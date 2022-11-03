<template>
  <div id="addSop_Page_Container" ref="addSop_Page_Container">
    <a-spin :spinning="loadingStatus">
      <!-- 新增群发助手SOP -->
      <!-- 群发助手新增 -->
      <div class="chooseUsersContainer">
        <div class="disabledBox" v-if="addInfo.invalidState === 2" @click="$message.warn('执行后不可修改！')">
          <div class="executionDisableBox" v-if="pageTypeId === -1" @click.stop="sendSop()" v-permission="'/sopGeneral/add@post'">开始执行</div>
          <div class="executionDisableBox" v-else @click.stop="sendSop()" v-permission="'/sopGeneral/update@post'">开始执行</div>
        </div>
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
        <div class="line multiple">
          <span class="label">
            <span style="color: red">*</span>选择执行员工
          </span>
          <selectPersonnel
            v-if="treeData"
            :record="treeData"
            class="selectPersonnelCom"
            type="button"
            name="选择成员"
            v-model="employeeIds"
            @getVal="employeeIdsChange"
          />
        </div>
        <div class="line">
          <span class="label">
            <span style="color: red">*</span>选择执行客户
          </span>
          <div class="selectUserBox">
            <a-radio-group v-model="addInfo.selectContactType" @change="changeContactType" :disabled="addInfo.invalidState === 2">
              <a-radio :value="item.code" v-for="item in contactTypeList" :key="item.code">{{ item.name }}</a-radio>
            <!-- <a-radio :value="2">全部客户</a-radio> -->
            </a-radio-group>
          </div>
        </div>
        <div class="line multiple" v-if="Number(addInfo.selectContactType) === 1">
          <span class="label">包含标签</span>
          <div class="selectBox">
            <!-- @click="showBox(0)" -->
            <span class="selectBtn" @click="showBox(0)">
              <span class="emptyBtn" v-if="selectTagList.length == 0">+ 编辑</span>
              <span class="label_input_title" v-for="(item,index) in selectTagList" :key="index">
                {{ item.name }}
                <span class="delete" @click.stop="delTagHandle(item.id, index)">+</span>
              </span>
            </span>
          </div>
        </div>
        <div class="line">
          <span class="label"></span>
          <span class="finallyNum">
            预计人数：{{ addInfo.predictNum }}
            <span class="reload" @click="reloadExpectNum()" v-permission="'/sopGeneral/getPredictNum@post'">刷新</span>
          </span>
        </div>
        <div class="execution" v-if="pageTypeId === -1 && addInfo.invalidState !== 2" @click="sendSop()" v-permission="'/sopGeneral/add@post'">开始执行</div>
        <div class="execution" v-if="pageTypeId !== -1 && addInfo.invalidState !== 2" @click="sendSop()" v-permission="'/sopGeneral/update@post'">开始执行</div>
      </div>
      <div class="sendSOPInfoContainer">
        <TimeContent :timeList.sync="timeArray" :pageType="0" @changeTime="changeTimeMethod" :isSopEdit.sync="isSopEdit"/>
        <div class="sendItemContent">
          <div class="chooseSendDate">
            <div class="til">
              <span style="color: red;font-weight: 500;">*</span>发送时间
            </div>
            <div class="pickerBox" style="display: inline-block;position:relative">
              <div
                class="disabledBox"
                v-if="addInfo.listTaskInfo && addInfo.listTaskInfo[selectTimeIndex] && addInfo.listTaskInfo[selectTimeIndex].invalidState === 2"
                @click="$message.warn('执行后不可修改！')"
              ></div>
              <a-date-picker
                :disabled="addInfo.listTaskInfo && addInfo.listTaskInfo[selectTimeIndex] && addInfo.listTaskInfo[selectTimeIndex].invalidState === 2"
                dropdownClassName="addSop_Page_Container_selectSopItemDateBox"
                :allowClear="false"
                :showToday="false"
                v-model="chooseDate"
                :disabled-date="e => disabledBeforeDate(e, 'date')"
                :disabled-time="e => disabledBeforeDate(e, 'time')"
                valueFormat="YYYY-MM-DD HH:mm"
                format="YYYY-MM-DD HH:mm"
                show-time
                :getPopupContainer="() => $refs['addSop_Page_Container']"
                @change="sendDateChange"
              />
            </div>
          </div>
          <!-- 等式成立不可编辑 -->
          <SendContent
            :contentArray.sync="contentArray"
            :isSopEdit.sync="isSopEdit"
            :isDisableEdit="addInfo.listTaskInfo && addInfo.listTaskInfo[selectTimeIndex] && (addInfo.listTaskInfo[selectTimeIndex].invalidState === 2)"/>
        </div>
      </div>
      <!-- filterUserObj.list[0].target ? filterUserObj.list[0].target.map(it => +it.id) : [] -->
    </a-spin>
    <label-select
      :state="chooseUserTagsModalShow"
      :addState="false"
      :excludeId="[]"
      ref="labelSelect"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { getTagList, getGeneralDetail, getDictData, getGeneralPersonNum, addGeneralSop, editGeneralSop } from '@/api/salers'
import TimeContent from './timeContent.vue'
import SendContent from './sendContent.vue'
import { departmentEmp } from '@/api/common.js'
import Department from '@/components/department'
import LabelSelect from '../../../clientFollow/components/LabelSelect.vue'
// import { deepClonev2 } from '@/utils/util'
//  delSopTaskItemReq, getExpectNumReq, getUserSopReq, userSopSettingReq,
// import { userSopTaskItemSettingReq } from '@/api/salesManagement'
//  import { getDict, upLoad } from '@/api/common'
//  defaultLinkObj, defaultMiniObj, defaultLibraryObj, include1TypeSelectOptions, ransformTaskItemEntry, transformTaskDate, include2TypeSelectOptions,getNowDate, isUrl, disabledBeforeDate, generaType,generateDateTitle, returnPageTitle, transformTargetData, transformLibraryData
import { handleBtnArr, disabledBeforeDate } from '../sopUtils'
export default {
  name: 'GeneralAdd',
  components: {
    TimeContent,
    SendContent,
    Department,
    'label-select': LabelSelect,
    'MediumGroup': () => import('@/views/mediumGroup/index.vue')
  },
  data () {
    return {
      loadingStatus: false, // 加载状态
      selectTimeIndex: 0,
      childTagList: [], // 获取全部标签列表
      isSopEdit: false, // 判断页面是否被编辑过
      pageTypeId: 0, // 从上页传入的id,新增为-1,修改为真实id
      addInfo: {}, // 新增/修改数据对象
      timeArray: [], // 时间段数组
      currentTimeId: 0, // 当前选择的时间段id
      contentArray: [], // 内容数组
      chooseDate: '', // 时间选择器选择的时间
      isControlerDisabled: false,
      treeData: [],
      // 企业成员选择
      employeeIds: [],
      handleBtnArr,
      contactTypeList: [], // 执行客户类型数组
      selectTagList: [], // 标签列表
      sopList: [],
      sopExpectNum: 0,
      // 执行客户标签弹窗
      chooseUserTagsModalShow: false,
      disabledBeforeDate
    }
  },
  created () {
    this.pageTypeId = Number(this.$route.query.id)
    // 获取执行客户类型
    this.getDicData('sop_contact_type')
  },
  watch: {
    employeeIds () {
      console.log(this.employeeIds, '监听选择执行员工')
      this.$set(this.addInfo, 'empIds', this.employeeIds.join(','))
      this.getGeneralPersonData()
    },
    'addInfo.sopName' (e) {
      if (e && e.length > 18) {
        this.addInfo.sopName = e.slice(0, 18)
      }
    },
    timeArray () {
      console.log(this.timeArray, '父组件监听timeArray改变')
      this.$set(this.addInfo, 'listTaskInfo', this.timeArray)
    },
    contentArray () {
      console.log(this.currentTimeId, '父组件this.currentTimeId')
      console.log(this.contentArray, '父组件监听contentArray改变')
      this.selectTimeIndex = this.addInfo.listTaskInfo.findIndex(item => (item.tempId ? item.tempId === this.currentTimeId : item.id === this.currentTimeId))
      if (this.selectTimeIndex !== -1) {
        this.$set(this.addInfo.listTaskInfo[this.selectTimeIndex], 'sendContentList', this.contentArray)
      }
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
      // const tempIndex = this.addInfo.listTaskInfo.findIndex(item => (item.tempId ? item.tempId === this.currentTimeId : item.id === this.currentTimeId))
      // if (tempIndex !== -1) {
      //   this.$set(this.addInfo.listTaskInfo[tempIndex], 'sendContentList', this.contentArray)
      // }
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
    // sopName改变
    changeSopName (e) {
      // console.log(e, 'changeSopName改变')
      this.isSopEdit = true
    },
    // 切换执行客户类型
    changeContactType (e) {
      console.log(e, '监听执行客户类型')
      const targetVal = e.target.value
      if (Number(targetVal) === 1) {
        // 切换为筛选客户
        console.log('筛选客户')
      } else if (Number(targetVal) === 2) {
        // 切换为全部客户
        console.log('全部客户')
      }
      this.isSopEdit = true
      this.$set(this.addInfo, 'searchLableId', '')
      this.selectTagList = []
      this.getGeneralPersonData()
    },
    // 获取标签列表
    async getTagListData () {
      this.loadingStatus = true
      await getTagList().then(response => {
        console.log(response, '获取标签列表')
        // this.childTagList = response.data.tagGroupList
        // console.log(this.addInfo.lableVal, 'this.addInfo')
        for (const singleTag of response.data.tagGroupList) {
          for (const singleItem of singleTag.tags) {
            this.childTagList.push(singleItem)
          }
        }
        this.loadingStatus = false
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      const lableValList = this.addInfo.searchLableId.split(',').map(item => {
        item = Number(item)
        return item
      })
      // console.log(this.childTagList, 'this.childTagList')
      // let tempIdList = this.childTagList.map(item => item.id)
      // console.log(tempIdList, 'tempIdList')
      // console.log(lableValList, 'lableValList')
      const tempArray = this.childTagList.filter(item => {
        if (lableValList.indexOf(item.id) !== -1) {
          return item
        }
      })
      console.log(tempArray, 'tempArray')
      // debugger
      this.selectTagList = Object.assign([], tempArray)
      // 自动刷新预计人数
      this.getGeneralPersonData()
    },
    // 拉取部门数据
    departmentEmp () {
      this.loadingStatus = true
      departmentEmp().then(res => {
        this.treeData = res.data
        this.loadingStatus = false
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
    },
    // 获取字典数据
    async getDicData (type) {
      this.loadingStatus = true
      const params = { dictType: type }
      await getDictData(params).then(response => {
        this.loadingStatus = false
        console.log(response, '字典数据')
        this.contactTypeList = response.data.map(item => {
          item.code = Number(item.code)
          return item
        })
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      console.log(Number(this.pageTypeId), 'pageTypeId的类型')
      // debugger
      // const typeId = this.$route.query.id
      if (this.pageTypeId === -1) {
        console.log('新增操作')
        this.addInfo = { predictNum: 0, selectContactType: this.contactTypeList[0].code, listTaskInfo: [] }
        this.setDefaultTime()
        this.loadingStatus = false
      } else {
        console.log('修改操作')
        this.getDetail(this.pageTypeId)
      }
      this.departmentEmp()
    },
    // 如果是新增,设置默认时间点
    setDefaultTime () {
      const tempTaskList = []
      const tempInfo = {
        sort: this.addInfo.listTaskInfo.length + 1,
        tempId: new Date().getTime(),
        sendTime: moment().add(3, 'm').format('YYYY-MM-DD HH:mm'),
        sendContentList: []
      }
      tempTaskList.push(tempInfo)
      this.$set(this.addInfo, 'listTaskInfo', tempTaskList)
      this.timeArray = Object.assign([], this.addInfo.listTaskInfo)
    },
    // 获取详情
    async getDetail (id) {
      this.loadingStatus = true
      const params = { id }
      await getGeneralDetail(params).then(response => {
        this.loadingStatus = false
        console.log(response)
        this.addInfo = response.data
        this.$set(this.addInfo, 'selectContactType', Number(this.addInfo.selectContactType))
        this.employeeIds = this.setEmpIdArray(this.addInfo.empIds)
        this.timeArray = this.addInfo.listTaskInfo.map(item => {
          item.sendTime = moment(item.sendTime).format('YYYY-MM-DD HH:mm')
          return item
        })
        this.currentTimeId = this.addInfo.listTaskInfo[0].id
        // this.contentArray = this.addInfo.listTaskInfo[0].sendContentList
        // this.chooseDate = this.addInfo.listTaskInfo[0].sendTime
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      this.getTagListData()
    },
    // 获取群发助手人员数据
    async getGeneralPersonData (text) {
      if (!(this.addInfo.empIds && this.addInfo.empIds.length)) {
        if (text === 'reload') {
          this.$message.error('至少选择一名执行员工')
        }
        return
      }
      if (this.addInfo.selectContactType === 1) {
        if (this.selectTagList.length === 0) {
          if (text === 'reload') {
            this.$message.error('至少选择一个筛选标签!')
          }
          return
        }
      }
      this.loadingStatus = true
      const params = {
        empIds: this.addInfo.empIds,
        selectContactType: this.addInfo.selectContactType,
        searchLableId: this.addInfo.selectContactType === 1 ? this.selectTagList.map(item => item.id).join(',') : ''
      }
      await getGeneralPersonNum(params).then(response => {
        this.loadingStatus = false
        console.log(response, 'response')
        if (text === 'edit' || text === 'add') {
          console.log('无需显示提示框')
        } else {
          this.$message.success('刷新成功')
        }
        this.$set(this.addInfo, 'predictNum', response.countNum)
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      this.loadingStatus = false
      if (text === 'edit' || text === 'add') {
        if (parseInt(this.addInfo.predictNum) !== 0) {
          if (text === 'edit') {
            this.updataMethod(this.addInfo)
          } else if (text === 'add') {
            this.newDataMethod(this.addInfo)
          }
        } else {
          console.log(this.addInfo, '检测addInfo')
          this.$message.error('至少要有一个预计发送人')
        }
      }
      // if (text === 'edit') {
      //   this.updataMethod(this.addInfo)
      // } else if (text === 'add') {
      //   this.newDataMethod(this.addInfo)
      // }
    },
    // 将树id放入数组中
    setEmpIdArray (text) {
      const splitArray = text ? text.split(',') : []
      return splitArray
    },
    // 成员选择
    employeeIdsChange (e) {
      this.employeeIds = e
      console.log(e, '选择的成员id')
      this.$set(this.addInfo, 'empIds', this.employeeIds.join(','))
      this.isSopEdit = true
      // 自动刷新预计人数
      // this.getGeneralPersonData()
      // this.$set(this.addInfo, 'empIds', )
    },
    // 用于显示数据选中
    showBox (e) {
      console.log(e, 'eee')
      this.chooseUserTagsModalShow = !this.chooseUserTagsModalShow
      const filterIdArr = this.selectTagList.length !== 0 ? this.selectTagList.map(item => item.id) : []
      const filterInputArr = Object.assign([], this.selectTagList)
      if (this.selectTagList.length !== 0) {
        this.$refs.labelSelect.idArr = filterIdArr
        this.$refs.labelSelect.inputArr = filterInputArr
      }
    },
    // 标签返回数据
    transmitLabel (e) {
      console.log(e, '返回的数据')
      this.selectTagList = e
      this.isSopEdit = true
      // 自动刷新预计人数
      this.getGeneralPersonData()
    },
    // 切换时间节点回调
    changeTimeMethod (id) {
      console.log(id, '切换的时间节点id')
      console.log(this.addInfo.listTaskInfo, 'this.addInfo.listTaskInfo')
      this.currentTimeId = id
      const tempInfo = this.addInfo.listTaskInfo.find(item => (item.tempId ? item.tempId === id : item.id === id))
      console.log(tempInfo, 'tempInfo切换时间回调')
      // if(tempInfo) {
      //   this.contentArray = tempInfo.sendContentList
      // }
      this.contentArray = tempInfo.sendContentList
      this.chooseDate = tempInfo.sendTime
    },
    // 更新sop时间
    sendDateChange (val) {
      console.log(val, 'val')
      this.isSopEdit = true
      const tempIndex = this.addInfo.listTaskInfo.findIndex(item => (item.tempId ? item.tempId === this.currentTimeId : item.id === this.currentTimeId))
      // console.log(tempIndex, '更新时间tempIndex')
      this.$set(this.addInfo.listTaskInfo[tempIndex], 'sendTime', moment(val).format('YYYY-MM-DD HH:mm'))
    },
    // 刷新获取群发助手人数
    reloadExpectNum () {
      this.getGeneralPersonData('reload')
    },
    // 删除标签
    delTagHandle (id, index) {
      console.log(id, index, '删除标签')
      // console.log(this.selectTagList, 'selectTagList')
      this.selectTagList.splice(index, 1)
      console.log(this.selectTagList, '出现的数组')
      this.isSopEdit = true
      this.getGeneralPersonData()
    },
    // 开始执行
    sendSop () {
      if (!(this.addInfo.sopName && this.addInfo.sopName.trim())) {
        this.$message.error('请输入SOP名称！')
        return
      }
      if (!(this.addInfo.empIds && this.addInfo.empIds.length)) {
        this.$message.error('至少选择一名执行员工！')
        return
      }
      if (this.addInfo.selectContactType === 1 && !this.selectTagList.length) {
        this.$message.error('至少选择一项用户包含标签')
        return
      }
      this.$set(this.addInfo, 'searchLableId', this.selectTagList.map(item => item.id).join(','))
      if (this.addInfo.listTaskInfo && this.addInfo.listTaskInfo.length != 0) {
        for (const singleTimeInfo of this.addInfo.listTaskInfo) {
          if (singleTimeInfo.sendContentList.length === 0) {
            this.$message.error('每项任务都至少添加一项发送内容才可以执行！')
            return
          }
          const tempTimeArray = this.addInfo.listTaskInfo.map(item => item.sendTime)
          const tempNewSetTimeArray = [...new Set(tempTimeArray)]
          if (tempTimeArray.length === tempNewSetTimeArray.length) {
            // 两条数据相同,没有相同数据
          } else {
            this.$message.error('每项任务的时间不能相同')
            return
          }
          if ((new Date(singleTimeInfo.sendTime) < new Date().getTime()) && this.pageTypeId === -1) {
            this.$message.error('每项任务的时间都要大于当前时间！')
            return
          }
        }
      } else {
        this.$message.error('请选择时间点')
        return
      }
      this.loadingStatus = true
      this.$set(this.addInfo, 'empIds', this.employeeIds.join(','))
      console.log(this.addInfo, 'this.addInfo')
      // debugger
      if (this.pageTypeId === -1) {
        console.log('新增操作')
        // this.newDataMethod(this.addInfo)
        this.getGeneralPersonData('add')
      } else {
        console.log('修改操作')
        this.getGeneralPersonData('edit')
      }
    },
    // 新增操作
    newDataMethod (info) {
      this.loadingStatus = true
      addGeneralSop(info).then(response => {
        console.log(response, '新增操作')
        this.loadingStatus = false
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
      this.loadingStatus = true
      editGeneralSop(info).then(response => {
        console.log(response, '修改操作')
        this.loadingStatus = false
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
<style lang='less'>
#addSop_Page_Container {
  .selectPersonnelCom {
    width: 90%;
    .ant-btn {
      width: 180px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      border: 1px dashed #8a8a8a;
      background: none;
      color: rgba(0, 0, 0, 0.6);
      text-shadow: none;
    }
  }
  .chooseSendDate {
    .ant-calendar-picker {
      .ant-input {
        height: 30px;
      }
    }
  }
  .contentTextModal {
    .ant-modal-body {
      padding-top: 0;
      .ant-input {
        min-height: 100px;
      }
    }
  }
  // .contentLinkModal {
  //   .ant-modal-body {
  //     display: flex;
  //     justify-content: space-between;
  //     align-items: flex-start;
  //     position: relative;
  //     .tip {
  //       margin: 0;
  //       .click {
  //         color: #4074f6;
  //         cursor: pointer;
  //       }
  //     }
  //     .top {
  //       position: absolute;
  //       top: 0;
  //     }
  //     .formBox {
  //       width: 65%;
  //       .line {
  //         position: relative;
  //         margin-bottom: 10px;
  //         .ant-input {
  //           height: 35px;
  //           padding-right: 60px;
  //         }
  //         .len {
  //           position: absolute;
  //           right: 5px;
  //           top: 8px;
  //         }
  //       }
  //       .textarea {
  //         .ant-input {
  //           min-height: 100px;
  //         }
  //         .len {
  //           bottom: 0;
  //           transform: translate(0, 100%);
  //         }
  //       }
  //     }
  //     .pic {
  //       flex: 1;
  //       margin-left: 20px;
  //       display: flex;
  //       flex-direction: column;
  //       align-items: center;
  //       .image {
  //         width: 170px;
  //         height: 170px;
  //         border-radius: 5px;
  //         overflow: hidden;
  //         cursor: pointer;
  //       }
  //       .addPic {
  //         border: 1px dashed #d1d1d1;
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //         font-size: 50px;
  //         font-weight: 100;
  //         color: #878787;
  //       }
  //       .photoTip {
  //         margin-top: 5px;
  //       }
  //       .file {
  //         position: fixed;
  //         left: 100000px;
  //         top: 100000px;
  //         opacity: 0;
  //         width: 1px;
  //         height: 1px;
  //       }
  //     }
  //   }
  // }
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
<style lang='less' scoped>
@import '../addSop.less';
</style>
