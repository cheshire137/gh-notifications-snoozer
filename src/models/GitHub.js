const GitHubAuth = require('./GitHubAuth')

const TASKS_PER_PAGE = 30

class GitHub {
  constructor(token) {
    this.token = token
  }

  getTasks(filter) {
    const extraParams = filter.updatedAt ? ` updated:>${filter.updatedAt}` : ' is:open'
    const search = `${filter.query} ${extraParams}`
    return this.getIssuesFromSearch(search)
  }

  getCurrentUser() {
    const query = `{
      viewer {
        login
      }
    }`

    return this.graphql(query).then(result => result.viewer)
  }

  getIssuesFromSearch(search, endCursor, edges = []) {
    return this.graphql(this.taskQuery(), { search, endCursor }).then(results => {
      const allEdges = edges.concat(results.search.edges)

      if (results.search.pageInfo.hasNextPage) {
        const nextEndCursor = results.search.pageInfo.endCursor
        return this.getIssuesFromSearch(search, nextEndCursor, allEdges)
      }

      return { tasks: allEdges.map(edge => this.transformEdgeToTask(edge)) }
    })
  }

  graphql(query, variables = {}) {
    const url = 'https://api.github.com/graphql'
    const options = {
      body: JSON.stringify({ query, variables }),
      method: 'POST',
      headers: this.getHeaders(),
    }

    return fetch(url, options).then(response => {
      console.log(`${response.status} ${JSON.stringify(variables)}`)

      if (!response.ok) {
        return response.json().then(json => {
          throw new Error(`${response.status}: ${JSON.stringify(json)}`)
        })
      }

      return response.json().then(result => {
        if (result.errors) {
          throw new Error(`GraphQL Error: ${result.errors.map(e => e.message).join(', ')}`)
        }

        return result.data
      })
    })
  }

  getHeaders() {
    if (!this.token) {
      this.token = GitHubAuth.getToken()
    }
    return {
      Authorization: `bearer ${this.token}`,
    }
  }

  transformEdgeToTask(edge) {
    const rootPath = "https://github.com"
    const node = edge.node
    const type = node.type === 'PullRequest' ? 'pull' : 'issue'
    return {
      storageKey: `${type}-${node.id}`,
      id: node.id,
      type: node.type,
      title: node.title,
      body: node.body,
      state: node.state,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      isPullRequest: node.type === 'PullRequest',
      url: rootPath + node.path,
      number: node.number,
      repository: `${node.repository.owner.login}/${node.repository.name}`,
      repositoryOwner: node.repository.owner.login,
      repositoryOwnerUrl: rootPath + node.repository.owner.path,
      repositoryOwnerAvatar: node.repository.owner.avatarURL,
      user: node.author.login,
      userUrl: rootPath + node.author.path,
      userAvatar: node.author.avatarURL,
      comments: node.comments ? node.comments.totalCount : 0,
    }
  }

  // A GraphQL query using GitHubs GraphQL API https://developer.github.com/early-access/graphql/
  taskQuery() {
    return `query($search: String!, $endCursor: String) {
      search(first: 30, query: $search, after: $endCursor, type: ISSUE) {
        pageInfo {
         endCursor,
          hasNextPage
        }
        edges {
          node {
            ... on Issueish {
              body,
              id,
              title,
              number,
              type: __typename,

              author {
                login,
                path,
                avatarURL
              },

              repository {
                name,
                owner {
                  login
                  path,
                  avatarURL
                },
              },
            },
            ... on Issue {
              path,
              state,
              updatedAt,
              createdAt,
              comments(last: 1) {
                totalCount,
                edges {
                  node {
                    author {
                      login
                    }
                  }
                }
              }
            },
            ... on PullRequest {
              path,
              state,
              updatedAt,
              createdAt
            }
          }
        }
      }
    }`
  }
}

module.exports = GitHub
