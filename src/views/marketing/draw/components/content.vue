<template>
  <div>
    <a-form-model
      ref="contentForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-button type="primary" class="add" @click="addItem">添加新一集</a-button>

      <!-- item -->
      <a-collapse v-model="activeKey" v-for="(item, index) in form.confList" :key="'item'+index">
        <a-collapse-panel :key="'item'+index" :header="`第${toChinesNum(index + 1)}集`">
          <a slot="extra" @click.stop="delItem(index)">删除</a>
          <div class="item">
            <div class="box">

              <!-- head -->
              <div class="head">
                <a-form-model-item label="上传视频" :prop="`confList.${index}.localtion`" :rules="rules.localtion">
                  <div>
                    <a-input v-model="item.localtion" v-show="false" />
                    <UploadVideo :imgUrl="item.localtionFullPath" @changeImg="(e)=>{getImg(e, item)}" :fileType="3" />
                    <span>支持的视频文件格式：mp4，建议的视频大小：20-50M，不超过200M</span>
                  </div>
                </a-form-model-item>
                <a-form-model-item label="视频名称" :prop="`confList.${index}.name`" :rules="rules.name">
                  <a-input v-model="item.name" :maxLength="15" :suffix="item.name?`${item.name.length}/15`:'0/15'" />
                  最多可输入15个字
                </a-form-model-item>
              </div>
              <!-- end head -->

              <!-- topic -->
              <div class="topic">
                <a-button type="primary" class="add" @click="addTopic(item.questionList)">添加问题</a-button>
                <a-collapse v-model="topicActiveKey" v-for="(items, indexs) in item.questionList" :key="'questionList'+indexs">
                  <a-collapse-panel :header="`第${toChinesNum(indexs + 1)}题`" :key="'questionList'+ index +indexs">
                    <a slot="extra" @click.stop="delTopic(item.questionList, indexs)">删除</a>
                    <div>
                      <a-form-model-item label="题目" :prop="`confList.${index}.questionList.${indexs}.name`" :rules="rules.title">
                        <a-input v-model="items.name" :maxLength="50" :suffix="`${items.name.length}/50`" />
                      </a-form-model-item>
                      <a-form-model-item label="选项">
                      </a-form-model-item>

                      <!-- option -->
                      <div v-for="(opt, i) in items.answerList" :key="'answerList'+i">
                        <a-form-model-item :label="numMap[i]" :prop="`confList.${index}.questionList.${indexs}.answerList.${i}.answer`" :rules="rules.options">
                          <div class="optionBox">
                            <a-input v-model="opt.answer" :maxLength="50" :suffix="`${opt.answer.length}/50`" />
                            <a-icon type="plus-circle" class="btn" @click="addOption(items.answerList)" />
                            <a-icon type="minus-circle" class="btn" v-if="i>0" @click="delOption(items.answerList, i)" />
                          </div>
                        </a-form-model-item>
                      </div>
                      <!-- end option -->

                      <!-- answer -->
                      <a-form-model-item label="答案" prop="answer">
                        <a-select v-model="items.rightIdent">
                          <a-select-option
                            v-for="opt in items.answerList"
                            :key="opt.ident">
                            {{ opt.ident }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                      <!-- end answer -->

                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </div>
              <!-- end topic -->

            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
      <!-- end item -->
    </a-form-model>
  </div>
</template>

<script>
import UploadVideo from './upload'
import { toChinesNum } from '@/utils/util'
export default {
  name: 'TabContent',
  components: {
    UploadVideo
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading: false,
      form: {
        confList: []
      },
      activeKey: [],
      topicActiveKey: [],
      rules: {
        localtion: [{ required: true, message: '请上传视频', trigger: 'blur' }],
        name: [{ required: true, message: '请输入视频名称', trigger: 'blur' }],
        title: [{ required: true, message: '请输入题目', trigger: 'blur' }],
        options: [{ required: true, message: '请输入选项', trigger: 'change' }]
      },
      numMap: {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'F',
        6: 'G',
        7: 'H',
        8: 'I',
        9: 'J',
        10: 'K',
        11: 'L'
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        this.form.confList = val.confList || []
      }
    }
  },
  methods: {
    toChinesNum,
    /**
     * 添加剧集
     */
    addItem () {
      const item = {
        localtion: '',
        name: '',
        questionList: [
          {
            type: 'radio',
            name: '',
            answerList: [
              {
                ident: 'A',
                answer: ''
              }
            ],
            rightIdent: ''
          }
        ]
      }
      this.form.confList.push(item)
    },
    /**
     * 删除剧集
     */
    delItem (index) {
      this.form.confList.splice(index, 1)
    },
    /**
     * 添加问题
     */
    addTopic (record) {
      const item = {
        name: '',
        answerList: [
          {
            ident: 'A',
            answer: ''
          }
        ],
        rightIdent: ''
      }
      record.push(item)
    },
    /**
     * 删除问题
     */
    delTopic (record, index) {
      record.splice(index, 1)
    },
    /**
     * 添加选项
     */
    addOption (record) {
      const item = {
        ident: this.numMap[record.length],
        answer: ''
      }
      record.push(item)
    },
    /**
     * 删除选项
     */
    delOption (record, index) {
      if (record.length === 1) {
        this.$message.error('至少提交一个选项')
      } else {
        record.splice(index, 1)
      }
    },
    /**
     * 视频回调
     */
    getImg (url, item) {
      this.$set(item, 'localtionFullPath', url.fullPath)
      this.$set(item, 'localtion', url.path)
    },
    onSubmit () {
      console.log('提交')
    }
  }
}
</script>

<style lang="less" scoped>
  .add{
    margin-bottom:10px;
  }
  .item{
    width:80%;
    margin:0 auto;
    display:flex;
    .title{
      width:200px;
      background:#f6f6f6;
      margin-right:20px;
    }
    .box{
      flex:1;
    }
    .optionBox{
      display:flex;
      input{
        width:400px;
      }
      .btn{
        font-size:22px;
        margin-left:10px;
        margin-top:8px;
        cursor:pointer;
      }
    }
  }
  /deep/.ant-input-affix-wrapper .ant-input:not(:last-child){
    padding-right:80px;
  }
</style>
