<template>
  <div id="addSop_Page_Container" ref="addSop_Page_Container">
    <a-spin :spinning="loadingStatus">
      <!-- 群发活动新增 -->
      <div class="chooseUsersContainer">
        <div class="disabledBox" v-if="addInfo.invalidState === 2" @click="$message.warn('执行后不可修改！')">
          <div class="executionDisableBox" v-if="addInfo.invalidState === 2 && pageTypeId === -1" @click.stop="sendSop()" v-permission="'/sopActivity/add@post'">开始执行</div>
          <div class="executionDisableBox" v-if="addInfo.invalidState === 2 && pageTypeId !== -1" @click.stop="sendSop()" v-permission="'/sopActivity/update@post'">开始执行</div>
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
            <a-radio-group v-model="addInfo.selectContactType" @change="changeSelectContactType" :disabled="addInfo.invalidState === 2">
              <a-radio :value="item.code" v-for="item in contactTypeList" :key="item.code">{{ item.name }}</a-radio>
              <!-- <a-radio :value="2">全部客户</a-radio> -->
            </a-radio-group>
          </div>
        </div>
        <div
          class="line multiple"
          v-if="Number(addInfo.selectContactType) === 1"
        >
          <span class="label"></span>
          <div class="selectBox">
            <div class="operationMode" v-if="addInfo.listSearchInfo.length > 1">
              <!-- :class="(item.code === addInfo.addOrType) ? 'active' : ''" -->
              <span
                v-for="item in logicalList"
                :key="item.code"
                :class="(item.code === addInfo.andOrType) ? 'active' : ''"
                @click="chooseLogical(item)"
              >{{ item.name }}</span>
              <!-- item.name -->
              <!-- addInfo.addOrType -->
            </div>
            <!-- <div v-if="filterCustomerArray.length !== 0"> -->
            <div class="filterListBox" v-for="(bigItem, bigIndex) in addInfo.listSearchInfo" :key="bigItem.tempId ? bigItem.tempId : bigItem.id">
              <a-select
                placeholder="请选择"
                v-model="addInfo.listSearchInfo[bigIndex].lableStageType"
                style="width: 200px"
                @change="changeBigCate(bigItem, bigIndex, $event)"
              >
                <a-select-option :value="bigCateItem.code" v-for="bigCateItem in bigCateList" :key="bigCateItem.code">{{ bigCateItem.name }}</a-select-option>
              </a-select>
              <a-select
                placeholder="请选择"
                v-model="addInfo.listSearchInfo[bigIndex].containEmptyType"
                style="width: 200px"
                @change="changeAffiliation(bigIndex, $event)"
              >
                <a-select-option :value="affiliationItem.code" v-for="affiliationItem in returnFilter(addInfo.listSearchInfo[bigIndex].lableStageType)" :key="affiliationItem.code">{{ affiliationItem.name }}</a-select-option>
              </a-select>
              <div style="min-width: 200px" v-if="((addInfo.listSearchInfo[bigIndex].containEmptyType !== 'empty') && (addInfo.listSearchInfo[bigIndex].containEmptyType !== 'noempty'))">
                <div class="selectTags" v-if="addInfo.listSearchInfo[bigIndex].lableStageType == '1'" @click="showBox(bigIndex)">
                  <span class="emptyBtn" v-if="!(addInfo.listSearchInfo[bigIndex].tagsList && (addInfo.listSearchInfo[bigIndex].tagsList.length))">选择标签</span>
                  <span class="label_input_title" v-for="(tagsItem, tagsIndex) in addInfo.listSearchInfo[bigIndex].tagsList" :key="tagsItem.id">
                    {{ tagsItem.name }}
                    <span
                      class="delete"
                      @click.stop="delTagHandle(bigIndex, tagsItem.id, tagsIndex)"
                    >+</span>
                  </span>
                </div>
                <a-select
                  v-else
                  placeholder="请选择"
                  v-model="addInfo.listSearchInfo[bigIndex].vals"
                  style="width: 200px"
                  @change="changeCustomer"
                >
                  <a-select-option :value="customerTypeItem.code" v-for="customerTypeItem in customerTypeList" :key="customerTypeItem.code">{{ customerTypeItem.name }}</a-select-option>
                </a-select>
              </div>

              <div
                class="handle"
                v-if="bigIndex === 0 && addInfo.listSearchInfo.length < 10"
                @click="addNewFilterList()"
              >+</div>
              <div class="handle" v-if="bigIndex !== 0" @click="delFilterList(bigIndex)">-</div>
            </div>
          </div>

        </div>
        <div class="line">
          <span class="label"></span>
          <span class="finallyNum">
            预计人数：{{ addInfo.predictNum }}
            <span class="reload" @click="reloadExpectNum()" v-permission="'/sopActivity/getPredictNum@post'">刷新</span>
          </span>
        </div>
        <div class="execution" v-if="pageTypeId === -1 && addInfo.invalidState !== 2" @click="sendSop()" v-permission="'/sopActivity/add@post'">开始执行</div>
        <div class="execution" v-if="pageTypeId !== -1 && addInfo.invalidState !== 2" @click="sendSop()" v-permission="'/sopActivity/update@post'">开始执行</div>
      </div>
      <div class="sendSOPInfoContainer">
        <TimeContent :timeList.sync="timeArray" :isSopEdit.sync="isSopEdit" :pageType="0" @changeTime="changeTimeMethod"/>
        <!-- v-if="sopList.length" -->
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
                dropdownClassName="addSop_Page_Container_selectSopItemDateBox"
                :allowClear="false"
                :showToday="false"
                v-model="chooseDate"
                :disabled="addInfo.listTaskInfo && addInfo.listTaskInfo[selectTimeIndex] && addInfo.listTaskInfo[selectTimeIndex].invalidState === 2"
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
          <SendContent
            :isLoadingStatus.sync="loadingStatus"
            :contentArray.sync="contentArray"
            :isSopEdit.sync="isSopEdit"
            :isDisableEdit="addInfo.listTaskInfo && addInfo.listTaskInfo[selectTimeIndex] && (addInfo.listTaskInfo[selectTimeIndex].invalidState === 2)"/>
        </div>
      </div>
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
import TimeContent from './timeContent.vue'
import SendContent from './sendContent.vue'
import { departmentEmp } from '@/api/common.js'
// getActivityPersonNum,
import { getTagList, getActivityPersonNum, getActivityDetail, getDictData, addActivitySop, editActivitySop } from '@/api/salers'
import Department from '@/components/department'
import LabelSelect from '../../..//clientFollow/components/LabelSelect.vue'
import { disabledBeforeDate } from '../sopUtils'
export default {
  name: 'ActivityAdd',
  components: {
    TimeContent,
    SendContent,
    Department,
    'label-select': LabelSelect,
    'MediumGroup': () => import('@/views/mediumGroup/index.vue')
  },
  data () {
    return {
      loadingStatus: false,
      selectTimeIndex: 0,
      disabledBeforeDate,
      childTagList: [], // 获取的标签数组
      isSopEdit: false, // 判断页面是否被编辑过
      filterCustomerArray: [], // 筛选执行客户数组
      pageTypeId: 0, // 从上页传入的id,新增为-1,修改为真实id
      chooseFilterIndex: '', // 筛选数组选择下标,用于绑定标签
      addInfo: {}, // 新增/修改数据对象
      timeArray: [], // 传入组件时间段数组
      currentTimeId: 0, // 当前选择的时间段id
      contentArray: [], // 传入组件内容数组
      chooseDate: '', // 时间选择器选择的时间
      logicalList: [], // 逻辑关系列表
      bigCateList: [], // 大类数据列表
      customerTypeList: [], // 客户类型数据列表
      affiliiationList: [], // 所属关系数据列表
      isControlerDisabled: false,
      treeData: [],
      // 客户阶段
      include2TargetSelectOptions: [],
      sopExpectNum: 0, // 预计人数
      // 执行客户标签弹窗
      chooseUserTagsModalShow: false,
      // 企业成员选择
      employeeIds: [],
      contactTypeList: [], // 执行客户类型数组
      selectTagList: [], // 标签列表
      sopList: [],
      selectUserType: 1 // 选择执行客户类型
      // filterUserObj: {
      //   mode: '1',
      //   list: [
      //     {
      //       type: '1',
      //       include: undefined,
      //       target: undefined
      //     }
      //   ]
      // }
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
      this.getActivityPersonData()
    },
    'addInfo.sopName' (e) {
      if (e && e.length > 18) {
        this.addInfo.sopName = e.slice(0, 18)
      }
    },
    timeArray () {
      console.log(this.timeArray, '监听timeArray改变')
      this.$set(this.addInfo, 'listTaskInfo', this.timeArray)
    },
    contentArray () {
      console.log(this.currentTimeId, 'this.currentTimeId')
      console.log(this.contentArray, '监听contentArray改变')
      console.log(this.addInfo.listTaskInfo, 'this.addInfo.listTaskInfo')
      this.selectTimeIndex = this.addInfo.listTaskInfo.findIndex(item => (item.tempId ? item.tempId === this.currentTimeId : item.id === this.currentTimeId))
      if (this.selectTimeIndex !== -1) {
        this.$set(this.addInfo.listTaskInfo[this.selectTimeIndex], 'sendContentList', this.contentArray)
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
    // 切换选择筛选客户类型/全部
    changeSelectContactType (e) {
      console.log(e, '切换筛选客户类型/全部类型')
      const target = e.target.value
      this.isSopEdit = true
      // 选择全部类型
      if (Number(target) === 2) {
        this.$set(this.addInfo, 'listSearchInfo', [])
      } else if (Number(target) === 1) {
        // 选择筛选类型
        this.setDefaultCustomerMethod()
      }
      // 自动获取群发活动预计人数
      this.getActivityPersonData()
    },
    // 筛选所属关系 affiliiationList
    returnFilter (type) {
      let tempArray = []
      if (Number(type) === 2) {
        // 为客户阶段,将包含所有移除
        tempArray = this.affiliiationList.filter(item => {
          if (item.code !== 'containall') {
            return item
          }
        })
      } else {
        tempArray = Object.assign([], this.affiliiationList)
      }
      return tempArray
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
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      this.addInfo.listSearchInfo.forEach((item, index) => {
        console.log(item, index, '循环的数据')
        if (item.lableStageType === '1') {
          // 当前标签类型为标签
          const tempTagIdList = item.vals.split(',').map(it => {
            it = Number(it)
            return it
          })
          const tempSelectList = this.childTagList.filter(single => {
            if (tempTagIdList.indexOf(single.id) !== -1) {
              return single
            }
          })
          // this.addInfo.listSearchInfo[index].tagsList = Object.assign([], tempSelectList)
          this.$set(this.addInfo.listSearchInfo[index], 'tagsList', tempSelectList)
        }
      })
      // console.log(this.addInfo.listSearchInfo)
      // debugger
      this.$set(this.addInfo, 'listSearchInfo', this.addInfo.listSearchInfo)
      console.log(this.addInfo, 'this.addInfo')
      this.loadingStatus = false
      // for(let singleSearch of this.addInfo.listSearchInfo) {
      //   if(singleSearch.lableStageType === '1') {
      //     for(let singleVal of singleSearch.vals.join(',')) {

      //     }
      //   }
      // }
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
      this.departmentEmp()
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
      this.getLogicalList()
    },
    // 获取字典中逻辑关系数据
    async getLogicalList () {
      this.loadingStatus = true
      const params = { dictType: 'auto_lable_number_relationship' }
      await getDictData(params).then(response => {
        this.loadingStatus = false
        console.log(response, '逻辑关系数据')
        this.logicalList = response.data
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      this.getBigCateList()
    },
    // 获取字典中大类数据
    async getBigCateList () {
      this.loadingStatus = true
      const params = { dictType: 'sop_label_type' }
      await getDictData(params).then(response => {
        this.loadingStatus = false
        console.log(response, '大类数据')
        this.bigCateList = response.data.filter(item => item.name === '标签')
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      this.getCustomerTypeList()
    },
    // 获取字典中客户类型数据
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
      this.getAffiliationList()
    },
    // 获取字典中所属关系数据
    async getAffiliationList () {
      this.loadingStatus = true
      const params = { dictType: 'sop_condition' }
      await getDictData(params).then(response => {
        this.loadingStatus = false
        console.log(response, '客户类型数据')
        this.affiliiationList = response.data
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      if (this.pageTypeId === -1) {
        console.log('新增操作')
        this.addInfo = { andOrType: 'and', predictNum: 0, selectContactType: this.contactTypeList[0].code, listTaskInfo: [] }
        this.setDefaultTime()
        this.loadingStatus = false
      } else {
        console.log('修改操作')
        this.getDetail(this.pageTypeId)
      }
      // this.setDefaultCustomerMethod()
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
      this.setDefaultCustomerMethod()
    },
    // 默认向筛选客户列表中设置一个值
    setDefaultCustomerMethod () {
      const tempArray = []
      const params = {
        andOrType: 'and',
        tempId: new Date().getTime(),
        lableStageType: this.bigCateList[0].code
      }
      tempArray.push(params)
      this.$set(this.addInfo, 'listSearchInfo', tempArray)
      // this.filterCustomerArray.push(params)
      this.$set(this.addInfo, 'andOrType', 'and')
    },
    // 获取详情
    async getDetail (id) {
      this.loadingStatus = true
      const params = { id }
      await getActivityDetail(params).then(response => {
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
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      this.getTagListData()
    },
    // 选择逻辑关系
    chooseLogical (val) {
      this.isSopEdit = true
      console.log(val, '逻辑关系val')
      this.$set(this.addInfo, 'andOrType', val.code)
      const tempArray = this.addInfo.listSearchInfo.map(item => {
        item.andOrType = val.code
        return item
      })
      this.$set(this.addInfo, 'listSearchInfo', tempArray)
      // 自动获取群发活动预计人数
      this.getActivityPersonData()
    },
    // 切换大类
    changeBigCate (item, bigIndex, val) {
      this.isSopEdit = true
      console.log(item, bigIndex, val, '切换大类')
      console.log(this.addInfo, '新的提交数据')
      const tempInfo = Object.assign({}, this.addInfo)
      this.$delete(tempInfo.listSearchInfo[bigIndex], 'vals')
      this.$delete(tempInfo.listSearchInfo[bigIndex], 'tagsList')
      this.$delete(tempInfo.listSearchInfo[bigIndex], 'containEmptyType')
      // tempInfo.listSearchInfo[bigIndex].vals = ''
      // tempInfo.listSearchInfo[bigIndex].tagsList = []
      this.addInfo = Object.assign({}, tempInfo)
      // 自动获取群发活动预计人数
      this.getActivityPersonData()
    },
    // 切换所属关系
    changeAffiliation (index, val) {
      this.isSopEdit = true
      console.log(index, '切换所属关系', val)
      if (val === 'empty' || val === 'noempty') {
        // 切换为 为空或不为空
        this.$delete(this.addInfo.listSearchInfo[index], 'vals')
        this.addInfo.listSearchInfo[index].tagsList = []
        // this.$set(this.addInfo.listSearchInfo, `${index}`, this.addInfo.listSearchInfo[index])
      }
      this.$set(this.addInfo, 'listSearchInfo', this.addInfo.listSearchInfo)
      // 自动获取群发活动预计人数
      this.getActivityPersonData()
    },
    // 切换客户类型
    changeCustomer (val) {
      this.isSopEdit = true
      console.log(val, '切换客户类型')
      // 自动获取群发活动预计人数
      this.getActivityPersonData()
    },
    // 增加客户筛选组
    addNewFilterList () {
      this.isSopEdit = true
      console.log('增加客户筛选数据')
      // 如果当前筛选数组中的长度小于10,可以新增
      if (this.addInfo.listSearchInfo.length < 10) {
        this.$set(this.addInfo, 'andOrType', this.addInfo.andOrType)
        const params = {
          tempId: new Date().getTime(),
          lableStageType: this.bigCateList[0].code,
          andOrType: this.addInfo.andOrType
        }
        this.addInfo.listSearchInfo.push(params)
        // 将每个listSearchInfo中的对象添加andOrType
        const tempArray = this.addInfo.listSearchInfo.map(item => {
          item.andOrType = this.addInfo.andOrType
          return item
        })
        this.$set(this.addInfo, 'listSearchInfo', tempArray)
        // console.log(this.addInfo.andOrType, '当前的逻辑类型', this.logicalList, '当前逻辑数组中的内容')
      }
      // 自动获取群发活动预计人数
      this.getActivityPersonData()
    },
    // 删除客户筛选组
    delFilterList (bigIndex) {
      this.isSopEdit = true
      console.log(bigIndex, '删除筛选数据')
      this.addInfo.listSearchInfo.splice(bigIndex, 1)
      this.$set(this.addInfo, 'listSearchInfo', this.addInfo.listSearchInfo)
      // 自动获取群发活动预计人数
      this.getActivityPersonData()
    },
    // 获取群发活动人员数据
    async getActivityPersonData (text) {
      if (!(this.addInfo.empIds && this.addInfo.empIds.length)) {
        if (text === 'reload') {
          this.$message.error('至少选择一名执行员工')
        }
        return
      }
      if (Number(this.addInfo.selectContactType) === 1) {
        // 为筛选时
        if (this.addInfo.listSearchInfo && this.addInfo.listSearchInfo.length != 0) {
          for (const singleSearchInfo of this.addInfo.listSearchInfo) {
            if (!singleSearchInfo.containEmptyType) {
              if (text === 'reload') {
                this.$message.error('每项筛选都要有包含类型！')
              }
              return
            } else {
              if (singleSearchInfo.containEmptyType !== 'empty' && singleSearchInfo.containEmptyType !== 'noempty') {
                // 不是 不为空/为空
                // console.log(singleSearchInfo, 'singleSearchInfo')
                if (!singleSearchInfo.vals) {
                  if (text === 'reload') {
                    this.$message.error('每项筛选都要有标签或客户阶段值！')
                  }
                  return
                }
              }
            }
          }
        } else {
          if (text === 'reload') {
            this.$message.error('请选择筛选')
          }
          return
        }
      }
      this.loadingStatus = true
      const params = {
        empIds: this.addInfo.empIds,
        selectContactType: this.addInfo.selectContactType,
        andOrType: this.addInfo.andOrType,
        listSearchInfo: this.addInfo.listSearchInfo
      }
      await getActivityPersonNum(params).then(response => {
        console.log(response, '获取群发活动人数')
        this.loadingStatus = false
        this.$set(this.addInfo, 'predictNum', response.countNum)
        if (text === 'edit' || text === 'add') {
          console.log('无需显示提示框')
        } else {
          this.$message.success('刷新成功')
        }
      }).catch(error => {
        console.log(error)
        this.loadingStatus = false
      })
      if (text === 'edit' || text === 'add') {
        if (parseInt(this.addInfo.predictNum) !== 0) {
          this.loadingStatus = true
          if (text === 'edit') {
            console.log('修改操作', this.addInfo)
            this.updataMethod(this.addInfo)
          } else if (text === 'add') {
            console.log('新增操作', this.addInfo)
            this.newDataMethod(this.addInfo)
          }
        } else {
          this.$message.error('至少要有一个预计发送人')
        }
      }
      // if (text === 'edit') {
      //   console.log('修改操作', this.addInfo)
      //   this.updataMethod(this.addInfo)
      // } else if (text === 'add') {
      //   console.log('新增操作', this.addInfo)
      //   // this.newDataMethod(this.addInfo)
      // }
    },
    // 将树id放入数组中
    setEmpIdArray (text) {
      const splitArray = text ? text.split(',') : []
      return splitArray
    },
    // 成员选择
    employeeIdsChange (e) {
      this.isSopEdit = true
      this.employeeIds = e
      console.log(e, '选择的成员id')
      this.$set(this.addInfo, 'empIds', this.employeeIds.join(','))
      // 自动获取群发活动预计人数
      // this.getActivityPersonData()
      // this.$set(this.addInfo, 'empIds', )
    },
    showBox (e) {
      console.log(e, '点击哪一行的数据')
      this.chooseUserTagsModalShow = !this.chooseUserTagsModalShow
      if (e !== -1) {
        let filterInputArr = []
        let filterIdArr = []
        this.chooseFilterIndex = e
        const tempArray = this.addInfo.listSearchInfo
        console.log(tempArray, 'tempArray')
        // debugger
        filterIdArr = tempArray.length !== 0 && tempArray[this.chooseFilterIndex].tagsList && tempArray[this.chooseFilterIndex].tagsList.length !== 0
          ? tempArray[this.chooseFilterIndex].tagsList.map(item => item.id) : []
        filterInputArr = tempArray.length !== 0 && tempArray[this.chooseFilterIndex].tagsList && tempArray[this.chooseFilterIndex].tagsList.length !== 0
          ? Object.assign([], tempArray[this.chooseFilterIndex].tagsList) : []
        this.$refs.labelSelect.idArr = filterIdArr
        this.$refs.labelSelect.inputArr = filterInputArr
      }
    },
    // 标签返回数据
    transmitLabel (e) {
      this.isSopEdit = true
      console.log(e, '选择的标签数据')
      this.addInfo.listSearchInfo[this.chooseFilterIndex].vals = e.map(item => item.id).join(',')
      this.addInfo.listSearchInfo[this.chooseFilterIndex].tagsList = Object.assign([], e)
      this.$set(this.addInfo, 'listSearchInfo', this.addInfo.listSearchInfo)
      // 自动获取群发活动预计人数
      this.getActivityPersonData()
    },
    // 切换时间节点回调
    changeTimeMethod (id) {
      console.log(id, '切换的时间节点下标')
      console.log(this.addInfo.listTaskInfo, 'this.addInfo.listTaskInfo')
      this.currentTimeId = id
      // debugger
      const tempInfo = this.addInfo.listTaskInfo.find(item => (item.tempId ? item.tempId === id : item.id === id))
      console.log(tempInfo, 'tempInfo切换时间回调')
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
    // 刷新获取群发活动人数
    reloadExpectNum () {
      this.getActivityPersonData('reload')
    },
    // 删除标签
    delTagHandle (bigIndex, id, index) {
      this.isSopEdit = true
      console.log(bigIndex, id, index, '删除标签')
      const tempArray = Object.assign([], this.addInfo.listSearchInfo)
      tempArray[bigIndex].tagsList.splice(index, 1)
      // console.log(this.addInfo.listSearchInfo[bigIndex].tagsList.length)
      if (tempArray[bigIndex].tagsList.length !== 0) {
        this.$set(tempArray[bigIndex], 'vals', tempArray[bigIndex].tagsList.map(item => item.id).join(','))
        this.$set(tempArray[bigIndex], 'tagsList', tempArray[bigIndex].tagsList)
      } else {
        this.$set(tempArray[bigIndex], 'vals', '')
        this.$set(tempArray[bigIndex], 'tagsList', [])
      }

      this.$set(this.addInfo, 'listSearchInfo', tempArray)
      // 自动获取群发活动预计人数
      this.getActivityPersonData()
      // console.log(this.addInfo, '删除后的addInfo')
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
      if (Number(this.addInfo.selectContactType) === 1) {
        // 为筛选时
        if (this.addInfo.listSearchInfo && this.addInfo.listSearchInfo.length != 0) {
          for (const singleSearchInfo of this.addInfo.listSearchInfo) {
            if (!singleSearchInfo.containEmptyType) {
              this.$message.error('每项筛选都要有包含类型！')
              return
            } else {
              if (singleSearchInfo.containEmptyType !== 'empty' && singleSearchInfo.containEmptyType !== 'noempty') {
                // 不是 不为空/为空
                if (!singleSearchInfo.vals) {
                  this.$message.error('每项筛选都要有标签或客户阶段值！')
                  return
                }
              }
            }
          }
        } else {
          this.$message.error('请选择筛选')
          return
        }
      }
      // if (this.addInfo.selectContactType === 1 && !this.selectTagList.length) {
      //   this.$message.error('至少选择一项用户包含标签')
      //   return
      // }
      // this.$set(this.addInfo, 'searchLableId', this.selectTagList.map(item => item.id).join(','))
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
      if (this.pageTypeId === -1) {
        // console.log('新增操作', this.addInfo)
        this.getActivityPersonData('add')
        // this.newDataMethod(this.addInfo)
      } else {
        // console.log('修改操作', this.addInfo)
        this.getActivityPersonData('edit')
      }
    },
    // 新增操作
    newDataMethod (info) {
      addActivitySop(info).then(response => {
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
      editActivitySop(info).then(response => {
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
