<template>
  <div class="sendSOPList">
    <div class="addSop" @click="addSop">+ 添加</div>
    <div
      :class="selectSopItemIndex === index ? 'sopItem active' : 'sopItem'"
      v-for="(item, index) in sopList"
      :key="index"
      @click="chooseSopItem(item,index)"
    >
      {{ returnText(item) }}
      <span
        v-if="sopList.length !== 1 && item.invalidState !== 2"
        class="del"
        @click.stop="delSopItem(index, item)"
      >×</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TimeContent',
  data () {
    return {
      isSopEditStatus: false,
      // 组件内部数组
      // sopList: Object.assign([], this.timeList),
      // 选中的id
      selectSopItemIdx: 0,
      // 当前选中的下标
      selectSopItemIndex: 0,
      sopList: []
    }
  },
  props: {
    isSopEdit: {
      type: Boolean,
      default: false
    },
    pageType: {
      type: Number,
      default: -1
    },
    timeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    isSopEdit () {
      this.isSopEditStatus = this.isSopEdit
    },
    // 监听传入组件的时间数组
    timeList () {
      console.log(this.timeList, '子组件this.timeList')
      this.sopList = Object.assign([], this.timeList)
      if (this.sopList.length !== 0) {
        if (this.sopList[this.selectSopItemIndex].tempId) {
          this.selectSopItemIdx = this.sopList[this.selectSopItemIndex].tempId
        } else {
          this.selectSopItemIdx = this.sopList[this.selectSopItemIndex].id
        }
      }
      // this.selectSopItemIdx = this.sopList.length != 0 ? this.sopList[0].id : 0
    },
    // 监听选择的时间节点,防止多次选择,多次触发
    selectSopItemIdx () {
      console.log(this.selectSopItemIdx, '监听选择的时间节点')
      this.$emit('changeTime', this.selectSopItemIdx)
    }
  },
  methods: {
    returnText (item) {
      // console.log(item, 'item')
      let text = ''
      const pageType = this.pageType
      switch (pageType) {
        case 0:
          text = moment(item.sendTime).format('YYYY-MM-DD HH:mm')
          break
        case 1:
          console.log(item, '当前信息不处理')
          // text = item.sendTime
          break
        case 2:
          text = item.sendTime
          break
      }
      return text
    },
    // 新增sop时间
    addSop () {
      if (!this.sopList.every(item => item.sendContentList && item.sendContentList.length > 0)) {
        this.$message.error('每一个时间节点都至少添加一个内容才可以新增')
        return
      }
      this.isSopEditStatus = true
      this.$emit('update:isSopEdit', this.isSopEditStatus)
      // 获取最后一条的时间
      const previousTime = this.sopList[this.sopList.length - 1].sendTime
      // 将最后一条的时间格式化
      const previoutTimeFormat = moment(previousTime).format('YYYY-MM-DD HH:mm')
      // 获取当前的时间
      const currentTimeFormat = moment().format('YYYY-MM-DD HH:mm')
      const tempAddInfo = {
        sort: this.sopList.length + 1,
        tempId: new Date().getTime(),
        sendTime: (previoutTimeFormat === currentTimeFormat) ? moment(previousTime).add(1, 'm').format('YYYY-MM-DD HH:mm') : moment(currentTimeFormat).add(3, 'm').format('YYYY-MM-DD HH:mm'),
        sendContentList: []
      }
      this.sopList.push(tempAddInfo)
      this.$emit('update:timeList', this.sopList)
      // 将选中时间点切换为最新的一条
      this.selectSopItemIndex = this.sopList.length - 1
      // this.selectSopItemIdx = tempAddInfo.tempId

      // this.$emit('changeTime', tempAddInfo.tempId)
      // this.chooseSopItem(tempAddInfo, this.sopList.length - 1)
    },
    // 选择时间节点
    chooseSopItem (info, index) {
      console.log(info, '点击的对象', index, '点击的下标')
      if (info.tempId) {
        // 有tempId
        this.selectSopItemIdx = info.tempId
      } else {
        this.selectSopItemIdx = info.id
      }
      this.selectSopItemIndex = index
      // this.$emit('changeTime', this.selectSopItemIdx)
    },
    // 删除时间节点
    delSopItem (index, info) {
      console.log(index, '删除的下标', info, '删除的info')
      const that = this
      const nowSopList = Object.assign([], this.sopList)
      this.$confirm({
        title: '确定删除此时间?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          // 当前选中的内容
          const selectItem = nowSopList[this.selectSopItemIndex]
          let selectId = ''
          if (selectItem.tempId) {
            // 当前选中内容有tempId
            selectId = nowSopList[this.selectSopItemIndex].tempId
          } else {
            // 当前选中的id
            selectId = nowSopList[this.selectSopItemIndex].id
          }

          nowSopList.splice(index, 1)
          this.$message.success('删除成功')
          this.isSopEditStatus = true
          this.$emit('update:isSopEdit', this.isSopEditStatus)
          // console.log(this.selectSopItemIdx, index, '比较')
          // 删除的为后加的元素
          if (info.tempId) {
            // 删除的为选中的元素
            if (that.selectSopItemIdx === info.tempId) {
              // 取第一个元素的id
              that.selectSopItemIdx = nowSopList[0].tempId ? nowSopList[0].tempId : nowSopList[0].id
              that.selectSopItemIndex = 0
            } else {
              // console.log(selectId, nowSopList)
              // 删除的元素为非选中的元素
              // const selectIndex = nowSopList.findIndex(item => {
              //   if (item.tempId) {
              //     item.tempId = selectId
              //   } else {
              //     item.id = selectId
              //   }
              //   return item
              // })
              const selectIndex = nowSopList.findIndex(item => (item.tempId ? item.tempId === selectId : item.id === selectId))
              console.log('删除后加的元素')
              // debugger
              that.selectSopItemIndex = selectIndex
              that.selectSopItemIdx = nowSopList[selectIndex].tempId ? nowSopList[selectIndex].tempId : nowSopList[selectIndex].id
            }
          } else {
            // 删除之前的元素
            // 删除的为选中的元素
            if (that.selectSopItemIdx === info.id) {
              // 取第一个元素的id
              that.selectSopItemIdx = nowSopList[0].tempId ? nowSopList[0].tempId : nowSopList[0].id
              that.selectSopItemIndex = 0
            } else {
              // console.log(selectId, nowSopList)
              // 删除的元素为非选中的元素
              // const selectIndex = nowSopList.findIndex(item => {
              //   if (item.tempId) {
              //     item.tempId = selectId
              //   } else {
              //     item.id = selectId
              //   }
              //   return item
              //   // item.id === selectId
              // })
              const selectIndex = nowSopList.findIndex(item => (item.tempId ? item.tempId === selectId : item.id === selectId))
              console.log('删除之前的元素')
              // debugger
              that.selectSopItemIndex = selectIndex
              that.selectSopItemIdx = nowSopList[selectIndex].tempId ? nowSopList[selectIndex].tempId : nowSopList[selectIndex].id
            }
          }
          // // 删除的为选中的元素
          // if (that.selectSopItemIdx === id) {
          //   // 取第一个元素的id
          //   that.selectSopItemIdx = nowSopList[0].id
          //   that.selectSopItemIndex = 0
          // } else {
          //   // console.log(selectId, nowSopList)
          //   // 删除的元素为非选中的元素
          //   const selectIndex = nowSopList.findIndex(item => item.id === selectId)
          //   that.selectSopItemIndex = selectIndex
          // }
          this.sopList = Object.assign([], nowSopList)
          console.log(this.sopList, '组件中删除时间点')
          this.$emit('update:timeList', this.sopList)
          // this.$emit('changeTime', this.selectSopItemIdx)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sendSOPList {
    border-radius: 5px;
    padding: 20px;
    width: 300px;
    height: 460px;
    background-color: #fff;
    overflow-y: auto;
    .sopItem {
      height: 35px;
      width: 100%;
      display: flex;
      align-items: center;
      text-indent: 15px;
      cursor: pointer;
      border-radius: 5px;
      position: relative;
      .del {
        display: none;
        width: 35px;
        height: 35px;
        font-size: 16px;
        position: absolute;
        right: 0;
        top: 50%;
        align-items: center;
        justify-content: center;
        transform: translate(0, -50%);
      }
    }
    .sopItem:hover {
      .del {
        display: flex;
      }
    }
    .active {
      background: #eef2fc;
      color: #4074f6;
    }
    .addSop {
      margin-bottom: 20px;
      width: 100%;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      border: 1px dashed #8a8a8a;
      cursor: pointer;
    }
}
</style>
