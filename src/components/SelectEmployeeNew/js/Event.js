import { searchEmployeeList } from '@/api/selectMember'

const methods = {
  /**
   * 确定
   * @type Event
   * @returns {*}
   */
  confirm () {
    this.modalShow = false
    this.$emit('change', this.getDuplicateSelectData())
  },

  /**
   * 清除全部
   * @type Event
   */
  cleanSelect () {
    this.select.forEach(v => {
      if (v.type === 'depart') {
        this.$refs.department[0].updateDepartSelect(v, false)
      } else {
        this.$refs.department[0].updateSelect(v, false)
        this.$refs.members.updateSelect(v, false)
      }
    })

    this.select = []
  },

  /**
   * 删除已选成员
   * @type Event
   * @param e
   */
  delSelectChange (e) {
    e.data.select = false

    this.delSelect(e.data)

    if (e.data.type === 'depart') {
      this.$refs.department[0].updateDepartSelect(e.data, false)

      return false
    }

    this.$refs.department[0].updateSelect(e.data, false)
    this.$refs.members.updateSelect(e.data, false)
  },

  /**
   * 搜索选择成员
   * @type Event
   * @param e
   */
  searchSelectChange (e) {
    this.selectChange(e)

    this.$refs.department[0].updateSelect(e.data, e.select)
  },

  /**
   * 选择成员
   * @type Event
   * @param e
   * @returns {boolean}
   */
  selectChange (e) {
    if (e.select) {
      this.addSelect(e.data)

      return false
    }

    this.delSelect(e.data)
  },

  /**
   * 添加选择成员
   * @type Event
   * @param data
   * @returns {boolean}
   */
  addSelect (data) {
    if (this.select.length === this.maxCount) {
      this.$message.error('超出最大选择数量')

      data.select = false

      return false
    }

    this.$refs.department[0].updateSelect(data, true)

    this.select.push(data)
  },

  /**
   * 搜索成员
   * @type Event
   * @returns {boolean}
   */
  searchClick () {
    if (!this.search.name) {
      this.search.show = false
      this.total = this.oldTotal

      return false
    }

    this.total = ''
    this.search.loading = true
    this.search.show = true

    searchEmployeeList({
      searchKeyWords: this.search.name
    }).then(res => {
      this.search.members = res.data
      this.total = res.data.length

      this.syncSearchSelect()

      this.search.loading = false
    })
  }
}

export default {
  methods
}
