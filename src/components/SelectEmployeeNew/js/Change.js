const methods = {
  /**
   * 选择部门
   * @type Change
   * @param e
   * @returns {boolean}
   */
  selectDepartChange (e) {
    if (e.select) {
      this.select.push({
        type: 'depart',
        id: e.data.department.id,
        name: e.data.department.name,
        members: e.data.members
      })

      return false
    }

    for (const k in this.select) {
      if (this.select[k].type === 'depart' && this.select[k].id === e.data.department.id) {
        this.select.splice(k, 1)

        return false
      }
    }
  },

  /**
   * 全选/取消
   * @type Change
   * @param e
   * @returns {boolean}
   */
  selectAllChange (e) {
    const select = e.target.checked

    if (select && this.select.length === this.maxCount) {
      this.$message.error('超出最大选择数量')

      this.selectAll = false

      return false
    }

    if (select) {
      let count = 0

      this.search.members.forEach(v => {
        if (count < this.maxCount) {
          this.$refs.members.updateSelect(v, true)

          this.$refs.department[0].updateSelect(v, select)

          this.select.push(v)
        }

        count++
      })

      return false
    }

    this.search.members.forEach(search => {
      this.select.deleteObj('wxUserId', search.wxUserId)

      this.$refs.members.updateSelect(search, false)
    })

    this.search.members.forEach(member => {
      this.$refs.department[0].updateSelect(member, select)
    })

    this.$forceUpdate()
  },

  /**
   * 节流搜索
   * @type Change
   */
  searchThrottle () {
    if (this.timer) clearTimeout(this.timer)

    this.timer = setTimeout(() => {
      this.searchClick()
    }, 300)
  }
}

export default {
  methods
}
