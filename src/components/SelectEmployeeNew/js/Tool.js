import { getDepartList, getMemberTotalCount } from '@/api/selectMember'

const methods = {
  /**
   * 获取选择成员去重数据
   * @type Tool
   * @returns {*}
   */
  getDuplicateSelectData () {
    const members = []

    this.select.forEach(v => {
      if (v.type === 'depart') {
        v.members.forEach(v2 => {
          members.push(v2)
        })
      } else {
        members.push(v)
      }
    })

    return members.duplicate('wxUserId')
  },

  /**
   * 删除选择成员
   * @type Tool
   * @param data
   */
  delSelect (data) {
    if (data.type === 'depart') {
      this.select.deleteObj('id', data.id)
    } else {
      this.select.deleteObj('wxUserId', data.wxUserId)
    }

    if (data.type !== 'depart') this.$refs.department[0].updateSelect(data, false)
  },

  /**
   * 同步正常选择与搜索选择状态
   * @type Tool
   */
  syncSearchSelect () {
    this.select.forEach(select => {
      this.search.members.forEach(search => {
        if (select.wxUserId === search.wxUserId) search.select = select.select
      })
    })

    let selectCount = 0

    this.search.members.forEach(v => {
      if (v.select) selectCount++
    })

    if (selectCount === this.search.members.length) {
      this.selectAll = true
    } else {
      this.selectAll = false
    }
  },

  /**
   * 获取全部部门
   * @type Tool
   */
  getDepData (notice = false) {
    this.loading = true

    getDepartList().then(res => {
      this.depList = res.data
      this.loading = false

      if (notice) {
        setTimeout(() => {
          this.$refs.department[0].showChange()
        }, 0)
      }
    })
  },

  /**
   * 获取全部成员数量
   * @type Tool
   */
  getTotalCount () {
    getMemberTotalCount().then(res => {
    //   this.total = res.data[0]
    //   this.oldTotal = res.data[0]
      this.total = res.data
      this.oldTotal = res.data
    })
  }
}

export default {
  methods
}
