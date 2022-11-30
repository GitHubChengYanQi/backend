<template>
  <div id="div_wrapper_container" ref="div_wrapper_container">
    <a-spin :spinning="loadingStatus">
      <div class="chooseUsersContainer">
        <div class="line">
          <span class="label">
            <span style="color: red">*</span>
            日历模板名称
          </span>
          <div class="input">
            <a-input v-model="addInfo.sopName" placeholder="请输入日历模板名称" @change="changeSopName"/>
            <span class="len">{{ addInfo.sopName && addInfo.sopName.length ? addInfo.sopName.length :'0' }}/18</span>
          </div>
        </div>
        <div class="timeLine">
          <span class="label">
            <span style="color: red">*</span>
            选择发送日期
          </span>
          <div class="timeWrapper">
            <!-- <a-calendar @select.self="chooseDateMethod" valueFormat="YYYY-MM-DD" v-if="currentShowTabId === 0">
              <ul slot="dateCellRender" slot-scope="value" class="events">
                <li v-for="item in getCalendarTaskData(value)" :key="item.tempId ? item.tempId : item.id" class="singleDiv" @click.stop="chooseTimeContent(item)">
                  <div class="singleContentTaskDiv">{{ returnCalendarTask(item) }}</div>
                  <span class="delDiv" @click.stop="deleteCalendarTask(item)" v-if="getCalendarTaskData(value).length > 1">X</span>
                </li>
              </ul>
            </a-calendar> -->
            <div class="sendSOPInfoContainer" v-if="currentShowTabId === 1">
              <div class="sendSopTitle">
                <span style="color: red">*</span>
                选择发送日期设置内容
              </div>
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
              <div class="sendItemContent" v-if="addInfo.listTaskInfo && addInfo.listTaskInfo.length">
                <div class="sendContentTitle">
                  发送内容
                  <span>(发送时间,通过企微应用消息提醒群主和内容推送到企微侧边栏的时间)</span>
                </div>
                <div class="sendContentForm">
                  <div class="singleSendContentItem">
                    <div class="singleSendContentTitle">发送时间:</div>
                    <a-date-picker
                      dropdownClassName="addSop_Page_Container_selectSopItemDateBox"
                      :allowClear="false"
                      :showToday="false"
                      v-model="addInfo.listTaskInfo[selectSopItemIndex].sendTime"
                      valueFormat="YYYY-MM-DD HH:mm"
                      format="YYYY-MM-DD HH:mm"
                      show-time
                      :getPopupContainer="() => $refs['div_wrapper_container']"
                      @change="sendDateChange"
                    />
                  </div>
                  <div class="singleSendContentItem">
                    <div class="singleSendContentTitle">内容标题:</div>
                    <a-input v-model="addInfo.listTaskInfo[selectSopItemIndex].sendTitle" placeholder="请输入标题,标题不发给客户" @change="changeSopName"/>
                  </div>
                </div>
                <SendContent
                  :contentArray.sync="contentListArray"
                  :isSopEdit.sync="isSopEdit"
                  :isDisableEdit="false"/>
              </div>
            </div>
            <!-- <div class="tabWrapperDiv">
              <div class="singleTabDiv" @click="changeTabMethod(item)" :class="currentShowTabId === item.id ? 'activeTabDiv' : ''" v-for="item in showTabList" :key="item.id">{{ item.name }}</div>
            </div> -->
          </div>
        </div>
        <div class="execution" v-if="pageTypeId === -1" @click="sendSop()" v-permission="'/sopClusterCalendarTemplate/add@post'">保存</div>
        <div class="execution" v-else @click="sendSop()" v-permission="'/sopClusterCalendarTemplate/update@post'">保存</div>
      </div>
    </a-spin>
    <!-- <a-modal
      title="定时发送内容"
      :maskClosable="false"
      :width="1000"
      :visible="sendContentModalShow"
      @cancel="closeSendContentModal()"
      :getContainer="() => $refs['div_wrapper_container']"
    >
      <a-form layout="horizontal" labelAligin="left">
        <a-form-item label="发送时间" :labelCol="{span: 2}" :wrapperCol="{span: 21}">
          <a-date-picker
            dropdownClassName="addSop_Page_Container_selectSopItemDateBox"
            :allowClear="false"
            :showToday="false"
            v-model="addCalendarContentInfo.sendTime"
            valueFormat="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            show-time
            :getPopupContainer="() => $refs['div_wrapper_container']"
            @change="sendCalendarDateChange"
          />
        </a-form-item>
        <a-form-item label="内容标题" :labelCol="{span: 2}" :wrapperCol="{span: 21}">
          <a-input v-model="addCalendarContentInfo.sendTitle" placeholder="请输入标题,标题不发给客户"/>
        </a-form-item>
      </a-form>
      <SendContent
        :contentArray.sync="contentCalendarArray"
        :isSopEdit.sync="isCalendarEdit"
        :isDisableEdit="false"/>
      <template slot="footer">
        <a-button
          @click="closeSendContentModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmCalendarSendSure">确定</a-button>
      </template>
    </a-modal> -->
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { Calendar } from 'ant-design-vue'
// import SendListContent from './components/sendListContent.vue'
import SendContent from './components/sendContent.vue'
import { addCalendarTemplateMethod, getCalendarTemplateDetailMethod, editCalendarTemplateMethod } from '@/api/cluster'
moment.locale('zh-cn')
export default {
  name: 'AddClusterCalendar',
  components: {
    SendContent,
    aCalendar: Calendar
  },
  data () {
    return {
      sendListContentStatus: false,
      addCalendarInfo: {}, // 日历模式下新增的提交对象
      addCalendarContentInfo: {}, // 日历模式下添加内容对象
      contentCalendarArray: [], // 日历模式下弹框发送内容数组
      isCalendarEdit: false, // 判断日历模式下是否被编辑
      selectCalendarItemIdx: '', // 日历模式选中的时间id
      selectCalendarItemIndex: '', // 日历模式时间标签选择下标
      sendTime: '',
      // 日历模式下发送内容弹框
      sendContentModalShow: false,
      // 显示模式: 日历/列表
      showTabList: [
        {
          id: 0,
          name: '日历视图'
        },
        {
          id: 1,
          name: '列表视图'
        }
      ],
      // 当前生效的tab
      currentShowTabId: '',
      size: 'small',
      loadingStatus: false, // 加载过程是否显示
      isSopEdit: false, // 判断页面是否被编辑过
      selectSopItemIdx: '', // 列表模式选中的时间id
      selectSopItemIndex: '', // 列表模式时间标签选择下标
      pageTypeId: 0, // 从上页传入的id,新增为-1,修改为真实id
      addInfo: {}, // 新增/修改数据对象
      isControlerDisabled: false,
      contentListArray: [], // 内容数组
      commonListArray: [], // 中间的数组
      importStatus: false, // 传入状态
      chooseDate: '' // 时间选择器选择的时间
    }
  },
  created () {
    this.pageTypeId = Number(this.$route.query.id)
    this.initMethod()
  },
  watch: {
    currentShowTabId (e) {
      console.log('切换显示日历模式/列表模式', e)
    },
    'addCommonInfo.sopName' (e) {
      if (e && e.length > 18) {
        this.addInfo.sopName = e.slice(0, 18)
      }
    },
    contentArray () {
      console.log(this.currentTimeId, 'this.currentTimeId')
      console.log(this.contentArray, '监听contentArray改变')
      console.log(this.addInfo.listTaskInfo, 'this.addInfo.listTaskInfo')
      const tempIndex = this.addInfo.listTaskInfo.findIndex(item => (item.tempId ? item.tempId === this.currentTimeId : item.id === this.currentTimeId))
      console.log(tempIndex, 'tempIndex')
      if (tempIndex !== -1) {
        this.$set(this.addInfo.listTaskInfo[tempIndex], 'sendContentList', this.contentArray)
      }
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
      // this.$set(this.addInfo.listTaskInfo[tempIndex], 'sendContentList', this.contentArray)
    },
    contentCalendayArray () {
      this.$set(this.addCalendarContentInfo, 'sendContentList', this.contentCalendayArray)
    }
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
    changeData (array) {
      console.log(array, 'array')
    },
    // 初始化方法
    async initMethod () {
      this.selectSopItemIndex = 0
      // 默认展示日历视图
      this.currentShowTabId = 1
      this.addInfo = {}
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
        tempId: new Date().getTime(),
        sendTime: moment().add(3, 'm').format('YYYY-MM-DD HH:mm'),
        sendTitle: '',
        sendContentList: []
      }
      tempTaskList.push(tempInfo)
      this.selectSopItemIdx = tempInfo.tempId
      this.$set(this.addInfo, 'listTaskInfo', tempTaskList)
    },
    // 获取详情
    getDetail (id) {
      console.log(id, 'id')
      const params = { id }
      getCalendarTemplateDetailMethod(params).then(response => {
        this.loadingStatus = false
        console.log(response)
        this.addInfo = response.data
        this.contentListArray = this.addInfo.listTaskInfo[0].sendContentList
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
    },
    // 获取日历模式下任务列表
    getCalendarTaskData (value) {
      let listData = []
      // console.log(this.addInfo.listTaskInfo, '日历模式获取任务列表')
      if (this.addInfo && this.addInfo.listTaskInfo) {
        // 格式化单条日期
        const currentValue = moment(value).format('YYYY-MM-DD')
        // 得到当前模板中的时间点数组
        // const tempTaskTimeList = this.addInfo.listTaskInfo.map(item => moment(item.sendTime).format('YYYY-MM-DD'))
        // 得到单条信息在时间点数组中的位置
        const tempTaskIndex = this.addInfo.listTaskInfo.findIndex(item => moment(item.sendTime).format('YYYY-MM-DD') === currentValue)
        if (tempTaskIndex !== -1) {
          // console.log(tempTaskIndex, '下标')
          // console.log(this.addCalendarInfo.listTaskInfo[tempTaskIndex], 'this.addCalendarInfo.listTaskInfo')
          // 存在,就显示当前位置的发送内容
          listData.push(this.addInfo.listTaskInfo[tempTaskIndex])
          // console.log(listData, 'listData')
        } else {
          // 不存在,就显示空数组
          listData = []
        }
      } else {
        listData = []
      }
      // console.log(listData, 'listData')
      return listData
    },
    // 关闭日历模式添加内容弹框
    closeSendContentModal () {
      this.sendContentModalShow = false
      this.addCalendarContentInfo = {}
      this.contentListArray = []
      this.$set(this.addCalendarContentInfo, 'contentCalendarArray', [])
    },
    // 日历模式下删除任务
    deleteCalendarTask (info) {
      const that = this
      const nowCalendarList = Object.assign([], this.addInfo.listTaskInfo)
      this.$confirm({
        title: '确定删除此任务?',
        // content: 'Some descriptions',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          let tempCalendarIndex = ''
          if (info.tempId) {
            tempCalendarIndex = nowCalendarList.findIndex(item => info.tempId === (item.tempId ? item.tempId : item.id))
          } else {
            tempCalendarIndex = nowCalendarList.findIndex(item => info.id === (item.tempId ? item.tempId : item.id))
          }
          nowCalendarList.splice(tempCalendarIndex, 1)
          that.$set(this.addInfo, 'listTaskInfo', nowCalendarList)
        }
      })
    },
    // 提交日历模式添加内容
    confirmCalendarSendSure () {
      console.log(this.addCalendarContentInfo, 'this.addCalendarContentInfo')
      let tempIndex = ''
      if (!this.addCalendarContentInfo.sendTitle) {
        this.$message.error('请输入内容标题！')
        return
      }
      if ((!this.addCalendarContentInfo.sendContentList) || (this.addCalendarContentInfo.sendContentList.length === 0)) {
        this.$message.error('每一个时间节点都至少添加一个内容才可以新增')
        return
      }
      if (this.addCalendarContentInfo.tempId) {
        // 有tempId,表示为新增的元素提交
        tempIndex = this.addInfo.listTaskInfo.findIndex(item => this.addCalendarContentInfo.tempId === (item.tempId ? item.tempId : item.id))
      } else {
        // 没有tempId,表示为之前的元素提交
        tempIndex = this.addInfo.listTaskInfo.findIndex(item => this.addCalendarContentInfo.id === (item.tempId ? item.tempId : item.id))
      }
      // let tempIndex = this.addCalendarInfo.listTaskInfo.findIndex(item => item.id === )
      // console.log(this.chooseOldCalendarInfo, 'this.chooseOldCalendarInfo')
      // let tempIndex = this.addCalendarInfo.listTaskInfo.findIndex(item => item.sendTime === this.chooseOldCalendarInfo.sendTime)
      // this.addCalendarInfo.listTaskInfo.push(this.addCalendarContentInfo)
      // this.$set(this.addCalendarInfo, 'listTaskInfo', this.addCalendarInfo.listTaskInfo)
      this.addInfo.listTaskInfo.splice(tempIndex, 1, this.addCalendarContentInfo)
      // this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
      this.sendContentModalShow = false
      this.selectSopItemIdx = this.addInfo.listTaskInfo[0].tempId ? this.addInfo.listTaskInfo[0].tempId : this.addInfo.listTaskInfo[0].id
      this.contentListArray = Object.assign([], this.addInfo.listTaskInfo[0].sendContentList)
    },
    sendDateChange (val) {
      console.log(val, '更新时间')
    },
    sendCalendarDateChange () {},
    // 返回日历模式中的task
    returnCalendarTask (info) {
      console.log(info, 'info')
      return moment(info.sendTime).format('HH:mm') + ' ' + info.sendTitle
    },
    // 日历模式选择日期
    chooseDateMethod (e) {
      console.log(e, '选择日期')
      this.addCalendarContentInfo = {}
      this.sendContentModalShow = true
      const chooseCurrentDate = moment(e).format('YYYY-MM-DD')
      const tempCurrentTime = moment().format('HH:mm')
      const tempCurrentDate = chooseCurrentDate + ' ' + tempCurrentTime
      this.$set(this.addCalendarContentInfo, 'sendTime', moment(tempCurrentDate).format('YYYY-MM-DD HH:mm'))
      this.$set(this.addCalendarContentInfo, 'sendContentList', [])
    },
    // 日历模式选择日期中的任务
    chooseTimeContent (info) {
      console.log(info, '点击日期中的任务')
      this.sendContentModalShow = true
      this.addCalendarContentInfo = Object.assign({}, info)
      this.contentCalendarArray = Object.assign([], this.addCalendarContentInfo.sendContentList)
    },
    // 切换日历视图/列表视图tab
    changeTabMethod (info) {
      this.currentShowTabId = info.id
      if (this.currentShowTabId === 1) {
        this.contentListArray = Object.assign([], this.commonListArray)
      }
    },
    // 监听用户输入框输入
    changeSopName () {
      this.isSopEdit = true
    },
    dateNumberChange () {
      this.isSopEdit = true
    },
    // 返回时间列表字符串
    returnSopText (item) {
      console.log(item, '对当前的item进行组合处理')
      return moment(item.sendTime).format('YYYY-MM-DD HH:mm')
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
      this.contentListArray = tempInfo.sendContentList
    },
    addSop () {
      if (!this.addInfo.listTaskInfo.every(item => item.sendContentList && item.sendContentList.length > 0)) {
        this.$message.error('每一个时间节点都至少添加一个内容才可以新增')
        return
      }
      // 获取最后一条的时间
      const previousTime = this.addInfo.listTaskInfo[this.addInfo.listTaskInfo.length - 1].sendTime
      // 将最后一条的时间格式化
      const previoutTimeFormat = moment(previousTime).format('YYYY-MM-DD HH:mm')
      // 获取当前的时间
      const currentTimeFormat = moment().format('YYYY-MM-DD HH:mm')
      const tempAddInfo = {
        sort: this.addInfo.listTaskInfo.length + 1,
        tempId: new Date().getTime(),
        sendTime: (previoutTimeFormat === currentTimeFormat) ? moment(previousTime).add(1, 'm').format('YYYY-MM-DD HH:mm') : moment(currentTimeFormat).add(3, 'm').format('YYYY-MM-DD HH:mm'),
        sendContentList: []
      }
      this.addInfo.listTaskInfo.push(tempAddInfo)
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
      console.log(this.addInfo, '新增时间点后的对象')
      this.chooseSopItem(tempAddInfo, this.addInfo.listTaskInfo.length - 1)
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
          // this.sopList = nowSopList
          this.$set(this.addInfo, 'listTaskInfo', nowSopList)
          this.addCalendarInfo = Object.assign({}, this.addInfo)
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
      if (this.pageTypeId === -1) {
        console.log('新增操作', this.addInfo)
        this.newDataMethod(this.addInfo)
      } else {
        console.log('修改操作', this.addInfo)
        this.updataMethod(this.addInfo)
        // this.getGeneralPersonData('edit')
      }
    },
    // 新增操作
    newDataMethod (info) {
      console.log(info, '新增操作')
      addCalendarTemplateMethod(info).then(response => {
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
      editCalendarTemplateMethod(info).then(response => {
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
  ul,li {
    padding: 0;
    margin: 0;
  }
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
  .timeLine {
    display: flex;
    margin-bottom: 10px;
    margin-top: 20px;
    .label {
      width: 100px;
      text-align: right;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .timeWrapper {
      flex: 1;
      position: relative;
      border: 1px solid #e9e9e9;
      .tabWrapperDiv {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        .singleTabDiv {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          font-size: 14px;
          background-color: rgba(242, 242, 242, 1);
          color: black;
          border-radius: 4px;
        }
        .activeTabDiv {
          background-color: #4074f6;
          color: white;
        }
      }
      /deep/.ant-fullcalendar-header {
        padding: 11px 16px;
        text-align: left;
      }
      /deep/.ant-radio-button-wrapper {
        display: none;
      }
      .events {
        width: 100%;
        .singleDiv {
          width: calc(100% - 8px);
          position: relative;
          padding: 2px 10px 2px 4px;
          border-bottom: 1px solid #d8d8d8;
          margin-top: 2px;
          font-size: 12px;
          display: flex;
          align-items: center;
          &::nth-child(1) {
            margin-top: 0px;
          }
          // .singleContentTaskDiv::before {
          //   content: '';
          //   display: block;
          //   width: 4px;
          //   height: 4px;
          //   border-radius: 4px;
          //   background-color: black;
          // }
          .delDiv{
            width: 10px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            visibility: hidden;
            position: absolute;
            right: 0;
            top: 0;
          }
          &:hover {
            background-color: white;
            .delDiv {
              visibility: visible;
            }
          }
        }
        .singleDiv::before {
          content: '';
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 5px;
          margin-right: 2px;
          background-color: black;
        }
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
      flex-wrap: wrap;
      .tilBar {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sendSopTitle {
        font-size: 12px;
        font-weight: bolder;
        padding: 20px;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #d8d8d8;
      }
      .sendSOPList {
        border-radius: 5px;
        padding: 20px;
        width: 300px;
        height: auto;
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
        padding: 20px;
        .sendContentTitle {
          font-size: 14px;
          font-weight: bold;
          padding: 0 20px;
          span {
            font-size: 12px;
            color: #8a8a8a;
          }
        }
        .singleSendContentItem {
          display: flex;
          align-items: center;
          margin-top: 20px;
          padding: 0 20px;
          .singleSendContentTitle {
            flex-shrink: 0;
            font-size: 13px;
            margin-right: 20px;
          }
        }
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
</style>
