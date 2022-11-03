<template>
  <div class="creating_warning_rule">
    <div class="creating_warning_rule_card">
      <a-card>
        <div class="warning_info_box">
          <div class="warning_info_title_box">评分模型信息</div>
          <div class="warning_info_card">
            <span
              class="input_box"
              v-for="(item ,index) in creatingWarningRuleInput.warningInfoInput"
              :key="index"
              :style="`width:${item.isLine ? '100%' :''}`"
            >
              <span class="input_title"><i
                class="stress"
                v-if="item.stress"
              >*</i>{{ item.title }}</span>
              <span
                class="input_content"
                v-if="item.type == 'input'"
              >
                <a-input
                  :maxLength="20"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder"
                  v-model="warningInfoData[item.key]"
                ></a-input>
              </span>
              <span
                class="input_textarea"
                v-if="item.type == 'textarea'"
              >
                <a-textarea
                  :maxLength="200"
                  name=""
                  id=""
                  v-model="warningInfoData[item.key]"
                  :placeholder="item.placeholder"
                ></a-textarea>
              </span>
              <span
                class="input_select"
                v-if="item.type == 'select'"
              >
                <a-select
                  v-model="warningInfoData[item.key]"
                  :placeholder="item.placeholder"
                  class="select"
                >
                  <a-select-option
                    v-for="(selectItem,selectIndex) in selectData[item.childrenKey]"
                    :value="selectItem.code"
                    :key="selectIndex"
                  >{{ selectItem.name }}</a-select-option>
                </a-select>
              </span>
              <span
                class="input_switch"
                v-if="item.type == 'switch'"
              >
                <a-switch
                  :checked="warningInfoData[item.key]"
                  @click="setSwitch(item.key)"
                  checked-children="启用"
                  un-checked-children="关闭"
                ></a-switch>
              </span>
            </span>
          </div>
        </div>
        <div class="warning_scope_box">
          <div class="warning_scope_title_box">设置评分规则</div>
          <div class="warning_scope_card">
            <div class="select_target_box">
              <div class="select_target_title">
                选择指标
              </div>
              <div class="select_target_card">
                <div class="select_target_tree">
                  <a-tree
                    :treeData="treeData"
                    v-model="expandedKeys"
                    checkable
                    :loadData="onLoadData"
                    @check="getAddSelect"
                  >
                  </a-tree>
                </div>
                <div class="select_target_btn">
                  <a-button
                    type="primary"
                    ghost
                    class="button"
                    @click="setTargetData(-1)"
                  >添加指标</a-button>
                </div>
              </div>
            </div>
            <div class="arrows">
              <img
                class="arrows_icon"
                :src="require('@/assets/arrows.png')"
                alt=""
              >
            </div>
            <div class="redact_target_scoreRule_box">
              <div class="redact_target_scoreRule_title">
                编辑指标评分规则
              </div>
              <div class="redact_target_scoreRule_card">
                <div class="redact_header_box">
                  <span
                    :class="`redact_header redact_header_${index}`"
                    v-for="(item,index) in ['指标项','指标值','评分','权重系数']"
                    :key="index"
                  >{{ item }}</span>
                </div>
                <div
                  class="redact_content_box"
                  v-for="(item,index) in targetData"
                  :key="index"
                >
                  <div class="delete_box">
                    <img
                      @click="setTargetData(item.id)"
                      class="icon"
                      :src="require('@/assets/delete_red.png')"
                      alt=""
                    >
                  </div>
                  <div class="score_box">
                    <div
                      class="score"
                      v-for="(score, scoreIndex) in item.scoreData"
                      :key="scoreIndex"
                    >
                      <div class="grade_box">
                        <div
                          class="grade"
                          v-for="(grade,gradeIndex) in score.gradeData"
                          :key="gradeIndex"
                        >
                          <span class="targetNape">
                            <a-input
                              class="input"
                              disabled
                              v-model="grade.targetNape"
                              v-if="gradeIndex == 0"
                            ></a-input>
                            <a-select
                              v-else
                              v-model="grade.relate"
                              placeholder="请选择"
                              class="select"
                            >
                              <a-select-option
                                v-for="(selectItem,selectIndex) in selectData.andOrAlso"
                                :value="selectItem.code"
                                :key="selectIndex"
                              >{{ selectItem.name }}</a-select-option>
                            </a-select>
                          </span>
                          <span class="targetSelect">
                            <a-select
                              v-model="grade.operate"
                              placeholder="请选择"
                              class="select"
                            >
                              <a-select-option
                                v-for="(selectItem,selectIndex) in selectData.relation"
                                :value="selectItem.code"
                                :key="selectIndex"
                              >{{ selectItem.name }}</a-select-option>
                            </a-select>
                          </span>
                          <span class="targetPrice">
                            <a-select
                              class="input"
                              placeholder="请输入"
                              v-if="item.type == 'select' || item.type == 'radio'"
                              v-model="grade.select"
                            >
                              <a-select-option
                                v-for="(selectItem,selectIndex) in item.selectData"
                                :value="selectItem.id.toString()"
                                :key="selectIndex"
                              >{{ selectItem.name }}</a-select-option>
                            </a-select>
                            <a-select
                              v-else-if="item.type == 'checkbox'"
                              mode="tags"
                              class="input"
                              id="auctionTimesCode"
                              v-model="grade.checkbox"
                              :maxTagCount="1"
                              placeholder="请输入">
                              <a-select-option
                                v-for="( selectItem,selectIndex ) in item.selectData"
                                :value="selectItem.id.toString()"
                                :key="selectIndex">
                                {{ selectItem.name }}
                              </a-select-option>
                            </a-select>
                            <a-date-picker
                              class="input"
                              v-else-if="item.type == 'date'"
                              format="YYYY/MM/DD"
                              :showToday="false"
                              v-model="grade.date"
                              placeholder="请输入" />
                            <a-input
                              v-else
                              class="input"
                              placeholder="请输入"
                              v-model="grade.input"
                            ></a-input>
                          </span>
                          <span class="targetScore">
                            <a-input-number
                              :precision="4"
                              v-if="gradeIndex + 1 == score.gradeData.length"
                              class="input"
                              placeholder="评分"
                              v-model="score.score"
                            ></a-input-number>
                          </span>
                          <span class="targetNumber">
                            <a-input-number
                              v-if="gradeIndex + 1 == score.gradeData.length"
                              class="input"
                              :precision="4"
                              :min="0"
                              placeholder="系数"
                              v-model="score.ratio"
                            ></a-input-number>
                          </span>
                          <span class="targetOperation">
                            <img
                              v-if="gradeIndex == 0"
                              class="icon"
                              @click="setTargetGradeData(index,scoreIndex,-1)"
                              :src="require('@/assets/add_blue.png')"
                              alt=""
                            >
                            <img
                              v-else
                              class="icon"
                              @click="setTargetGradeData(index,scoreIndex,gradeIndex)"
                              :src="require('@/assets/delete_blue.png')"
                              alt=""
                            >
                          </span>
                        </div>
                      </div>

                      <div class="scoreOperation">
                        <a-button
                          type="primary"
                          class="button"
                          ghost
                          @click="setTargetScoreData(index,-1)"
                          v-if="scoreIndex == 0"
                        >增加评分</a-button>
                        <a-button
                          v-else
                          type="primary"
                          @click="setTargetScoreData(index,scoreIndex)"
                          ghost
                          class="button"
                        >删除评分</a-button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="warning_rule_box">
          <div class="warning_rule_title_box">评分结果</div>
          <div class="warning_rule_card">
            <div class="warning_rule_content">
              <div class="warning_rule_redact_div">
                <div class="redact_button">
                  <a-button @click="setScoreData(-1)">增加评分结果</a-button>
                </div>
                <div class="redact_content">
                  <div
                    class="redact_div"
                    v-for="(item,index) in scoreData"
                    :key="index"
                  >
                    <div
                      class="close"
                      v-if="index !== 0"
                      @click="setScoreData(index)"
                    >
                      <img
                        :src="require('@/assets/close.png')"
                        alt=""
                        class="icon"
                      >
                    </div>
                    <div class="redact_left">
                      <div class="redact_list_box">
                        <div
                          class="redact_list"
                          v-for="(items,indexs) in item.score"
                          :key="indexs"
                        >
                          <span
                            class="redact_index"
                            v-if="indexs == 0"
                          >{{ index + 1 }}</span>
                          <span
                            class="redact_title"
                            :style="`margin-left:${indexs == 0 ? '':'40px'}`"
                          >
                            <span
                              class="redact_txt"
                              v-if="indexs == 0"
                            >总评分</span>
                            <span
                              class="redact_title_select"
                              v-else
                            >
                              <a-select
                                v-model="items.relate"
                                placeholder="请选择"
                                class="title_select"
                              >
                                <a-select-option
                                  v-for="(selectItem,selectIndex) in selectData.andOrAlso"
                                  :value="selectItem.code"
                                  :key="selectIndex"
                                >{{ selectItem.name }}</a-select-option>
                              </a-select>
                            </span>
                          </span>
                          <span class="redact_select">
                            <a-select
                              v-model="items.operate"
                              placeholder="请选择"
                              class="select"
                            >
                              <a-select-option
                                v-for="(selectItem,selectIndex) in selectData.relation"
                                :value="selectItem.code"
                                :key="selectIndex"
                              >{{ selectItem.name }}</a-select-option>
                            </a-select>
                          </span>
                          <span class="redact_input">
                            <a-input-number
                              :precision="4"
                              class="input"
                              v-model="items.score"
                            ></a-input-number>
                          </span>
                          <span class="redact_option">
                            <span
                              class="redact_icon"
                              v-if="indexs == 0"
                            >
                              <img
                                class="icon"
                                @click="setScore(index,-1)"
                                :src="require('@/assets/add_blue.png')"
                                alt="添加"
                              >
                            </span>
                            <span
                              class="redact_icon"
                              v-else
                            >
                              <img
                                class="icon"
                                v-if="indexs + 1 == item.score.length"
                                @click="setScore(index,indexs)"
                                :src="require('@/assets/delete_blue.png')"
                                alt="删除"
                              >
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="redact_right">
                      <div class="title">
                        评分结论：
                      </div>
                      <div class="textarea_box">
                        <a-textarea
                          :maxLength="200"
                          placeholder="结论最多填写200个字"
                          v-model="item.fruit"
                          name=""
                          id=""
                          class="textarea"
                        ></a-textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <a-button
      type="primary"
      class="save"
      @click="saveModel"
    >保存</a-button>
  </div>
</template>

<script>
import { getDict } from '@/api/common.js'
import { businessTermsList } from '@/api/clientFollow.js'
import { judgeFormerSave, judgeFormerLoad } from '@/api/riskEarlyWarning.js'
import moment from 'moment'

export default {
  data () {
    return {
      // 表格类型
      creatingWarningRuleInput: {
        warningInfoInput: [
          {
            title: '评分模型名称：',
            stress: true,
            type: 'input',
            placeholder: '请输入规则名称',
            key: 'name'
          },
          {
            title: 'key：',
            stress: true,
            type: 'input',
            placeholder: '规则首字母+4位流水号',
            key: 'kagi',
            disabled: true
          },
          {
            title: '模型描述：',
            type: 'textarea',
            placeholder: '请输入内容',
            key: 'brief',
            isLine: true
          },
          {
            title: '评分模型分类：',
            stress: true,
            type: 'select',
            placeholder: '请选择',
            key: 'type',
            childrenKey: 'scoreModelClass'
          },
          {
            title: '是否启用模型：',
            type: 'switch',
            key: 'open'
          }
        ]
      },
      // 表格数据
      warningInfoData: { open: true },
      // 需要用到的公用选项
      selectData: {
        relation: [],
        andOrAlso: [],
        scoreModelClass: []
      },
      // 评分盒子
      scoreData: [{ score: [{}, {}] }],
      // 评分规则右盒子
      treeData: [
        {
          title: '健康档案',
          key: '0',
          disableCheckbox: true
        }
      ],
      // 获取的选择数据
      expandedKeys: [],
      // 指标数据
      targetData: [],
      // 保存时拦截
      isSave: false,
      saveRule: false,
      isTarget: false,
      // 可以被选中的指标项
      targetArr: [],
      // 编辑所需要的模型id
      modelId: -1
    }
  },
  created () {
    this.getSelectArr()
    this.getUrl()
  },
  methods: {
    // 获取地址栏参数
    getUrl () {
      const object = {}
      // 1.获取？后面的所有内容包括问号
      const url = decodeURI(location.search) // ?name=嘻嘻&hobby=追剧

      // 2.截取？后面的字符
      const urlData = url.substr(1)
      // name=嘻嘻&hobby=追剧
      if (urlData.length === 0) return
      const strs = urlData.split('&')
      for (let i = 0; i < strs.length; i++) {
        object[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
      if (!object.hasOwnProperty('id')) return

      this.modelId = object.id
      this.getInfo()
      console.log(this.modelId)
    },
    // 编辑时信息
    getInfo () {
      if (this.modelId == -1) return
      const obj = {
        id: this.modelId
      }
      console.log(obj)
      judgeFormerLoad(obj).then(res => {
        console.log(res)
        const data = res.data
        this.warningInfoData = {
          name: data.name,
          open: data.open,
          type: data.type,
          brief: data.brief,
          kagi: data.kagi
        }
        this.expandedKeys = data.entry.map(item => {
          return item.termId
        })
        this.targetData = data.entry.map(item => {
          const obj = {}
          obj.id = item.termId
          obj.type = item.termType
          obj.selectData = item.termNext
          obj.scoreData = item.option.map(items => {
            const objs = {}
            objs.score = items.score
            objs.ratio = items.ratio
            objs.gradeData = items.detail.map(grade => {
              grade.targetNape = item.termName
              if (item.termType == 'select' || item.termType == 'radio') {
                grade.select = grade.worth
              } else if (item.termType == 'checkbox') {
                grade.checkbox = grade.worth.split(',')
              } else if (item.termType == 'date') {
                grade.date = moment(grade.worth, 'YYYY-MM-DD')
              } else {
                grade.input = grade.worth
              }
              return grade
            })
            return objs
          })
          return obj
        })
        this.scoreData = data.grade.map(item => {
          const obj = {}
          obj.fruit = item.fruit
          obj.score = item.detail
          return obj
        })
        console.log(this.scoreData)
      })
    },
    // 获取公用下拉框
    getSelectArr () {
      this.getSelectData('auto_lable_number_condition', 'relation')
      this.getSelectData('auto_lable_number_relationship', 'andOrAlso')
      this.getSelectData('score_model_classification', 'scoreModelClass')
    },
    // 操作是否启用
    setSwitch (e) {
      this.$set(this.warningInfoData, e, !this.warningInfoData[e])
    },
    // 增加删除评分结果
    setScoreData (e) {
      if (e == -1) {
        this.scoreData = [...this.scoreData, { score: [{ score: 1 }] }]
      } else {
        this.scoreData = this.scoreData.filter((item, index) => {
          return index != e
        })
      }
    },
    // 评分结果评分
    setScore (i, e) {
      if (e == -1) {
        this.$set(this.scoreData[i], 'score', [...this.scoreData[i].score, { score: 1 }])
      } else {
        const newData = this.scoreData[i].score.filter((item, index) => {
          return index !== e
        })
        this.$set(this.scoreData[i], 'score', newData)
      }
    },
    // 获取树形控件数据
    getTreeData (e) {
      return new Promise((resolve) => {
        if (!e) {
          resolve()
        } else {
          const data = {
            parentId: e
          }
          businessTermsList(data).then((res) => {
            let childrenData = res.data.map((item) => {
              item.title = item.name
              item.key = item.id
              item.isLeaf = !(
                item.type === 'web' ||
                item.type === 'casette' ||
                item.type === 'list' ||
                item.type === 'lable'
              )
              if (!(item.type === 'web' || item.type === 'casette' || item.type === 'list' || item.type === 'lable')) {
                this.targetArr = [...new Set([...this.targetArr, item])]
              }
              item.disableCheckbox =
                item.type === 'web' || item.type === 'casette' || item.type === 'list' || item.type === 'lable'
              return item
            })
            childrenData = childrenData.filter((item) => {
              return item.status == '0'
            })
            resolve(childrenData)
          })
        }
      })
    },
    // 动态加载树形控件数据
    onLoadData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
        } else {
          this.getTreeData(treeNode.eventKey).then((res) => {
            treeNode.dataRef.children = res
            this.treeData = [...this.treeData]
            resolve()
          })
        }
      })
    },
    // 获取公用选择数据
    getSelectData (e, key) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        console.log(res)
        this.selectData[key] = res.data
      })
    },
    // 添加刪除指标
    setTargetData (e) {
      if (e == -1) {
        if (this.expandedKeys.length == 0) return this.$message.error('至少选择一项')
        let newData = this.targetArr.filter((item) => {
          return this.expandedKeys.includes(item.id)
        })
        const newId = this.targetData.map(item => {
          return item.id
        })
        newData = newData.map((item) => {
          const obj = {}
          obj.id = item.id
          obj.type = item.type
          obj.scoreData = [{ gradeData: [{ targetNape: item.name }], ratio: 1 }]
          obj.selectData = item.selectData
          return obj
        })
        newData = newData.filter(item => {
          return !newId.includes(item.id)
        })
        this.targetData = [...this.targetData, ...newData]
        console.log(this.targetData)
      } else {
        this.targetData = this.targetData.filter((item) => {
          return item.id != e
        })
        this.expandedKeys = this.expandedKeys.filter(item => {
          return item != e
        })
        console.log(this.expandedKeys)
      }
    },
    setTargetScoreData (parentIndex, e) {
      if (e == -1) {
        console.log(this.targetData[parentIndex])
        this.$set(this.targetData[parentIndex], 'scoreData', [
          ...this.targetData[parentIndex].scoreData,
          { gradeData: [{ targetNape: this.targetData[parentIndex].scoreData[0].gradeData[0].targetNape }], ratio: 1 }
        ])
      } else {
        const newScoreData = this.targetData[parentIndex].scoreData.filter((item, index) => {
          return index != e
        })
        this.$set(this.targetData[parentIndex], 'scoreData', newScoreData)
      }
      this.$forceUpdate()
    },
    setTargetGradeData (parentIndex, i, e) {
      if (e == -1) {
        this.$set(this.targetData[parentIndex].scoreData[i], 'gradeData', [
          ...this.targetData[parentIndex].scoreData[i].gradeData,
          {}
        ])
      } else {
        const newGradeData = this.targetData[parentIndex].scoreData[i].gradeData.filter((item, index) => {
          return index != e
        })
        this.$set(this.targetData[parentIndex].scoreData[i], 'gradeData', newGradeData)
      }
      this.$forceUpdate()
    },
    // 保存
    saveModel () {
      this.isSave = false
      this.saveRule = false
      this.isTarget = false
      console.log(this.warningInfoData, this.scoreData, this.targetData)
      const data = this.warningInfoData
      const keyArr = []
      const requiredKey = ['name', 'type']
      for (const key in data) {
        keyArr.push(key)
      }
      if (this.targetData.length == 0) return this.$message.error('至少选择一个指标项')
      const entry = this.targetData.map(item => {
        const obj = {}
        obj.termId = item.id
        obj.termType = item.type.length > 0 ? item.type : 'input'
        obj.option = item.scoreData.map((items) => {
          const obj = {}
          obj.score = items.score
          obj.ratio = items.ratio
          obj.detail = items.gradeData.map((itemx, index) => {
            if ((!itemx.relate && index != 0) || !itemx.operate) {
              this.isTarget = true
            }
            const obj = {}
            if (index == 0) {
              obj.relate = 'and'
            } else {
              obj.relate = itemx.relate
            }
            obj.operate = itemx.operate
            if (item.type == 'select' || item.type == 'radio') {
              if (!itemx.select) {
                this.isTarget = true
              }
              obj.worth = itemx.select
            } else if (item.type == 'checkbox') {
              if (!itemx.checkbox) {
                this.isTarget = true
              }
              obj.worth = itemx.checkbox.join(',')
            } else if (item.type == 'date') {
              if (!itemx.date) {
                this.isTarget = true
              }
              obj.worth = itemx.date._d ? moment(itemx.date._d).format('YYYY-MM-DD') : itemx.date
            } else {
              if (!itemx.input) {
                this.isTarget = true
              }
              obj.worth = itemx.input
            }
            return obj
          })
          return obj
        })
        return obj
      })
      const grade = this.scoreData.map((item) => {
        const obj = {}
        obj.fruit = item.fruit
        obj.detail = item.score.map((items, index) => {
          const obj = {}
          if ((!items.relate && index != 0) || !items.operate.toString() || !items.score.toString()) {
            this.saveRule = true
          }
          obj.relate = index == 0 ? this.selectData.andOrAlso[0].code : items.relate
          obj.operate = items.operate
          obj.score = items.score
          return obj
        })
        return obj
      })
      const obj = { ...this.warningInfoData, grade, entry }
      console.log(obj)
      if (this.modelId !== -1) {
        obj.id = this.modelId
      }
      const filterKey = keyArr.filter((item) => {
        return requiredKey.includes(item)
      })
      this.isSave = !requiredKey.length == filterKey.length

      if (this.isSave) return this.$message.error('名称或分类未填写')
      if (this.isTarget) return this.$message.error('请输入正确的指标评分规则')
      if (this.saveRule) return this.$message.error('请输入正确的评分结果规则')
      judgeFormerSave(obj).then((res) => {
        console.log(res)
        this.$router.push('/riskEarlyWarning/scoringTemplate')
      })
    },
    getAddSelect (e, { checked }) {
      console.log(e, checked)
      if (checked) {
        this.getTreeData(e[e.length - 1]).then(res => {
          console.log(res)
          this.targetArr = this.targetArr.map(item => {
            if (item.id == e[e.length - 1]) {
              item.selectData = res.map(item => {
                const obj = {}
                obj.id = item.id
                obj.name = item.name
                obj.type = item.type
                return obj
              })
              if (res.length !== 0) {
                item.type = item.selectData[0].type
              }
            }
            return item
          })
          console.log(this.targetArr)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.creating_warning_rule {
  width: 100%;
  min-height: 100vh;
  position: relative;
  .creating_warning_rule_card {
    width: 100%;
    min-width: 600px;

    .warning_info_box {
      position: relative;
      width: 100%;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
      color: #333333;
      padding-top: 35px;
      box-sizing: border-box;
      .warning_info_title_box {
        position: absolute;
        top: 20px;
        left: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
        width: 92px;
        height: 32px;
        background-color: #fff;
      }
      .warning_info_card {
        box-sizing: border-box;
        padding: 25px 30px;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 345px;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid rgb(170, 170, 170);
        .input_box {
          display: flex;
          align-items: center;
          .input_title {
            width: 100px;
            white-space: nowrap;
            margin-left: 15px;
            font-family: 'Arial Normal', 'Arial';
            font-weight: 400;
            font-style: normal;
            font-size: 14px;
            color: #333;
            .stress {
              color: red;
              margin-right: 2px;
            }
          }
          .input_content {
            width: 290px;
            height: 35px;
            margin-right: 30px;
          }

          .input_textarea {
            textarea {
              resize: none;
              width: 418px;
              height: 61px;
            }
          }
          .input_select {
            width: 220px;
            height: 40px;
            margin-right: 50px;
            .select {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    .warning_scope_box {
      position: relative;
      width: 100%;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
      color: #333333;
      padding-top: 35px;
      box-sizing: border-box;
      .warning_scope_title_box {
        position: absolute;
        top: 20px;
        left: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
        width: 92px;
        height: 32px;
        background-color: #fff;
      }
      .warning_scope_card {
        overflow: auto;
        box-sizing: border-box;
        padding: 15px 30px 25px 30px;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        width: 100%;
        min-height: 693px;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid rgb(170, 170, 170);
        .select_target_box {
          flex-shrink: 0;
          width: 306px;

          .select_target_title {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding-left: 30px;
            height: 30px;
            font-size: 14px;
            font-family: 'Arial Normal', Arial;
            font-weight: 400;
            font-style: normal;
            letter-spacing: normal;
            color: rgb(51, 51, 51);
          }
          .select_target_card {
            display: flex;
            justify-content: space-between;
            width: 100%;
            flex-basis: 1;
            height: 620px;
            padding: 15px 20px;
            box-sizing: border-box;
            overflow: auto;
            font-family: 'Arial Normal', 'Arial';
            font-weight: 400;
            font-style: normal;
            font-size: 13px;
            letter-spacing: normal;
            color: #333333;
            background: inherit;
            background-color: rgba(255, 255, 255, 1);
            box-sizing: border-box;
            border-width: 1px;
            border-style: solid;
            border-color: rgba(215, 215, 215, 1);
          }
        }
        .arrows {
          margin: 0 5px;
          .arrows_icon {
            width: 65px;
            height: auto;
          }
        }
        .redact_target_scoreRule_box {
          flex-grow: 1;
          .redact_target_scoreRule_title {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding-left: 10px;
            height: 30px;
            font-size: 14px;
            font-family: 'Arial Normal', Arial;
            font-weight: 400;
            font-style: normal;
            letter-spacing: normal;
            color: rgb(51, 51, 51);
          }
          .redact_target_scoreRule_card {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 620px;
            padding: 15px 20px;
            overflow: auto;
            box-sizing: border-box;
            background-color: rgba(255, 255, 255, 1);
            box-sizing: border-box;
            border-width: 1px;
            border-style: solid;
            border-color: rgba(215, 215, 215, 1);
            .redact_header_box {
              display: flex;
              flex-wrap: nowrap;
              margin-bottom: 25px;
              font-size: 16px;
              font-family: 'Arial Normal', 'Arial';
              font-weight: 400;
              font-style: normal;
              color: #333333;
              .redact_header {
                margin-left: 20px;
                display: inline-block;
                width: 80px;
                text-align: center;
              }
              .redact_header_0 {
                margin-left: 30px;
              }
              .redact_header_1 {
                margin-left: 130px;
                width: 164px;
              }
              .redact_header_2 {
                width: 60px;
              }
              .redact_header_3 {
                width: 65px;
              }
            }
            .redact_content_box {
              width: 100%;
              display: flex;
              .delete_box {
                margin-right: 10px;
                height: 40px;
                display: flex;
                align-items: center;
                .icon {
                  cursor: pointer;
                  width: 20px;
                  height: auto;
                }
              }
              .score_box {
                display: flex;
                flex-direction: column;
                width: 100%;
                min-height: 260px;
                .score {
                  display: flex;
                  width: 100%;
                  .grade_box {
                    display: flex;
                    flex-direction: column;
                    .grade {
                      display: flex;
                      align-items: center;
                      height: 40px;
                      margin-bottom: 25px;
                      .targetNape {
                        margin-right: 20px;
                        width: 80px;
                        height: 35px;
                        .input {
                          width: 100%;
                          height: 100%;
                        }
                        .select {
                          width: 100%;
                          height: 100%;
                        }
                      }
                      .targetSelect {
                        margin-right: 20px;
                        width: 100px;
                        height: 35px;
                        .select {
                          width: 100%;
                          height: 100%;
                        }
                      }
                      .targetPrice {
                        margin-right: 20px;
                        width: 164px;
                        height: 35px;
                        .input {
                          width: 100%;
                          height: 100%;
                        }
                      }
                      .targetScore {
                        margin-right: 20px;
                        width: 60px;
                        height: 35px;
                        .input {
                          width: 100%;
                          height: 100%;
                        }
                      }
                      .targetNumber {
                        margin-right: 20px;
                        width: 64px;
                        height: 35px;
                        .input {
                          width: 100%;
                          height: 100%;
                        }
                      }
                      .targetOperation {
                        .icon {
                          cursor: pointer;
                          width: 25px;
                          height: auto;
                        }
                      }
                    }
                  }

                  .scoreOperation {
                    margin-left: 35px;
                    height: 36px;
                  }
                }
              }
            }
          }
        }
      }
    }

    .warning_rule_box {
      position: relative;
      width: 100%;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
      color: #333333;
      padding-top: 35px;
      box-sizing: border-box;
      .warning_rule_title_box {
        position: absolute;
        top: 20px;
        left: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
        width: 92px;
        height: 32px;
        background-color: #fff;
      }
      .warning_rule_card {
        overflow: auto;
        box-sizing: border-box;
        padding: 0 30px 25px 30px;
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        min-height: 826px;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid rgb(170, 170, 170);

        .warning_rule_content {
          width: 100%;
          .warning_rule_redact_div {
            .redact_button {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              width: 100%;
              height: 65px;
            }
            .redact_content {
              width: 100%;
              .redact_div {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                min-height: 268px;
                margin-bottom: 40px;
                background-color: rgba(255, 255, 255, 1);
                padding: 15px;
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-color: rgba(215, 215, 215, 1);
                .close {
                  cursor: pointer;
                  position: absolute;
                  top: 0;
                  right: 0;
                  transform: translate(50%, -50%);
                  .icon {
                    cursor: pointer;
                    width: 35px;
                    height: auto;
                  }
                }
                .redact_left {
                  flex: 1;
                  .redact_list_box {
                    width: 100%;
                    .redact_list {
                      width: 100%;
                      display: flex;
                      align-items: center;
                      margin-bottom: 20px;
                      .redact_index {
                        width: 40px;
                        font-size: 18px;
                        color: #333333;
                        font-family: 'Arial Normal', 'Arial';
                        font-weight: 400;
                      }
                      .redact_title {
                        width: 100px;
                        margin-right: 15px;

                        .redact_txt {
                          display: inline-block;
                          width: 100%;
                          text-align: center;
                          white-space: nowrap;
                          font-size: 16px;
                          color: #333333;
                          font-family: 'Arial Normal', 'Arial';
                          font-weight: 400;
                        }
                        .redact_title_select {
                          flex-shrink: 0;
                          .title_select {
                            width: 100%;
                          }
                        }
                      }
                      .redact_select {
                        flex-shrink: 0;
                        width: 100px;
                        margin-right: 20px;
                        .select {
                          width: 100%;
                        }
                      }
                      .redact_input {
                        width: 80px;
                        .input {
                          width: 100%;
                        }
                      }
                      .redact_option {
                        margin-left: 20px;
                        .redact_icon {
                          .icon {
                            cursor: pointer;
                            width: 25px;
                            height: auto;
                          }
                        }
                      }
                    }
                  }
                }
                .redact_right {
                  flex: 1;
                  display: flex;
                  .title {
                    white-space: nowrap;
                  }
                  .textarea_box {
                    .textarea {
                      resize: none;
                      width: 328px;
                      height: 87px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .save {
    position: absolute;
    top: -40px;
    right: 10px;
    width: 133px;
    height: 35px;
  }
}

::v-deep(#auctionTimesCode) {
  .ant-select-search__field {
    pointer-events:none;
  }
}
</style>
