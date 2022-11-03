const methods = {
  /**
   * 显示
   * @type External
   * @param members
   * @param maxCount
   * @param depart
   */
  $show (members = [], maxCount = 200, depart = false) {
    this.modalShow = true
    this.select = JSON.parse(JSON.stringify(members))

    // this.maxCount = maxCount
    this.depart = depart

    if (this.depart) this.maxCount = 99999999

    window.$members = this.select

    this.getDepData(true)
    this.getTotalCount()
  },

  $hide () {
    this.modalShow = false
  }
}

export default {
  methods
}
