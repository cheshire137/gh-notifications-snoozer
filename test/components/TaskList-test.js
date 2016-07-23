describe('TaskList', () => {
  it('does not show tasks that are ignored, archived or snoozed')

  context('when the snooze button is clicked', () => {
    it('hides selected tasks')
    it('updates the selected task\'s `snooze_until` field')
    it('shows the tasks again, starting at midnight of the next day')
  })

  context('when the archive button is clicked', () => {
    it('hides selected tasks')
    it('updates the selected task\'s `archived_at` field')
    it('shows tasks again if `updated_at` is greater than `archived_at`')
  })

  context('when the ignore button is clicked', () => {
    it('hides selected tasks')
    it('updates the selected task\'s `ignored` field')
  })
})
