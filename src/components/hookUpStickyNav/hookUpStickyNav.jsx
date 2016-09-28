const React = require('react')

function hookUpStickyNav(Component, navSelector) {
  class StickyNav extends React.Component {
    componentDidMount() {
      window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll() {
      const doc = document.documentElement
      const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
      const navBars = Array.from(document.querySelectorAll(navSelector))
      navBars.forEach(navBar => {
        const nav = navBar
        nav.style.top = `${top}px`
        nav.classList.toggle('has-shadow', top > 0)
      })
    }

    render() {
      return <Component {...this.props} {...this.state} />
    }
  }

  return StickyNav
}

module.exports = hookUpStickyNav
