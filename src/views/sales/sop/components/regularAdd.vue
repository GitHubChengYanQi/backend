<template>
  <div id="addSop_Page_Container" ref="addSop_Page_Container">
    <a-spin :spinning="loadingStatus">
      <!-- 群发助手新增 -->
      <div class="chooseUsersContainer">
        <!-- <div class="disabledBox" v-if="addInfo.invalidState === 2" @click="$message.warn('执行后不可修改！')"></div> -->
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
        <div class="line multiple">
          <span class="label">
            <span style="color: red">*</span>筛选客户
          </span>
          <div class="selectBox">
            <!-- <div class="filterListBox">
              <a-select v-model="addInfo.optionType" style="width: 200px">
                <a-select-option :value="1">客户阶段</a-select-option>
              </a-select>
              <a-select
                placeholder="请选择"
                mode="multiple"
                v-model="addInfo.optionValList"
                style="width: 300px;min-height: 40px;"
              >
                <a-select-option
                  v-for="(item, idx) in customerTypeList"
                  :key="idx"
                  :value="item.code"
                >{{ item.name }}</a-select-option>
              </a-select>
            </div> -->
            <div class="filterListBox">
              <span class="selectBtn" @click="showBox(0)">
                <span
                  class="emptyBtn"
                  v-if="!(addInfo.selectTagList && addInfo.selectTagList.length)"
                >+ 添加标签</span>
                <span
                  class="label_input_title"
                  v-for="(item,index) in addInfo.selectTagList"
                  :key="item.id"
                >
                  {{ item.name }}
                  <span class="delete" @click.stop="delTagHandle(item,0, index)">+</span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="line multiple">
          <span class="label">排除标签</span>
          <div class="selectBox">
            <span class="selectBtn" @click="showBox(-2)">
              <span class="emptyBtn" v-if="!(addInfo.excludeTagList && addInfo.excludeTagList.length)">+ 添加标签</span>
              <span
                class="label_input_title"
                v-for="(item,index) in addInfo.excludeTagList"
                :key="index"
              >
                {{ item.name }}
                <span class="delete" @click.stop="delTagHandle(item.id, -2, index)">+</span>
              </span>
            </span>
          </div>
        </div>
        <div class="execution" v-if="pageTypeId === -1" @click="sendSop()" v-permission="'/sopRegular/add@post'">开始执行</div>
        <div class="execution" v-else @click="sendSop()" v-permission="'/sopRegular/update@post'">开始执行</div>
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
        <!-- v-if="sopList.length" -->
        <div class="sendItemContent">
          <div class="chooseSendDate" v-if="addInfo.listTaskInfo && addInfo.listTaskInfo.length">
            <div class="til">
              <span style="color: red;font-weight: 500;">*</span>发送时间
            </div>
            <div class="pickerBox" style="display: inline-block;position:relative">
              <!-- <div
                class="disabledBox"
                v-if="addInfo.listTaskInfo && addInfo.listTaskInfo[selectSopItemIndex] && addInfo.listTaskInfo[selectSopItemIndex].invalidState === 2"
                @click="$message.warn('执行后不可修改！')"
              ></div> -->
              <div class="chooseDateBox1">
                <p class="tip">当客户条件为所选内容时</p>
                <div class="chooseDateBoxRadio">
                  <div class="line-wrapper">
                    <a-radio
                      :checked="+addInfo.listTaskInfo[selectSopItemIndex].sendType === 1"
                      @click="chooseDateRadioClick(1)"
                    />当天
                    <a-input-number
                      v-model="addInfo.listTaskInfo[selectSopItemIndex].sendHour"
                      :min="0"
                      :max="23"
                      style="width: 70px;"
                      @blur="dateNumberChange($event, addInfo.listTaskInfo[selectSopItemIndex].sendType)"
                    />小时
                    <a-input-number
                      v-model="addInfo.listTaskInfo[selectSopItemIndex].sendMinute"
                      :min="addInfo.listTaskInfo[selectSopItemIndex].sendMinute === 0 ? 3 : 1"
                      :max="59"
                      style="width: 60px;"
                      @blur="dateNumberChange($event, addInfo.listTaskInfo[selectSopItemIndex].sendType)"
                    />分钟后发送
                  </div>
                  <div class="line-wrapper">
                    <a-radio
                      :checked="+addInfo.listTaskInfo[selectSopItemIndex].sendType === 2"
                      @click="chooseDateRadioClick(2)"
                    />第
                    <a-input-number
                      v-model="addInfo.listTaskInfo[selectSopItemIndex].sendDayNum"
                      :min="1"
                      :max="100"
                      style="width: 70px;"
                      @blur="dateNumberChange($event, addInfo.listTaskInfo[selectSopItemIndex].sendType)"
                    />天
                    <!-- sendTime -->
                    <!-- :disabled-hours="(e) => addInfo.listTaskInfo[selectSopItemIndex].sendDayNum === 1 && disabledBeforeDate(e, 'hour')"
                      :disabled-minutes="(e) => addInfo.listTaskInfo[selectSopItemIndex].sendDayNum === 1 &&disabledBeforeDate(e, 'minute')"
                    -->
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
      <!-- addTagsType === 'executeTags' ? filterSelectInfo.excludeTagList : filterSelectInfo.selectTagList -->
    </a-spin>
    <label-select
      :state="chooseUserTagsModalShow"
      :addState="false"
      :excludeId="addTagsType === 'executeTags' ? filterSelectInfo.excludeTagList : filterSelectInfo.selectTagList"
      ref="labelSelect"
    />
  </div>
</template>

<script>

import SendContent from './sendContent.vue'
// import moment from 'moment'
// import { getGeneralDetail, getDictData, getGeneralPersonNum, addGeneralSop, editGeneralSop } from '@/api/salers'
import { getTagList, getRegularDetail, getDictData, addRegularSop, editRegularSop } from '@/api/salers'
import { departmentEmp } from '@/api/common.js'
import Department from '@/components/department'
import LabelSelect from '../../../clientFollow/components/LabelSelect.vue'
//  delSopTaskItemReq, getExpectNumReq, getUserSopReq, userSopSettingReq,
//  import { getDict, upLoad } from '@/api/common'
//  defaultLinkObj, defaultMiniObj, defaultLibraryObj, include1TypeSelectOptions, getNowDate, isUrl, disabledBeforeDate, generaType, generateDateTitle, returnPageTitle, transformTargetData, transformLibraryData
import { disabledBeforeDate } from '../sopUtils'
export default {
  name: 'RegularAdd',
  components: {
    SendContent,
    Department,
    'label-select': LabelSelect,
    'MediumGroup': () => import('@/views/mediumGroup/index.vue')
  },
  data () {
    return {
      loadingStatus: false,
      disabledBeforeDate,
      childTagList: [], // 从子组件中获取的标签信息
      isSopEdit: false, // 判断页面是否被编辑过
      filterSelectInfo: {}, // 过滤选中的标签对象
      filterSelectList: [],
      pageTypeId: 0, // 从上页传入的id,新增为-1,修改为真实id
      addInfo: {}, // 新增/修改数据对象
      addTagsType: '', // 添加标签状态
      currentTimeId: 0, // 当前选择的时间段id
      contentArray: [], // 内容数组
      chooseDate: '', // 时间选择器选择的时间
      customerTypeList: [], // 客户类型数据列表
      sopList: [],
      // 执行客户标签弹窗
      chooseUserTagsModalShow: false,
      isControlerDisabled: false,
      SOPName: '',
      treeData: [],
      // 企业成员选择
      employeeIds: [],
      selectUserType: 1, // 选择执行客户类型
      selectTagList: [], // 标签列表
      excludeTagList: [], // 排除标签列表
      selectSopItemIdx: '', // 选中的时间id
      selectSopItemIndex: '' // 时间标签选择下标
    }
  },
  created () {
    this.pageTypeId = Number(this.$route.query.id)
    this.$set(this.addInfo, 'optionType', 1)
    this.departmentEmp()
  },
  watch: {
    employeeIds () {
      console.log(this.employeeIds, '监听选择执行员工')
      this.$set(this.addInfo, 'empIds', this.employeeIds.join(','))
    },
    'addInfo.sopName' (e) {
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
    changeSopName () {
      this.isSopEdit = true
    },
    returnFilterMethod () {
      return []
    },
    // 获取标签列表
    async getTagListData () {
      this.loadingStatus = true
      await getTagList().then(response => {
        this.loadingStatus = false
        console.log(response, '获取标签列表')
        // this.childTagList = response.data.tagGroupList
        console.log(this.addInfo.lableVal, 'this.addInfo')
        for (const singleTag of response.data.tagGroupList) {
          for (const singleItem of singleTag.tags) {
            this.childTagList.push(singleItem)
          }
        }
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      const lableValList = this.addInfo.lableVal.split(',').map(item => {
        item = Number(item)
        return item
      })
      const excludeValList = this.addInfo.excludeLable.split(',').map(item => {
        item = Number(item)
        return item
      })
      // let tempIdList = this.childTagList.map(item => item.id)
      // console.log(tempIdList, 'tempIdList')
      // console.log(lableValList, 'lableValList')
      const tempArray = this.childTagList.filter(item => {
        if (lableValList.indexOf(item.id) !== -1) {
          return item
        }
      })
      console.log(tempArray, 'tempArray')
      this.$set(this.addInfo, 'selectTagList', tempArray)
      this.$set(this.filterSelectInfo, 'selectTagList', tempArray.map(item => item.id))
      const tempExcludeArray = this.childTagList.filter(item => {
        if (excludeValList.indexOf(item.id) !== -1) {
          return item
        }
      })
      this.$set(this.addInfo, 'excludeTagList', tempExcludeArray)
      this.$set(this.filterSelectInfo, 'excludeTagList', tempExcludeArray.map(item => item.id))
      this.loadingStatus = false
    },
    // 拉取部门数据
    async departmentEmp () {
      this.loadingStatus = true
      await departmentEmp().then(res => {
        this.loadingStatus = false
        this.treeData = res.data
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      this.getCustomerTypeList()
    },
    // 获取字典中客户类型列表
    async getCustomerTypeList () {
      this.loadingStatus = true
      const params = { dictType: 'follow_up_status' }
      await getDictData(params).then(response => {
        this.loadingStatus = false
        console.log(response, '客户类型数据')
        this.customerTypeList = response.data
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      this.selectSopItemIndex = 0
      if (this.pageTypeId === -1) {
        // 新增
        this.setDefaultTime()
        this.loadingStatus = false
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
        sendType: 1, // 默认为当天
        sendHour: '0', // 默认为当天0小时
        sendMinute: '10', // 默认为当天10分钟
        sendDayNum: '', // 默认传空
        sendTime: '', // 默认传空
        sendContentList: []
      }
      tempTaskList.push(tempInfo)
      this.currentTimeId = tempInfo.tempId
      this.selectSopItemIdx = this.currentTimeId
      this.$set(this.addInfo, 'listTaskInfo', tempTaskList)
      this.$set(this.addInfo, 'lableVal', '')
      this.$set(this.addInfo, 'excludeLable', '')
      this.$set(this.addInfo, 'selectTagList', [])
      this.$set(this.addInfo, 'excludeTagList', [])
      this.$set(this.addInfo, 'optionValList', [])
      this.$set(this.addInfo, 'optionVal', '')
    },
    // 获取详情
    getDetail (id) {
      this.loadingStatus = true
      const params = { id }
      getRegularDetail(params).then(response => {
        this.loadingStatus = false
        console.log(response)
        this.addInfo = response.data
        this.$set(this.addInfo, 'optionType', Number(this.addInfo.optionType))
        this.employeeIds = this.setEmpIdArray(this.addInfo.empIds)
        this.$set(this.addInfo, 'optionValList', this.addInfo.optionVal.length ? this.addInfo.optionVal.split(',') : [])
        this.$set(this.addInfo, 'selectTagList', this.addInfo.lableVal.length ? this.addInfo.lableVal.split(',') : [])
        this.$set(this.addInfo, 'excludeTagList', this.addInfo.excludeLable.length ? this.addInfo.excludeLable.split(',') : [])
        // this.filterSelectList = Object.assign([], this.addInfo.selectTagList)
        this.contentArray = this.addInfo.listTaskInfo[this.selectSopItemIndex].sendContentList
        console.log(this.addInfo.selectTagList, 'this.addInfo.selectTagList')
        this.currentTimeId = this.addInfo.listTaskInfo[0].id
        this.selectSopItemIdx = this.currentTimeId
        this.getTagListData()
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
    },
    // 返回时间列表字符串
    returnSopText (item) {
      console.log(item, '对当前的item进行组合处理')
      let headText = ''
      if (item.sendType === 1) {
        headText = `当天${item.sendHour}小时${item.sendMinute}分钟后发送`
      } else {
        headText = `第${item.sendDayNum}天${item.sendTime}发送`
      }
      return headText
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
      // this.$set(this.addInfo, 'empIds', )
    },
    // 点击选择标签
    showBox (e) {
      console.log(e, 'eee')
      let filterInputArr = []
      let filterIdArr = []
      if (e !== -1) {
        if (e == 0) {
          // 添加执行标签
          this.addTagsType = 'executeTags'
          filterIdArr = this.addInfo.selectTagList.map(item => item.id)
          filterInputArr = Object.assign([], this.addInfo.selectTagList)
        } else {
          this.addTagsType = 'excludeTags'
          filterIdArr = this.addInfo.excludeTagList.map(item => item.id)
          filterInputArr = Object.assign([], this.addInfo.excludeTagList)
        }
        // console.log(this.addTagsType, 'this.addTagsType')
        // console.log(this.addInfo, '选择标签操作')
      }
      this.$refs.labelSelect.idArr = filterIdArr
      this.$refs.labelSelect.inputArr = filterInputArr
      this.chooseUserTagsModalShow = !this.chooseUserTagsModalShow
    },
    // 标签返回数据
    transmitLabel (e) {
      this.isSopEdit = true
      console.log(e, '标签返回的数据')
      if (this.addTagsType === 'executeTags') {
        this.$set(this.addInfo, 'selectTagList', e)
        this.$set(this.addInfo, 'lableVal', e.map(item => item.id).join(','))
        const tempArray = this.addInfo.selectTagList.map(item => item.id)
        this.$set(this.filterSelectInfo, 'selectTagList', tempArray)
      } else {
        this.$set(this.addInfo, 'excludeTagList', e)
        this.$set(this.addInfo, 'excludeLable', e.map(item => item.id).join(','))
        this.$set(this.filterSelectInfo, 'excludeTagList', e.map(item => item.id))
      }
      console.log(this.filterSelectInfo)
      // this.selectTagList = e
    },
    // 删除标签
    delTagHandle (info, typeId, index) {
      console.log(info, typeId, index, '删除标签操作')
      this.isSopEdit = true
      if (typeId === 0) {
        // 删除可选标签
        this.addInfo.selectTagList.splice(index, 1)
        this.addInfo.lableVal = this.addInfo.selectTagList.length ? this.addInfo.selectTagList.map(it => it.id).join(',') : ''
        this.$set(this.filterSelectInfo, 'selectTagList', this.addInfo.selectTagList)
      } else {
        // 删除排除标签
        this.addInfo.excludeTagList.splice(index, 1)
        this.addInfo.excludeLable = this.addInfo.excludeTagList.length ? this.addInfo.excludeTagList.map(it => it.id).join(',') : ''
        this.$set(this.filterSelectInfo, 'excludeTagList', this.addInfo.excludeTagList)
      }
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
    },
    // 添加时间点
    addSop () {
      if (!this.addInfo.listTaskInfo.every(item => item.sendContentList && item.sendContentList.length > 0)) {
        this.$message.error('每一个时间节点都至少添加一个内容才可以新增')
        return
      }
      this.isSopEdit = true
      const tempInfo = {
        sort: (this.addInfo.listTaskInfo && this.addInfo.listTaskInfo.length > 0) ? this.addInfo.listTaskInfo.length + 1 : '1',
        tempId: new Date().getTime(),
        sendType: 1, // 默认为当天
        sendHour: '0', // 默认为当天0小时
        sendMinute: '10', // 默认为当天10分钟
        sendDayNum: '', // 默认传空
        sendTime: '', // 默认传空
        sendContentList: []
      }
      this.addInfo.listTaskInfo.push(tempInfo)
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
      this.chooseSopItem(tempInfo, this.addInfo.listTaskInfo.length - 1)
      // this.selectSopItemIdx = tempInfo.tempId
      // this.selectSopItemIndex = this.addInfo.listTaskInfo.length - 1
      // console.log(this.addInfo, '新增时间点后的对象')
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
      this.currentTimeId = this.selectSopItemIdx
      this.selectSopItemIndex = index
      const tempInfo = this.addInfo.listTaskInfo.find(item => (item.tempId ? item.tempId === this.selectSopItemIdx : item.id === this.selectSopItemIdx))
      console.log(tempInfo, 'tempInfo切换时间回调')
      this.contentArray = tempInfo.sendContentList
    },
    // 删除时间节点
    delSopItem (index, info) {
      console.log(index, '删除的下标', info, '删除的info')
      this.isSopEdit = true
      const that = this
      const nowSopList = Object.assign([], this.addInfo.listTaskInfo)
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
              that.selectSopItemIndex = selectIndex
              that.selectSopItemIdx = nowSopList[selectIndex].tempId ? nowSopList[selectIndex].tempId : nowSopList[selectIndex].id
            }
          }
          // this.sopList = nowSopList
          // that.$emit('update:timeArray', nowSopList)
          this.$set(this.addInfo, 'listTaskInfo', nowSopList)
        }
      })
    },
    // 单击选择时间点类型
    chooseDateRadioClick (value) {
      this.isSopEdit = true
      console.log(value, 'value')
      if (this.addInfo.listTaskInfo[this.selectSopItemIndex].sendType === Number(value)) {
        // 状态没变,无需触发
      } else {
        if (value === 2) {
          // 选中为第几天
          this.addInfo.listTaskInfo[this.selectSopItemIndex].sendDayNum = 1
          this.addInfo.listTaskInfo[this.selectSopItemIndex].sendTime = '10:00'
        } else {
          // 选中为当天
          this.addInfo.listTaskInfo[this.selectSopItemIndex].sendHour = 0
          this.addInfo.listTaskInfo[this.selectSopItemIndex].sendMinute = 10
        }
      }
      this.addInfo.listTaskInfo[this.selectSopItemIndex].sendType = Number(value)
      this.$set(this.addInfo, 'listTaskInfo', this.addInfo.listTaskInfo)
    },
    // 时间选择
    dateNumberChange (e) {
      console.log(e, '时间选择')
      this.isSopEdit = true
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
      if (!((this.addInfo.optionValList && this.addInfo.optionValList.length) ||
            (this.addInfo.lableVal && this.addInfo.lableVal.length))) {
        this.$message.error('至少选择一个客户条件值')
        return
      }
      this.$set(this.addInfo, 'optionVal', this.addInfo.optionValList.length ? this.addInfo.optionValList.join(',') : '')
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
      this.loadingStatus = true
      console.log(this.addInfo, 'this.addInfo')
      // 生成客户阶段的文字
      const customerTypeNameList = this.customerTypeList.filter(item => {
        if (this.addInfo.optionValList.indexOf(item.code) !== -1) {
          return item
        }
      })
      // 生成客户阶段文字
      const tempCustomerText = customerTypeNameList.length ? `客户阶段:${customerTypeNameList.map(item => item.name).join('、')}` : ''
      // 生成标签阶段文字
      const tempTagText = this.addInfo.selectTagList.length ? `客户标签:${this.addInfo.selectTagList.map(item => item.name).join('、')}` : ''
      let totalText = ''
      if (tempCustomerText) {
        // 有客户信息
        if (tempTagText) {
          // 有标签信息
          totalText = tempCustomerText + ';' + tempTagText
        } else {
          // 没有标签信息
          totalText = tempCustomerText
        }
      } else {
        // 没有客户信息
        if (tempTagText) {
          // 有标签信息
          totalText = tempTagText
        }
      }
      this.$set(this.addInfo, 'empIds', this.employeeIds.join(','))
      this.$set(this.addInfo, 'showExecuteVal', totalText)
      this.loadingStatus = true
      if (this.pageTypeId === -1) {
        console.log('新增操作', this.addInfo)
        // debugger
        this.newDataMethod(this.addInfo)
      } else {
        console.log('修改操作', this.addInfo)
        // debugger
        this.updataMethod(this.addInfo)
      }
    },
    // 新增操作
    newDataMethod (info) {
      addRegularSop(info).then(response => {
        this.loadingStatus = false
        console.log(response, '新增操作')
        if (response.code === 200) {
          this.isSopEdit = false
          this.$message.success('新增成功')
          const setTimeoutId = setTimeout(() => {
            clearTimeout(setTimeoutId)
            this.$router.go(-1)
          }, 500)
        }
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
    },
    // 修改操作
    updataMethod (info) {
      editRegularSop(info).then(response => {
        this.loadingStatus = false
        console.log(response, '修改操作')
        if (response.code === 200) {
          this.isSopEdit = false
          this.$message.success('修改成功')
          const setTimeoutId = setTimeout(() => {
            clearTimeout(setTimeoutId)
            this.$router.go(-1)
          }, 500)
        }
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
    }
  }
}
</script>
  <style lang='less' scroped>
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
    .contentLinkModal {
      .ant-modal-body {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;
        .tip {
          margin: 0;
          .click {
            color: #4074f6;
            cursor: pointer;
          }
        }
        .top {
          position: absolute;
          top: 0;
        }
        .formBox {
          width: 65%;
          .line {
            position: relative;
            margin-bottom: 10px;
            .ant-input {
              height: 35px;
              padding-right: 60px;
            }
            .len {
              position: absolute;
              right: 5px;
              top: 8px;
            }
          }
          .textarea {
            .ant-input {
              min-height: 100px;
            }
            .len {
              bottom: 0;
              transform: translate(0, 100%);
            }
          }
        }
        .pic {
          flex: 1;
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .image {
            width: 170px;
            height: 170px;
            border-radius: 5px;
            overflow: hidden;
            cursor: pointer;
          }
          .addPic {
            border: 1px dashed #d1d1d1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 50px;
            font-weight: 100;
            color: #878787;
          }
          .photoTip {
            margin-top: 5px;
          }
          .file {
            position: fixed;
            left: 100000px;
            top: 100000px;
            opacity: 0;
            width: 1px;
            height: 1px;
          }
        }
      }
    }
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
