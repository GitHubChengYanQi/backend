<!-- 问卷 -->
<template>
  <div>
    <div class="questionnaire">
      <div class="l-list">
        <div class="titleContent">
          <a-row type="flex" class="flex-row-center">
            <a-col class="title flex-row-center" :span="6">
              <div class="chunk"></div>
              选择问卷
            </a-col>
            <a-col :span="18">
              <Space class="btns" v-if="isAdd">
                <a-button
                  type="primary"
                  v-permission="'questionnaire@created1'"
                  @click="
                    visible = true
                    currentIsEnterprise = 1
                  "
                >
                  添加企业问卷
                </a-button>
                <a-button
                  type="primary"
                  v-permission="'questionnaire@created2'"
                  @click="
                    visible = true
                    currentIsEnterprise = 0
                  "
                >
                  添加个人问卷
                </a-button>
              </Space>
            </a-col>
          </a-row>
        </div>
        <a-input-search placeholder="输入问卷名称" v-model="questionnaireName" @search="onSearch" @change="onSearch" />
        <a-spin :spinning="spinning">
          <div
            class="demo-infinite-container"
            style="margin-top: 0"
            v-infinite-scroll="getList"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10">
            <a-list :data-source="list">
              <a-list-item slot="renderItem" slot-scope="item, index" @click="listChange(item, index)">
                <div :class="{ item: true, active: index == activeIndex }">
                  <div
                    v-if="item.isEnterprise == 1"
                    class="tip flex-row-center"
                    :style="{ background: item.isEnterprise == 1 ? 'rgb(2, 167, 240)' : '' }"
                  >
                    {{ item.isEnterprise == 1 ? '企业' : '平台' }}
                  </div>
                  <div class="text">
                    {{ item.questionnaireName }}
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </div>
        </a-spin>
      </div>
      <div class="r-detail">
        <div class="titleContent">
          <!-- <a-row>
                    <a-col class="title flex-row-center" :span="6">
                        <div class="chunk"></div>
                        问卷详情
                    </a-col>
                </a-row> -->
          <a-row type="flex" class="flex-row-center">
            <a-col class="title flex-row-center" :span="4">
              <div class="chunk"></div>
              问卷详情
            </a-col>
            <a-col :span="18">
              <!-- && list[activeIndex].isEnterprise == 0-->
              <Space v-if="activeIndex != null && isAdd">
                <a-button type="danger" v-permission="'/diagnosisCareQuestionnaire/delete#post'" @click="deleteItem"> 删除 </a-button>
                <a-upload
                  name="file"
                  :showUploadList="false"
                  :headers="headers"
                  :action="`${baseUrl}/questionExcel/ImportQuestionnaire`"
                  @change="upChange"
                >
                  <a-button type="primary" v-permission="'/diagnosisCareQuestionnaire/updateByExcel#post'" :loading="upLoading"> 上传更新问卷 </a-button>
                </a-upload>
                <a-button type="primary" v-permission="'/questionExcel/downLoadQuestionnaire#post'" @click="downloadCurrent"> 下载问卷 </a-button>
              </Space>
            </a-col>
          </a-row>
        </div>
        <div class="r-detail-content">
          <QuestionnaireDetail :questionnaireArr="questionnaireArr1" />
          <Empty v-if="!questionnaireArr1.length" class="emptyCenter" description="请选择问卷或添加问卷" />
        </div>
      </div>
      <a-modal v-model="visible" title="新建问卷" :footer="null" :width="800">
        <a-form
          :form="form"
          labelAlign="left"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 21 }"
          @submit="handleSubmit"
        >
          <a-form-item label="问卷名称:">
            <a-input
              placeholder="请输入问卷名称"
              :maxLength="20"
              v-decorator="['questionnaireName', { rules: [{ required: true, message: '请输入问卷名称' }] }]"
            />
          </a-form-item>
          <a-form-item label="问卷内容：">
            <a-row class="flex-row-center">
              <a-col class="title flex-row-center" :span="16">
                <a-input
                  placeholder="请先下载表格模板，在模板里填写问题及答案后，再上传问卷"
                  disabled
                  style="border: 0; background: #fff"
                  v-decorator="['fileName', { rules: [{ required: true, message: '请上传问卷' }] }]"
                />
              </a-col>
              <a-col :span="8">
                <Space class="btns" size="large">
                  <a-upload
                    name="file"
                    :showUploadList="false"
                    :headers="headers"
                    :action="`${baseUrl}/questionExcel/ImportQuestionnaire`"
                    @change="handleChange"
                  >
                    <a-button type="primary" v-permission="'/questionExcel/ImportQuestionnaire#post'" :loading="btnLoading"> 上传问卷 </a-button>
                  </a-upload>
                  <a-button type="primary" v-permission="'/questionExcel/downloadTemplate#post'" @click="downloadTemplate"> 下载模板 </a-button>
                </Space>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="问卷预览:">
            <div class="wj-preview">
              <QuestionnaireDetail :questionnaireArr="questionnaireArr" />
              <span v-if="!uploadState">上传问卷后，可查看问卷内容</span>
            </div>
          </a-form-item>
          <a-form-item class="" :wrapper-col="{ span: 12, offset: 5 }">
            <a-row type="flex" class="flex-row-center">
              <Space size="large">
                <a-button @click="visible = false"> 取消 </a-button>
                <a-button type="primary" v-permission="'/diagnosisCareQuestionnaire/saveByExcel#post'" html-type="submit"> 确定 </a-button>
              </Space>
            </a-row>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <!-- 新建方案按钮 -->
    <div class="addBtns flex-row-center" v-if="!isAdd">
      <Space>
        <a-button @click="closeModal(false)"> 取消 </a-button>
        <a-button type="primary" @click="closeModal(true)"> 确定 </a-button>
      </Space>
    </div>
  </div>
</template>

<script>
import { Space, Empty } from 'ant-design-vue'
import QuestionnaireDetail from '../../components/questionnaireDetail/index.vue'
import {
  diagnosisCareQuestionnaireDetail,
  diagnosisCareQuestionnaireList,
  diagnosisCareQuestionnaireSaveByExcel,
  diagnosisCareQuestionnaireDlete,
  questionExcelDownloadTemplate,
  questionExcelDownLoadQuestionnaire,
  diagnosisCareQuestionnaireUpdateByExcel
} from '@/api/healthManage'
import storage from 'store'
import message from 'ant-design-vue/lib/message'
import infiniteScroll from '@/utils/directive'
export default {
  props: {
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  directives: { infiniteScroll },
  components: {
    Space,
    Empty,
    QuestionnaireDetail
  },
  data () {
    return {
      form: this.$form.createForm(this),
      list: [],
      visible: false,
      headers: {},
      activeIndex: null,
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      questionnaireArr: [],
      questionnaireArr1: [],
      uploadState: false,
      btnLoading: false,
      upLoading: false,
      currentIsEnterprise: 0,
      spinning: false,
      questionnaireName: '',
      busy: false,
      userListPagination: {
        page: 0,
        total: 0,
        totalPage: 0
      }
    }
  },
  watch: {
    visible (newData, oldData) {
      if (!newData) {
        this.form.resetFields()
        this.questionnaireArr = []
        this.uploadState = false
        this.btnLoading = false
      }
    }
  },
  created () {
    this.onSearch()
    this.headers = {
      Authorization: storage.get('ACCESS_TOKEN')
    }
  },
  mounted () {},
  beforeDestroy () {},
  methods: {
    onSearch () {
      this.busy = false
      this.list = []
      this.activeIndex = null
      this.questionnaireArr1 = []
      this.userListPagination = {
        page: 0,
        total: 0,
        totalPage: 0
      }
      this.getList()
    },
    // 问卷列表
    async getList () {
      if (this.spinning) return
      const { totalPage, page } = this.userListPagination
      this.userListPagination.page = page + 1
      if (totalPage && page >= totalPage) {
        this.busy = true
        return
      }
      const params = {
        page: this.userListPagination.page,
        size: 20
      }
      this.spinning = true
      try {
        const { code, data } = await diagnosisCareQuestionnaireList({ questionnaireName: this.questionnaireName }, params)
        if (code == 200) {
          console.log(data.records)
          const arr = this.list
          this.list = arr.concat(data.records)
          this.userListPagination.totalPage = Math.ceil(data.total / 20)
        }
        this.spinning = false
      } catch (error) {
        this.spinning = false
      }
    },
    // 问卷模板上传
    handleChange ({ file: { response, name, percent } }) {
      this.btnLoading = true
      if (percent === 100) {
        if (response) {
          this.btnLoading = false
          if (response.code == 200) {
            this.uploadState = false
            this.form.setFieldsValue({
              fileName: name
            })
            this.questionnaireArr = response.data
          } else {
            this.$message.error(response.msg)
          }
        }
      }
    },
    // 问卷更新
    async upChange ({ file: { response, name, percent } }) {
      this.upLoading = true
      if (percent === 100) {
        if (response) {
          this.upLoading = false
          if (response.code == 200) {
            this.upLoading = false

            const { code } = await diagnosisCareQuestionnaireUpdateByExcel({
              questionResults: response.data,
              questionnaireId: this.list[this.activeIndex].questionnaireId
            })
            if (code == 200) {
              this.$message.success('操作成功')
              this.listChange(this.list[this.activeIndex], this.activeIndex)
            } else {
              this.$message.error('操作失败')
            }
          } else {
            this.$message.error(response.msg)
          }
        }
      }
    },
    // 点击问卷查询详情
    async listChange (item, index) {
      this.activeIndex = index
      try {
        const {
          data: { questionResults }
        } = await diagnosisCareQuestionnaireDetail({ id: item.questionnaireId })
        this.questionnaireArr1 = questionResults
      } catch (error) {
        console.log(error)
      }
    },
    // 新建问卷
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, { questionnaireName }) => {
        if (!err) {
          const data = {
            questionnaireName,
            questionResults: this.questionnaireArr,
            isEnterprise: this.currentIsEnterprise
          }
          const { code } = await diagnosisCareQuestionnaireSaveByExcel(data)
          if (code === 200) {
            this.$message.success('添加成功')
            this.visible = false
            this.onSearch()
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },
    // 删除问卷
    deleteItem () {
      const _self = this
      this.$confirm({
        content: '确定要删除问卷吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          const { code } = await diagnosisCareQuestionnaireDlete({
            questionnaireId: _self.list[_self.activeIndex].questionnaireId
          })
          if (code === 200) {
            _self.$message.success('删除成功')
            _self.list.splice(_self.activeIndex, 1)
            // _self.onSearch()
          } else {
            _self.$message.error('删除失败')
          }
        }
      })
    },
    // 调用新建方案关闭弹窗
    closeModal (state) {
      let item = ''
      if (state && this.activeIndex != null) {
        item = this.list[this.activeIndex]
      }
      if (!item && state) {
        this.$message.error('请选择问卷')
        return
      }
      this.$emit('close', item, 1)
    },
    // 下载模板
    async downloadTemplate () {
      const res = await questionExcelDownloadTemplate()
      console.log(res, '导出')
      const blob = new Blob([res])// response.data为后端传的流文件
      const downloadFilename = '问卷模板.xlsx'// 设置导出的文件名  用moment时间插件对文件命名防止每次都是一样的文件名
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // 兼容ie浏览器
        window.navigator.msSaveOrOpenBlob(blob, downloadFilename)
      } else {
        // 谷歌,火狐等浏览器
        const url = window.URL.createObjectURL(blob)
        const downloadElement = document.createElement('a')
        downloadElement.style.display = 'none'
        downloadElement.href = url
        downloadElement.download = downloadFilename
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(url)
      }
      message.success('导出成功~')
    },
    // 下载当前问卷
    async downloadCurrent () {
      const res = await questionExcelDownLoadQuestionnaire({ questionnaireId: this.list[this.activeIndex].questionnaireId })
      console.log(res, '导出')
      const blob = new Blob([res])// response.data为后端传的流文件
      const downloadFilename = `${this.list[this.activeIndex].questionnaireName}.xlsx`// 设置导出的文件名  用moment时间插件对文件命名防止每次都是一样的文件名
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // 兼容ie浏览器
        window.navigator.msSaveOrOpenBlob(blob, downloadFilename)
      } else {
        // 谷歌,火狐等浏览器
        const url = window.URL.createObjectURL(blob)
        const downloadElement = document.createElement('a')
        downloadElement.style.display = 'none'
        downloadElement.href = url
        downloadElement.download = downloadFilename
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(url)
      }
      message.success('导出成功~')
    }

  }
}
</script>
<style lang="less" scoped>
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.addBtns {
  margin-top: 20px;
  width: 100%;
  justify-content: center;
}

.questionnaire {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  height:620px;
  .titleContent {
    margin: 20px 0;

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .btns {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  .l-list {
    width: 365px;

    .demo-infinite-container {
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      overflow: auto;
      height: 492px;
      padding: 0px !important;

      .item {
        width: 100%;
        max-width: 100%;
        position: relative;
        padding: 15px 15px 15px 30px;

        .tip {
          position: absolute;
          left: 0;
          top: 0;
          background: rgb(236, 128, 141);
          color: #fff;
          width: 17px;
          height: 100%;
          font-size: 12px;
          text-align: center;
        }
        .text{
          max-height: 81px;
          overflow: hidden;
          text-overflow: ellipsis;  /* 超出部分省略号 */
          word-break: break-all;  /* break-all(允许在单词内换行。) */
          display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
          -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
          -webkit-line-clamp: 2; /* 显示的行数 */
        }
      }

      .active {
        background-color: rgb(2, 167, 240);
        color: #fff;
      }
    }

    .demo-loading-container {
      position: absolute;
      bottom: 40px;
      width: 100%;
      text-align: center;
    }
  }

  .r-detail {
    width: calc(100% - 386px);
    &-content {
      width: 100%;
      height: 536px;
      overflow-y: auto;
      border: 1px solid #e8e8e8;
      border-radius: 5px;
      padding: 20px;

      .emptyCenter {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.wj-preview {
  padding: 0 15px;
  box-sizing: border-box;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  height: 460px;
  width: 100%;
  overflow-y: auto;
}
</style>
<style>
.ant-list-item {
  padding: 0;
}

.ant-list-split .ant-list-item:last-child {
  border-bottom: 1px solid #e8e8e8;
}
</style>
