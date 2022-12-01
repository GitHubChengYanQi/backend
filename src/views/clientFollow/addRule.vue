<template>
  <div class="add_rule">
    <!-- 返回蒙层 -->
    <div
      class="return_cover"
      @click="returnPage"
    ></div>
    <!-- 内容 -->
    <a-card>
      <div
        class="add_rule_box"
        v-if="table == 0"
      >
        <div class="title">创建自动打标签规则</div>
        <div class="content">
          <div class="rule_box">
            <div class="rule">
              <span class="rule_title"> 打标签方式： </span>
              <span class="label"> 关键词打标签 </span>
            </div>
            <div class="hint">根据客户聊天行为，设定客户在聊天过程中提到的关键词，自动将提到关键词的客户打标签</div>
          </div>
          <div class="input_box">
            <div class="input">
              <span class="input_title"><span class="necessary">*</span> 规则名称： </span>
              <a-input
                style="width: 400px; height: 36px"
                placeholder="请填写规则名称，仅内部可见"
                v-model="input"
              ></a-input>
            </div>
          </div>
          <div class="selectMembers_box">
            <div class="selectMembers">
              <span class="selectMembers_title"><span class="necessary">*</span> 生效员工： </span>
              <selectPersonnel
                type="button"
                name="选择成员"
                v-model="mumbersArr"
                @getVal="changeAssigneeIds"
              />
            </div>
            <div class="hint">仅针对开通了消息存档的员工生效</div>
          </div>
        </div>
        <div
          class="title"
          style="margin-top:50px;"
        >设置关键词</div>
        <div class="content">
          <span class="matching_box">
            <span class="matching_title">
              <span class="necessary">*</span>
              模糊匹配<a-tooltip
                placement="top"
                title="客户与员工聊天中对话内容只要包含某个关键词，客户就会被自动打上标签"
                :getPopupContainer="getPopupContainer"
              >
                <i class="svg_six">
                  <svg-icon :state="6" />
                </i>
              </a-tooltip>：
            </span>
            <span
              class="add_keyword"
              @click="hideModal('dim')"
            ><span class="icon">+</span>添加关键词</span>
            <span class="keyword_box">
              <span
                class="keyword"
                v-for="(item, index) in keyword.dim"
                :key="index"
              >
                {{ item.keysInfo }}
                <i
                  class="svg_three"
                  @click="deleteKeyword('dim', index)"
                >
                  <svg-icon :state="2" />
                </i>
              </span>
            </span>
          </span>
          <span class="matching_box">
            <span class="matching_title">
              <span class="necessary">*</span>
              精准匹配<a-tooltip
                placement="top"
                title="客户与员工聊天中对话内容只要提到某个关键词，客户就会被自动打上标签"
                :getPopupContainer="getPopupContainer"
              >
                <i class="svg_six">
                  <svg-icon :state="6" />
                </i>
              </a-tooltip>：
            </span>
            <span
              class="add_keyword"
              @click="hideModal('accurate')"
            ><span class="icon">+</span>添加关键词</span>
            <span class="keyword_box">
              <span
                class="keyword"
                v-for="(item, index) in keyword.accurate"
                :key="index"
              >
                {{ item.keysInfo }}
                <i
                  class="svg_three"
                  @click="deleteKeyword('accurate', index)"
                >
                  <svg-icon :state="2" />
                </i>
              </span>
            </span>
          </span>
        </div>
        <div
          class="title"
          style="margin-top:50px;"
        >
          自动打标签
          <span class="hint">触发关键词次数为触发模糊匹配和精准匹配关键词总和</span>
        </div>
        <div class="content">
          <div class="add_keyword_operation_box">
            <div
              class="keyword_operation_box"
              v-for="(item, index) in keywordRule"
              :style="{border:index + 1 == keywordRule.length ? '' :'none'}"
              :key="index"
            >
              <div class="operation_box">
                <span class="operation_title">{{ '规则' + (index + 1) + '：' }}</span>
                <span class="operation_content">
                  客户每<span class="operation">
                    <a-select
                      v-model="keywordRule[index].date"
                      label-in-value
                      style="width: 51px"
                    >
                      <a-select-option
                        v-for="( items , indexs ) in dateArr"
                        :value="items.value"
                        :key="indexs"
                      >
                        {{ items.label }}
                      </a-select-option>
                    </a-select>
                  </span>
                  触发关键词 <span class="operation">
                    <a-input-number
                      v-model="keywordRule[index].labelRuleCount"
                      :min="1"
                      :max="10"
                      style="width:52px"
                    />
                  </span>
                  次自动打上
                  <span class="operation">
                    <span
                      class="label_input"
                      @click="showBox(index)"
                    >
                      <span v-if="keywordRule[index].label.length == 0">请选择标签</span>
                      <span
                        class="label_input_title"
                        v-for="(items,indexs) in keywordRule[index].label"
                        :key="indexs"
                      >
                        {{ items.name }}
                        <span
                          class="delete"
                          @click.stop="setInputArr(items.id,index, indexs)"
                        >+</span>
                      </span>
                    </span>
                  </span>
                  标签<i
                    class="delete_svg"
                    v-if="keywordRule.length > 1"
                    @click="setOperationArr(-1, index)"
                  >
                    <svg-icon :state="7" />
                  </i>
                </span>
              </div>
            </div>
            <div class="add_task">
              <span
                class="btn"
                :style="{color:keywordRule.length == 10 ? '#ccc':''}"
                @click="setOperationArr()"
              >
                <i
                  class="add_svg"
                  :style="{borderColor:keywordRule.length == 10 ? '#ccc':''}"
                >
                  <svg-icon :state="8" />
                </i>
                添加规则
              </span>
              <span class="hint">（添加的多条规则可同时生效，最多设置10个规则）</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="add_rule_box"
        v-if="table == 1"
      >
        <div class="title">规则基础信息</div>
        <div class="content">
          <div class="reminder">
            设定规则，当用户加入规则内的群聊，自动给入群客户打标签
          </div>
          <div class="input_box">
            <div class="input">
              <span class="input_title"><span class="necessary">*</span> 规则名称： </span>
              <a-input
                style="width: 400px; height: 36px"
                placeholder="请填写规则名称，仅内部可见"
                v-model="input"
              ></a-input>
            </div>
          </div>
        </div>
        <div
          class="title"
          style="margin-top:50px;"
        >
          设置打标签规则
        </div>
        <div class="content">
          <div class="add_keyword_operation_box">
            <div
              class="keyword_operation_box"
              v-for="(item, index) in groupRule"
              :style="{border:index + 1 == groupRule.length ? '' :'none'}"
              :key="index"
            >
              <div class="operation_box">
                <span class="operation_title">{{ '规则' + (index + 1) + '：' }}</span>
                <span class="operation_content">
                  用户加入群聊
                  <span class="operation">
                    <span
                      class="label_input"
                      @click="showGroup(index)"
                    >
                      <span v-if="groupRule[index].group.length == 0">请选择群聊</span>
                      <span
                        class="label_input_title"
                        v-for="(items,indexs) in groupRule[index].group"
                        :key="indexs"
                      >
                        {{ items.roomName }}
                      </span>
                    </span>
                  </span>
                  时，可打上标签
                  <span class="operation">
                    <span
                      class="label_input"
                      @click="showBox(index)"
                    >
                      <span v-if="groupRule[index].label.length == 0">请选择标签</span>
                      <span
                        class="label_input_title"
                        v-for="(items,indexs) in groupRule[index].label"
                        :key="indexs"
                      >
                        {{ items.name }}
                        <span
                          class="delete"
                          @click.stop="setInputArr(items.id,index, indexs)"
                        >+</span>
                      </span>
                    </span>
                  </span>
                  <!-- 并添加评分
                  <span class="operation">
                    <a-switch v-model="groupRule[index].score" />
                  </span>
                  <span
                    class="operation"
                    v-if="groupRule[index].score">
                    <a-input-number
                      v-model="groupRule[index].labelRuleCount"
                      :min="1"
                      :max="10"
                      style="width:52px" />
                    &nbsp;分
                  </span> -->
                  <i
                    class="delete_svg"
                    v-if="groupRule.length > 1"
                    @click="setOperationArr(-1, index)"
                  >
                    <svg-icon :state="7" />
                  </i>
                </span>
              </div>
            </div>
            <div class="add_task">
              <span
                class="btn"
                :style="{color:groupRule.length == 10 ? '#ccc':''}"
                @click="setOperationArr()"
              >
                <i
                  class="add_svg"
                  :style="{borderColor:groupRule.length == 10 ? '#ccc':''}"
                >
                  <svg-icon :state="8" />
                </i>
                添加规则
              </span>
              <span class="hint">（添加的多条规则可同时生效，最多设置10个规则）</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="add_rule_box"
        v-if="table == 2"
      >
        <div class="title">规则基础信息</div>
        <div class="content">
          <div class="reminder">
            根据规则，当客户在设定时间段内成为企业微信客户，将自动被打上标签
          </div>
          <div class="input_box">
            <div class="input">
              <span class="input_title"><span class="necessary">*</span> 规则名称： </span>
              <a-input
                style="width: 400px; height: 36px"
                placeholder="请填写规则名称，仅内部可见"
                v-model="input"
              ></a-input>
            </div>
          </div>
          <div class="selectMembers_box">
            <div class="selectMembers">
              <span class="selectMembers_title"><span class="necessary">*</span> 生效员工： </span>
              <selectPersonnel
                type="button"
                name="选择成员"
                v-model="mumbersArr"
                @getVal="changeAssigneeIds"
              />
            </div>
            <div class="hint">仅针对开通了消息存档的员工生效</div>
          </div>
        </div>
        <div
          class="title"
          style="margin-top:50px;"
        >
          设置打标签规则
        </div>
        <div class="content">
          <div class="add_keyword_operation_box">
            <div
              class="keyword_operation_box"
              v-for="(item, index) in timeRule"
              :style="{border:index + 1 == timeRule.length ? '' :'none'}"
              :key="index"
            >
              <div class="operation_box">
                <span class="operation_title">{{ '规则' + (index + 1) + '：' }}</span>
                <span class="operation_content">
                  为每
                  <span class="operation">
                    <a-select
                      v-model="timeRule[index].date"
                      style="width: 51px"
                    >
                      <a-select-option
                        v-for="( items , indexs ) in dateArr"
                        :value="items.value"
                        :key="indexs"
                      >
                        {{ items.label }}
                      </a-select-option>
                    </a-select>
                  </span>
                  <span
                    class="operation"
                    v-if="timeRule[index].date == 'week'"
                  >
                    <a-select
                      v-model="timeRule[index].week"
                      mode="multiple"
                      style="width: 500px"
                      :maxTagCount="1"
                      placeholder="请选择日期"
                    >
                      <a-select-option
                        v-for="( items , indexs ) in weekArr"
                        :value="items.value"
                        :key="indexs"
                      >
                        {{ items.label }}
                      </a-select-option>
                    </a-select>
                  </span>
                  <span
                    class="operation"
                    v-if="timeRule[index].date == 'month'"
                  >
                    <a-select
                      v-model="timeRule[index].month"
                      mode="multiple"
                      style="width: 300px"
                      placeholder="请选择日期"
                      :maxTagCount="1"
                    >
                      <a-select-option
                        v-for="( items , indexs ) in dayArr"
                        :value="items.value"
                        :key="indexs"
                      >
                        {{ items.label }}
                      </a-select-option>
                    </a-select>
                  </span>
                  <span class="operation">
                    <a-time-picker
                      v-model="item.startTime"
                      placeholder="开始时间"
                    />
                  </span>
                  <span class="operation">
                    <a-time-picker
                      v-model="item.endTime"
                      placeholder="结束时间"
                    />
                  </span>
                  添加的用户打上
                  <span class="operation">
                    <span
                      class="label_input"
                      @click="showBox(index)"
                    >
                      <span v-if="timeRule[index].label.length == 0">请选择标签</span>
                      <span
                        class="label_input_title"
                        v-for="(items,indexs) in timeRule[index].label"
                        :key="indexs"
                      >
                        {{ items.name }}
                        <span
                          class="delete"
                          @click.stop="setInputArr(items.id,index, indexs)"
                        >+</span>
                      </span>
                    </span>
                  </span>
                  的标签
                  <i
                    class="delete_svg"
                    v-if="timeRule.length > 1"
                    @click="setOperationArr(-1, index)"
                  >
                    <svg-icon :state="7" />
                  </i>
                </span>
              </div>
            </div>
            <div class="add_task">
              <span
                class="btn"
                :style="{color:timeRule.length == 5 ? '#ccc':''}"
                @click="setOperationArr()"
              >
                <i
                  class="add_svg"
                  :style="{borderColor:timeRule.length == 5 ? '#ccc':''}"
                >
                  <svg-icon :state="8" />
                </i>
                添加规则
              </span>
              <span class="hint">（添加的多条规则可同时生效，最多设置10个规则）</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="add_rule_box"
        v-if="table == 3"
      >
        <div class="title">{{ tableId.length == 0 ?'新建':'编辑' }}数值打标签</div>
        <div class="content">
          <div class="input_box">
            <div class="input">
              <span class="input_title"><span class="necessary">*</span> 规则名称： </span>
              <a-input
                style="width: 400px; height: 36px"
                placeholder="请填写规则名称，仅内部可见"
                v-model="input"
              ></a-input>
            </div>
          </div>
          <div class="selectLable_box">
            <span class="selectLable_title"><span class="necessary">*</span> 选择标签： </span>
            <span
              class="label_input"
              @click="showBox()"
            >
              <span v-if="dateRule.length == 0">请选择标签</span>
              <span
                class="label_input_title"
                v-for="(item,index) in dateRule"
                :key="index"
              >
                {{ item.name }}
                <span
                  class="delete"
                  @click.stop="setInputArr(item.id,0, index)"
                >+</span>
              </span>
              <span
                v-if="dateRule.length >0"
                class="empty"
                @click.stop="empty"
              >+</span>
            </span>
          </div>
          <div class="installRule_box">
            <span class="installRule_title"><span class="necessary">*</span> 设置打标签规则： </span>
            <span class="installRule_content">
              <span
                class="installRule"
                v-for="(item,index) in ruleDate"
                :key="index"
              >
                <span
                  class="is_cascader"
                  @click="setCascader(index)"
                >
                  <span
                    class="is_placeholder"
                    v-if="item.txt.length == 0"
                  >请选择类型</span>
                  <span
                    class="is_txt"
                    v-else
                  >{{ item.txt }}</span>
                  <i class="is_icon">
                    <svg-icon
                      :state="11"
                      :rotate="cascaderstate == index"
                    />
                  </i>
                  <div
                    class="is_selectBox"
                    v-if="cascaderstate == index"
                  >
                    <div
                      class="is_select_listBox"
                      v-for="(cascaderItem,cascaderIndex) in item.cascaderData"
                      :key="cascaderIndex"
                    >
                      <div
                        @click.stop="setCascaderSelect(selectItem,cascaderIndex,index,selectItem.isChildern)"
                        v-for="(selectItem ,selectIndex) in cascaderItem"
                        :class="item.cascaderSelect[cascaderIndex] == selectItem.id ? 'is_select is_active' : 'is_select'"
                        :key="selectIndex"
                      >
                        {{ selectItem.name }}
                        <i
                          class="is_select_icon"
                          v-if="selectItem.isChildern"
                        >
                          <svg-icon :state="12" />
                        </i>
                      </div>
                    </div>
                  </div>
                </span>
                <a-select
                  v-model="ruleDate[index].select"
                  placeholder="请选择"
                  style="width: 100px; height:36px;margin-left:20px;"
                >
                  <a-select-option
                    v-for="( items , indexs ) in relation"
                    :value="items.value"
                    :key="indexs"
                  >
                    {{ items.label }}
                  </a-select-option>
                </a-select>
                <!-- 日期 -->
                <a-date-picker
                  v-if="item.type == 'date'"
                  format="YYYY/MM/DD"
                  :showToday="false"
                  v-model="ruleDate[index].date"
                  placeholder="请输入"
                  style="width: 120px; height:36px;margin-left:20px;margin-bottom: 20px;"
                />
                <!-- 多选 -->
                <a-select
                  v-if="item.type == 'checkbox'"
                  mode="tags"
                  id="auctionTimesCode"
                  v-model="ruleDate[index].checkbox"
                  :maxTagCount="1"
                  placeholder="请输入"
                  style="min-width: 120px; min-height:36px;margin-left:20px;margin-bottom: 20px; cursor:pointer;"
                >
                  <a-select-option
                    v-for="( items , indexs ) in ruleDate[index].selectData"
                    :value="items.value"
                    :key="indexs"
                  >
                    {{ items.label }}
                  </a-select-option>
                </a-select>
                <!-- 单选 -->
                <a-select
                  v-if="item.type == 'radio' || item.type == 'select'"
                  v-model="ruleDate[index].radio"
                  placeholder="请输入"
                  style="min-width: 120px; min-height:36px;margin-left:20px;margin-bottom: 20px;"
                >
                  <a-select-option
                    v-for="( items , indexs ) in ruleDate[index].selectData"
                    :value="items.value"
                    :key="indexs"
                  >
                    {{ items.label }}
                  </a-select-option>
                </a-select>
                <!-- 输入框 -->
                <a-input
                  v-if="item.type == 'input' || item.type == 'text' || item.type == 'bm' || item.type == 'range' || item.type == 'rangeDouble'"
                  v-model="ruleDate[index].input"
                  placeholder="请输入"
                  style="width: 80px; height:36px;margin-left:20px;margin-bottom: 20px;"
                />
                <a-button
                  :type="index > 0 ? '' : 'primary'"
                  style="margin-left:10px;"
                  @click="addRuleDate(index.toString())"
                >{{ index > 0 ? '删除':'增加' }}</a-button>
              </span>
              <div
                class="relation_box"
                v-if="ruleDate.length > 1"
              >
                <div
                  class="relation_select also"
                  v-for="(relationItem ,relationIndex) in relationData "
                  :key="relationIndex"
                  :style="{background: relationState == relationItem.value ? '#1890ff': '',top: `calc( 50% - ${20 * (1 - relationIndex)}px)` }"
                  @click="setRelation(relationItem.value)"
                >{{ relationItem.label }}</div>
              </div>
            </span>
          </div>
          <div class="hint">
            <span
              style="white-space: break-spaces;"
              v-if="hintState"
            >{{ hintTxt }}</span>
            <span v-else>当所选的数值数值为所设置内容</span>
            时，自动为客户打上<span class="label_box">
              <span
                class="label"
                v-for="(item,index) in dateRule"
                :key="index"
              >{{ item.name }}</span></span> 标签。
          </div>
        </div>
        <div
          class="title"
          style="margin-top:50px"
        >增加跟客任务<span style="color:#ccc;">（非必填）</span>：</div>
        <div class="content">
          <div class="hint">当客户匹配到了该标签后，自动创建跟客任务 <span class="btn">点击跳转</span></div>
        </div>
      </div>
      <div
        class="add_rule_box"
        v-if="table == 4"
      >
        <div class="title">{{ tableId.length == 0 ?'新建':'编辑' }}消费属性打标签</div>
        <div class="content">
          <div class="input_box">
            <div class="input">
              <span class="input_title"><span class="necessary">*</span> 规则名称： </span>
              <a-input
                style="width: 400px; height: 36px"
                placeholder="请填写规则名称，仅内部可见"
                v-model="input"
              ></a-input>
            </div>
          </div>
          <div class="selectLable_box">
            <span class="selectLable_title"><span class="necessary">*</span> 选择标签： </span>
            <span
              class="label_input"
              @click="showBox()"
            >
              <span v-if="dateRule.length == 0">请选择标签</span>
              <span
                class="label_input_title"
                v-for="(item,index) in dateRule"
                :key="index"
              >
                {{ item.name }}
                <span
                  class="delete"
                  @click.stop="setInputArr(item.id,0, index)"
                >+</span>
              </span>
              <span
                v-if="dateRule.length >0"
                class="empty"
                @click.stop="empty"
              >+</span>
            </span>
          </div>
          <div class="installRule_box">
            <span class="installRule_title"><span class="necessary">*</span> 设置打标签规则： </span>
            <span class="installRule_content">
              <span
                class="installRule"
                v-for="(item,index) in ruleDate"
                :key="index"
              >
                <span
                  class="is_cascader"
                  @click="setCascader(index)"
                >
                  <span
                    class="is_placeholder"
                    v-if="item.txt.length == 0"
                  >请选择类型</span>
                  <span
                    class="is_txt"
                    v-else
                  >{{ item.txt }}</span>
                  <i class="is_icon">
                    <svg-icon
                      :state="11"
                      :rotate="cascaderstate == index"
                    />
                  </i>
                  <div
                    class="is_selectBox"
                    v-if="cascaderstate == index"
                  >
                    <div
                      class="is_select_listBox"
                      v-for="(cascaderItem,cascaderIndex) in item.cascaderData"
                      :key="cascaderIndex"
                    >
                      <div
                        @click.stop="setCascaderSelect(selectItem,cascaderIndex,index,selectItem.isChildern)"
                        v-for="(selectItem ,selectIndex) in cascaderItem"
                        :class="item.cascaderSelect[cascaderIndex] == selectItem.id ? 'is_select is_active' : 'is_select'"
                        :key="selectIndex"
                      >
                        {{ selectItem.name }}
                        <i
                          class="is_select_icon"
                          v-if="selectItem.isChildern"
                        >
                          <svg-icon :state="12" />
                        </i>
                      </div>
                    </div>
                  </div>
                </span>
                <a-select
                  v-model="ruleDate[index].select"
                  placeholder="请选择"
                  style="width: 100px; height:36px;margin-left:20px;"
                >
                  <a-select-option
                    v-for="( items , indexs ) in relation"
                    :value="items.value"
                    :key="indexs"
                  >
                    {{ items.label }}
                  </a-select-option>
                </a-select>
                <!-- 日期 -->
                <a-date-picker
                  v-if="item.type == 'date'"
                  format="YYYY/MM/DD"
                  :showToday="false"
                  v-model="ruleDate[index].date"
                  placeholder="请输入"
                  style="width: 120px; height:36px;margin-left:20px;margin-bottom: 20px;"
                />
                <!-- 多选 -->
                <a-select
                  v-if="item.type == 'checkbox'"
                  mode="tags"
                  id="auctionTimesCode"
                  v-model="ruleDate[index].checkbox"
                  :maxTagCount="1"
                  placeholder="请输入"
                  style="min-width: 120px; min-height:36px;margin-left:20px;margin-bottom: 20px; cursor:pointer;"
                >
                  <a-select-option
                    v-for="( items , indexs ) in ruleDate[index].selectData"
                    :value="items.value"
                    :key="indexs"
                  >
                    {{ items.label }}
                  </a-select-option>
                </a-select>
                <!-- 单选 -->
                <a-select
                  v-if="item.type == 'radio' || item.type == 'select'"
                  v-model="ruleDate[index].radio"
                  placeholder="请输入"
                  style="min-width: 120px; min-height:36px;margin-left:20px;margin-bottom: 20px;"
                >
                  <a-select-option
                    v-for="( items , indexs ) in ruleDate[index].selectData"
                    :value="items.value"
                    :key="indexs"
                  >
                    {{ items.label }}
                  </a-select-option>
                </a-select>
                <!-- 输入框 -->
                <a-input
                  v-if="item.type == 'input' || item.type == 'text' || item.type == 'bm' || item.type == 'range' || item.type == 'rangeDouble'"
                  v-model="ruleDate[index].input"
                  placeholder="请输入"
                  style="width: 80px; height:36px;margin-left:20px;margin-bottom: 20px;"
                />
                <a-button
                  :type="index > 0 ? '' : 'primary'"
                  style="margin-left:10px;"
                  @click="addRuleDate(index.toString())"
                >{{ index > 0 ? '删除':'增加' }}</a-button>
              </span>
              <div
                class="relation_box"
                v-if="ruleDate.length > 1"
              >
                <div
                  class="relation_select also"
                  v-for="(relationItem ,relationIndex) in relationData "
                  :key="relationIndex"
                  :style="{background: relationState == relationItem.value ? '#1890ff': '',top: `calc( 50% - ${20 * (1 - relationIndex)}px)` }"
                  @click="setRelation(relationItem.value)"
                >{{ relationItem.label }}</div>
              </div>
            </span>
          </div>
          <div class="hint">
            <span
              style="white-space: break-spaces;"
              v-if="hintState"
            >{{ hintTxt }}</span>
            <span v-else>当所选的数值数值为所设置内容</span>
            时，自动为客户打上<span class="label_box">
              <span
                class="label"
                v-for="(item,index) in dateRule"
                :key="index"
              >{{ item.name }}</span></span> 标签。
          </div>
        </div>
        <div
          class="title"
          style="margin-top:50px"
        >增加跟客任务<span style="color:#ccc;">（非必填）</span>：</div>
        <div class="content">
          <div class="hint">当客户匹配到了该标签后，自动创建跟客任务 <span class="btn">点击跳转</span></div>
        </div>
      </div>
      <div class="btn_box">
        <a-button
          type="primary"
          v-if="table == 3 && tableId.length > 0"
          @click="addRule()"
        >保存</a-button>
        <a-button
          type="primary"
          v-else
          @click="addRule()"
        >创建规则</a-button>
      </div>
    </a-card>
    <!-- 选择标签 -->
    <label-select
      :state="ruleState"
      :addState="true"
      ref="labelSelect"
    />
    <!-- 添加关键字 -->
    <a-modal
      :visible="visible"
      title="添加匹配关键词"
      ok-text="确认"
      cancel-text="取消"
      @ok="getAddKeyword"
      @cancel="hideModal(-1)"
    >
      <div class="add_keyword_box">
        <div
          class="keyword_input"
          style="margin-bottom: 15px"
          v-for="(item, index) in addKeyword"
          :key="index"
        >
          <span class="title">{{ '关键词' + (index + 1) + '：' }}</span>
          <a-input
            v-model="item.keysInfo"
            style="width: 362px; height: 36px"
          />
          <i
            class="delete_svg"
            v-if="addKeyword.length > 1"
            @click="addKeywordInput(-1, index)"
          >
            <svg-icon :state="7" />
          </i>
        </div>
        <div class="add_keyword_btn">
          <span
            class="btn"
            @click="addKeywordInput()"
          >
            <i class="add_svg">
              <svg-icon :state="8" />
            </i>
            添加关键词
          </span>
        </div>
      </div>
    </a-modal>
    <!-- 添加群聊 -->
    <a-modal
      :visible="groupState"
      :title="'选择群聊（'+ groupArr.length + '）'"
      ok-text="确认"
      cancel-text="取消"
      @ok="setGroup"
      @cancel="showGroup(-1)"
    >
      <div class="select_group_box">
        <div class="select_group_search">
          <a-input-search
            v-model="groupSearch"
            @search="onSearch"
            style="height:36px"
            placeholder="请输入群聊名称"
          />
        </div>
        <div class="select_group_content">
          <div
            class="select_grop"
            v-for="(item,index) in groupArr"
            :key="index"
          >
            <img
              class="group_img"
              referrer="no-referrer|origin|unsafe-url"
              :src="item.img || groupImg"
              alt=""
            >
            <span class="group_info">
              <div class="name">
                {{ item.roomName }}
              </div>
              <div class="people">
                {{ item.currentNum + '/' + item.roomMax }}
              </div>
            </span>
            <span class="grouo_select">
              <input
                class="grouo_select_input tui_checkbox"
                type="checkbox"
                v-model="item.isSelect"
              >
            </span>
          </div>
        </div>
      </div>
    </a-modal>
    <!-- 添加成员 -->
  </div>
</template>

<script>
import LabelSelect from './components/LabelSelect'
import SvgIcon from './components/SvgIcon.vue'
import {
  businessTermsList,
  numberAutoLabelAdd,
  numberAutoLabelUpdate,
  numberAutoLabelDetail,
  groupAutoLabelAdd,
  timeAutoLabelAdd
} from '@/api/clientFollow.js'
import { roomList } from '@/api/workRoom.js'
import { getDict } from '@/api/common.js'

import moment from 'moment'

export default {
  components: { 'svg-icon': SvgIcon, 'label-select': LabelSelect },
  data () {
    return {
      choosePeopleShow: false,
      cascaderstate: -1,
      groupImg: require('@/assets/group.png'),
      ruleIndex: 0, // 控制操控函数
      groupIndex: 0, // 群聊
      table: 0,
      input: '', // 规则名称
      ruleState: false,
      visible: false,
      groupState: false,
      keyword: {
        // 关键词
        dim: [],
        accurate: []
      },
      keySelect: 'dim',
      addKeyword: [
        {
          value: ''
        }
      ],
      // 周
      weekArr: [],
      // 月
      dayArr: [],
      dateArr: [],
      keywordRule: [{ date: 'day', label: [], labelRuleCount: 1 }], // 自动打标签规则
      mumbersArr: [], // 生效员工
      groupArr: [], // 群聊数据
      groupRule: [{ label: [], score: false, group: [], labelRuleCount: 1, groupKey: [] }], // 群组规则
      groupSearch: '',
      timeRule: [{ date: 'day', label: [], startTime: '', endTime: '' }], // 时段规则
      dateRule: [],
      ruleDate: [
        {
          cascaderData: [[{ name: '健康档案', id: 0, isChildern: true }]],
          cascaderSelect: [],
          cascaderSelectTxt: [],
          type: 'input',
          txt: ''
        }
      ], // 数值打标签
      relation: [], // 判断条件
      hintTxt: '',
      hintArr: [
        {
          value: '',
          select: '',
          input: ''
        }
      ],
      hintState: false,
      relationState: '',
      tableId: '',
      isDate: false,
      isType: false,
      relationData: [],
      relationType: [],
      isRule: false
    }
  },
  watch: {
    ruleDate: {
      handler (val, oldval) {
        this.setHintTxt()
      },
      deep: true
    }
  },
  created () {
    this.getUrl()
  },
  mounted () {
    document.addEventListener('click', this.setselectdiv)
  },
  destroyed () {
    document.removeEventListener('click', this.setselectdiv)
  },
  methods: {
    returnPage () {
      let state = true
      if (this.table == 0) {
        this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.table}`)
      } else if (this.table == 1) {
        if (this.input.length > 0) {
          state = false
        }
        this.groupRule.map((item, index) => {
          if (item.label.length > 0 || item.group.length > 0) {
            state = false
          }
        })
      } else if (this.table == 2) {
        if (this.input.length > 0 || this.mumbersArr.length > 0) {
          state = false
        }
        this.timeRule.map((item) => {
          if (item.startTime.length > 0 || item.endTime.length > 0) {
            state = false
            return
          } else if (item.date == 'week') {
            if (item.week.length > 0) {
              state = false
            }
          } else if (item.date == 'month') {
            if (item.month.length > 0) {
              state = false
            }
          }
          if (item.label.length > 0) {
            state = false
          }
        })
      } else if (this.table == 3) {
        if (this.input.length > 0 || this.dateRule.length > 0) {
          state = false
        }
        this.ruleDate.map((item) => {
          console.log(item)
          if (
            item.cascaderSelect.length > 0 ||
            item.select != undefined ||
            item.input != undefined ||
            item.radio != undefined ||
            item.txt.length > 0 ||
            item.data != undefined
          ) {
            state = false
          }
        })
      }
      if (state) {
        this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.table}`)
      } else {
        this.$confirm({
          title: '提示',
          content: '退出后无法保存',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.table}`)
          },
          onCancel () {}
        })
      }
    },
    setselectdiv (e) {
      const thisClassName = e.target.className
      const txt = ['is_select_listBox', 'is_cascader', 'is_txt', 'is_icon']
      if (!txt.includes(thisClassName)) {
        this.cascaderstate = -1
      }
    },
    changeAssigneeIds (e) {
      this.mumbersArr = e
    },
    moment,
    setCascaderSelect (e, i, parentId, isChildern) {
      this.ruleDate[parentId].cascaderSelect[i] = e.id
      this.ruleDate[parentId].cascaderSelectTxt[i] = e.name
      if (!isChildern) {
        this.ruleDate[parentId].cascaderSelect = this.ruleDate[parentId].cascaderSelect.slice(0, i + 1)
        this.ruleDate[parentId].cascaderData = this.ruleDate[parentId].cascaderData.slice(0, i + 1)
        this.ruleDate[parentId].type = e.type
        this.setCascader(-1)
        this.ruleDate[parentId].txt = ''
        this.ruleDate[parentId].cascaderSelectTxt = this.ruleDate[parentId].cascaderSelectTxt.slice(0, i + 1)
        let txt = ''
        this.ruleDate[parentId].cascaderSelectTxt.map((item) => {
          txt = txt + item + '/'
        })
        this.ruleDate[parentId].txt = txt.slice(0, txt.length - 1)
        for (const key in this.ruleDate[parentId]) {
          console.log(key)
          if (key == 'input') {
            this.ruleDate[parentId][key] = ''
          } else if (key == 'radio') {
            this.ruleDate[parentId][key] = ''
          } else if (key == 'date') {
            this.ruleDate[parentId][key] = ''
          } else if (key == 'checkbox') {
            this.ruleDate[parentId][key] = []
          }
        }
      }
      this.getSelect(e.id, i, parentId)
    },
    setCascader (e) {
      this.cascaderstate = this.cascaderstate == e ? -1 : e
    },
    getSelect (e, i, parentId) {
      this.isType = false
      const data = {
        parentId: e
      }
      console.log(e)
      businessTermsList(data).then((res) => {
        console.log(res, '1111')
        res.data = res.data.map((item) => {
          if (item.type === 'web' || item.type === 'casette' || item.type === 'list' || item.type === 'lable') {
            item.isChildern = true
          } else if (item.type == 'checkbox' || item.type == 'radio' || item.type == 'select') {
            this.isType = item.type
          } else {
            if (item.type.length == 0) {
              item.type = 'input'
              this.isType = 'input'
            }
            item.isChildern = false
          }
          return item
        })
        if (this.isType == 'checkbox' || this.isType == 'radio' || this.isType == 'select') {
          this.ruleDate[parentId].type = this.isType
          this.ruleDate[parentId].selectData = res.data.map((item) => {
            item.label = item.name
            item.value = item.id.toString()
            return item
          })
          this.ruleDate[parentId].selectData = this.ruleDate[parentId].selectData.filter((item) => {
            return item.status == '0'
          })
          console.log(this.ruleDate[parentId].selectData)
        }
        if (this.isType) return
        this.ruleDate[parentId].cascaderData.splice(i + 1, this.ruleDate[parentId].cascaderData.length - 1)
        res.data = res.data.filter((item) => {
          return item.status == '0'
        })
        this.ruleDate[parentId].cascaderData[i + 1] = res.data
      })
      this.$forceUpdate()
    },
    onSearch () {
      this.getGroup()
    },
    getGroup (e = 0) {
      const data = {}

      roomList(data).then((res) => {
        this.groupArr = res.data.list

        this.groupArr = this.groupArr.filter((item) => {
          return item.roomName.indexOf(this.groupSearch) != -1
        })

        console.log(this.groupArr, '群组')
        this.groupArr = this.groupArr.map((item) => {
          if (this.groupRule[this.groupIndex].groupKey.includes(item.roomId)) {
            item.isSelect = true
          }
          return item
        })
      })
    },
    setRelation (e) {
      this.relationState = e
      this.setHintTxt()
    },
    addRule () {
      if (this.table == 0) {
        console.log(this.keywordRule)
        if (this.input.length == 0) return this.$message.error('规则名称不能为空')
        if (this.mumbersArr.length == 0) return this.$message.error('未选择员工')
        if (this.keyword.dim.length == 0) return this.$message.error('未添加模糊匹配')
        this.keyword.dim = this.keyword.dim.map((item) => {
          item.keysType = 1
          return item
        })
        if (this.keyword.accurate.length == 0) return this.$message.error('未添加精准匹配')
        this.keyword.accurate = this.keyword.accurate.map((item) => {
          item.keysType = 2
          return item
        })
        this.isDate = false
        const autoLabelRules = this.keywordRule.map((item) => {
          const arr = {}
          arr.labelRuleCycle = item.date.label
          arr.labelRuleCount = item.labelRuleCount
          if (item.label.length == 0) {
            this.$message.error('未选择标签')
            this.isDate = true
          }
          arr.autoLabelGroups = item.label.map((items) => {
            const obj = {}
            obj.labelGroupId = items.id
            obj.labelGroupType = 1
            return obj
          })
          return arr
        })
        const autoLabelUsers = this.mumbersArr.map((item) => {
          const arr = {}
          arr.userId = item
          arr.userType = 1
          return arr
        })
        if (this.isDate) return
        const data = {
          labelName: this.input,
          labelType: parseInt(this.table) + 1,
          autoLabelKeys: [...this.keyword.dim, ...this.keyword.accurate],
          autoLabelRules,
          autoLabelUsers
        }
        console.log(data)
      } else if (this.table == 1) {
        console.log(this.groupRule)
        this.isDate = false
        if (this.input.length == 0) return this.$message.error('规则名称不能为空')
        const rules = this.groupRule.map((item, index) => {
          const arr = {}
          if (item.label.length == 0 || item.group.length == 0) {
            this.isDate = true
          }
          arr.sort = index + 1
          const newLabel = item.label.map((items) => {
            return items.id
          })
          arr.roomIdGroup = item.groupKey.join(',')
          arr.labelIdGroup = newLabel.join(',')
          return arr
        })

        const data = {
          name: this.input,
          rules
        }
        console.log(data)
        if (this.isDate) return this.$message.error('请输入正确的规则')
        groupAutoLabelAdd(data).then((res) => {
          console.log(res)
          this.$message.success('保存成功')
          this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.table}`)
        })
      } else if (this.table == 2) {
        console.log(this.timeRule)
        if (this.input.length == 0) return this.$message.error('规则名称不能为空')
        if (this.mumbersArr.length == 0) return this.$message.error('未选择员工')
        this.isDate = false
        const rules = this.timeRule.map((item, index) => {
          console.log(item)
          const arr = {}
          arr.sort = index + 1
          if (!item.startTime || !item.endTime) {
            this.isDate = true
            return
          } else if (item.date == 'week') {
            if (item.week.length > 0) {
              arr.timeCycle = item.week.join(',')
            } else {
              this.isDate = true
            }
          } else if (item.date == 'month') {
            if (item.month.length > 0) {
              arr.timeCycle = item.month.join(',')
            } else {
              this.isDate = true
            }
          }
          arr.timeUnit = item.date
          if (new Date(item.startTime._d).getTime() > new Date(item.endTime._d).getTime()) {
            this.isDate = true
          }

          arr.startTime = moment(item.startTime._d).format('HH:mm:ss')
          arr.endTime = moment(item.endTime._d).format('HH:mm:ss')
          if (item.label.length == 0) {
            this.isDate = true
          } else {
            const newLabel = item.label.map((items) => {
              return items.id
            })
            arr.labelIdGroup = newLabel.join(',')
          }

          return arr
        })
        if (this.isDate) return this.$message.error('请输入正确的规则')
        const employeeIdGroup = this.mumbersArr.join(',')
        const data = {
          name: this.input,
          rules,
          employeeIdGroup
        }
        console.log(data)
        timeAutoLabelAdd(data).then((res) => {
          console.log(res)
          this.$message.success('保存成功')
          this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.table}`)
        })
      } else if (this.table == 3) {
        console.log(this.ruleDate)
        this.isRule = false
        if (this.input.length == 0) return this.$message.error('规则名称不能为空')
        if (this.dateRule.length == 0) return this.$message.error('未选择标签')
        const rules = this.ruleDate.map((item, index) => {
          const arr = {}
          arr.sort = index + 1
          arr.type = this.relationType[0].code
          arr.judgmentConditions = item.select
          let columnPath = ''
          item.cascaderSelect.map((items, indexs) => {
            columnPath = indexs == 0 ? items : columnPath + ',' + items
          })
          columnPath = columnPath.slice(0, columnPath.length)
          arr.columnPath = columnPath
          console.log(item.cascaderSelect)
          arr.columnId = item.cascaderSelect[item.cascaderSelect.length - 1]
          if (
            item.type == 'input' ||
            item.type == 'text' ||
            item.type == 'bm' ||
            item.type == 'range' ||
            item.type == 'rangeDouble'
          ) {
            arr.val = item.input
          } else if (item.type == 'radio' || item.type == 'select') {
            arr.val = item.radio
          } else if (item.type == 'checkbox') {
            let txt = ''
            item.checkbox.map((item, index) => {
              txt = index == 0 ? item : txt + ',' + item
            })
            arr.val = txt.slice(0, txt.length)
          } else if (item.type == 'date') {
            if (item.date && item.date != null) {
              arr.val = item.date._d ? moment(item.date._d).format('YYYY-MM-DD') : item.date
            }
          } else {
            arr.val = item.input
          }
          if (arr.columnPath.length == 0 || arr.judgmentConditions == undefined || arr.val == undefined || !arr.val) {
            this.isRule = true
          }
          return arr
        })
        let labelIdGroup = ''
        if (this.dateRule.length > 0) {
          this.dateRule.map((item, index) => {
            labelIdGroup = index == 0 ? item.id : labelIdGroup + ',' + item.id
          })
          console.log(labelIdGroup)
          labelIdGroup = labelIdGroup.toString().slice(0, labelIdGroup.length)
        }
        const data = {
          name: this.input,
          ruleRelationship: this.relationState,
          labelIdGroup,
          rules
        }
        console.log(data)
        if (this.isRule) return this.$message.error('请输入正确的规则')
        if (this.tableId.length > 0) {
          data.id = this.tableId
          numberAutoLabelUpdate(data).then((res) => {
            console.log(res)
            this.$message.success('编辑成功')
            this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.table}`)
          })
        } else {
          numberAutoLabelAdd(data).then((res) => {
            console.log(res)
            this.$router.push(`${'/clientFollow/autoLabel'}?id=${this.table}`)
          })
        }
      }
    },
    setHintTxt () {
      console.log(this.ruleDate, '111111111')
      this.ruleDate.map((item, index) => {
        for (const key in item) {
          if (key == 'txt' && item[key].length > 0) {
            this.hintArr[index].value = this.ruleDate[index].txt
          } else if (key == 'select') {
            const select = this.relation.filter((items) => {
              if (items.value === item[key]) return items
            })
            this.hintArr[index].select = select[0].label
          } else if (
            key == 'input' &&
            (item.type == 'input' ||
              item.type == 'text' ||
              item.type == 'bm' ||
              item.type == 'range' ||
              item.type == 'rangeDouble')
          ) {
            this.hintArr[index].input = item.input
            if (this.hintArr[index].input.length > 0) return
          } else if (key == 'date' && item.type == 'date') {
            if (!this.ruleDate[index][key]) {
              this.hintArr[index].input = ''
            } else {
              this.hintArr[index].input = !this.ruleDate[index][key]._d
                ? this.ruleDate[index][key]
                : moment(this.ruleDate[index][key]._d).format('YYYY-MM-DD')
              console.log(this.hintArr[index].input, '11111111')
              if (this.hintArr[index].input.length > 0) return
            }
          } else if (key == 'checkbox' && item.type == 'checkbox') {
            const txtArr = this.ruleDate[index].selectData.filter((items) => {
              return this.ruleDate[index][key].includes(items.value)
            })
            let txt = ''
            txtArr.map((items) => {
              txt += items.label + '、'
            })
            this.hintArr[index].input = txt.slice(0, txt.length - 1)
            if (this.hintArr[index].input.length > 0) return
          } else if (key == 'radio' && (item.type == 'radio' || item.type == 'select')) {
            this.hintArr[index].input =
              this.ruleDate[index].selectData.filter((items) => {
                return items.value == this.ruleDate[index][key]
              }).length > 0
                ? this.ruleDate[index].selectData.filter((items) => {
                  return items.value == this.ruleDate[index][key]
                })[0].label
                : ''
            if (this.hintArr[index].input.length > 0) return
          } else {
            this.hintArr[index].input = ''
          }
        }
      })
      this.hintTxt = ''
      console.log(this.hintArr, '333333333')
      this.hintArr.map((item, index) => {
        if (index != 0) {
          let relation = ''
          this.relationData.map((items) => {
            if (items.value == this.relationState) {
              relation = items.label
            }
          })
          this.hintTxt =
            this.hintTxt +
            relation +
            item.value +
            '\xa0\xa0\xa0' +
            item.select +
            '\xa0\xa0\xa0' +
            item.input +
            '\xa0\xa0\xa0'
          console.log('ok')
        } else {
          this.hintTxt =
            this.hintTxt + item.value + '\xa0\xa0\xa0' + item.select + '\xa0\xa0\xa0' + item.input + '\xa0\xa0\xa0'
        }
      })
      this.hintTxt = '当\xa0\xa0\xa0' + this.hintTxt
      this.hintState = true
    },
    addRuleDate (e) {
      if (e != 0) {
        this.ruleDate = this.ruleDate.filter((item, index) => {
          if (index.toString() != e) return item
        })
        this.hintArr = this.hintArr.filter((item, index) => {
          if (index.toString() != e) return item
        })
      } else {
        this.hintArr = [
          ...this.hintArr,
          {
            value: '',
            select: '',
            input: ''
          }
        ]
        this.ruleDate = [
          ...this.ruleDate,
          {
            cascaderData: [[{ name: '健康档案', id: 0, isChildern: true }]],
            cascaderSelect: [],
            cascaderSelectTxt: [],
            type: 'input',
            txt: ''
          }
        ]
      }
    },
    empty () {
      this.dateRule = []
    },
    showBox (e) {
      if (e !== -1) {
        if (this.table == 0) {
          this.ruleIndex = e
          this.$refs.labelSelect.idArr = this.keywordRule[this.ruleIndex].label.map((item) => {
            return item.id
          })
          this.$refs.labelSelect.inputArr = this.keywordRule[this.ruleIndex].label
        } else if (this.table == 1) {
          this.ruleIndex = e
          this.$refs.labelSelect.idArr = this.groupRule[this.ruleIndex].label.map((item) => {
            return item.id
          })
          this.$refs.labelSelect.inputArr = this.groupRule[this.ruleIndex].label
        } else if (this.table == 2) {
          this.ruleIndex = e
          this.$refs.labelSelect.idArr = this.timeRule[this.ruleIndex].label.map((item) => {
            return item.id
          })
          this.$refs.labelSelect.inputArr = this.timeRule[this.ruleIndex].label
        } else if (this.table == 3) {
          this.$refs.labelSelect.idArr = this.dateRule.map((item) => {
            return item.id
          })
          this.$refs.labelSelect.inputArr = this.dateRule
          console.log(this.$refs.labelSelect.idArr)
        }
      }
      this.ruleState = !this.ruleState
    },
    showGroup (e) {
      if (e != -1) {
        this.groupIndex = e
        this.getGroup()
      } else {
        this.getGroup()
      }
      this.groupState = !this.groupState
      this.groupSearch = ''
    },
    setGroup () {
      this.groupRule[this.groupIndex].group = this.groupArr.filter((item) => {
        if (item.isSelect) return item
      })
      this.groupRule[this.groupIndex].groupKey = this.groupArr.map((item) => {
        if (item.isSelect) return item.roomId
      })
      this.showGroup(-1)
    },
    setInputArr (e, i, z) {
      if (this.table == 0) {
        this.$refs.labelSelect.idArr = this.keywordRule[i].label.map((item) => {
          return item.id
        })
        this.$refs.labelSelect.inputArr = this.keywordRule[i].label
        this.$refs.labelSelect.setArr(e, z)
        this.keywordRule[i].label = this.keywordRule[i].label.filter((item, index) => {
          if (index != z) return item
        })
      } else if (this.table == 1) {
        this.$refs.labelSelect.idArr = this.groupRule[i].label.map((item) => {
          return item.id
        })
        this.$refs.labelSelect.inputArr = this.groupRule[i].label
        this.$refs.labelSelect.setArr(e, z)
        this.groupRule[i].label = this.groupRule[i].label.filter((item, index) => {
          if (index != z) return item
        })
      } else if (this.table == 2) {
        this.$refs.labelSelect.idArr = this.timeRule[i].label.map((item) => {
          return item.id
        })
        this.$refs.labelSelect.inputArr = this.timeRule[i].label
        this.$refs.labelSelect.setArr(e, z)
        this.timeRule[i].label = this.timeRule[i].label.filter((item, index) => {
          if (index != z) return item
        })
      } else if (this.table == 3) {
        this.$refs.labelSelect.idArr = this.dateRule.map((item) => {
          return item.id
        })
        this.$refs.labelSelect.inputArr = this.dateRule
        this.$refs.labelSelect.setArr(e, z)
        this.dateRule = this.dateRule.filter((item, index) => {
          if (index != z) return item
        })
      }
    },
    addFlod (e, key) {
      if (this[key].includes(e)) {
        this[key] = this[key].filter((item) => {
          return item !== e
        })
      } else {
        this[key] = [...this[key], e]
      }
    },
    getPopupContainer (triggerNode) {
      return triggerNode.parentNode
    },
    transmitLabel (e) {
      if (this.table == 0) {
        this.keywordRule[this.ruleIndex].label = e
      } else if (this.table == 1) {
        this.groupRule[this.ruleIndex].label = e
      } else if (this.table == 2) {
        this.timeRule[this.ruleIndex].label = e
      } else if (this.table == 3) {
        this.dateRule = e
      }
    },
    hideModal (key) {
      if (key !== -1) {
        this.keySelect = key
        this.addKeyword = [...this.keyword[this.keySelect], { keysInfo: '' }]
      } else {
        this.addKeyword = [{ keysInfo: '' }]
      }
      this.visible = !this.visible
    },
    getAddKeyword () {
      if (this.addKeyword.some((item) => item.keysInfo == '')) {
        return this.$message.error(`关键字不能为空`)
      }
      const arr = this.addKeyword.map((item) => {
        return item.keysInfo
      })
      if (new Set(arr).size !== arr.length) return this.$message.error('关键字不能相同')
      this.keyword[this.keySelect] = this.addKeyword
      this.visible = !this.visible
      this.addKeyword = [{ keysInfo: '' }]
    },
    setKeyword (e) {},
    deleteKeyword (key, i) {
      this.keyword[key] = this.keyword[key].filter((item, index) => {
        if (i != index) return item
      })
    },
    addKeywordInput (e, i) {
      if (e == -1) {
        this.addKeyword = this.addKeyword.filter((item, index) => {
          if (i != index) return item
        })
      } else {
        this.addKeyword = [...this.addKeyword, { keysInfo: '' }]
      }
    },
    setOperationArr (e, i) {
      if (e == -1) {
        if (this.table == 0) {
          this.keywordRule = this.keywordRule.filter((item, index) => {
            if (index !== i) return item
          })
        } else if (this.table == 1) {
          this.groupRule = this.groupRule.filter((item, index) => {
            if (index !== i) return item
          })
        } else if (this.table == 2) {
          this.timeRule = this.timeRule.filter((item, index) => {
            if (index !== i) return item
          })
        }
      } else {
        if (this.keywordRule.length == 10 || this.groupRule.length == 10 || this.timeRule.length == 5) return
        if (this.table == 0) {
          this.keywordRule = [
            ...this.keywordRule,
            { date: { value: '0', label: '天' }, label: [], labelRuleCount: 1, idArr: [] }
          ]
        } else if (this.table == 1) {
          this.groupRule = [...this.groupRule, { label: [], score: false, group: [], labelRuleCount: 1, groupKey: [] }]
        } else if (this.table == 2) {
          this.timeRule = [...this.timeRule, { date: 'day', label: [], startTime: '', endTime: '' }]
        }
      }
    },
    getSelectData (e, key) {
      const obj = {
        dictType: e
      }
      getDict(obj).then((res) => {
        console.log(res)
        this[key] = res.data.map((item) => {
          item.label = item.name
          item.value = item.code
          return item
        })
        if (key == 'relationData') {
          this.relationState = this[key][0].value
        }
        console.log(this[key])
      })
    },
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
      this.table = object.id
      if (this.table == 1) this.getGroup()
      if (this.table == 2) {
        this.getSelectData('time_unit', 'dateArr')
        this.getSelectData('time_cycle_week', 'weekArr')
        this.getSelectData('time_cycle_day', 'dayArr')
      }
      if (this.table == 3) {
        this.getSelectData('auto_lable_number_condition', 'relation')
        this.getSelectData('auto_lable_number_relationship', 'relationData')
        this.getSelectData('auto_lable_number_type', 'relationType')
      }
      if (object.hasOwnProperty('label') && this.table == 3) {
        this.tableId = object.label
        const obj = {
          id: this.tableId
        }
        numberAutoLabelDetail(obj).then((res) => {
          console.log(res, '1111')
          const data = res.data
          this.input = data.name
          const newDateRule = data.labelIdGroup.split(',').map((item, index) => {
            const obj = {}
            obj.name = data.labelIdNameGroup[index]
            obj.id = Number(item)
            return obj
          })
          this.dateRule = newDateRule
          this.relationState = data.ruleRelationship
          const newHintArr = []
          const newRules = []
          data.rules.map((item) => {
            newHintArr.push({
              value: '',
              select: '',
              input: ''
            })
            const obj = {
              cascaderData: [[{ name: '健康档案', id: 0, isChildern: true }]],
              cascaderSelect: [],
              cascaderSelectTxt: [],
              type: 'input',
              txt: ''
            }
            obj.cascaderSelect = item.columnPath.split(',')
            obj.select = item.judgmentConditions
            let txt = ''
            item.columnPathName.map((items, indexs) => {
              txt = indexs == 0 ? '健康档案/' + items : txt + '/' + items
            })
            obj.txt = item.columnPathName.length == 1 ? txt : txt.slice(0, txt.length)
            obj.type = item.columnIdOptionType || item.columnIdType
            console.log(obj.type, '1111111111')
            if (obj.type == 'radio' || obj.type == 'select') {
              obj.selectData = item.columnIdOption.map((items) => {
                items.value = items.id.toString()
                items.label = items.name
                return items
              })
              obj.radio = item.val
            } else if (
              obj.type == 'input' ||
              obj.type == 'text' ||
              obj.type == 'bm' ||
              obj.type == 'range' ||
              obj.type == 'rangeDouble'
            ) {
              obj.input = item.val
            } else if (obj.type == 'date') {
              obj.date = item.val
            } else if (obj.type == 'checkbox') {
              obj.selectData = item.columnIdOption.map((items) => {
                items.value = items.id.toString()
                items.label = items.name
                return items
              })
              console.log(obj.selectData)
              obj.checkbox = item.val.split(',')
            } else {
              obj.input = item.val
            }
            newRules.push(obj)
          })
          this.hintArr = newHintArr
          this.ruleDate = newRules
          this.setHintTxt()
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.add_rule {
  position: relative;
  width: 100%;

  .return_cover {
    cursor: pointer;
    position: absolute;
    top: -40px;
    left: 0;
    z-index: 100;
    width: 70px;
    height: 30px;
  }

  .add_rule_box {
    display: flex;
    flex-direction: column;
    .title {
      font-size: 15px;
      line-height: 21px;
      color: rgba(0, 0, 0, 0.85);
      border-bottom: 1px solid #f1f1f1;
      padding-bottom: 16px;
      margin-bottom: 16px;
      position: relative;
      .hint {
        margin-left: 6px;
        font-size: 8px;
        color: #b8b8b8;
      }
    }

    .content {
      display: flex;
      flex-direction: column;

      .hint {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border-width: 0px;
        white-space: nowrap;
        text-transform: none;
        font-size: 14px;
        text-align: left;
        font-family: 'Arial Normal', 'Arial', sans-serif;
        font-weight: 400;
        font-style: normal;

        .label_box {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .label {
            margin: 4px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 28px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            background: #f7f7f7;
            border-radius: 4px;
            border: 1px solid #e9e9e9;
          }
        }

        .btn {
          cursor: pointer;
          color: #02a7f0;
        }
      }

      .reminder {
        font-size: 8px;
        color: #b8b8b8;
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
      }
      .selectLable_box {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .selectLable_title {
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5;
          white-space: nowrap;
          .necessary {
            color: red;
          }
        }
        .label_input {
          position: relative;
          box-sizing: border-box;
          padding: 5px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          border: 1px solid #d9d9d9;
          box-sizing: border-box;
          cursor: pointer;
          color: #bfbfbf;
          border-radius: 2px;
          padding-left: 5px;
          margin-right: 10px;
          width: 400px;
          min-height: 36px;

          &:hover {
            border-color: #1673ff;
          }

          .label_input_title {
            margin: 4px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 28px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            background: #f7f7f7;
            border-radius: 4px;
            border: 1px solid #e9e9e9;
            .delete {
              margin-left: 5px;
              line-height: 20px;
              font-size: 20px;
              transform: rotate(45deg);

              &:hover {
                color: #0052d9;
              }
            }
          }

          .empty {
            position: absolute;
            top: 50%;
            right: 10px;
            width: 14px;
            height: 14px;
            background-color: rgba(87, 85, 85, 0.7);
            border-radius: 50%;
            color: #fff;
            transform: translateY(-50%) rotate(45deg);
            font-size: 18px;
            font-style: normal;
            line-height: 10px;
            text-align: center;
            text-transform: none;
            vertical-align: -0.125em;
            text-rendering: optimizeLegibility;
          }
        }
      }
      .installRule_box {
        display: flex;
        margin-bottom: 20px;
        .installRule_title {
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 36px;
          white-space: nowrap;
          .necessary {
            color: red;
          }
        }
        .installRule_content {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          width: 100%;
          position: relative;
          .installRule {
            display: flex;
            flex-wrap: nowrap;
            margin-left: 30px;
            .is_cascader {
              position: relative;
              cursor: pointer;
              min-width: 280px;
              flex-shrink: 0;
              height: 36px;
              border: 1px solid #ccc;
              .is_placeholder {
                width: 100%;
                height: 20px;
                margin-top: -10px;
                padding: 0 20px 0 12px;
                overflow: hidden;
                line-height: 33px;
                color: #ccc;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .is_txt {
                width: 100%;
                height: 20px;
                margin-top: -10px;
                padding: 0 40px 0 12px;
                overflow: hidden;
                line-height: 33px;
                color: rgba(0, 0, 0, 0.65);
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .is_icon {
                position: absolute;
                top: 6px;
                right: 12px;
              }

              .is_selectBox {
                position: absolute;
                top: 36px;
                left: 0;
                z-index: 5;
                font-size: 14px;
                border-radius: 2px;
                display: flex;
                white-space: nowrap;
                min-width: 111px;
                max-height: 180px;
                background-color: #fff;
                box-sizing: border-box;
                border: 1px solid #e8e8e8;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.21);
                .is_select_listBox {
                  display: flex;
                  overflow: auto;
                  flex-direction: column;
                  .is_select {
                    flex-shrink: 0;
                    padding: 5px 12px;
                    line-height: 22px;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  }
                  .is_active {
                    font-weight: 600;
                    background-color: #fafafa;
                  }
                }
              }
            }
          }
          .relation_box {
            position: absolute;
            left: 0;
            top: 0;
            width: 20px;
            height: calc(100% - 55px);
            display: flex;
            transform: translate(10px, 20px);
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            border-left: 1px solid #ccc;
            flex-direction: column;
            justify-content: center;

            .relation_select {
              position: absolute;
              top: 50%;
              left: -50%;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
              background-color: #ccc;
              color: #fff;
            }
            .also {
              top: calc(50% - 20px);
            }
          }
        }
      }
      .rule_box {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        .rule {
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5;
          .rule_title {
            white-space: nowrap;
          }
          .label {
            background: #fff;
            border: 1px solid rgba(0, 0, 0, 0.15);
            box-sizing: border-box;
            border-radius: 4px;
            width: 160px;
            height: 32px;
            line-height: 32px;
            padding-left: 8px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
            text-align: center;
          }
        }
        .hint {
          margin: 6px 0 6px 85px;
          font-size: 8px;
          color: #b8b8b8;
        }
      }
      .input_box {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        .input {
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5;
          .input_title {
            white-space: nowrap;
            .necessary {
              color: red;
            }
          }
        }
      }
      .selectMembers_box {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        .selectMembers {
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5;
          .selectMembers_title {
            white-space: nowrap;
            .necessary {
              color: red;
            }
          }
          .selectMembers_select {
            cursor: pointer;
            width: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            padding: 0 12px;
            font-size: 14px;
            border-radius: 2px;
            line-height: 1.499;
            font-weight: 400;
            white-space: nowrap;
            text-align: center;
            background-image: none;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            user-select: none;
            touch-action: manipulation;
            color: rgba(0, 0, 0, 0.65);
            background-color: #fff;
            border-color: #d9d9d9;

            &:hover {
              color: #40a9ff;
              border-color: #40a9ff;
            }
          }
        }

        .member_box {
          margin-left: 78px;
          margin-top: 17px;
          display: flex;
          flex-wrap: wrap;
          .member {
            background: #f7f7f7;
            border-radius: 2px;
            padding: 5px 10px;
            font-size: 14px;
            line-height: 22px;
            color: rgba(0, 0, 0, 0.85);
            position: relative;
            margin-right: 17px;
            margin-bottom: 10px;
            .close_svg {
              transform: rotate(45deg);
              width: 14px;
              height: 14px;
              line-height: 12px;
              text-align: center;
              position: absolute;
              background: #a9a9a9;
              border-radius: 50%;
              cursor: pointer;
              font-size: 12px;
              right: -6px;
              top: -5px;
              color: #fff;
            }
          }
        }

        .hint {
          margin: 6px 0 6px 68px;
          font-size: 8px;
          color: #b8b8b8;
        }
      }
      .matching_box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 22px;
        width: 100%;
        .matching_title {
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5;
          .necessary {
            color: red;
          }
          .svg_six {
            position: relative;
            cursor: pointer;
            margin: 0 5px;
            font-size: 12px;
            display: inline-block;
            color: inherit;
            font-style: normal;
            line-height: 0;
            text-align: center;
            text-transform: none;
            vertical-align: -0.125em;
            text-rendering: optimizeLegibility;
            border: 1px solid #000;
            border-radius: 50%;

            .hidden_box {
              position: absolute;
              top: -100px;
              left: -150px;
              width: 300px;
              padding: 20px;
              line-height: 20px;
              white-space: normal;
              background-color: #fff;
              border: 1px solid #ccc;
              z-index: 10;
              text-align: start;
            }
          }
        }
        .add_keyword {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          box-sizing: border-box;
          height: 36px;
          padding: 0 12px;
          font-size: 14px;
          border-radius: 2px;
          color: rgba(0, 0, 0, 0.65);
          font-variant: tabular-nums;
          line-height: 1.5;
          list-style: none;
          font-feature-settings: 'tnum';
          position: relative;
          background: #fff;
          transition: all 0.3s;
          border: 1px solid #ccc;

          .icon {
            font-size: 21px;
            color: #000;
            margin-right: 5px;
          }
        }
        .keyword_box {
          margin-left: 10px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .keyword {
            margin-right: 10px;
            margin-bottom: 5px;
            background: #f7f7f7;
            border-radius: 2px;
            padding: 5px 10px;
            font-size: 14px;
            line-height: 22px;
            color: rgba(0, 0, 0, 0.85);
            .svg_three {
              cursor: pointer;
            }
          }
        }
      }
      .add_keyword_operation_box {
        background-color: #fbfbfb;
        min-width: 800px;
        border: 1px solid #e2e2e2;
        .keyword_operation_box {
          padding: 15px;
          flex-shrink: 0;
          border-bottom: 1px dashed #e2e2e2;
          .operation_box {
            display: flex;
            align-items: center;
            .operation_title {
              white-space: nowrap;
            }
            .operation_content {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              .operation {
                margin: 0 5px;
                .label_input {
                  box-sizing: border-box;
                  padding: 5px;
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  border: 1px solid #d9d9d9;
                  width: 280px;
                  box-sizing: border-box;
                  cursor: pointer;
                  color: #bfbfbf;
                  border-radius: 2px;
                  padding-left: 5px;
                  margin-right: 10px;
                  .label_input_title {
                    margin: 4px;
                    padding: 0 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 28px;
                    color: rgba(0, 0, 0, 0.65);
                    font-size: 14px;
                    background: #f7f7f7;
                    border-radius: 4px;
                    border: 1px solid #e9e9e9;
                    .delete {
                      margin-left: 5px;
                      line-height: 20px;
                      font-size: 20px;
                      transform: rotate(45deg);

                      &:hover {
                        color: #0052d9;
                      }
                    }
                  }
                }
                .select_week {
                  box-sizing: border-box;
                  margin: 0;
                  padding: 4px 11px;
                  color: #ccc;
                  font-size: 14px;
                  font-variant: tabular-nums;
                  line-height: 1.8;
                  list-style: none;
                  font-feature-settings: 'tnum';
                  position: relative;
                  display: inline-block;
                  width: 128px;
                  outline: none;
                  cursor: pointer;
                  background-color: #fff;
                  border: 1px solid #d9d9d9;
                  border-radius: 4px;
                  height: 36px;
                  transition: opacity 0.3s;
                  .week_body {
                    position: absolute;
                    top: 36px;
                    left: 0;
                    display: inline-flex;
                    text-align: center;
                    background: #fff;
                    border: 1px solid #f0f0f0;
                    border-radius: 2px;
                    outline: none;
                    width: 280px;
                    flex-wrap: wrap;
                    .week {
                      width: 88px;
                      height: 66px;
                      display: flex;
                      align-items: center;
                      justify-content: center;

                      &:hover {
                        color: #fff;
                        background-color: #ccc;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        .add_task {
          display: flex;
          align-items: center;
          margin: 8px 0 8px 14px;

          .hint {
            font-size: 8px;
            color: #b8b8b8;
          }

          .btn {
            color: #1b91ff;
            display: flex;
            align-items: center;
            cursor: pointer;
          }

          .add_svg {
            margin-right: 5px;
            font-size: 12px;
            display: inline-block;
            color: inherit;
            font-style: normal;
            line-height: 0;
            text-align: center;
            text-transform: none;
            vertical-align: -0.125em;
            text-rendering: optimizeLegibility;
            border: 1px solid #1b91ff;
            border-radius: 50%;
          }
        }
      }
    }
  }
  .btn_box {
    margin-top: 60px;
  }
}

::v-deep(.select_group_content) {
  margin-top: 16px;
  width: 100%;
  height: 366px;
  overflow: auto;
  .select_grop {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .group_img {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      margin-right: 11px;
    }
    .group_info {
      flex: 1;
      .name {
        color: #222;
        font-size: 14px;
        font-weight: 500;
      }
      .people {
        color: #999;
        opacity: 0.85;
      }
    }
    .grouo_select {
      margin-right: 20px;
      .grouo_select_input {
        width: 16px;
        height: 16px;
      }
      .tui_checkbox:checked {
        background: #1673ff;
        border: solid 1px #1673ff;
      }
      .tui_checkbox {
        width: 16px;
        height: 16px;
        background-color: #ffffff;
        border: solid 1px #dddddd;
        font-size: 0.8rem;
        margin: 0;
        padding: 0;
        position: relative;
        display: inline-block;
        vertical-align: top;
        cursor: default;
        -webkit-appearance: none;
        -webkit-user-select: none;
        user-select: none;
        -webkit-transition: background-color ease 0.6s;
        transition: background-color ease 0.6s;
      }
      .tui_checkbox:checked::after {
        content: '';
        top: 3px;
        left: 2px;
        position: absolute;
        background: transparent;
        border: #fff solid 2px;
        border-top: none;
        border-right: none;
        height: 6px;
        width: 10px;
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }
    }
  }
}

::v-deep(.add_keyword_btn) {
  color: #1b91ff;
  margin-left: 64px;
  margin-top: 20px;

  .btn {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .add_svg {
    margin-right: 5px;
    font-size: 12px;
    display: inline-block;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizeLegibility;
    border: 1px solid #1b91ff;
    border-radius: 50%;
  }
}
::v-deep(#auctionTimesCode) {
  .ant-select-search__field {
    display: none;
  }
}

::v-deep(.delete_svg) {
  margin-left: 10px;
  cursor: pointer;
  font-size: 12px;
  display: inline-block;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  border: 1px solid #000;
  border-radius: 50%;
}
::v-deep(.ant-tooltip-inner) {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}
/* 小箭头 */
::v-deep(.ant-tooltip-arrow::before) {
  background-color: #fff;
}
</style>
