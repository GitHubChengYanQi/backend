<template>
  <div class="creating_warning_rule">
    <div class="creating_warning_rule_card">
      <a-card>
        <div class="warning_info_box">
          <div class="warning_info_title_box">预警信息</div>
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
                  :checked="warningInfoData[item.key] == 1"
                  @click="setSwitch(item.key)"
                  checked-children="启用"
                  un-checked-children="关闭"
                ></a-switch>
              </span>
            </span>
          </div>
        </div>
        <div class="warning_scope_box">
          <div class="warning_scope_title_box">预警范围</div>
          <div class="warning_scope_card">
            <span
              class="input_box"
              v-for="(item ,index) in creatingWarningRuleInput.warningScopeInput.slice(0,warningScopeData.detect_code == '1' ? 1:creatingWarningRuleInput.warningScopeInput.length)"
              :key="index"
              :style="`width:${item.isLine ? '100%' :''}`"
            >
              <span class="input_title"><i
                class="stress"
                v-if="item.stress"
              >*</i>{{ item.title }}</span>
              <span
                class="input_select"
                v-if="item.type == 'select'"
              >
                <a-select
                  @change="()=>{$forceUpdate();}"
                  v-model="warningScopeData[item.key]"
                  :placeholder="item.placeholder"
                  class="select"
                >
                  <a-select-option
                    v-for="(selectItem,selectIndex) in selectData[item.children]"
                    :value="selectItem.code"
                    :key="selectIndex"
                  >{{ selectItem.name }}</a-select-option>
                </a-select>
              </span>
            </span>
            <span
              class="input_box"
              v-if="warningScopeData.detect_code == '1'"
              style="width:100%;"
            >
              <span class="input_title"><i class="stress">*</i>评分模型</span>
              <span
                class="input_model"
                v-if="scoringModel.title"
              ><i class="icon">
                <img
                  class="delete"
                  :src="require('@/assets/delete_white.png')"
                  @click="setScoringModel(-1,'scoringModel')"
                  alt=""
                ></i> {{ scoringModel.title }}</span>
              <span
                v-else
                class="input_model"
                @click="setState('scoringModelState')"
              >选择评分模型</span>
            </span>
            <span
              class="input_box"
              v-if="warningScopeData.question_detect_code == '1'&& warningScopeData.detect_code != '1'"
              style="width:100%;align-items: flex-start;"
            >
              <span
                class="input_title"
                style="margin-top:15px;"
              ><i class="stress">*</i>选择监控量表：</span>
              <div class="input_model_box">
                <span
                  class="input_model"
                  v-for="(item,index) in addQuestionnaireData"
                  :key="index"
                >
                  <i class="icon"><img
                    @click="delAddQuestionnaireData(index)"
                    class="delete"
                    :src="require('@/assets/delete_white.png')"
                    alt=""
                  ></i>
                  {{ item.title }}</span>
                <span
                  class="input_model"
                  @click="setState('questionnaireState')"
                > 添加问卷</span>
              </div>
            </span>
            <span
              class="input_box"
              v-if="warningScopeData.question_detect_code == '2' && warningScopeData.detect_code != '1'"
              style="width:100%;"
            >
              <span class="input_title"><i class="stress">*</i>选择问卷：</span>
              <span
                class="input_model"
                v-if="selectQuestionnaireModel.title"
              ><i class="icon">
                <img
                  class="delete"
                  :src="require('@/assets/delete_white.png')"
                  @click="setScoringModel(-1,'selectQuestionnaireModel')"
                  alt=""
                ></i>{{ selectQuestionnaireModel.title }}</span>
              <span
                class="input_model"
                v-else
                @click="setState('questionnaireState')"
              >选择问卷</span>
            </span>
          </div>
        </div>
        <div class="warning_rule_box">
          <div class="warning_rule_title_box">设置预警规则</div>
          <div class="warning_rule_card">
            <!-- 量表通用-->
            <div
              class="warning_rule_content"
              v-if="warningScopeData.question_detect_code == '1' && warningScopeData.detect_code != '1'"
            >
              <div class="warning_rule_redact_div">
                <div class="redact_title">编辑预警规则</div>
                <div class="redact_div">
                  <div class="redact_header">
                    <span
                      class="title"
                      v-for="(item,index) in ['','选项','评分','权重系数' ]"
                      :key="index"
                    >{{ item }}</span>
                  </div>
                  <div class="redact_content">
                    <span
                      class="data"
                      v-for="(item,index) in setWarningRule.redactData"
                      :key="index"
                    >
                      <i class="index">{{ index + 1 }}</i>
                      <span class="data_option">{{ String.fromCharCode((65 + index )) }}</span>
                      <span class="data_input">
                        <a-input-number
                          :precision="4"
                          v-model="item.score"
                          style="width: 66px;"
                        ></a-input-number>
                      </span>
                      <span class="data_input">
                        <a-input-number
                          :min="0"
                          :precision="4"
                          v-model="item.point"
                          style="width: 66px;"
                        ></a-input-number>
                      </span>
                      <span
                        class="data_icon"
                        v-if="index == 0"
                      >
                        <img
                          class="icon"
                          @click="setRedactData(-1)"
                          :src="require('@/assets/add_blue.png')"
                          alt="添加"
                        >
                      </span>
                      <span
                        class="data_icon"
                        v-else
                      >
                        <img
                          class="icon"
                          @click="setRedactData(index)"
                          :src="require('@/assets/delete_blue.png')"
                          alt="删除"
                        >
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="warning_grade_div">
                <span class="input_box">
                  <span class="input_title"><i class="stress">*</i>预警等级：</span>
                  <span class="input_button">
                    <a-button
                      style="width: 80px;height: 30px;"
                      @click="addGrade(-1)"
                    >新增</a-button>
                  </span>
                </span>
                <div class="grade_content">
                  <div
                    class="grade_div"
                    v-for="(item,index) in setWarningRule.gradeData"
                    :key="index"
                  >
                    <div
                      class="close"
                      v-if="index != 0"
                      @click="addGrade(index)"
                    >
                      <img
                        :src="require('@/assets/close.png')"
                        alt=""
                      >
                    </div>
                    <div
                      class="grade_line"
                      v-for="(items,indexs) in item.gradingRelationship"
                      :key="indexs"
                    >
                      <span
                        class="grade_index"
                        v-if="indexs == 0"
                      >
                        <i class="index">{{ index + 1 }}</i>
                        <span class="title">当</span>
                      </span>
                      <span
                        class="grade_select"
                        v-else
                      >
                        <a-select
                          v-model="items.relate"
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
                      <span class="txt">总评分</span>
                      <span class="grade_select">
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
                      <span class="grade_input">
                        <a-input-number
                          class="input"
                          v-model="items.score"
                        ></a-input-number>
                      </span>
                      <span class="grade_option">
                        <span
                          class="grade_icon"
                          v-if="indexs == 0"
                        >
                          <img
                            class="icon"
                            @click="setGradingRelationship(index,-1)"
                            :src="require('@/assets/add_blue.png')"
                            alt="添加"
                          >
                        </span>
                        <span
                          class="grade_icon"
                          v-else
                        >
                          <img
                            class="icon"
                            @click="setGradingRelationship(index,indexs)"
                            :src="require('@/assets/delete_blue.png')"
                            alt="删除"
                          >
                        </span>
                      </span>
                    </div>
                    <div class="grade_foot">
                      <span class="txt">时 预警等级 为</span>
                      <span class="grade_select">
                        <a-select
                          v-model="item.level"
                          placeholder="请选择"
                          class="select"
                          @change="(e)=>{
                            setLevelModel(e,index)
                            $forceUpdate();
                          }"
                        >
                          <a-select-option
                            v-for="(selectItem,selectIndex) in selectData.grade"
                            :value="selectItem.code"
                            :key="selectIndex"
                          >{{ selectItem.name }}</a-select-option>
                        </a-select>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 健康档案选择评分模型 -->
            <div
              class="select_warning_box"
              v-else-if="scoringModel.title && warningScopeData.detect_code == '1'"
            >
              <div class="select_warning_title">选择预警监控指标</div>
              <div class="select_warning_content">
                <div class="select_target_box">
                  <div class="select_target_card">
                    <div class="select_target_tree">
                      <a-tree
                        :treeData="treeData"
                        v-model="expandedKeys"
                        checkable
                        :loadData="onLoadData"
                      >
                      </a-tree>
                    </div>
                    <!-- <div class="select_target_btn">
                      <a-button
                        type="primary"
                        ghost
                        class="button"
                        @click="setTargetData()"
                      >添加指标</a-button>
                    </div> -->
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
                  <div class="redact_target_scoreRule_card">
                    <div
                      class="target_box"
                      v-for="(item,index) in scoringModel.targertData"
                      :key="index"
                    >
                      <!-- <i class="icon"><img
                      class="delete"
                      :src="require('@/assets/delete_red.png')"
                      alt=""
                    ></i> -->
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="warning_class_box">
                <div class="warning_class_title">
                  <i class="stress">*</i>预警等级：
                </div>
                <div class="warning_class_content">
                  <div
                    class="warning_box"
                    v-for="(item,index) in scoringModel.scoreData"
                    :key="index"
                  >
                    <div class="warning_class">
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
                            :style="`margin-left:${indexs == 0 ? '':'20px'}`"
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
                                disabled
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
                              disabled
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
                              disabled
                              class="input"
                              v-model="items.score"
                            ></a-input-number>
                          </span>
                        </div>
                      </div>
                    </div>
                    <span class="warning_class_txt">
                      时 预警等级 为
                    </span>
                    <a-select
                      @change="(e)=>{
                        setLevelModel(e,index)
                        $forceUpdate();
                      }"
                      v-model="item.level"
                      placeholder="请选择"
                      class="select"
                    >
                      <a-select-option
                        v-for="(selectItem,selectIndex) in selectData.grade"
                        :value="selectItem.code"
                        :key="selectIndex"
                      >{{ selectItem.name }}</a-select-option>
                    </a-select>
                  </div>
                </div>
              </div>
            </div>
            <!-- 单独制定未选择问卷 -->
            <div
              class="stateless"
              v-else-if="warningScopeData.question_detect_code == '2' && warningScopeData.detect_code != '1' && !selectQuestionnaireModel.title"
            >
              <a-empty description="请先选择问卷，再设置预警规则" />
            </div>
            <!-- 单独定制选择问卷 -->
            <div
              class="select_Warning_box"
              v-else-if="warningScopeData.question_detect_code == '2' && warningScopeData.detect_code != '1' && selectQuestionnaireModel.title"
            >
              <div class="select_Warning_target">
                <div class="select_Warning_target_title">
                  选择预警指标
                </div>
                <div class="select_Warning_target_content">
                  <div
                    class="questionnaire_issue_box"
                    v-for="(item,index) in questionnaireData"
                    :style="`display:${item.questionContent ? '':'none'}`"
                    :key="index"
                  >
                    <div class="questionnaire_issue_header">
                      <div class="index">{{ index + 1 }}</div>
                      <div class="issue">{{ item.questionContent ? item.questionContent :'' }}</div>
                      <div class="issue_class">{{ item.questionType ? item.questionType :'' }}</div>
                    </div>
                    <div
                      class="arrow"
                      v-if="item.questionType != '上传图片' && item.questionType != '提醒' && item.questionType != '同时录入数值'"
                      @click="setWarningRuleData(-1,index)"
                    >
                      <img
                        :src="require('@/assets/arrow_blue.svg')"
                        alt=""
                        class="icon"
                      >
                      <span class="txt">+ 添加</span>
                    </div>
                    <div class="questionnaire_issue_input">
                      <!-- 说明 -->
                      <!-- <div
                        class="issue_box"
                        v-if="item.questionType == '问题类型'"
                      >
                        <div
                          class="radio"
                          v-for="(radio,radioIndex) in item.children"
                          :key="radioIndex"
                        >
                          <div class="radio_title"> 答案 </div>
                        </div>
                      </div> -->
                      <div
                        class="issue_input"
                        v-if="item.questionType == '数字'"
                      >
                        <a-input-number
                          v-model="item.input"
                          disabled
                          style="width:313px;height:32px"
                        >
                        </a-input-number>
                      </div>
                      <!-- 文本  -->
                      <div
                        class="issue_input"
                        v-if="item.questionType == '文本'"
                      >
                        <a-input
                          v-model="item.input"
                          disabled
                          style="width:313px;height:32px"
                        >
                        </a-input>
                      </div>
                      <!-- 单选 -->
                      <div
                        class="issue_radio"
                        v-if="item.questionType == '单选'"
                      >
                        <div
                          class="radio"
                          v-for="(radio,radioIndex) in item.answers"
                          :key="radioIndex"
                        >
                          <div class="radio_title">{{ radio.answerContent }}</div>
                        </div>
                      </div>
                      <!-- 日期 -->
                      <div
                        class="issue_date"
                        v-if="item.questionType == '日期'"
                      >
                        <a-date-picker
                          disabled
                          format="YYYY/MM/DD"
                          :showToday="false"
                          v-model="item.date"
                          placeholder="请输入"
                          style="width: 154px; height:28px;"
                        />
                      </div>
                      <!-- 上传图片 -->
                      <div
                        class="issue_upload"
                        v-if="item.questionType == '上传图片'"
                      >
                        <a-upload
                          disabled
                          list-type="picture-card"
                        >
                          <div>
                            <div class="ant-upload-text">Upload</div>
                          </div>
                        </a-upload>
                      </div>
                      <!-- 多选 -->
                      <div
                        class="issue_checkbox"
                        v-if="item.questionType == '多选'"
                      >
                        <div
                          class="radio"
                          v-for="(radio,radioIndex) in item.answers"
                          :key="radioIndex"
                        >
                          <div class="radio_title">{{ radio.answerContent }}</div>
                        </div>
                      </div>
                      <!-- 同时录入数值 -->
                      <div
                        class="issue_enteringData"
                        v-if="item.questionType == '同时录入数值'"
                      >
                        <div
                          class="radio"
                          v-for="(radio,radioIndex) in item.answers"
                          :key="radioIndex"
                        >
                          <div class="radio_title">
                            <div class="txt">{{ radio.answerContent }}</div>
                            <div class="input">
                              <a-input
                                v-model="radio.input"
                                disabled
                              >
                              </a-input>
                            </div>
                            <div
                              class="arrowtxt"
                              @click="setWarningRuleData(-1,index,radio)"
                            >
                              <img
                                :src="require('@/assets/arrow_blue.svg')"
                                alt=""
                                class="icon"
                              >
                              <span class="addtxt">+ 添加</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 提示 -->
                      <div
                        class="issue_Tooltip"
                        v-if="item.questionType == '提示'"
                      >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="connect">
                <img
                  :src="require('@/assets/arrow.svg')"
                  alt=""
                >
              </div>
              <div class="redact_Warning_target">
                <div class="redact_Warning_target_title">
                  编辑预警规则
                </div>
                <div class="redact_Warning_target_content">
                  <div
                    class="redact_Warning_target_list"
                    v-for="(item,index) in warningRuleData"
                    :key="index"
                  >
                    <div
                      class="andOrAlso"
                      v-if="index != 0"
                    >
                      <a-select
                        v-model="item.relate"
                        placeholder="请选择"
                        class="select"
                      >
                        <a-select-option
                          v-for="(selectItem,selectIndex) in selectData.andOrAlso"
                          :value="selectItem.code"
                          :key="selectIndex"
                        >{{ selectItem.name }}</a-select-option>
                      </a-select>
                    </div>
                    <span
                      class="index"
                      :style="`margin-left:${index == 0 ? '100px':''}`"
                    >{{ index + 1 }}</span>
                    <span class="txt"><span class="stress">{{ '问题'+ item.number }}</span> {{ item.selectname }}的答案</span>
                    <div class="relation">
                      <a-select
                        v-model="item.relation"
                        placeholder="请选择"
                        class="select"
                      >
                        <a-select-option
                          v-for="(selectItem,selectIndex) in selectData.relation"
                          :value="selectItem.code"
                          :key="selectIndex"
                        >{{ selectItem.name }}</a-select-option>
                      </a-select>
                    </div>
                    <div class="targetPrice">
                      <a-select
                        v-if="item.type == '单选'"
                        v-model="item.select"
                        placeholder="请选择"
                        class="input"
                      >
                        <a-select-option
                          v-for="(selectItem,selectIndex) in item.answers"
                          :value="selectItem.id"
                          :key="selectIndex"
                        >{{ selectItem.name }}</a-select-option>
                      </a-select>
                      <a-select
                        v-else-if="item.type == '多选'"
                        mode="tags"
                        class="input"
                        id="auctionTimesCode"
                        v-model="item.checkbox"
                        :maxTagCount="1"
                        placeholder="请输入"
                      >
                        <a-select-option
                          v-for="( selectItem,selectIndex ) in item.answers"
                          :value="selectItem.id.toString()"
                          :key="selectIndex"
                        >
                          {{ selectItem.name }}
                        </a-select-option>
                      </a-select>
                      <a-date-picker
                        class="input"
                        v-else-if="item.type == '日期'"
                        format="YYYY/MM/DD"
                        :showToday="false"
                        v-model="item.date"
                        placeholder="请输入"
                      />
                      <a-input-number
                        v-else-if="item.type == '数字'"
                        class="input"
                        placeholder="请输入"
                        v-model="item.input"
                      ></a-input-number>
                      <a-input
                        v-else
                        class="input"
                        placeholder="请输入"
                        v-model="item.input"
                      ></a-input>
                    </div>
                    <div class="delete">
                      <a-button
                        type="primary"
                        ghost
                        class="button"
                        @click="setWarningRuleData(index)"
                      >删除</a-button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grade_foot">
                <span class="txt"><i style="color:red;">*</i>预警等级:</span>
                <span class="grade_select">
                  <a-select
                    v-model="warningRule.level"
                    placeholder="请选择"
                    class="select"
                    @change="(e)=>{
                      setLevelModel(e,0)
                      $forceUpdate();
                    }"
                  >
                    <a-select-option
                      v-for="(selectItem,selectIndex) in selectData.grade"
                      :value="selectItem.code"
                      :key="selectIndex"
                    >{{ selectItem.name }}</a-select-option>
                  </a-select>
                </span>
              </div>
            </div>
            <div
              class="stateless"
              v-else
            >
              <a-empty :description="null" />
            </div>
          </div>
        </div>
        <div class="notify_box">
          <div class="notify_card">
            <div class="notify_object_div">
              <span
                class="input_box"
                style="width:100%"
              >
                <span class="input_title"><i class="stress">*</i>通知对象：</span>
                <span class="input_select">
                  <a-select
                    v-model="notice_code"
                    class="select"
                  >
                    <a-select-option
                      v-for="(selectItem,selectIndex) in selectData.notifyObject"
                      :value="selectItem.code"
                      :key="selectIndex"
                    >{{ selectItem.name }}</a-select-option>
                  </a-select>
                </span>
              </span>
            </div>
            <div class="notify_content_div">
              <div
                class="title"
                v-if="warningLevelData.length > 0"
              >通知内容</div>
              <div class="content">
                <div
                  class="line"
                  v-for="(item,index) in warningLevelData"
                  :key="index"
                >
                  <i class="index">{{ index + 1 }}</i>
                  <span class="txt">预警等级 为{{ item.name }}时，通知内容：</span>
                  <span
                    class="input_model"
                    v-if="!warningLevelArr[item.code - 1].title"
                    @click="setState('messageState',index)"
                  >选择消息模板</span>
                  <span
                    class="input_model"
                    v-else
                  >
                    <i class="icon">
                      <img
                        class="delete"
                        :src="require('@/assets/delete_white.png')"
                        @click="setScoringModel(-1,'warningLevelArr',item.code - 1)"
                        alt=""
                      ></i>
                    {{ warningLevelArr[item.code - 1].title }}
                  </span>
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
    <!-- 评分模板 -->
    <a-modal
      :visible="scoringModelState"
      okText="选择"
      cancelText="取消"
      width="1168px"
      @ok="setScoringModel()"
      @cancel="setState('scoringModelState')"
    >
      <div class="scoringModel_box">
        <div class="scoringModel_left">
          <div class="scoringModel_header_left">
            选择评分模型
          </div>
          <div class="scoringModel_content_left">
            <div class="scoringModel_search_box">
              <a-input-search
                v-model="scoringModelData.search"
                @search="scoringModelSearh('scoringModelData')"
                class="scoringModel_search"
                placeholder="请输入评分模板名称"
              >
              </a-input-search>
            </div>
            <div class="scoringModel_list_box">
              <div
                class="scoringModel_list"
                @click="setListIndex('scoringModelData',index)"
                :style="{backgroundColor:scoringModelData.listIndex == index ? '#1890ff':'',
                         color:scoringModelData.listIndex == index ? '#fff':''
                }"
                v-for="(item,index) in scoringModelData.listData"
                :key="index"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
        <div class="scoringModel_right">
          <div class="scoringModel_header_right">
            详情
          </div>
          <div class="scoringModel_content_right">
            <div
              class="stateless"
              v-if="scoringModelData.listIndex == -1"
            >
              <a-empty description="请选择模板" />
            </div>
            <div
              class="scoringModel_listData_box"
              v-else
            >
              <div
                class="scoringModel_listData"
                v-for="(item,index) in scoringModelData.listContentData"
                :key="index"
              >
                <div class="modelDescribe_box">
                  <div class="modelDescribe_title">模型描述：</div>
                  <div class="modelDescribe_content">
                    {{ item.brief }}
                  </div>
                </div>
                <div class="modelGrade_rule_box">
                  <div class="modelGrade_rule_title">
                    模型评分规则：
                  </div>
                  <div class="modelGrade_rule_content">
                    <div class="modelGrade_rule_header">
                      <span
                        :class="`redact_header redact_header_${headerIndex}`"
                        v-for="(header,headerIndex) in ['指标项','指标值','评分','权重系数']"
                        :key="headerIndex"
                      >{{ header }}</span>
                    </div>
                    <div class="modelGrade_rule">
                      <div class="score_box">
                        <div
                          class="redact_content_box"
                          v-for="(target,targetIndex) in item.targetData"
                          :key="targetIndex"
                        >
                          <div class="score_box">
                            <div
                              class="score"
                              v-for="(score, scoreIndex) in target.scoreData"
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
                                      disabled
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
                                      disabled
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
                                      disabled
                                      class="input"
                                      placeholder="请输入"
                                      v-if="target.type == 'select' || target.type == 'radio'"
                                      v-model="grade.select"
                                    >
                                      <a-select-option
                                        v-for="(selectItem,selectIndex) in target.selectData"
                                        :value="selectItem.id.toString()"
                                        :key="selectIndex"
                                      >{{ selectItem.name }}</a-select-option>
                                    </a-select>
                                    <a-select
                                      disabled
                                      v-else-if="target.type == 'checkbox'"
                                      mode="tags"
                                      class="input"
                                      id="auctionTimesCode"
                                      v-model="grade.checkbox"
                                      :maxTagCount="1"
                                      placeholder="请输入"
                                    >
                                      <a-select-option
                                        v-for="( selectItem,selectIndex ) in target.selectData"
                                        :value="selectItem.id.toString()"
                                        :key="selectIndex"
                                      >
                                        {{ selectItem.name }}
                                      </a-select-option>
                                    </a-select>
                                    <a-date-picker
                                      class="input"
                                      disabled
                                      v-else-if="target.type == 'date'"
                                      format="YYYY/MM/DD"
                                      :showToday="false"
                                      v-model="grade.date"
                                      placeholder="请输入"
                                    />
                                    <a-input
                                      v-else
                                      disabled
                                      class="input"
                                      placeholder="请输入"
                                      v-model="grade.input"
                                    ></a-input>
                                  </span>
                                  <span class="targetScore">
                                    <a-input-number
                                      v-if="gradeIndex + 1 == score.gradeData.length"
                                      class="input"
                                      disabled
                                      :precision="4"
                                      placeholder="评分"
                                      v-model="score.score"
                                    ></a-input-number>
                                  </span>
                                  <span class="targetNumber">
                                    <a-input-number
                                      disabled
                                      v-if="gradeIndex + 1 == score.gradeData.length"
                                      class="input"
                                      :precision="4"
                                      :min="0"
                                      placeholder="系数"
                                      v-model="score.ratio"
                                    ></a-input-number>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modelGrade_result_box">
                  <div class="modelGrade_result_title">
                    模型评分结果：
                  </div>
                  <div class="modelGrade_result_content">
                    <div class="redact_content">
                      <div
                        class="redact_div"
                        v-for="(result,resultIndex) in item.scoreData"
                        :key="resultIndex"
                      >
                        <div class="redact_left">
                          <div class="redact_list_box">
                            <div
                              class="redact_list"
                              v-for="(items,indexs) in result.score"
                              :key="indexs"
                            >
                              <span
                                class="redact_index"
                                v-if="indexs == 0"
                              >{{ resultIndex + 1 }}</span>
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
                                    disabled
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
                                  disabled
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
                                  disabled
                                  class="input"
                                  v-model="items.score"
                                ></a-input-number>
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
                              disabled
                              v-model="result.fruit"
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
          </div>
        </div>
      </div>
    </a-modal>
    <!-- 问卷 -->
    <a-modal
      :visible="questionnaireState"
      okText="选择"
      cancelText="取消"
      width="1168px"
      @ok="getAddQuestionnaire"
      @cancel="setState('questionnaireState')"
    >
      <div class="scoringModel_box">
        <div class="scoringModel_left">
          <div class="scoringModel_header_left">
            选择问卷
          </div>
          <div class="scoringModel_content_left">
            <div class="scoringModel_search_box">
              <div
                class="checkbox"
                v-if="warningScopeData.question_detect_code == '1'"
              >
                <a-checkbox
                  :checked="questionnaire.allState"
                  :indeterminate="questionnaire.indeterminate"
                  @change="setQuestionnaireListState('allState',-1)"
                >
                </a-checkbox>
              </div>
              <a-input-search
                v-model="selectQuestionnaireData.search"
                @search="scoringModelSearh('selectQuestionnaireData')"
                class="scoringModel_search"
                placeholder="请输入问卷名称"
              >
              </a-input-search>
            </div>
            <div
              class="scoringModel_list_checkbox"
              v-if="warningScopeData.question_detect_code == '1'"
            >
              <div class="list_checkbox"></div>
              <div class="scoringModel_list_box">
                <div
                  class="scoringModel_list"
                  @click="setListIndex('selectQuestionnaireData', index)"
                  :style="{backgroundColor:selectQuestionnaireData.listIndex == index ? '#1890ff':'',
                           color:selectQuestionnaireData.listIndex == index ? '#fff':''
                  }"
                  v-for="(item,index) in selectQuestionnaireData.listData"
                  :key="index"
                >
                  <div
                    class="checkbox_div"
                    @click.stop=""
                  >
                    <a-checkbox
                      :checked="questionnaire.childrenList.includes(index)"
                      @change="setQuestionnaireListState('childrenList',index)"
                    >
                    </a-checkbox>
                  </div>
                  <div
                    class="identification_platform"
                    v-if="item.isEnterprise == '2'"
                  >平台</div>
                  <div
                    class="identification_enterprise"
                    v-if="item.isEnterprise == '1'"
                  >企业</div>
                  {{ item.title }}
                </div>
              </div>
            </div>
            <div
              class="scoringModel_list_box"
              v-else
            >
              <div
                class="scoringModel_list"
                @click="setListIndex('selectQuestionnaireData', index)"
                :style="{backgroundColor:selectQuestionnaireData.listIndex == index ? '#1890ff':'',
                         color:selectQuestionnaireData.listIndex == index ? '#fff':''
                }"
                v-for="(item,index) in selectQuestionnaireData.listData"
                :key="index"
              >
                <div
                  class="identification_platform"
                  v-if="item.isEnterprise == '2'"
                >平台</div>
                <div
                  class="identification_enterprise"
                  v-if="item.isEnterprise == '1'"
                >企业</div>
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
        <div class="scoringModel_right">
          <div class="scoringModel_header_right">
            问卷详情
          </div>
          <div class="questionnaire_info_box">
            <div
              class="questionnaire_issue_box"
              v-for="(item,index) in questionnaireData"
              :style="`display:${questionnaireData.length > 0 ? '': 'none'};`"
              :key="index"
            >
              <div class="questionnaire_issue_header">
                <div class="index">{{ index + 1 }}</div>
                <div class="issue">{{ item.questionContent ? item.questionContent :'' }}</div>
                <div class="issue_class">{{ item.questionType ? item.questionType :'' }}</div>
                <div
                  class="hint"
                  v-if="!item.questionType"
                  @click="showBox('explain',index)"
                >6</div>
                <div
                  class="explain_box"
                  v-if="explain == index"
                >
                  <div
                    class="delete"
                    @click="showBox('explain',-1)"
                  >+</div>
                  <div class="title">
                    说明
                  </div>
                  <div class="content">
                    <div
                      class="list"
                      v-for="(list,listIndex) in ['提醒  提示信息，不需用户回答','单选','多选','文本 文本框需用户填写','日期','数字','上传图片','同时录入数值']"
                      :key="listIndex"
                    >
                      {{ (listIndex + 1 )+ '\n' + list }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="questionnaire_issue_input">
                <!-- 说明 -->
                <div
                  class="issue_box"
                  v-if="!item.questionType"
                >
                  <div
                    class="radio"
                    v-for="(radio,radioIndex) in item.children"
                    :key="radioIndex"
                  >
                    <div class="radio_title"> 答案 </div>
                    <div class="skip">跳转问题编号</div>
                  </div>
                </div>
                <!-- 数字 -->
                <div
                  class="issue_input"
                  v-if="item.questionType == '数字'"
                >
                  <a-input-number
                    v-model="item.input"
                    disabled
                    style="width:313px;height:32px"
                  >
                  </a-input-number>
                  <!-- <div class="skip">跳转问题{{ item.value }}</div> -->
                </div>
                <!-- 文本  -->
                <div
                  class="issue_input"
                  v-if="item.questionType == '文本'"
                >
                  <a-input
                    v-model="item.input"
                    disabled
                    style="width:313px;height:32px"
                  >
                  </a-input>
                  <!-- <div class="skip">跳转问题{{ item.value }}</div> -->
                </div>
                <!-- 单选 -->
                <div
                  class="issue_radio"
                  v-if="item.questionType == '单选'"
                >
                  <div
                    class="radio"
                    v-for="(radio,radioIndex) in item.answers"
                    :key="radioIndex"
                  >
                    <div class="radio_title">{{ radio.answerContent }}</div>
                    <!-- <div class="skip">跳转问题{{ radio.value }}</div> -->
                  </div>
                </div>
                <!-- 日期 -->
                <div
                  class="issue_date"
                  v-if="item.questionType == '日期'"
                >
                  <a-date-picker
                    disabled
                    format="YYYY/MM/DD"
                    :showToday="false"
                    v-model="item.date"
                    placeholder="请输入"
                    style="width: 154px; height:28px;"
                  />
                  <!-- <div class="skip">跳转问题{{ item.value }}</div> -->
                </div>
                <!-- 上传图片 -->
                <div
                  class="issue_upload"
                  v-if="item.questionType == '上传图片'"
                >
                  <a-upload
                    disabled
                    list-type="picture-card"
                  >
                    <div>
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <!-- <div class="skip">跳转问题{{ item.value }}</div> -->
                </div>
                <!-- 多选 -->
                <div
                  class="issue_checkbox"
                  v-if="item.questionType == '多选'"
                >
                  <div
                    class="radio"
                    v-for="(radio,radioIndex) in item.answers"
                    :key="radioIndex"
                  >
                    <div class="radio_title">{{ radio.answerContent }}</div>
                    <!-- <div
                      class="skip"
                      v-if="radioIndex == 0"
                    >跳转问题{{ radio.value }}</div> -->
                  </div>
                </div>
                <!-- 同时录入数值 -->
                <div
                  class="issue_enteringData"
                  v-if="item.questionType == '同时录入数值'"
                >
                  <div
                    class="radio"
                    v-for="(radio,radioIndex) in item.answers"
                    :key="radioIndex"
                  >
                    <div class="radio_title">
                      <div class="txt">{{ radio.answerContent }}</div>
                      <div class="input">
                        <a-input
                          v-model="radio.input"
                          disabled
                          style="width:290px;height:32px"
                        >
                        </a-input>
                      </div>
                    </div>
                    <!-- <div class="skip">跳转问题{{ radio.value }}</div> -->
                  </div>
                </div>
                <!-- 提示 -->
                <div
                  class="issue_Tooltip"
                  v-if="item.questionType == '提示'"
                >
                  <!-- <div class="skip">跳转问题</div> -->
                </div>
              </div>
            </div>
            <div
              class="stateless"
              v-if="selectQuestionnaireData.listIndex == -1"
            >
              <a-empty :description="null" />
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <!-- 消息模板-->
    <a-modal
      :visible="messageState"
      okText="选择"
      cancelText="取消"
      width="1168px"
      @ok="getWarningLevel"
      @cancel="setState('messageState',-1)"
    >
      <div class="scoringModel_box">
        <div class="scoringModel_left">
          <div class="scoringModel_header_left">
            选择消息模板
          </div>
          <div class="scoringModel_content_left">
            <div class="scoringModel_search_box">
              <a-input-search
                v-model="messageData.search"
                @search="scoringModelSearh('messageData')"
                class="scoringModel_search"
                placeholder="请输入模板名称"
              >
              </a-input-search>
            </div>
            <div class="scoringModel_search_box">
              <a-cascader
                class="scoringModel_search"
                style="margin-top:20px"
                v-model="messageData.classify"
                @change="scoringModelSearh('messageData')"
                :options="selectData.tempSelectOptions"
                :field-names="{ label: 'name', value: 'code', children: 'child' }"
                placeholder="请选择模板分类"
              />
            </div>
            <div
              class="scoringModel_list_box"
              style="min-height: 500px;"
            >
              <div
                class="scoringModel_list"
                @click="setListIndex('messageData', index)"
                :style="{backgroundColor:messageData.listIndex == index ? '#1890ff':'',
                         color:messageData.listIndex == index ? '#fff':''
                }"
                v-for="(item,index) in messageData.listData"
                :key="index"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="scoringModel_right">
          <div class="scoringModel_header_right">
            详情
          </div>
          <div class="meeageModel_info_box">
            <div
              class="stateless"
              v-if="messageData.listIndex == -1"
            >
              <a-empty :description="null" />
            </div>
            <div
              class="isShow"
              v-else
            >
              <div class="meeageModel_noticeCrowd">
                <div class="title">通知人群：</div>
                <div class="content">{{ messageData.noticeCrowd == '0' ? '用户':'员工' }}</div>
              </div>
              <div class="meeageModel_channel">
                <div class="title">通知渠道：</div>
                <div
                  class="content"
                  v-if="messageDataContent.length > 0"
                >
                  <span
                    class="channel"
                    v-for="(item,index) in messageDataContent[0].noticeChannels"
                    :key="index"
                  >{{ index + 1 == messageDataContent[0].noticeChannels.length ? selectData.messageChilder[item] : selectData.messageChilder[item] + '、' }}</span>
                </div>
              </div>
              <div class="meeageModel_phone">
                <div
                  class="msgPreviewBox"
                  v-for="(item,index) in messageDataContent"
                  :key="index"
                >
                  <img
                    src="./image/arrow.svg"
                    @click="handleSet(-1)"
                    alt
                    class="arrow left"
                  />
                  <img
                    src="./image/arrow.svg"
                    @click="handleSet(1)"
                    alt
                    class="arrow"
                  />
                  <div class="bar"></div>
                  <div class="bar bottom"></div>
                  <div class="contentBox">
                    <!-- 公众号 站内信 -->
                    <div
                      class="officialAccount"
                      v-if="item.noticeChannels[item.selectIndex] == 0|| item.noticeChannels[item.selectIndex] == 3"
                    >
                      <div class="til">{{ item.title || '消息标题' }}</div>
                      <div class="content">{{ item.content }}</div>
                    </div>
                    <!-- 企微 -->
                    <div
                      class="wechatPlus"
                      v-if="item.noticeChannels[item.selectIndex] == 1"
                    >
                      <img
                        src="./image/user.svg"
                        alt
                        class="user"
                      />
                      <div class="content">{{ item.content }}</div>
                    </div>
                    <!-- 短信 -->
                    <div
                      class="shortMsg"
                      v-if="item.noticeChannels[item.selectIndex] == 2"
                    >
                      <div class="date">{{ new Date().getMonth() + 1 + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() }}</div>
                      <div class="content">{{ item.content }}</div>
                    </div>
                    <!-- 邮件 -->
                    <div
                      class="email"
                      v-if="item.noticeChannels[item.selectIndex] == 4"
                    >
                      <div class="til">{{ item.title || '消息标题' }}</div>
                      <div class="user">
                        <img
                          src="./image/user.svg"
                          alt
                          class="icon"
                        />
                        <span class="name">{{ '用户名' }}</span>
                      </div>
                      <div class="content">{{ item.content }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getDict, getDictTree } from '@/api/common.js'
import { businessTermsList } from '@/api/clientFollow.js'
import {
  warnStrategyAdd,
  warnStrategyInfo,
  warnStrategyEdit,
  judgeFormerFind,
  judgeFormerLoad,
  riskNoticeTempGetAll
} from '@/api/riskEarlyWarning.js'
import { getNoticeInfoReq } from '@/api/templateLibrary.js'
import { diagnosisCareQuestionnaireQuestionnaireList, diagnosisCareQuestionnaireDetail } from '@/api/healthManage.js'

import moment from 'moment'

export default {
  data () {
    return {
      warningRule: {},
      modelId: -1,
      // 表格类型
      creatingWarningRuleInput: {
        warningInfoInput: [
          {
            title: '规则名称：',
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
            title: '规则描述：',
            type: 'textarea',
            placeholder: '请输入内容',
            key: 'brief',
            isLine: true
          },
          {
            title: '预警分类：',
            stress: true,
            type: 'select',
            placeholder: '请选择',
            key: 'warn_code',
            childrenKey: 'scoreModelClass'
          },
          {
            title: '是否启用规则：',
            type: 'switch',
            key: 'is_open',
            default: true
          }
        ],
        warningScopeInput: [
          {
            title: '监控范围：',
            stress: true,
            type: 'select',
            placeholder: '请选择',
            key: 'detect_code',
            isLine: true,
            children: 'detectionRange'
          },
          {
            title: '问卷监测方式：',
            stress: true,
            type: 'select',
            placeholder: '请选择',
            isLine: true,
            key: 'question_detect_code',
            children: 'questionnaireMonitoringMethod'
          }
        ]
      },
      // 表格数据
      warningInfoData: { is_open: 1 },
      // 预警范围
      warningScopeData: {},
      // 预警规则
      setWarningRule: {
        redactData: [{ point: 1 }, { point: 1 }],
        gradeData: [{ gradingRelationship: [{}, {}] }]
      },
      // 需要用到的公用选项
      selectData: {
        relation: [],
        andOrAlso: [],
        grade: [],
        notifyObject: [],
        scoreModelClass: [],
        detectionRange: [],
        questionnaireMonitoringMethod: [],
        tempSelectOptions: [],
        messageChilder: ['公众号', '企微消息', '短信', '站内信', '邮件', 'app']
      },
      // 通知对象
      notice_code: '1',
      // 控制评分模板的显示隐藏
      scoringModelState: false,
      // 评分模板所需要的数据
      scoringModelData: {
        search: '', // 模板搜索参数
        listIndex: -1, // 选中
        listData: [],
        listContentData: []
      },
      // 评分模板选择后数据
      scoringModel: {},
      // 量表数据
      treeData: [
        {
          title: '健康档案',
          key: '0',
          disableCheckbox: true
        }
      ],
      // 树状图选择序号
      expandedKeys: [],
      // 预警等级
      warningCalss: [],
      // 问卷弹框是否展示
      questionnaireState: false,
      // 说明盒子
      explain: -1,
      // 上传地址
      // 问卷展示内容数据
      questionnaireData: [],
      // 问卷
      selectQuestionnaireData: {
        search: '', // 模板搜索参数
        listIndex: -1, // 选中
        listData: []
      },
      // 控制问卷弹框
      questionnaire: {
        allState: false,
        indeterminate: false,
        childrenList: []
      },
      // 添加问卷数组
      addQuestionnaireData: [],
      // 选择问卷数据
      selectQuestionnaireModel: {},
      // 预警规则
      warningRuleData: [],
      // 控制报错信息
      isInfo: true,
      isScope: true,
      levelState: true,
      // 编辑时所需要的id
      detailsId: -1,
      // 消息模板
      messageState: false,
      messageData: {
        search: '', // 模板搜索参数
        listIndex: -1, // 选中
        listData: [],
        classify: [] // 联机选择
      },
      // 要选择的预警等级盒子
      warningLevel: -1,
      // 选择数据的内容
      targetArr: [],
      // 消息展示
      messageDataContent: [],
      // 选择消息模板所对应的参数
      warningLevelArr: [{}, {}, {}, {}],
      warningLevelData: []
    }
  },
  created () {
    this.getSelectArr()
    this.getUrl()
  },
  methods: {
    setLevelModel (e, i) {
      console.log(e, i)
      const data = this.selectData.grade.filter((item, index) => {
        return item.code == e && index != 0
      })
      if (this.warningScopeData.question_detect_code == '1' || this.warningScopeData.detect_code == '1') {
        const res = new Map()
        this.warningLevelData = [...this.warningLevelData, ...data].filter(item => {
          var attrItem = item.code
          return !res.has(attrItem) && res.set(attrItem, 1)
        }).sort(function (a, b) {
          var value1 = a.code
          var value2 = b.code
          return value1 - value2
        })
        console.log(this.scoringModel.scoreData, this.setWarningRule.gradeData)
        let levelIndex
        if (this.warningScopeData.detect_code == '1') {
          levelIndex = this.scoringModel.scoreData.map((item) => {
            return item.level
          })
        } else {
          levelIndex = this.setWarningRule.gradeData.map((item) => {
            return item.level
          })
        }
        this.warningLevelData = this.warningLevelData.filter((item) => {
          return levelIndex.includes(item.code)
        })
      } else if (this.warningScopeData.question_detect_code == '2') {
        this.warningLevelData = data
      }
      console.log(this.warningLevelData)
    },
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
    },
    // 修改时操作
    getInfo () {
      if (this.modelId == -1) return
      const obj = {
        id: this.modelId
      }
      warnStrategyInfo(obj).then((res) => {
        console.log(res, '111111111')
        const data = res.data
        this.warningInfoData = {
          name: data.name,
          is_open: data.is_open,
          warn_code: data.warn_code,
          brief: data.brief,
          kagi: data.kagi
        }
        this.notice_code = data.notice_code
        this.warningScopeData = {
          detect_code: data.detect_code
        }
        this.warningLevelArr = data.notice_model_json.map((item) => {
          const obj = {}
          obj.level = item.level
          obj.id = item.id
          obj.title = item.name
          return obj
        })
        this.warningLevelData = data.notice_model_json.filter(item => {
          return item.id
        }).map((item) => {
          const obj = {}
          obj.code = item.level
          obj.name = this.selectData.grade.filter(items => {
            return items.code == item.level
          })[0].name
          return obj
        })
        if (data.question_detect_code.length > 0) {
          this.warningScopeData.question_detect_code = data.question_detect_code
        }
        if (this.warningScopeData.detect_code == '1') {
          this.scoringModel = {
            id: data.score_former_id,
            title: data.score_former_name
          }
          this.scoringModel.targertData = data.score_detect_targert_json
          this.scoringModel.scoreData = data.warn_lever_json.map((item) => {
            const obj = {}
            obj.fruit = item.fruit
            obj.level = item.level
            obj.score = item.point
            return obj
          })
        }
        if (this.warningScopeData.detect_code == '2' && this.warningScopeData.question_detect_code == '1') {
          console.log(data)
          this.addQuestionnaireData = data.scale_detect_json.map((item) => {
            const obj = {}
            obj.id = item.id
            obj.title = item.name
            return obj
          })
          this.setWarningRule.redactData = data.warn_rule_json.map((item) => {
            const obj = {}
            obj.score = item.score
            obj.point = item.point
            return obj
          })
          this.setWarningRule.gradeData = data.warn_lever_json.map((item) => {
            const obj = {}
            obj.level = item.level
            obj.gradingRelationship = item.point
            return obj
          })
        } else if (this.warningScopeData.detect_code == '2' && this.warningScopeData.question_detect_code == '2') {
          const obj = {
            id: data.question_id
          }
          diagnosisCareQuestionnaireDetail(obj).then((res) => {
            console.log(res)
            this.selectQuestionnaireModel = {
              title: res.data.questionnaireName,
              id: res.data.questionnaireId
            }
            this.questionnaireData = res.data.questionResults
            this.warningRuleData = data.warn_rule_json.map((item, index) => {
              const obj = {}
              obj.number = item.number
              obj.id = item.id
              obj.type = item.type
              obj.relate = item.relate
              if (item.type == '多选' || item.type == '单选') {
                console.log(this.questionnaireData)
                const newFilter = this.questionnaireData.filter((items) => {
                  return items.questionId == item.id
                })
                console.log(newFilter)
                obj.answers = newFilter[0].answers.map((items) => {
                  const obj = {}
                  obj.id = items.answerId
                  obj.name = items.answerContent
                  return obj
                })
              }
              obj.relation = item.operate
              if (obj.type == '单选') {
                obj.select = item.score
              } else if (obj.type == '多选') {
                obj.checkbox = item.score.split(',')
              } else if (obj.type == '日期') {
                obj.date = item.score
              } else if (obj.type == '同时录入数值') {
                obj.selectid = item.selectid
                obj.selectname = item.selectname
                obj.input = item.score
              } else {
                obj.input = item.score
              }
              return obj
            })
            console.log(this.warningRuleData, '222222')
          })
          this.warningRule.level = data.warn_lever_code
        }
      })
    },
    // 选择消息模型
    getWarningLevel () {
      const obj = {
        title: this.messageData.listData[this.messageData.listIndex].name,
        id: this.messageData.listData[this.messageData.listIndex].id
      }
      const newIndex = this.warningLevelData[this.warningLevel].code - 1
      console.log(newIndex)
      this.warningLevelArr[newIndex] = { ...this.warningLevelArr[newIndex], ...obj }
      this.setState('messageState', -1)
    },
    // 获取评分模型列表
    getScoreModelList (total) {
      const obj = {
        name: this.scoringModelData.search
      }
      console.log(total)
      if (total != undefined) {
        obj.size = total
      }
      console.log(obj)
      judgeFormerFind(obj).then((res) => {
        console.log(res)
        console.log(res.data.total, res.data.datas.length)
        if (res.data.total !== res.data.datas.length) {
          this.getScoreModelList(res.data.total)
        }
        const listData = res.data.datas
          .filter((item) => {
            return item.open
          })
          .map((item) => {
            const obj = {}
            obj.title = item.name
            obj.id = item.id
            return obj
          })
        this.$set(this.scoringModelData, 'listData', listData)
      })
    },
    // 获取评分模型内容
    getModelContent (e) {
      const obj = {
        id: this.scoringModelData.listData[e].id
      }
      judgeFormerLoad(obj).then((res) => {
        console.log(res)
        const data = res.data
        const obj = {}
        obj.brief = data.brief
        obj.targetData = data.entry.map((item) => {
          const obj = {}
          obj.id = item.termId
          obj.type = item.termType
          obj.name = item.termName
          obj.selectData = item.termNext
          obj.scoreData = item.option.map((items) => {
            const objs = {}
            objs.score = items.score
            objs.ratio = items.ratio
            objs.gradeData = items.detail.map((grade) => {
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
        obj.scoreData = data.grade.map((item) => {
          const obj = {}
          obj.fruit = item.fruit
          obj.score = item.detail
          return obj
        })
        this.$set(this.scoringModelData, 'listContentData', [obj])
        console.log(this.scoringModelData.listContentData)
      })
    },
    // 获取问卷列表
    getQuestionnaireList () {
      const obj = {
        questionnaireName: this.selectQuestionnaireData.search
      }
      diagnosisCareQuestionnaireQuestionnaireList(obj).then((res) => {
        console.log(res)
        this.selectQuestionnaireData.listData = res.data.records
          .filter((item) => {
            return item.isEnterprise == '1'
          })
          .map((item) => {
            const obj = {}
            obj.id = item.questionnaireId
            obj.title = item.questionnaireName
            obj.isEnterprise = item.isEnterprise
            return obj
          })
      })
    },
    // 获取问卷详情
    getQuestionnaireDetail (e) {
      const obj = {
        id: this.selectQuestionnaireData.listData[e].id
      }
      diagnosisCareQuestionnaireDetail(obj).then((res) => {
        console.log(res)
        this.questionnaireData = res.data.questionResults
        console.log(this.questionnaireData)
      })
    },
    // 获取消息模板列表
    getMessageList () {
      const obj = {
        name: this.messageData.search,
        firstClass: this.messageData.classify.length > 0 ? this.messageData.classify[0] : '',
        secondClass: this.messageData.classify.length > 1 ? this.messageData.classify[1] : ''
      }
      riskNoticeTempGetAll(obj).then((res) => {
        console.log(res, '消息')
        this.messageData.listData = res.data.map((item) => {
          const obj = {}
          obj.id = item.id
          obj.name = item.name
          return obj
        })
      })
    },
    // 获取消息模板内容
    getMessageData (e) {
      const obj = {
        id: this.messageData.listData[e].id
      }
      console.log(obj)
      getNoticeInfoReq(obj).then((res) => {
        console.log(res)
        const data = res.data
        const newArr = [{}]
        this.messageDataContent = newArr.map((item) => {
          const obj = {}
          obj.content = data.content
          obj.noticeChannels = data.noticeChannels.split(',')
          obj.selectIndex = 0
          obj.updatedAt = data.updatedAt
          obj.title = data.title
          return obj
        })
        console.log(this.messageDataContent)
      })
    },
    // 消息模型样式切换
    handleSet (e) {
      if (this.messageDataContent[0].selectIndex + e == this.messageDataContent[0].noticeChannels.length) {
        this.messageDataContent[0].selectIndex = 0
      } else if (this.messageDataContent[0].selectIndex + e < 0) {
        this.messageDataContent[0].selectIndex = this.messageDataContent[0].noticeChannels.length - 1
      } else {
        this.messageDataContent[0].selectIndex = this.messageDataContent[0].selectIndex + e
      }
    },
    // 获取公用下拉框
    getSelectArr () {
      this.getSelectData('auto_lable_number_condition', 'relation')
      this.getSelectData('auto_lable_number_relationship', 'andOrAlso')
      this.getSelectData('warning_classification', 'scoreModelClass')
      this.getSelectData('warning_level', 'grade')
      this.getSelectData('notification_object', 'notifyObject')
      this.getSelectData('detection_range', 'detectionRange')
      this.getSelectData('questionnaire_monitoring_method', 'questionnaireMonitoringMethod')
      this.getSelectData('model_classification', 'tempSelectOptions', true)
    },
    // 修改信息操作
    editModel () {},
    // 操作是否启用
    setSwitch (e) {
      this.$set(this.warningInfoData, e, !this.warningInfoData[e])
    },
    // 增加删除给预警规则
    setRedactData (e) {
      if (e == -1) {
        if (this.setWarningRule.redactData.length == 26) return
        this.$set(this.setWarningRule, 'redactData', [...this.setWarningRule.redactData, { point: 1 }])
      } else {
        const newData = this.setWarningRule.redactData.filter((item, index) => {
          return index != e
        })
        this.$set(this.setWarningRule, 'redactData', newData)
      }
    },
    // 获取公用选择数据
    getSelectData (e, key, type) {
      const obj = {
        dictType: e
      }

      if (type) {
        getDictTree(obj).then((res) => {
          console.log(res)
          this.selectData[key] = res.data
        })
      } else {
        getDict(obj).then((res) => {
          console.log(res)
          this.selectData[key] = res.data
          console.log(key)
          if (key == 'grade') {
            this.warningLevelArr = this.selectData[key].slice(1, this.selectData[key].length).map((item) => {
              const obj = {}
              obj.level = item.code
              return obj
            })
            console.log(this.warningLevelArr, '1111111111')
          }
        })
      }
    },
    // 添加预警等级
    addGrade (e) {
      if (e == -1) {
        this.$set(this.setWarningRule, 'gradeData', [
          ...this.setWarningRule.gradeData,
          { gradingRelationship: [{}, {}] }
        ])
      } else {
        const data = this.setWarningRule.gradeData.filter((item, index) => {
          return index != e
        })
        this.$set(this.setWarningRule, 'gradeData', data)
      }
    },
    // 预警规则下类型增删
    setGradingRelationship (i, e) {
      if (e == -1) {
        const newData = this.setWarningRule.gradeData
        newData[i].gradingRelationship = [...this.setWarningRule.gradeData[i].gradingRelationship, {}]
        this.$set(this.setWarningRule, 'gradeData', newData)
      } else {
        const newData = this.setWarningRule.gradeData
        newData[i].gradingRelationship = this.setWarningRule.gradeData[i].gradingRelationship.filter((item, index) => {
          return index != e
        })
        this.$set(this.setWarningRule, 'gradeData', newData)
      }
    },
    // 控制状态
    setState (key, e) {
      this[key] = !this[key]
      // 初始化弹框状态
      if (!this[key] && key == 'scoringModelState') {
        this.scoringModelData.search = ''
        this.scoringModelData.listIndex = -1
      } else if (this[key] && key == 'scoringModelState') {
        this.getScoreModelList()
      }
      if (!this.questionnaireState && key == 'questionnaireState') {
        this.questionnaire = {
          allState: false,
          indeterminate: false,
          childrenList: [],
          listIndex: -1
        }
        this.selectQuestionnaireData.search = ''
        this.selectQuestionnaireData.listIndex = -1
      } else if (this.questionnaireState && key == 'questionnaireState') {
        this.getQuestionnaireList()
      }
      // 控制页面展示与弹框同步
      if (this.questionnaireState) {
        if (this.addQuestionnaireData.length != 0) {
          this.selectQuestionnaireData.listData.filter((item, index) => {
            this.addQuestionnaireData.map((items) => {
              if (items.id == item.id) {
                this.setQuestionnaireListState('childrenList', index)
              }
            })
          })
        }
      }
      // 消息模板位置
      if (!this[key] && key == 'messageState') {
        this.warningLevel = e
        this.messageData.search = ''
        this.messageData.listIndex = -1
        this.messageData.classify = []
      } else if (this[key] && key == 'messageState') {
        console.log(e)
        this.warningLevel = e
        console.log('ok')
        this.getMessageList()
      }
    },
    // 搜索
    scoringModelSearh (key) {
      if (key == 'scoringModelData') {
        this.scoringModelData.listContentData = []
        this.scoringModelData.listIndex = -1
        this.getScoreModelList()
      } else if (key == 'messageData') {
        console.log(this.messageData)
        this.messageData.listIndex = -1
        this.messageDataContent = []
        this.getMessageList()
      } else if (key == 'selectQuestionnaireData') {
        this.selectQuestionnaireData.listIndex = -1
        this.questionnaireData = []
        this.getQuestionnaireList()
      }
    },
    // 选择列表
    setListIndex (key, e) {
      this[key].listIndex = e
      if (key == 'scoringModelData') {
        this.getModelContent(e)
      } else if (key == 'messageData') {
        this.getMessageData(e)
      } else {
        this.getQuestionnaireDetail(e)
      }
    },
    // 改变数据
    setScoringModel (e, key, index) {
      console.log(index)
      if (e == -1) {
        if (index !== undefined) {
          console.log('ok')
          this[key][index] = { level: this[key][index].level }
          console.log(this[key][index])
        } else {
          this[key] = {}
          if (key == 'selectQuestionnaireModel') {
            this.warningRuleData = []
          }
        }
        console.log(this[key])
      } else {
        this.scoringModel.title = this.scoringModelData.listData[this.scoringModelData.listIndex].title
        this.scoringModel.id = this.scoringModelData.listData[this.scoringModelData.listIndex].id
        const targertData = this.scoringModelData.listContentData[0].targetData.map((item) => {
          const obj = {}
          obj.id = item.id
          obj.name = item.name
          return obj
        })
        this.scoringModel.scoreData = this.scoringModelData.listContentData[0].scoreData
        this.scoringModel.targertData = targertData
        console.log(this.scoringModel)
        this.setState('scoringModelState')
      }
      this.$forceUpdate()
    }, // 获取树形控件数据
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
    // 获取select
    setTargetData (e) {
      console.log(this.expandedKeys)
    },
    // 展示隐藏盒子
    showBox (key, e) {
      this[key] = e
    },
    // 修复全选
    setQuestionnaireListState (key, i) {
      if (i == -1) {
        this.questionnaire[key] = !this.questionnaire[key]
        if (this.questionnaire[key]) {
          this.questionnaire.childrenList = this.selectQuestionnaireData.listData.map((item, index) => {
            return index
          })
        } else {
          this.questionnaire.childrenList = []
          this.questionnaire.indeterminate = false
        }
      } else {
        if (!this.questionnaire[key].includes(i)) {
          this.questionnaire[key] = [...this.questionnaire[key], i]
        } else {
          this.questionnaire[key] = this.questionnaire[key].filter((item) => {
            return i != item
          })
        }
        this.questionnaire.indeterminate =
          this.questionnaire[key].length > 0 &&
          this.questionnaire[key].length != this.selectQuestionnaireData.listData.length
        this.questionnaire.allState = this.questionnaire[key].length == this.selectQuestionnaireData.listData.length
      }
    },
    // 选择问卷
    getAddQuestionnaire () {
      if (this.warningScopeData.question_detect_code == '1' && this.questionnaire.childrenList.length == 0) {
        return this.$message.error('至少选择一项')
      }
      if (this.warningScopeData.question_detect_code == '1' && this.questionnaire.childrenList.length > 0) {
        console.log(this.questionnaire.childrenList)
        this.addQuestionnaireData = this.selectQuestionnaireData.listData.filter((item, index) => {
          if (this.questionnaire.childrenList.includes(index)) {
            return item
          }
        })
        console.log(this.addQuestionnaireData)
        this.setState('questionnaireState')
      } else if (this.warningScopeData.question_detect_code == '2') {
        if (this.selectQuestionnaireData.listIndex == -1) return this.$message.error('至少选择一项')
        this.selectQuestionnaireModel = this.selectQuestionnaireData.listData[this.selectQuestionnaireData.listIndex]
        this.setState('questionnaireState')
      } else {
        this.setState('questionnaireState')
      }
    },
    // 删除问卷
    delAddQuestionnaireData (i) {
      this.addQuestionnaireData = this.addQuestionnaireData.filter((item, index) => {
        return index !== i
      })
    },
    // 添加问题到规则
    setWarningRuleData (i, e, radio) {
      console.log(i, e, radio)
      if (i == -1) {
        let newData = this.questionnaireData.filter((item, index) => {
          item.number = index + 1
          return e == index
        })
        newData = newData.map((item) => {
          const obj = {}
          obj.id = item.questionId
          obj.number = item.number
          obj.type = item.questionType
          obj.answers = item.answers.map((items) => {
            const obj = {}
            obj.id = items.answerId
            obj.name = items.answerContent
            return obj
          })
          if (item.questionType == '同时录入数值') {
            obj.selectname = radio.answerContent
            obj.selectid = radio.answerId
          }
          return obj
        })
        this.warningRuleData = [...this.warningRuleData, ...newData]
        console.log(this.warningRuleData)
      } else {
        this.warningRuleData = this.warningRuleData.filter((item, index) => {
          return i != index
        })
      }
    }, // 保存
    saveModel () {
      this.isInfo = false
      this.isScope = false
      this.isTarget = false
      this.levelState = false
      const info = this.warningInfoData
      if (!info.name || !info.warn_code) {
        this.isInfo = true
      }
      const scope = this.warningScopeData
      console.log(this.warningScopeData)
      if (!scope.detect_code && scope.detect_code != '1') {
        this.isScope = true
      }
      const newLevelArr = this.warningLevelArr.map((item) => {
        const obj = {}
        obj.level = item.level
        const newLevel = this.warningLevelData.map(items => {
          return items.code
        })
        if (newLevel.includes(item.level)) {
          obj.id = item.id
          obj.name = item.title
        }

        return obj
      })
      console.log(newLevelArr)
      const obj = { ...info, ...scope, notice_code: this.notice_code, notice_model_json: newLevelArr }
      if (obj.detect_code == '1') {
        console.log(this.scoringModel)
        if (!this.scoringModel.id) return this.$message.error('未选择评分模型')
        obj.score_former_id = this.scoringModel.id
        obj.score_detect_targert_json = this.scoringModel.targertData
        obj.warn_lever_json = this.scoringModel.scoreData.map((item) => {
          const obj = {}
          if (!item.level) {
            this.levelState = true
          }
          obj.fruit = item.fruit
          obj.level = item.level
          obj.point = item.score
          return obj
        })
      } else if (obj.detect_code == '2' && obj.question_detect_code == '1') {
        console.log('ok')
        if (this.addQuestionnaireData.length == 0) return this.$message.error('未选择监控量表')
        obj.scale_detect_json = this.addQuestionnaireData.map((item) => {
          const obj = {}
          obj.id = item.id
          obj.name = item.title
          return obj
        })
        obj.warn_rule_json = this.setWarningRule.redactData.map((item, index) => {
          item.answer = String.fromCharCode(65 + index)
          console.log(item)
          if (!item.point || !item.score) {
            console.log(this.levelState)
            this.levelState = true
            console.log(this.levelState)
          }
          return item
        })
        obj.warn_lever_json = this.setWarningRule.gradeData.map((item) => {
          const obj = {}
          if (!item.level) {
            this.levelState = true
          }
          obj.level = item.level
          obj.point = item.gradingRelationship.map((items, indexs) => {
            if (indexs == 0) {
              if (!items.operate || !items.score) {
                this.levelState = true
              }
              items.relate = 'and'
            } else {
              if (!items.relate || !items.operate || !items.score) {
                this.levelState = true
              }
            }
            return items
          })
          return obj
        })
      } else if (obj.detect_code == '2' && obj.question_detect_code == '2') {
        if (!this.selectQuestionnaireModel.id) return this.$message.error('未选择问卷')
        obj.question_id = this.selectQuestionnaireModel.id
        if (this.warningRuleData.length == 0) return this.$message.error('至少添加一项规则')
        obj.warn_rule_json = this.warningRuleData.map((item, index) => {
          const obj = {}
          obj.number = item.number
          obj.id = item.id
          obj.type = item.type
          obj.operate = item.relation
          if (obj.type == '单选') {
            if (!item.select) {
              this.levelState = true
            }
            obj.score = item.select
          } else if (obj.type == '多选') {
            if (!item.checkbox) {
              this.levelState = true
            }
            obj.score = item.checkbox.join(',')
          } else if (obj.type == '日期') {
            if (!item.date) {
              this.levelState = true
              return
            }
            obj.score = item.date._d ? moment(item.date._d).format('YYYY-MM-DD') : item.date
          } else if (obj.type == '同时录入数值') {
            obj.selectid = item.selectid
            obj.selectname = item.selectname
          } else {
            if (!item.input) {
              this.levelState = true
            }
            obj.score = item.input
          }
          if (!item.relation) {
            this.levelState = true
          }
          if (index == 0) {
            obj.relate = 'and'
          } else {
            if (!item.relate) {
              this.levelState = true
            }
            obj.relate = item.relate
          }
          return obj
        })
        console.log(obj.warn_rule_json)
        if (!this.warningRule.level) return this.$message.error('请选择预警等级')
        obj.warn_lever_code = this.warningRule.level
      }
      if (this.isInfo) return this.$message.error('名称或分类未填写')
      if (this.isScope) return this.$message.error('范围或方式未选择')
      if (this.levelState) return this.$message.error('请输入正确的预警规则')
      console.log(obj)
      if (this.modelId == -1) {
        warnStrategyAdd(obj).then((res) => {
          console.log(res)
          this.$router.push('/riskEarlyWarning/warningRule')
        })
      } else {
        obj.id = this.modelId
        warnStrategyEdit(obj).then((res) => {
          console.log(res)
          this.$router.push('/riskEarlyWarning/warningRule')
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
        box-sizing: border-box;
        padding: 25px 30px;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        min-height: 300px;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid rgb(170, 170, 170);
        .input_box {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
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

          .input_select {
            width: 220px;
            height: 40px;
            margin-right: 50px;
            .select {
              width: 100%;
              height: 100%;
            }
          }
          .input_model_box {
            display: flex;
            flex-wrap: wrap;
            .input_model {
              margin-right: 20px;
              margin-bottom: 20px;
              position: relative;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              min-width: 250px;
              height: 46px;
              background: inherit;
              background-color: rgba(255, 255, 255, 1);
              box-sizing: border-box;
              border-width: 1px;
              border-style: solid;
              border-color: rgba(215, 215, 215, 1);
              border-radius: 5px;

              .icon {
                position: absolute;
                top: 0;
                right: 0;
                cursor: pointer;
                transform: translate(50%, -50%);
                .delete {
                  width: 16px;
                  height: 16px;
                }
              }
            }
          }

          .input_model {
            position: relative;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 250px;
            padding: 0 20px;
            height: 46px;
            background: inherit;
            background-color: rgba(255, 255, 255, 1);
            box-sizing: border-box;
            border-width: 1px;
            border-style: solid;
            border-color: rgba(215, 215, 215, 1);
            border-radius: 5px;

            .icon {
              position: absolute;
              top: 0;
              right: 0;
              cursor: pointer;
              transform: translate(50%, -50%);
              .delete {
                width: 16px;
                height: 16px;
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
        box-sizing: border-box;
        padding: 25px 30px;
        overflow: auto;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        min-height: 826px;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid rgb(170, 170, 170);

        .warning_rule_content {
          width: 100%;
          .warning_rule_redact_div {
            .redact_title {
              display: flex;
              align-items: center;
              width: 100%;
              height: 50px;
            }
            .redact_div {
              width: 100%;
              min-height: 407px;
              background-color: rgba(255, 255, 255, 1);
              padding: 15px;
              box-sizing: border-box;
              border-width: 1px;
              border-style: solid;
              border-color: rgba(215, 215, 215, 1);
              .redact_header {
                width: 100%;
                .title {
                  display: inline-block;
                  min-width: 70px;
                  margin-right: 30px;
                  text-align: center;
                  font-size: 16px;
                  color: #02a7f0;
                }
              }
              .redact_content {
                margin-top: 20px;
                .data {
                  width: 100%;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  margin-bottom: 15px;
                  .index {
                    text-align: center;
                    min-width: 70px;
                    font-size: 16px;
                    color: #333333;
                    margin-right: 30px;
                  }
                  .data_option {
                    min-width: 70px;
                    text-align: center;
                    font-size: 16px;
                    color: #333333;
                    margin-right: 30px;
                  }
                  .data_input {
                    min-width: 70px;
                    display: flex;
                    justify-content: center;
                    height: 30px;
                    margin-right: 30px;
                  }
                  .data_icon {
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

          .warning_grade_div {
            margin-top: 30px;
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
              .input_button {
                display: inline-block;
              }
            }
            .grade_content {
              margin: 10px 45px;
              .grade_div {
                position: relative;
                width: 425px;
                padding: 15px;
                box-sizing: border-box;
                min-height: 184px;
                background: inherit;
                background-color: rgba(255, 255, 255, 1);
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-color: rgba(215, 215, 215, 1);
                border-radius: 5px;
                margin-bottom: 20px;
                .close {
                  cursor: pointer;
                  position: absolute;
                  top: 0;
                  right: 0;
                  transform: translate(50%, -50%);
                }
                .grade_line {
                  width: 100%;
                  display: flex;
                  align-items: center;
                  margin-bottom: 25px;
                  .grade_index {
                    display: flex;
                    justify-content: space-between;
                    width: 90px;
                    font-size: 16px;
                    color: #000000;
                    .index {
                      width: 30px;
                    }
                    .title {
                      display: inline-block;
                      width: 50px;
                      text-align: center;
                    }
                  }
                  .grade_select {
                    width: 100px;
                    .select {
                      width: 100%;
                    }
                  }
                  .txt {
                    margin: 0 20px 0 20px;
                  }
                  .grade_input {
                    margin-left: 20px;
                    width: 66px;
                    .input {
                      width: 100%;
                    }
                  }
                  .grade_option {
                    margin-left: auto;
                    .grade_icon {
                      .icon {
                        cursor: pointer;
                        width: 25px;
                        height: auto;
                      }
                    }
                  }
                }

                .grade_foot {
                  width: 100%;
                  display: flex;
                  align-items: center;
                  .txt {
                    margin-right: 20px;
                  }

                  .grade_select {
                    width: 100px;
                    .select {
                      width: 100%;
                    }
                  }
                }
              }
            }
          }
        }

        .select_warning_box {
          width: 100%;
          .select_warning_title {
            font-family: 'Arial Normal', 'Arial';
            font-weight: 400;
            font-style: normal;
            font-size: 14px;
            letter-spacing: normal;
            color: #333333;
            margin-bottom: 5px;
            margin-left: 20px;
          }
          .select_warning_content {
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            background-color: #fff;
            border-radius: 10px;
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
              .redact_target_scoreRule_card {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                min-width: 530px;
                padding: 25px 20px;
                box-sizing: border-box;
                height: 620px;
                border: 1px solid #ccc;
                .target_box {
                  position: relative;
                  margin-right: 30px;
                  border-radius: 5px;
                  border: 1px solid #ccc;
                  width: 80px;
                  height: 35px;
                  line-height: 35px;
                  text-align: center;
                  font-family: 'Arial Normal', 'Arial';
                  font-weight: 400;
                  font-style: normal;
                  font-size: 13px;
                  letter-spacing: normal;
                  color: #333333;

                  .icon {
                    position: absolute;
                    top: 0;
                    right: 0;
                    cursor: pointer;
                    transform: translate(50%, -50%);
                    .delete {
                      width: 20px;
                      height: 20px;
                    }
                  }
                }
              }
            }
          }
          .warning_class_box {
            margin-top: 45px;
            width: 100%;
            .warning_class_title {
              font-family: 'Arial Normal', 'Arial';
              font-weight: 400;
              font-style: normal;
              font-size: 14px;
              letter-spacing: normal;
              color: #333333;
              margin-bottom: 5px;
              .stress {
                color: red;
                margin-right: 2px;
              }
            }
            .warning_class_content {
              width: 100%;
              display: flex;
              flex-direction: column;

              .warning_box {
                width: 100%;
                display: flex;
                align-items: center;
                margin-bottom: 30px;
                .warning_class {
                  width: 814px;
                  min-height: 79px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  .redact_list_box {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    width: 100%;
                    .redact_list {
                      display: flex;
                      align-items: center;
                      margin: 20px 0;

                      .redact_index {
                        margin-left: 20px;
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
                        width: 90px;
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
                .warning_class_txt {
                  white-space: nowrap;
                  margin: 0 10px;
                }
                .select {
                  width: 110px;
                  height: 40px;
                }
              }
            }
          }
        }
        .select_Warning_box {
          width: 100%;
          background-color: #fff;
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .select_Warning_target {
            min-width: 460px;
            overflow: auto;
            .select_Warning_target_title {
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

            .select_Warning_target_content {
              width: 460px;
              height: 710px;
              overflow: auto;
              padding: 20px 15px;
              box-sizing: border-box;
              border: 1px solid #ccc;
              .questionnaire_issue_box {
                position: relative;
                width: 100%;
                min-height: 70px;
                padding: 20px 20px 15px 0;
                border-bottom: 1px solid #ccc;
                .questionnaire_issue_header {
                  position: relative;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  font-family: 'Arial Normal', 'Arial';
                  font-weight: 400;
                  font-style: normal;
                  font-size: 16px;
                  letter-spacing: normal;
                  color: #333333;
                  .index {
                    text-align: center;
                    line-height: 25px;
                    border-radius: 50%;
                    width: 25px;
                    height: 25px;
                    font-size: 14px;
                    color: #ffffff;
                    background-color: #02a7f0;
                    margin-right: 20px;
                  }

                  .issue_class {
                    margin-left: auto;
                  }

                  .hint {
                    cursor: pointer;
                    font-family: Helvetica, Arial;
                    white-space: nowrap;
                    padding-top: 1px;
                    background-color: #fff849;
                    font-size: 10px;
                    font-weight: bold;
                    line-height: 14px;
                    margin-right: 3px;
                    padding: 0px 4px;
                    color: #000;
                    box-shadow: 1px 1px 3px #aaa;
                    position: absolute;
                    top: 0;
                    right: 0;
                    transform: translate(100%, -50%);
                  }
                  .explain_box {
                    z-index: 10;
                    position: absolute;
                    top: 15px;
                    right: 0;
                    padding: 16px 3px 10px 3px;
                    background-color: #efefef;
                    width: 300px;
                    height: 300px;
                    line-height: normal;
                    border: #8f949a solid 1px;
                    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.4);
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                    .delete {
                      position: absolute;
                      top: 0;
                      right: 5px;
                      font-size: 25px;
                      line-height: 25px;
                      color: #ccc;
                      transform: rotate(45deg);
                      cursor: pointer;
                    }
                    .title {
                      font-size: 13px;
                      font-weight: bold;
                      color: #2c2c2c;
                      margin: 15px 0px 5px 14px;
                      white-space: nowrap;
                    }
                    .content {
                      display: flex;
                      flex-direction: column;
                      padding: 2px 26px 16px 14px;
                      box-sizing: border-box;
                      font-size: 13px;
                      color: #2a2e38;
                      line-height: 1.67;
                      word-wrap: break-word;
                    }
                  }
                }

                .arrow {
                  cursor: pointer;
                  position: absolute;
                  right: 0;
                  top: 50%;
                  .txt {
                    position: absolute;
                    top: 50%;
                    left: 5px;
                    transform: translateY(-50%);
                    font-family: '微软雅黑';
                    font-weight: 400;
                    font-style: normal;
                    font-size: 12px;
                    color: #ffffff;
                  }
                }
                .questionnaire_issue_input {
                  font-family: 'Arial Normal', 'Arial';
                  font-weight: 400;
                  font-style: normal;
                  font-size: 13px;
                  letter-spacing: normal;
                  color: #333333;
                  .issue_box {
                    margin-left: 40px;
                    margin-top: 20px;
                    display: flex;
                    flex-wrap: wrap;
                    .radio {
                      margin-right: 50px;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      .radio_title {
                        width: 62px;
                        min-height: 27px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: inherit;
                        background-color: rgba(242, 242, 242, 1);
                        box-sizing: border-box;
                        border-width: 1px;
                        border-style: solid;
                        border-color: rgba(215, 215, 215, 1);
                        border-radius: 5px;
                        font-size: 14px;
                      }
                      .skip {
                        margin-top: 20px;
                        color: red;
                      }
                    }
                  }

                  .issue_input {
                    margin-left: 40px;
                    margin-top: 20px;
                    width: 313px;
                    display: flex;
                    flex-direction: column;
                    .skip {
                      margin-top: 20px;
                      color: red;
                    }
                  }

                  .issue_radio {
                    margin-left: 40px;
                    margin-top: 20px;
                    display: flex;
                    flex-wrap: wrap;
                    .radio {
                      margin-right: 50px;
                      margin-bottom: 20px;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      .radio_title {
                        padding: 0 10px;
                        min-width: 62px;
                        height: 27px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: inherit;
                        background-color: rgba(242, 242, 242, 1);
                        box-sizing: border-box;
                        border-width: 1px;
                        border-style: solid;
                        border-color: rgba(215, 215, 215, 1);
                        border-radius: 5px;
                        font-size: 14px;
                      }
                      .skip {
                        margin-top: 20px;
                        color: red;
                      }
                    }
                  }

                  .issue_date {
                    margin-left: 40px;
                    margin-top: 20px;
                    .skip {
                      margin-top: 20px;
                      color: red;
                    }
                  }

                  .issue_upload {
                    margin-left: 40px;
                    margin-top: 20px;

                    .skip {
                      margin-top: 20px;
                      color: red;
                    }
                  }
                  .issue_checkbox {
                    margin-left: 40px;
                    margin-top: 20px;
                    display: flex;
                    flex-wrap: wrap;
                    .radio {
                      margin-right: 50px;
                      margin-bottom: 20px;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      .radio_title {
                        padding: 0 10px;
                        min-width: 62px;
                        height: 27px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: inherit;
                        background-color: rgba(242, 242, 242, 1);
                        box-sizing: border-box;
                        border-width: 1px;
                        border-style: solid;
                        border-color: rgba(215, 215, 215, 1);
                        border-radius: 5px;
                        font-size: 14px;
                      }
                      .skip {
                        margin-top: 20px;
                        color: red;
                      }
                    }
                  }

                  .issue_enteringData {
                    margin-left: 40px;
                    margin-top: 20px;
                    display: flex;
                    flex-wrap: wrap;
                    .radio {
                      margin-right: 50px;
                      display: flex;
                      flex-direction: column;
                      margin-bottom: 25px;
                      .radio_title {
                        display: flex;
                        align-items: center;
                        .txt {
                          width: 62px;
                          min-height: 27px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          background: inherit;
                          background-color: rgba(242, 242, 242, 1);
                          box-sizing: border-box;
                          border-width: 1px;
                          border-style: solid;
                          border-color: rgba(215, 215, 215, 1);
                          border-radius: 5px;
                          font-size: 14px;
                        }

                        .input {
                          margin-left: 60px;
                          width: 150px;
                        }
                        .arrowtxt {
                          cursor: pointer;
                          margin-left: 58px;
                          position: relative;
                          .addtxt {
                            position: absolute;
                            top: 50%;
                            left: 5px;
                            transform: translateY(-50%);
                            font-family: '微软雅黑';
                            font-weight: 400;
                            font-style: normal;
                            font-size: 12px;
                            color: #ffffff;
                          }
                        }
                      }
                      .skip {
                        margin-top: 20px;
                        color: red;
                      }
                    }
                  }

                  .issue_Tooltip {
                    margin-left: 40px;
                    margin-top: 20px;

                    .skip {
                      margin-top: 20px;
                      color: red;
                    }
                  }
                }
              }
            }
          }
          .connect {
            display: flex;
            margin: 0 25px;
          }
          .redact_Warning_target {
            flex-grow: 1;
            .redact_Warning_target_title {
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
            .redact_Warning_target_content {
              width: 100%;
              height: 710px;
              overflow: auto;
              padding: 20px 15px;
              box-sizing: border-box;
              border: 1px solid #ccc;
              .redact_Warning_target_list {
                width: 100%;
                display: flex;
                align-items: center;
                margin-bottom: 35px;
                .index {
                  margin: 0 10px;
                }
                .txt {
                  margin-right: 15px;
                  font-family: 'Arial Normal', 'Arial';
                  font-weight: 400;
                  font-style: normal;
                  font-size: 16px;
                  letter-spacing: normal;
                  color: #333333;
                  .stress {
                    color: #02a7f0;
                  }
                }
                .andOrAlso {
                  width: 90px;
                  .select {
                    width: 100%;
                  }
                }

                .relation {
                  margin-right: 20px;
                  width: 100px;
                  .select {
                    width: 100%;
                  }
                }
                .targetPrice {
                  margin-right: 20px;
                  width: 140px;
                  .input {
                    width: 100%;
                  }
                }
              }
            }
          }
          .grade_foot {
            padding: 20px;
            box-sizing: border-box;
            height: 160px;
            width: 100%;
            .grade_select {
              margin-left: 10px;
              .select {
                width: 110px;
                height: 40px;
              }
            }
          }
        }

        .stateless {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .notify_box {
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
      .notify_card {
        box-sizing: border-box;
        padding: 25px 30px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        width: 100%;
        min-height: 338px;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid rgb(170, 170, 170);
        .notify_object_div {
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

        .notify_content_div {
          .title {
            width: 100%;
            height: 80px;
            display: flex;
            align-items: center;
          }
          .content {
            .index {
              margin-right: 5px;
            }
            .line {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
              .input_model {
                cursor: pointer;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 250px;
                height: 46px;
                background: inherit;
                background-color: rgba(255, 255, 255, 1);
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-color: rgba(215, 215, 215, 1);
                border-radius: 5px;
                .icon {
                  position: absolute;
                  top: 0;
                  right: 0;
                  cursor: pointer;
                  transform: translate(50%, -50%);
                  .delete {
                    width: 16px;
                    height: 16px;
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

::v-deep(.scoringModel_box) {
  display: flex;
  .scoringModel_left {
    width: 364px;
    flex-shrink: 0;
    .scoringModel_header_left {
      width: 100%;
      margin-bottom: 20px;
      box-sizing: border-box;
      padding-left: 15px;
      border-left: 3px solid #02a7f0;
      font-family: 微软雅黑;
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
    }
    .scoringModel_content_left {
      width: 100%;
      height: 615px;
      box-sizing: border-box;
      padding-left: 3px;
      overflow: auto;
      .scoringModel_search_box {
        display: flex;
        align-items: center;
        width: 100%;
        height: 45px;
        .checkbox {
          margin-right: 10px;
        }

        .scoringModel_search {
          width: 100%;
          height: 100%;
          input {
            height: 100%;
          }
        }
      }

      .scoringModel_list_checkbox {
        display: flex;

        .list_checkbox {
          width: 26px;
        }
      }

      .scoringModel_list_box {
        margin-top: 20px;
        width: 100%;
        min-height: 550px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        .scoringModel_list {
          position: relative;
          cursor: pointer;
          width: 100%;
          padding: 0 30px;
          box-sizing: border-box;
          font-size: 14px;
          color: #7f7f7f;
          background-color: #fff;
          min-height: 40px;
          display: flex;
          align-items: center;
          border-radius: 2px;
          border-bottom-right-radius: 0px;
          border-bottom-left-radius: 0px;
          border-bottom: 1px solid rgba(170, 170, 170, 1);
          &:hover {
            background-color: #1890ff;
            color: #fff;
          }

          .checkbox_div {
            position: absolute;
            top: 50%;
            left: -25px;
            transform: translateY(-50%);
          }

          .identification_platform {
            position: absolute;
            top: 0;
            left: 0;
            width: 20px;
            line-height: 20px;
            height: 100%;
            color: #fff;
            white-space: pre-wrap;
            text-align: center;
            background-color: #ec808d;
          }

          .identification_enterprise {
            position: absolute;
            top: 0;
            left: 0;
            writing-mode: vertical-lr;
            width: 20px;
            line-height: 20px;
            white-space: pre-wrap;
            text-align: center;
            height: 100%;
            color: #fff;
            background-color: #1890ff;
          }
        }
      }
    }
  }
  .scoringModel_right {
    margin-left: 50px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .scoringModel_header_right {
      width: 100%;
      margin-bottom: 20px;
      box-sizing: border-box;
      padding-left: 15px;
      border-left: 3px solid #02a7f0;
      font-family: 微软雅黑;
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
    }
    .scoringModel_content_right {
      flex-grow: 1;
      width: 100%;
      padding-bottom: 10px;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 5px;
      overflow: auto;
      border: 1px solid #ccc;
      height: 615px;
      .stateless {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .scoringModel_listData_box {
        width: 100%;
        min-height: 100%;
        overflow: auto;
        .scoringModel_listData {
          width: 100%;
          .modelDescribe_box {
            display: flex;
            padding: 20px 10px;
            min-height: 70px;
            box-sizing: border-box;
            .modelDescribe_title {
              white-space: nowrap;
            }
          }
          .modelGrade_rule_box {
            width: 100%;
            .modelGrade_rule_title {
              width: 100%;
              padding-left: 10px;
              box-sizing: border-box;
              border-bottom: 1px solid #ccc;
              font-family: 'Arial Normal', 'Arial';
              font-weight: 400;
              font-style: normal;
              font-size: 14px;
              letter-spacing: normal;
              color: #333333;
            }
            .modelGrade_rule_content {
              width: 100%;
              .modelGrade_rule_header {
                display: flex;
                flex-wrap: nowrap;
                margin-bottom: 10px;
                font-size: 16px;
                font-family: 'Arial Normal', 'Arial';
                font-weight: 400;
                font-style: normal;
                color: #333333;
                .redact_header {
                  margin-left: 20px;
                  display: inline-block;
                  width: 80px;
                  height: 50px;
                  line-height: 50px;
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

              .modelGrade_rule {
                width: 100%;
                padding-left: 35px;
                box-sizing: border-box;
                display: flex;

                .score_box {
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                  min-height: 260px;
                  .score {
                    display: flex;
                    flex-direction: column;
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
                          width: 90px;
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
          .modelGrade_result_box {
            width: calc(100% - 20px);
            padding: 5px 10px;
            box-sizing: border-box;
            margin: 0 10px;
            border: 1px solid #ccc;
            .modelGrade_result_title {
              width: 100%;
              font-family: 'Arial Normal', 'Arial';
              font-weight: 400;
              font-style: normal;
              font-size: 14px;
              letter-spacing: normal;
              color: #333333;
              margin-bottom: 10px;
            }
            .modelGrade_result_content {
              .redact_content {
                width: 100%;
                .redact_div {
                  position: relative;
                  display: flex;
                  flex-direction: column;
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
                          width: 90px;
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
    .questionnaire_info_box {
      flex-grow: 1;
      width: 100%;
      padding: 15px 20px;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 5px;
      overflow: auto;
      border: 1px solid #ccc;
      height: 615px;
      .questionnaire_issue_box {
        width: 100%;
        min-height: 70px;
        padding: 20px 20px 15px 0;
        border-bottom: 1px solid #ccc;
        .questionnaire_issue_header {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          font-family: 'Arial Normal', 'Arial';
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          letter-spacing: normal;
          color: #333333;
          .index {
            text-align: center;
            line-height: 25px;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            font-size: 14px;
            color: #ffffff;
            background-color: #02a7f0;
            margin-right: 20px;
          }

          .issue_class {
            margin-left: auto;
          }

          .hint {
            cursor: pointer;
            font-family: Helvetica, Arial;
            white-space: nowrap;
            padding-top: 1px;
            background-color: #fff849;
            font-size: 10px;
            font-weight: bold;
            line-height: 14px;
            margin-right: 3px;
            padding: 0px 4px;
            color: #000;
            box-shadow: 1px 1px 3px #aaa;
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(100%, -50%);
          }
          .explain_box {
            z-index: 10;
            position: absolute;
            top: 15px;
            right: 0;
            padding: 16px 3px 10px 3px;
            background-color: #efefef;
            width: 300px;
            height: 300px;
            line-height: normal;
            border: #8f949a solid 1px;
            box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            .delete {
              position: absolute;
              top: 0;
              right: 5px;
              font-size: 25px;
              line-height: 25px;
              color: #ccc;
              transform: rotate(45deg);
              cursor: pointer;
            }
            .title {
              font-size: 13px;
              font-weight: bold;
              color: #2c2c2c;
              margin: 15px 0px 5px 14px;
              white-space: nowrap;
            }
            .content {
              display: flex;
              flex-direction: column;
              padding: 2px 26px 16px 14px;
              box-sizing: border-box;
              font-size: 13px;
              color: #2a2e38;
              line-height: 1.67;
              word-wrap: break-word;
            }
          }
        }
        .questionnaire_issue_input {
          font-family: 'Arial Normal', 'Arial';
          font-weight: 400;
          font-style: normal;
          font-size: 13px;
          letter-spacing: normal;
          color: #333333;
          .issue_box {
            margin-left: 40px;
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            .radio {
              margin-right: 50px;
              display: flex;
              flex-direction: column;
              align-items: center;
              .radio_title {
                margin-bottom: 10px;
                padding: 0 10px;
                min-width: 62px;
                min-height: 27px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: inherit;
                background-color: rgba(242, 242, 242, 1);
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-color: rgba(215, 215, 215, 1);
                border-radius: 5px;
                font-size: 14px;
              }
              .skip {
                margin-top: 20px;
                color: red;
              }
            }
          }

          .issue_input {
            margin-left: 40px;
            margin-top: 20px;
            width: 313px;
            display: flex;
            flex-direction: column;
            .skip {
              margin-top: 20px;
              color: red;
            }
          }

          .issue_radio {
            margin-left: 40px;
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            .radio {
              margin-right: 50px;
              display: flex;
              flex-direction: column;
              align-items: center;
              .radio_title {
                margin-bottom: 10px;
                padding: 0 10px;
                min-width: 62px;
                min-height: 27px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: inherit;
                background-color: rgba(242, 242, 242, 1);
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-color: rgba(215, 215, 215, 1);
                border-radius: 5px;
                font-size: 14px;
              }
              .skip {
                margin-top: 20px;
                color: red;
              }
            }
          }

          .issue_date {
            margin-left: 40px;
            margin-top: 20px;
            .skip {
              margin-top: 20px;
              color: red;
            }
          }

          .issue_upload {
            margin-left: 40px;
            margin-top: 20px;

            .skip {
              margin-top: 20px;
              color: red;
            }
          }
          .issue_checkbox {
            margin-left: 40px;
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            .radio {
              margin-right: 50px;
              display: flex;
              flex-direction: column;
              align-items: center;
              .radio_title {
                margin-bottom: 10px;
                padding: 0 10px;
                min-width: 62px;
                min-height: 27px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: inherit;
                background-color: rgba(242, 242, 242, 1);
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-color: rgba(215, 215, 215, 1);
                border-radius: 5px;
                font-size: 14px;
              }
              .skip {
                margin-top: 20px;
                color: red;
              }
            }
          }

          .issue_enteringData {
            margin-left: 40px;
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            .radio {
              margin-right: 50px;
              display: flex;
              flex-direction: column;
              margin-bottom: 25px;
              .radio_title {
                display: flex;
                align-items: center;
                .txt {
                  width: 62px;
                  min-height: 27px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: inherit;
                  background-color: rgba(242, 242, 242, 1);
                  box-sizing: border-box;
                  border-width: 1px;
                  border-style: solid;
                  border-color: rgba(215, 215, 215, 1);
                  border-radius: 5px;
                  font-size: 14px;
                }

                .input {
                  margin-left: 60px;
                }
              }

              .skip {
                margin-top: 20px;
                color: red;
              }
            }
          }

          .issue_Tooltip {
            margin-left: 40px;
            margin-top: 20px;

            .skip {
              margin-top: 20px;
              color: red;
            }
          }
        }
      }

      .stateless {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .meeageModel_info_box {
      flex-grow: 1;
      width: 100%;
      padding: 15px 20px;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 5px;
      overflow: auto;
      border: 1px solid #ccc;
      height: 615px;
      .meeageModel_noticeCrowd {
        display: flex;
        align-items: center;
      }
      .meeageModel_channel {
        display: flex;
        align-items: center;
      }
      .meeageModel_phone {
        margin-top: 20px;
        .msgPreviewBox {
          height: 450px;
          width: 250px;
          border: 3px solid rgba(0, 0, 0, 0.2);
          border-radius: 20px;
          align-self: flex-end;
          margin-left: 80px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          .arrow {
            position: absolute;
            top: 50%;
            transform: translate(0, -50%);
            right: -50px;
            height: 40px;
            cursor: pointer;
          }
          .left {
            right: 0;
            left: -50px;
            transform: rotate(-180deg);
            transform-origin: center;
            top: 45%;
          }
          .bar {
            width: 80px;
            height: 8px;
            border-radius: 10px;
            background-color: rgba(0, 0, 0, 0.2);
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);
            top: 15px;
          }
          .bottom {
            top: auto;
            bottom: 15px;
          }
          .contentBox {
            width: 230px;
            height: 366px;
            padding: 10px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            .officialAccount {
              width: 100%;
              height: 220px;
              border-radius: 5px;
              border: 1px solid rgba(0, 0, 0, 0.2);
              .til {
                padding: 5px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
              .content {
                padding: 3px 5px;
                margin-top: 5px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 8;
                overflow: hidden;
              }
            }
            .wechatPlus {
              display: flex;
              align-items: flex-start;
              margin-top: 20px;
              .user {
                width: 25px;
                height: 25px;
                border: 1px solid rgba(0, 0, 0, 0.2);
              }
              .content {
                flex: 1;
                border: 1px solid rgba(0, 0, 0, 0.2);
                margin-left: 5px;
                border-radius: 5px;
                padding: 5px 8px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 12;
                overflow: hidden;
              }
            }
            .shortMsg {
              .content {
                background-color: rgba(0, 0, 0, 0.05);
                border-radius: 10px;
                padding: 4px 6px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 8;
                overflow: hidden;
                margin-top: 10px;
                min-height: 50px;
              }
            }
            .email {
              .til {
                margin-left: 10px;
              }
              .user {
                padding: 8px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                .icon {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 2px solid rgba(0, 0, 0, 0.5);
                  margin-right: 5px;
                }
              }
              .content {
                padding: 4px 5px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 12;
                overflow: hidden;
              }
            }
          }
        }
      }
      .stateless {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

::v-deep(.ant-modal-footer) {
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    width: 300px;
    display: flex;
    justify-content: space-between;
    flex-flow: row-reverse !important;
    button {
      width: 127px;
      height: 44px;
    }
  }
}

::v-deep(#auctionTimesCode) {
  .ant-select-search__field {
    pointer-events: none;
  }
}
</style>
