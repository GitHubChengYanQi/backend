/* eslint-disable */
<template>
  <div class="questionnaireDetail">
    <div class="questionnaireName" v-if="questionnaireName">{{ questionnaireName }}</div>
    <a-form :form="form" formLayout="vertical" v-if="questionnaireArr.length">
      <template>
        <div
          v-for="(item, index) in questionnaireArr"
          :key="index">
          <div class="title-content">
            <div class="l">
              <div class="tip">{{ index+1 }}</div>
              {{ item.questionContent }}
            </div>
            <div class="r">
              {{ item.questionType }}
            </div>
          </div>
          <a-form-item style="padding-left:50px">
            <!-- 文本 -->
            <a-input v-model="item.answers[0].inputVal" v-if="item.questionType === '文本'" :disabled="!isSubmit" />
            <!-- 单选 -->
            <a-radio-group v-model="item.radioVal" v-if="item.questionType === '单选'" :disabled="!isSubmit">
              <a-radio :value="radioItem.answerId" v-for="radioItem in item.answers" :key="radioItem.answerId">
                {{ radioItem.answerContent }}
              </a-radio>
            </a-radio-group>
            <!-- 日期 -->
            <a-date-picker v-model="item.answers[0].dateVal" v-if="item.questionType === '日期'" :disabled="!isSubmit"/>
            <!-- 上传图片 -->
            <div @click="getIndex(index)">
              <a-upload
                :disabled="!isSubmit"
                v-if="item.questionType === '上传图片'"
                accept="image/*"
                list-type="picture-card"
                :file-list="item.answers[0].imgVal"
                :customRequest="upLoadImg"
                @preview="handlePreview"
                :remove="removeImg"
              >
                <div>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </div>
            <!-- 同时录入 -->
            <template v-if="item.questionType === '同时录入数值'">
              <template >
                <!-- eslint-disable-next-line-->
                <div class="input-view" v-for="(obj, index) in item.answers" :key="`${index}--`">
                  <div class="title">{{ obj.answerContent }}：</div>
                  <a-input v-model="obj.inputVal" style="width: 50%" :disabled="!isSubmit"/>
                </div>
              </template>
            </template>
            <!-- 数字 -->
            <a-input-number
              :disabled="!isSubmit"
              id="inputNumber"
              v-model="item.answers[0].numVal"
              style="width: 54%"
              v-if="item.questionType === '数字'"
            />
            <!-- 多选 -->
            <!-- eslint-disable-next-line-->
            <a-checkbox-group v-model="item.checkboxVal" v-if="item.questionType === '多选'" :disabled="!isSubmit">
              <!-- eslint-disable-next-line-->
              <a-checkbox :value="obj.answerId" v-for="(obj, index) in item.answers" :key="`${index}-`">{{
                obj.answerContent
              }}</a-checkbox>
            </a-checkbox-group>
            <!-- 提醒  -->
            <!--            <div class="tixing" v-if="item.questionType === '提醒'">-->
            <!--              {{ `${index + 1}、${item.questionContent}` }}-->
            <!--            </div>-->
            <a-divider style="margin:24px 0 0px 0"></a-divider>
          </a-form-item>
        </div>
      </template>
      <a-form-item v-if="isSubmit" :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" :disabled="btnState" @click="sub">提交</a-button>
      </a-form-item>
    </a-form>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import { commonUpload, diagnosisCareResultAdd } from '@/api/healthManage'
export default {
  // eslint-disable-next-line
  props: ['questionnaireArr', 'questionnaireName', 'isSubmit', 'currentObj', 'detailObj'],
  name: 'QuestionnaireDetail',
  data () {
    return {
      form: this.$form.createForm(this),
      imageUrl: '',
      dataList: [],
      currentIndex: '',
      previewVisible: false,
      previewImage: ''
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    btnState () {
      // eslint-disable-next-line no-unused-vars
      let current = true
      this.questionnaireArr.forEach(item => {
        if (item.questionType === '文本' && item.answers[0].inputVal) {
          current = false
          return
        }
        if (item.questionType === '单选' && item.radioVal) {
          current = false
          return
        }
        if (item.questionType === '日期' && item.answers[0].dateVal) {
          current = false
          return
        }
        if (item.questionType === '上传图片' && item.answers[0].imgVal.length) {
          current = false
          return
        }
        if (item.questionType === '同时录入数值') {
          item.answers.forEach(obj => {
            if (obj.inputVal) {
              current = false
            }
          })
          if (!current) return
        }
        if (item.questionType === '数字' && item.answers[0].numVal !== '') {
          current = false
        }
        if (item.questionType === '多选' && item.checkboxVal.length) {
          current = false
        }
      })
      return current
    }
  },
  methods: {
    propsList (e) {
      this.dataList = e
    },
    handleChange () {},
    getIndex (index) {
      console.log(index, 'index')
      this.currentIndex = index
    },
    upLoadImg (file) {
      console.log(file)
      const formData = new FormData() // 构造一个 FormData，把后台需要发送的参数添加
      formData.append('file', file.file)
      commonUpload(formData).then(({ code, data }) => {
        this.questionnaireArr[this.currentIndex]['answers'][0].imgVal.push({
          uid: this.questionnaireArr[this.currentIndex]['answers'][0].imgVal.length,
          url: data.fullPath,
          status: 'done',
          name: data.name,
          Path: data.path
        })
      })
    },
    async sub () {
      // console.log({
      //   contactId: this.currentObj.contactData.id,
      //   questionnaireId: this.detailObj.questionnaireId,
      //   taskId: this.currentObj.taskId,
      //   planId: this.currentObj.planId,
      //   taskDetailId: this.currentObj.taskDetailId,
      //   questionParams: this.questionnaireArr
      // })
      const data = await diagnosisCareResultAdd({
        contactId: this.currentObj.contactData.id,
        questionnaireId: this.detailObj.questionnaireId,
        taskId: this.currentObj.taskId,
        planId: this.currentObj.planId,
        taskDetailId: this.currentObj.taskDetailId,
        questionParams: this.questionnaireArr
      })
      if (data.code == 200) {
        this.$message.success('操作成功')
        this.$emit('updateList')
      } else {
        this.$message.success('操作失败')
      }
      this.$emit('close')
      // console.log(this.questionnaireArr, 'questionnaireArr') diagnosisCar5eResultAdd
    },
    handlePreview (file) {
      this.previewImage = file.url
      this.previewVisible = true
    },
    removeImg (file) {
      let cIndex
      setTimeout(() => {
        console.log(file)
        this.questionnaireArr[this.currentIndex]['answers'][0].imgVal.forEach((item, index) => {
          if (item.Path === file.Path) {
            cIndex = index
          }
        })
      }, 300)
      this.questionnaireArr[this.currentIndex]['answers'][0].imgVal.splice(cIndex, 1)
    }
  }
}
</script>
<style lang="less">
.questionnaireDetail {
  width: 100%;
  .questionnaireName {
    with: 100%;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
    background-color: #f8f8f8;
  }
  .tixing{
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
  }
  .input-view {
    display: flex;
    flex-direction: row;
    align-content: center;
    .title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .title-content{
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .l{
      display: flex;
      flex-direction: row;
      align-items: center;
      line-height: 1;
      font-size: 16px;
      color: #333;
      .tip{
        width: 25px;
        height: 25px;
        text-align: center;
        line-height: 25px;
        background-color: #02a7f0;
        border-radius: 50%;
        color: #fff;
        margin-right: 20px;
      }
    }
    .r{
      line-height: 25px;
      font-size: 16px;
      color: #333;
    }
  }
}
</style>
