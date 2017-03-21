const MS_PER_DAY = 1000 * 60 * 60 * 24

class TaskVisibility {
  static daysBetween(a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    return Math.floor((utc2 - utc1) / MS_PER_DAY)
  }

  static isHiddenTask(task) {
    const { ignore, snoozedAt, archivedAt, updatedAt } = task

    if (ignore) {
      // Ignored task, hide it
      return true
    }

    if (typeof snoozedAt === 'string') {
      const currentDate = new Date()
      const snoozeDate = new Date(snoozedAt)
      if (this.daysBetween(snoozeDate, currentDate) < 1) {
        // Snoozed within the last day, hide it
        return true
      }
    }

    if (typeof archivedAt === 'string') {
      const updateDate = new Date(updatedAt)
      const archiveDate = new Date(archivedAt)
      if (archiveDate >= updateDate) {
        // Has not been updated since it was archived, hide it
        return true
      }
    }

    return false
  }
}

module.exports = TaskVisibility
