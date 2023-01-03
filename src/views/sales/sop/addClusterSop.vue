<template>
  <div id="addSop_Page_Container" ref="addSop_Page_Container">
    <a-spin :spinning="loadingStatus">
      <div class="chooseUsersContainer">
        <div class="line">
          <span class="label">
            <span style="color: red">*</span>
            SOP名称
          </span>
          <div class="input">
            <a-input v-model="addInfo.sopName" placeholder="请输入SOP名称" @change="changeSopName"/>
            <span class="len">{{ addInfo.sopName && addInfo.sopName.length ? addInfo.sopName.length :'0' }}/18</span>
          </div>
        </div>
        <div class="execution" v-permission="'/sopClusterTemplate/add@post'" v-if="(pageType === 'add') || (pageType === 'copy')" @click="sendSop()">保存</div>
        <div class="execution" v-permission="'/sopClusterTemplate/update@post'" v-else @click="sendSop()">保存</div>
      </div>
      <div class="sendSOPInfoContainer">
        <div class="sendSOPList" v-if="addInfo.listTaskInfo && addInfo.listTaskInfo.length">
          <div class="addSop" @click="addSop">+ 添加</div>
          <div
            :class="selectSopItemIndex === index ? 'sopItem active' : 'sopItem'"
            v-for="(item, index) in addInfo.listTaskInfo"
            :key="item.tempId ? item.tempId : item.id"
            @click="chooseSopItem(item,index)"
          >
            {{ returnSopText(item) }}
            <span
              v-if="addInfo.listTaskInfo.length !== 1"
              class="del"
              @click.stop="delSopItem(index, item)"
            >×</span>
          </div>
        </div>
        <div class="sendItemContent">
          <div class="chooseSendDate" v-if="addInfo.listTaskInfo && addInfo.listTaskInfo.length">
            <div class="til">
              <span style="color: red;font-weight: 500;">*</span>发送时间
            </div>
            <div class="pickerBox" style="display: inline-block;position:relative">
              <div class="chooseDateBox1">
                <p class="tip">当客户条件为所选内容时</p>
                <div class="chooseDateBoxRadio">
                  <div class="line-wrapper">
                    第
                    <a-input-number
                      v-model="addInfo.listTaskInfo[selectSopItemIndex].sendDayNum"
                      :min="1"
                      :max="100"
                      style="width: 70px;"
                      @blur="dateNumberChange($event, addInfo.listTaskInfo[selectSopItemIndex].sendType)"
                    />天
                    <a-time-picker
                      :allowClear="false"
                      v-model="addInfo.listTaskInfo[selectSopItemIndex].sendTime"
                      valueFormat="HH:mm"
                      format="HH:mm"
                      @change="dateNumberChange($event, addInfo.listTaskInfo[selectSopItemIndex].sendType)"
                    />发送
                    <span class="tip">(注：第一天就是当天，过时不发送）</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SendContent
            :isLoadingStatus.sync="loadingStatus"
            :contentArray.sync="contentArray"
            :isSopEdit.sync="isSopEdit"
            :isDisableEdit="false"/>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { addSopTemplateMethod, getSopTemplateDetailMethod, editSopTemplateMethod } from '@/api/cluster'
import SendContent from './components/sendContent.vue'
export default {
  name: 'AddClusterSop',
  components: {
    SendContent
  },
  data () {
    return {
      pageType: '', // 当前页面状态
      // 显示加载中
      loadingStatus: false,
      isSopEdit: false, // 判断页面是否被编辑过
      selectSopItemIdx: '', // 选中的时间id
      selectSopItemIndex: '', // 时间标签选择下标
      pageTypeId: 0, // 从上页传入的id,新增为-1,修改为真实id
      addInfo: {}, // 新增/修改数据对象
      timeArray: [], // 时间段数组
      isControlerDisabled: false,
      contentArray: [], // 内容数组
      chooseDate: '', // 时间选择器选择的时间
      SOPName: '',
      sopList: [],
      treeData: []
    }
  },
  created () {
    this.pageType = this.$route.query.type
    if (this.pageType === 'add') {
      // 新增模式,无需处理
      this.pageTypeId = -1
    } else if (this.pageType === 'edit' || this.pageType === 'copy') {
      // 修改模式/复制模式
      this.pageTypeId = Number(this.$route.query.id)
    }
    this.initMethod()
  },
  // 页面销毁前
  beforeDestroy () {
    console.log('新增群SOP模板页面销毁前')
    console.log(this.$router, '看看能得到路由么')
    const nextRouterLink = this.$router.currentRoute.path
    console.log(nextRouterLink, 'nextRouterLink')
    if (nextRouterLink.indexOf('clusterSop') === -1) {
      // 跳转的路由,非群SOP模板页
      sessionStorage.removeItem('sopTemplatePage')
    }
    // sessionStorage.removeItem('activeType')
  },
  watch: {
    'addInfo.sopName' (e) {
      if (e && e.length > 18) {
        this.addInfo.sopName = e.slice(0, 18)
      }
    },
    contentArray () {
      console.log(this.contentArray, '监听contentArray改变')
      console.log(this.addInfo.listTaskInfo, 'this.addInfo.listTaskInfo')
      // const tempIndex = this.addInfo.listTaskInfo.findIndex(item => (item.tempId ? (item.tempId === this.currentTimeId) : (item.id === this.currentTimeId)))
      const tempIndex = this.addInfo.listTaskInfo.findIndex(item => (item.tempId ? (item.tempId === this.selectSopItemIdx) : (item.id === this.selectSopItemIdx)))
      console.log(tempIndex, 'tempIndex')
      if (tempIndex !== -1) {
        this.$set(this.addInfo.listTaskInfo[tempIndex], 'sendContentList', this.contentArray)
      }
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
      // this.$set(this.addInfo.listTaskInfo[tempIndex], 'sendContentList', this.contentArray)
    }
  },
  mounted () {

  },
  beforeRouteLeave (_, __, next) {
    // 导航离开当前路由的时候被调用，this可以被访问到
    if (!this.isSopEdit) {
      next()
    } else {
      this.$confirm({
        title: '返回后，将不再保存已编辑的内容',
        onOk () {
          next()
        }
      })
    }
  },
  methods: {
    // 监听用户输入框输入
    changeSopName () {
      this.isSopEdit = true
    },
    dateNumberChange () {
      this.isSopEdit = true
    },
    // 初始化方法
    async initMethod () {
      this.selectSopItemIndex = 0
      if (this.pageTypeId === -1) {
        // 新增
        this.setDefaultTime()
      } else {
        // 修改
        this.getDetail(this.pageTypeId)
      }
    },
    // 如果是新增,设置默认时间点
    setDefaultTime () {
      const tempTaskList = []
      const tempInfo = {
        sort: (this.addInfo.listTaskInfo && this.addInfo.listTaskInfo.length > 0) ? this.addInfo.listTaskInfo.length + 1 : '1',
        tempId: new Date().getTime(),
        sendDayNum: 1, // 默认传空
        sendTime: '10:00', // 默认传空
        sendContentList: []
      }
      tempTaskList.push(tempInfo)
      // this.currentTimeId = tempInfo.tempId
      this.selectSopItemIdx = tempInfo.tempId
      this.$set(this.addInfo, 'listTaskInfo', tempTaskList)
    },
    // 获取详情
    async getDetail (id) {
      console.log(id, 'id')
      // this.currentTimeId = this.addInfo.listTaskInfo[0].id
      // this.selectSopItemIdx = this.addInfo.listTaskInfo[0].id
      // this.contentArray = this.addInfo.listTaskInfo[this.selectSopItemIndex].sendContentList
      this.loadingStatus = true
      const params = { id }
      await getSopTemplateDetailMethod(params).then(response => {
        this.loadingStatus = false
        console.log(response)
        this.addInfo = response.data
        this.contentArray = this.addInfo.listTaskInfo[this.selectSopItemIndex].sendContentList
        this.selectSopItemIdx = this.addInfo.listTaskInfo[0].id
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      // this.loadingStatus = false
    },
    // 返回时间列表字符串
    returnSopText (item) {
      console.log(item, '对当前的item进行组合处理')
      return `第${item.sendDayNum}天${item.sendTime}发送`
    },
    // 单击所选择的时间点
    chooseSopItem (info, index) {
      console.log(info, '单击所选择的时间点', index, '点击的下标')
      if (info.tempId) {
        // 有tempId
        this.selectSopItemIdx = info.tempId
      } else {
        this.selectSopItemIdx = info.id
      }
      // this.currentTimeId = this.selectSopItemIdx
      this.selectSopItemIndex = index
      const tempInfo = this.addInfo.listTaskInfo.find(item => (item.tempId ? item.tempId === this.selectSopItemIdx : item.id === this.selectSopItemIdx))
      console.log(tempInfo, 'tempInfo切换时间回调')
      this.contentArray = tempInfo.sendContentList
    },
    addSop () {
      if (!this.addInfo.listTaskInfo.every(item => item.sendContentList && item.sendContentList.length > 0)) {
        this.$message.error('每一个时间节点都至少添加一个内容才可以新增')
        return
      }
      this.isSopEdit = true
      const tempMaxValue = Math.max.apply(Math, this.addInfo.listTaskInfo.map(item => Number(item.sendDayNum)))
      const tempInfo = {
        sort: (this.addInfo.listTaskInfo && this.addInfo.listTaskInfo.length > 0) ? this.addInfo.listTaskInfo.length + 1 : '1',
        tempId: new Date().getTime(),
        sendTime: '10:00',
        sendDayNum: tempMaxValue + 1,
        sendContentList: []
      }
      this.addInfo.listTaskInfo.push(tempInfo)
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
      console.log(this.addInfo, '新增时间点后的对象')
      this.chooseSopItem(tempInfo, this.addInfo.listTaskInfo.length - 1)
    },
    // 删除时间节点
    delSopItem (index, info) {
      console.log(index, '删除的下标', info, '删除的info')
      const that = this
      const nowSopList = Object.assign([], this.addInfo.listTaskInfo)
      this.$confirm({
        title: '确定删除此时间?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          this.isSopEdit = true
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
          // console.log(this.selectSopItemIdx, index, '比较')
          // 删除的为后加的元素
          if (info.tempId) {
            // 删除的为选中的元素
            if (that.selectSopItemIdx === info.tempId) {
              // 取第一个元素的id
              that.selectSopItemIdx = nowSopList[0].tempId ? nowSopList[0].tempId : nowSopList[0].id
              that.selectSopItemIndex = 0
            } else {
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
              const selectIndex = nowSopList.findIndex(item => (item.tempId ? item.tempId === selectId : item.id === selectId))
              console.log('删除之前的元素')
              // debugger
              that.selectSopItemIndex = selectIndex
              that.selectSopItemIdx = nowSopList[selectIndex].tempId ? nowSopList[selectIndex].tempId : nowSopList[selectIndex].id
            }
          }
          this.$set(this.addInfo, 'listTaskInfo', nowSopList)
        }
      })
    },
    // 开始执行
    sendSop () {
      if (!(this.addInfo.sopName && this.addInfo.sopName.trim())) {
        this.$message.error('请输入SOP名称！')
        return
      }
      if (this.addInfo.listTaskInfo && this.addInfo.listTaskInfo.length != 0) {
        for (const singleTimeInfo of this.addInfo.listTaskInfo) {
          if (singleTimeInfo.sendContentList.length === 0) {
            this.$message.error('每项任务都至少添加一项发送内容才可以执行！')
            return
          }
        }
      } else {
        this.$message.error('请选择时间点')
        return
      }
      // debugger
      // console.log(this.addInfo, 'this.addInfo')
      this.loadingStatus = true
      if (this.pageType === 'add' || this.pageType === 'copy') {
        console.log('新增操作', this.addInfo)
        this.newDataMethod(this.addInfo)
      } else {
        console.log('修改操作', this.addInfo)
        this.updataMethod(this.addInfo)
      }
    },
    // 新增操作
    newDataMethod (info) {
      console.log(info, '新增操作')
      addSopTemplateMethod(info).then(response => {
        this.loadingStatus = false
        console.log(response, '新增操作')
        if (response.code === 200) {
          this.isSopEdit = false
          this.$message.success('新增成功')
          this.$router.go(-1)
        }
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
    },
    // 修改操作
    updataMethod (info) {
      console.log(info, '修改操作')
      editSopTemplateMethod(info).then(response => {
        this.loadingStatus = false
        console.log(response, '修改操作')
        if (response.code === 200) {
          this.isSopEdit = false
          this.$message.success('修改成功')
          this.$router.go(-1)
        }
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
    }
  }
}
</script>
  <style lang='less' scoped>
.chooseUsersContainer {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  .line {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .label {
      width: 100px;
      text-align: right;
      margin-right: 10px;
    }
    .input {
      width: 300px;
      position: relative;
      .ant-input {
        width: 100%;
        padding: 4px 45px 4px 11px;
        background-color: transparent;
      }
      .len {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
  }
  .execution {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4074f6;
    color: #fff;
    width: 120px;
    height: 50px;
    cursor: pointer;
  }
}
.sendSOPInfoContainer {
      width: 100%;
      margin-top: 10px;
      display: flex;
      height: 100%;
      .sendSOPList {
        border-radius: 5px;
        padding: 20px;
        width: 300px;
        height: auto;
        // height: 460px;
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
      .sendItemContent {
        margin-left: 10px;
        flex: 1;
        height: 100%;
        .chooseSendDate {
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          .til {
            font-weight: 600;
            margin-bottom: 10px;
          }
          .chooseDateBox1 {
            .chooseDateBoxRadio {
              display: flex;
              flex-direction: column;
              .line-wrapper {
                margin-bottom: 10px;
                .ant-time-picker {
                  width: 120px;
                }
              }
            }
          }
          .chooseDateBox2 {
            display: flex;
            align-items: center;
          }
        }

      }
}
.uploadFileInp {
  position: fixed;
  left: -100000px;
  top: -100000px;
  opacity: 0;
  width: 1px;
  height: 1px;
}

  .addSop_Page_Container_selectSopItemDateBox {
    .ant-calendar-time-picker-combobox {
      .ant-calendar-time-picker-select {
        width: 50%;
      }
      .ant-calendar-time-picker-select:last-child {
        display: none;
      }
    }
  }
  </style>
  <!-- <style lang='less' scoped>
  @import './addSop.less';
  </style> -->
