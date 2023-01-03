<template>
  <div id="healthRecord-Component-Container">
    <div class="tabRadioBox">
      <a-radio-group v-model="selectTag">
        <a-radio-button v-for="(item, index) in tags" :key="index" :value="item.key">{{ item.name }}</a-radio-button>
      </a-radio-group>
      <!-- 组件时仅展示 -->
      <div v-if="!isComponent">
        <div
          class="edit"
          v-if="['xyjl', 'xtjl', 'xzjl', 'nsjl'].includes(selectTag)"
          @click="handleBtnClick('edit')"
        >新增</div>
        <div v-else>
          <span class="edit" v-if="!isEdit && tagsDetailArr.length" @click="isEdit = true">编辑</span>
          <a-button :loading="saveLoading" class="edit" v-if="isEdit" @click="saveData">保存</a-button>
        </div>
      </div>
    </div>
    <div class="recordsListBox">
      <!-- 血糖等特殊表格 -->
      <div
        class="specialListDetail"
        ref="specialListRef"
        v-if="['xyjl', 'xtjl', 'xzjl', 'nsjl'].includes(selectTag)"
      >
        <a-table
          :dataSource="tagsDetailArr"
          :columns="tableCloumns"
          :pagination="pagination"
          @change="handleTableChange"
        ></a-table>
      </div>
      <!-- 默认列表 -->
      <div class="defaultListBox" v-else>
        <div class="recordList" v-for="(list, index) in tagsDetailArr" :key="list.key">
          <div class="titleBox" v-if="['input', 'bm', 'date'].includes(list.type)">
            <div class="title">{{ list.name }}</div>
            <div v-if="isEdit">
              <a-input
                class="inputItem"
                v-if="list.type === 'input'"
                v-model="list.dataName"
                @blur="({target: {value}}) => itemChangeSet({data: value, dataName: value}, index, 0)"
              />
              <span class="content" v-else-if="list.type === 'bm'">{{ list.dataName || '自动计算' }}</span>
              <a-date-picker
                :showToday="false"
                v-else-if="list.type === 'date'"
                v-model="list.dataName"
                :disabled-date="e => disabledBeforeDate(e)"
                valueFormat="YYYY-MM-DD HH:mm"
                format="YYYY-MM-DD HH:mm"
                show-time
                @change="e => itemChangeSet({data: e, dataName: e}, index, 0)"
              />
            </div>
            <div v-else>
              <span class="content" v-if="list.type !== 'bm'">{{ list.dataName || '-' }}</span>
              <span class="content" v-else>{{ list.dataName || '自动计算' }}</span>
            </div>
          </div>
          <div class="title" v-else>{{ list.name }}</div>
          <div class="recordListDetail" v-if="['web'].includes(list.type)">
            <div class="recordItemBox" v-for="(item, idx) in list.webInfo" :key="idx">
              <span class="label">{{ item.name }}</span>
              <div v-if="isEdit">
                <!-- 多按钮选择 -->
                <div class="contentBox" v-if="item.type === 'tab'">
                  <div
                    v-for="(it, i) in item.secData.records"
                    :class="(item.secData.type === 'radio' && it.key === item.data || item.secData.type === 'checkbox' && item.data.split(',').includes(it.key)) ? 'selectItem active' : 'selectItem'"
                    @click="itemChangeSet({data: it.key, dataName: it.name}, index, idx)"
                    :key="i"
                  >{{ it.name }}</div>
                </div>
                <!-- 自定义 -->
                <div class="customBox" v-else-if="item.type === 'text'">
                  <a-textarea
                    v-model="item.dataName"
                    :maxlength="200"
                    :auto-size="{ minRows: 3, maxRows: 8 }"
                    @blur="({target: {value}}) => itemChangeSet({data: value, dataName: value}, index, idx)"
                  />
                </div>
              </div>
              <span class="content" v-else>{{ item.dataName || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-modal
      v-model="modalObj.visible"
      :title="`${modalObj.id ? '修改' : '新增'}${typeMap[modalObj.modalType]}记录`"
      id="healthRecord-Component-editSpecialModal-Container"
      :confirm-loading="saveLoading"
      @ok="editSpecialModalOK"
      @cancel="editSpecialModalCancel"
    >
      <div v-if="modalObj.list">
        <div class="lineItem" v-for="(item, index) in modalObj.list" :key="index">
          <span class="label">{{ item.name }}:</span>
          <a-select
            v-if="['module', 'range', 'tab'].includes(item.type)"
            class="rigInpBox"
            ref="select"
            v-model="item.dataName"
            :placeholder="`请选择${item.name}值`"
            @focus="selectInpFocus(index, item.key)"
            @change="(value) => confirmSelectItem(value, index, item.type)"
          >
            <a-select-option
              v-for="(it, idx) in item.records || []"
              :key="idx"
              :value="it.name"
            >{{ it.name }}</a-select-option>
          </a-select>
          <a-date-picker
            v-else-if="item.type === 'date'"
            class="rigInpBox"
            :showToday="false"
            v-model="item.dataName"
            :disabled-date="e => disabledBeforeDate(e)"
            valueFormat="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            show-time
            @change="e => confirmSelectItem(e, index, item.type)"
          />
          <a-input
            v-else-if="item.type === 'input'"
            class="rigInpBox"
            v-model="item.dataName"
            @blur="({target: {value}}) => confirmSelectItem(value, index, item.type)"
          />
          <div class="rigInpBox" v-else-if="item.type === 'rangeDouble'">
            <a-select
              style="width: 45%"
              v-model="item.dataName[0]"
              :options="(item.records || []).map(it => ({ value: it.name, label: it.name }))"
              @focus="selectInpFocus(index, item.key)"
            ></a-select>
            <span class="dot">.</span>
            <a-select
              v-if = "modalObj.modalType === 'xzjl'"
              style="width: 45%"
              v-model="item.dataName[1]"
              :options="Array(100).fill(null).map((it, index) => ({ value: index < 10 ? '0' + index : index, label: index < 10 ? '0' + index : index }))"
            ></a-select>
            <a-select
              v-else
              style="width: 45%"
              v-model="item.dataName[1]"
              :options="Array(10).fill(null).map((it, index) => ({ value: index, label: index }))"
            ></a-select>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
/**
 * @param {Boolean} isComponent 是否为组件
 * @param {String} contactId 联系人ID 为组件必传
 * example:  <HealthRecord :is-component="true" contact-id="49" v-if="showBol" />
 */
import { delSpecialItemReq, getSpecialItemDetailReq, getSpecialItemReq, getTabDetailReq, getTabsArrReq, saveSpecialItemReq, saveUserInfoReq } from '@/api/workContact'
import { deepClonev2 } from '@/utils/util'
import { Modal } from 'ant-design-vue'
import moment from 'moment'

const tabDetails = new Map()
const selectsBox = new Map()

const defaultPageObj = {
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '30', '50']
}

const getSource = (t) => {
  if (t === '1') {
    return '企业微信'
  } else if (t === '2') {
    return '用户上传'
  } else if (t === '3') {
    return '设备'
  } else if (t === '4') {
    return '管理后台'
  } else return t
}

const typeMap = {
  'xyjl': '血压',
  'xtjl': '血糖',
  'xzjl': '血脂',
  'nsjl': '尿酸'
}

// const defaultItemObj = {
//   data: '',
//   dataName: '',
//   id: '',
//   isPull: '',
//   key: '',
//   name: '',
//   secData: {
//     records: [],
//     type: ''
//   },
//   type: ''
// }
export default {
  name: '',
  components: {},
  props: {
    isComponent: {
      type: Boolean,
      default: false
    },
    contactId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      typeMap,
      saveLoading: false,
      isEdit: false,
      selectTag: '',
      tags: [],
      tagsDetailArr: [],
      tableCloumns: [],
      modalObj: {
        visible: false,
        modalType: 'xyjl',
        id: ''
      },
      pagination: { ...defaultPageObj }
    }
  },
  computed: {},
  watch: {
    selectTag (key) {
      this.tagsDetailArr = []
      this.pagination = { ...defaultPageObj }
      this.getTabDetails(key)
    },
    'modalObj.visible' (bol) {
      if (bol) {
        this.modalObj.list.forEach(async (item, index) => {
          if (['module', 'range', 'tab', 'rangeDouble'].includes(item.type) && !selectsBox.get(item.key)) {
            const { data } = await getSpecialItemDetailReq({ key: item.key })
            selectsBox.set(item.key, data.records)
          }
        })
      }
    }
  },
  beforeCreate () { },
  created () {
    this.getTabs()
    tabDetails.clear()
  },
  beforeMount () { },
  mounted () { },
  methods: {
    // /**
    //  * 生成选项
    //  */
    // makeOption () {
    //   console.log(11111)
    //   Array(100).fill(null).map((it, index) => ({ value: index, label: index }))
    // },
    async getTabs () {
      const { data } = await getTabsArrReq({})
      this.tags = data.records
      this.selectTag = data.records[0].key
    },
    async getTabDetails (key) {
      if (tabDetails.has(key)) {
        this.tagsDetailArr = tabDetails.get(key)
      } else {
        let obj = {
          contactId: this.isComponent ? this.contactId : this.$route.query.id,
          key
        }
        if (['xyjl', 'xtjl', 'xzjl', 'nsjl'].includes(this.selectTag)) {
          obj = {
            ...obj,
            page: this.pagination.current,
            perPage: this.pagination.pageSize
          }
        }
        const data = await getTabDetailReq(obj)

        if (['xyjl', 'xtjl', 'xzjl', 'nsjl'].includes(this.selectTag)) {
          const d = data.data.list
          const dataSource = []
          for (const item of d) {
            dataSource.push({
              ...item,
              id: item.recordId,
              key: item.recordId,
              scope: item.scope,
              scopeName: item.scopeName,
              scopeKey: item.scopeKey,
              sourceTxt: getSource(item.source)
            })
          }
          const cloumns = []

          cloumns.push({
            title: '类别',
            dataIndex: 'scopeName',
            align: 'center',
            customRender: (txt, { scopeKey }) => (
              <span class={`sourceTxt-${this.selectTag}-${scopeKey}`}>{txt}</span>
            )
          })
          for (let i = 0; i < dataSource.length; i++) {
            const arrs = dataSource[i].dataList
            for (const item of arrs) {
              dataSource[i][item.key] = item.dataName
            }
          }
          if (d[0]) {
            for (const item of d[0].dataList) {
              cloumns.push({
                title: item.name,
                dataIndex: item.key,
                key: item.key,
                customRender: (txt, { scopeKey }) => (
                  <span class={`sourceTxt-${item.scopeKey}`}>{txt}</span>
                )
              })
            }
          }
          cloumns.push({
            title: '数据来源',
            dataIndex: 'sourceTxt',
            align: 'center'
          })
          if (!this.isComponent) {
            if (d[0].source === '2' || d[0].source === '3') {
              console.log('公众号信息不让编辑')
              cloumns.push({
                title: '操作',
                dataIndex: 'id',
                align: 'center',
                customRender: () => (
                  <div class="handlesBox">
                    {/* <span class="btn" onClick={() => this.handleBtnClick('edit', id)}>编辑</span>
                    <span class="btn del" onClick={() => this.handleBtnClick('delete', id)}>删除</span> */}
                  </div>
                )
              })
            } else {
              cloumns.push({
                title: '操作',
                dataIndex: 'id',
                align: 'center',
                customRender: (id) => (
                  <div class="handlesBox">
                    <span class="btn" onClick={() => this.handleBtnClick('edit', id)}>编辑</span>
                    <span class="btn del" onClick={() => this.handleBtnClick('delete', id)}>删除</span>
                  </div>
                )
              })
            }
          }
          this.pagination.total = data.data.totalNum
          if (data.data.totalNum === 0) {
            this.tagsDetailArr = []
          } else {
            this.tagsDetailArr = dataSource
          }
          this.tableCloumns = cloumns
        } else {
          // 一级数据中 空值为空数组，需要提前设置默认值
          // for (const i in data.data) {
          //   const item = data.data[i]
          //   if (['input', 'bm', 'date'].includes(item.type) && !item.webInfo.length) {
          //     console.log(data.data[i], 'data.data[i]')
          //     data.data[i].webInfo.push({ ...defaultItemObj })
          //   }
          // }
          tabDetails.set(key, data.data)
          this.tagsDetailArr = data.data
        }
      }
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTabDetails(this.selectTag)
    },
    itemChangeSet ({ data, dataName }, index, idx) {
      const nowD = deepClonev2(this.tagsDetailArr)
      const targetItem = nowD[index].webInfo[idx]
      if (['input', 'bm', 'date'].includes(nowD[index].type) || (nowD[index].type === 'web' && (targetItem.secData.type === 'radio' || targetItem.type === 'text'))) {
        if (['input', 'bm', 'date'].includes(nowD[index].type)) {
          nowD[index].data = data
          nowD[index].dataName = dataName
        } else {
          nowD[index].webInfo[idx].data = data
          nowD[index].webInfo[idx].dataName = dataName
        }
        if (this.selectTag === 'jcxx' && ['sgcm', 'tzkg'].includes(nowD[index].key)) {
          // 计算bm
          const nowKey = nowD[index].key
          let cm = nowKey === 'sgcm' ? +dataName : null
          let kg = nowKey === 'tzkg' ? +dataName : null
          const findVal = nowD.find(
            (item) => item.key === (cm ? 'tzkg' : 'sgcm')
          ).dataName

          let bmi = ''
          if (findVal && dataName) {
            if (cm || cm === 0) {
              kg = +findVal
            } else {
              cm = +findVal
            }
            const m = cm / 100 // cm -> m
            bmi = kg / Math.pow(m, 2)
            bmi = Math.round(bmi * 10) / 10
          }
          if (isNaN(bmi)) {
            bmi = '自动计算'
          }
          const findBMIIdx = nowD.findIndex(it => it.key === 'bmikmm')
          nowD[findBMIIdx].data = bmi
          nowD[findBMIIdx].dataName = bmi
        }
      } else if (targetItem.secData.type === 'checkbox') {
        const dataArr = targetItem.data ? targetItem.data.split(',') : []
        const findDataIdx = dataArr.indexOf(data)
        const dataNameArr = targetItem.dataName ? targetItem.dataName.split(',') : []
        const findDataNameIdx = dataNameArr.indexOf(dataName)
        if (findDataIdx !== -1 && findDataNameIdx !== -1) {
          dataArr.splice(findDataIdx, 1)
          dataNameArr.splice(findDataNameIdx, 1)
        } else {
          dataArr.push(data)
          dataNameArr.push(dataName)
        }
        nowD[index].webInfo[idx].data = dataArr.join()
        nowD[index].webInfo[idx].dataName = dataNameArr.join()
      }
      tabDetails.set(this.selectTag, nowD)
      this.tagsDetailArr = nowD
    },
    disabledBeforeDate (e) {
      const date = new Date()
      const dayTime = 1000 * 60 * 60 * 24
      return e.valueOf() > (new Date(date.toLocaleDateString()).getTime() + dayTime)
    },
    // 按钮操作
    async handleBtnClick (type, id) {
      const that = this
      if (type === 'delete') {
        Modal.confirm({
          title: '确定要删除吗？',
          okType: 'danger',
          async onOk () {
            await delSpecialItemReq({
              recordId: id,
              contactId: that.$route.query.id,
              source: 4
            })
            that.$message.success(`删除成功！`)
            that.getTabDetails(that.selectTag)
          }
        })
      } else {
        const itemId = id || ''
        const { data } = await getSpecialItemReq({ recordId: itemId, key: this.selectTag })
        const processData = data.map((item) => {
          let val = item.dataName
          if (item.type === 'rangeDouble') {
            val = item.dataName ? item.dataName.split('.') : ['', '']
          } else if (item.type === 'date') {
            val = moment().format('YYYY-MM-DD HH:mm')
          }
          return {
            ...item,
            data: val,
            dataName: val
          }
        })
        this.modalObj = {
          visible: true,
          modalType: this.selectTag,
          id: itemId,
          list: processData
        }
      }
    },
    async selectInpFocus (index, key) {
      if (this.modalObj.list[index].records) return
      const nowList = deepClonev2(this.modalObj.list)
      nowList[index].records = selectsBox.get(key)
      this.modalObj.list = nowList
    },
    confirmSelectItem (value, index, type) {
      const nowList = deepClonev2(this.modalObj.list)
      if (['input', 'range', 'date'].includes(type)) {
        nowList[index].data = value
      } else if (['module', 'tab'].includes(type)) {
        nowList[index].data = nowList[index].records.find(it => it.name === value).key
      } else if (type === 'rangeDouble') {
        // nowList[index].data[rangeIdx] = value
      }
      this.modalObj.list = nowList
    },
    async editSpecialModalOK () {
      this.saveLoading = true
      const processList = this.modalObj.list.map(({ key, name, data, dataName, type }) => ({
        key,
        name,
        data: type === 'rangeDouble' ? dataName.join('.') : data,
        dataName: type === 'rangeDouble' ? dataName.join('.') : dataName
      }))
      let flag = false
      let name = ''
      for (let i = 0; i < processList.length; i++) {
        if (processList[i].data === '') {
          flag = true
          name = processList[i].name
        }
      }
      if (flag) {
        this.$message.error('请填写' + name)
        this.saveLoading = false
      } else {
        await saveSpecialItemReq({
          recordId: this.modalObj.id,
          contactId: this.$route.query.id,
          source: 4,
          key: this.selectTag,
          dataList: processList
        })
        this.$message.success(`${this.modalObj.id ? '修改' : '添加'}成功！`)
        this.getTabDetails(this.selectTag)
        this.saveLoading = false
        this.editSpecialModalCancel()
      }
    },
    editSpecialModalCancel () {
      this.modalObj = {
        visible: false,
        modalType: 'xyjl',
        id: ''
      }
    },
    async saveData () {
      this.saveLoading = true
      const processTagsData = this.tagsDetailArr.map(list => ({
        key: list.key,
        name: list.name,
        data: list.data,
        dataName: list.dataName,
        dataList: list.webInfo.map(item => ({
          key: item.key,
          name: item.name,
          data: item.data,
          dataName: item.dataName
        }))
      }))
      const data = {
        contactId: this.$route.query.id,
        source: 4,
        key: this.selectTag,
        secList: processTagsData
      }
      await saveUserInfoReq(data)
      this.$message.success('保存成功！')
      this.isEdit = false
      this.saveLoading = false
    }
  },
  beforeUpdate () { },
  updated () { },
  beforeUnmount () { },
  unmounted () { }
}
</script>
<style lang='less'>
#healthRecord-Component-editSpecialModal-Container {
  .lineItem {
    margin: 20px 0;
    display: flex;
    align-items: center;
    .label {
      width: 100px;
    }
    .rigInpBox {
      flex: 1;
      .dot {
        padding: 0 4%;
        font-size: 20px;
      }
    }
  }
}
</style>
<style lang='less' scoped>
.tabRadioBox {
  width: 100%;
  display: flex;
  align-items: center;
  .edit {
    margin-left: 100px;
    padding: 1px 10px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    cursor: pointer;
    height: fit-content;
    display: inline-block;
  }
  .edit:hover {
    color: rgba(0, 0, 0, 0.65);
  }
}
.recordsListBox {
  width: 100%;
  height: auto;
  .defaultListBox {
    width: 100%;
    padding: 20px;
    height: auto;
    .recordList {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: auto;
      padding: 20px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      .titleBox {
        display: flex;
        align-items: center;
        .content {
        }
        .inputItem {
          width: 300px;
        }
        .title {
          margin-bottom: 0;
        }
      }
      .title {
        width: 180px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 13px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      .recordListDetail {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .recordItemBox {
          width: 100%;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          .label {
            width: 180px;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.85);
          }
          .contentBox {
            display: flex;
            align-items: center;
            .selectItem {
              padding: 1px 10px;
              border: 1px solid rgba(0, 0, 0, 0.5);
              border-radius: 5px;
              cursor: pointer;
              margin-left: 10px;
            }
            .selectItem:first-child {
              margin-left: 0;
            }
            .active {
              background: #518fe4;
              border-color: #518fe4;
              color: #fff;
            }
          }
          .customBox {
            .ant-input {
              width: 600px;
            }
          }
        }
        .recordItemBox:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .specialListDetail {
    .sourceTxt-1{
      color: #ff0000;
    }
    .sourceTxt-xyjl-0 {
      color: #009966;
    }
    .sourceTxt-xyjl-1 {
      color: #ccd771;
    }
    .sourceTxt-xyjl-2 {
      color: #efc25d;
    }
    .sourceTxt-xyjl-3 {
      color: #e98850;
    }
    .sourceTxt-xyjl-4 {
      color: #df5660;
    }
    .sourceTxt-xtjl-0 {
      color: #009966;
    }
    .sourceTxt-xtjl-1 {
      color: #0099ff;
    }
    .sourceTxt-xtjl-2 {
      color: #ff0000;
    }
    .sourceTxt-xtjl-3 {
      color: #efc25d;
    }
    .sourceTxt-nsjl-0 {
      color: #009966;
    }
    .sourceTxt-nsjl-1 {
      color: #e98850;
    }
    .sourceTxt-nsjl-2 {
      color: #ff0000;
    }
    .sourceTxt-xzjl-0 {
      color: #009966;
    }
    .sourceTxt-xzjl-1 {
      color: #ff0000;
    }
    .handlesBox {
      display: flex;
      justify-content: space-around;
      .btn {
        cursor: pointer;
        color: #02a7f0;
      }
      .del {
        color: #d9001b;
      }
    }
  }
}
</style>
