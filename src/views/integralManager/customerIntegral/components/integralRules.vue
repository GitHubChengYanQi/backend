<template>
  <div id="integral_rules_container" ref="integral_rules_container">
    <div class="commonRulesDiv">
      <div class="headTitleDiv">通用设置</div>
      <a-table
        :loading="commonTableLoading"
        :row-key="record => record.id"
        :data-source="commonTableData"
        :columns="commonTableColumns"
        :pagination="false"
        class="tableBox"
        :scroll="{ x: 1500}">
        <div slot="options" slot-scope="text, record">
          <template>
            <div style="display: flex;justify-content: space-around;">
              <a-button type="link" @click="setCommonMethod(record)">设置</a-button>
            </div>
          </template>
        </div>
      </a-table>
    </div>
    <div class="integralRulesDiv">
      <div class="headTitleDiv">积分规则</div>
      <a-table
        :loading="integralTableLoading"
        :row-key="record => record.id"
        :data-source="integralTableData"
        :columns="integralTableColumns"
        :pagination="integralPagination"
        @change="handleTableChange"
        class="tableBox"
        :scroll="{ x: 1500}">
        <div slot="options" slot-scope="text, record">
          <template>
            <div style="display: flex;justify-content: space-around;">
              <a-button type="link" @click="setIntegralMethod(record)">设置</a-button>
              <a-button type="link" @click="addGoodsMethod(record)">新增商品</a-button>
            </div>
          </template>
        </div>
      </a-table>
    </div>
    <a-modal
      title="积分有效期"
      :maskClosable="false"
      :width="1000"
      :visible="commonValidityShowStatus"
      class="validityModalClass"
      @cancel="closeCommonValidityModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <a-radio-group class="radioValityGroupDiv" v-model="commonValidityTypeInfo.restrictionType" @change="changeValidity">
        <a-radio class="singleRadioDiv" :value="'1'">
          <div class="singleRadioTitle">永久有效</div>
        </a-radio>
        <a-radio class="singleRadioDiv" :value="'2'">
          <div class="singleRegularTopDiv">
            <div class="singleRadioTitle">定期清零</div>
            <div class="regularText">可设置清零时间与清零周期，例：每年9月1号，清零去年8月1号到今年7月31号获得的积分。</div>
          </div>
          <div class="regularContentView">
            <div class="singleRegularContent">
              每年
              <a-date-picker
              :getCalendarContainer="() => $refs['integral_rules_container']"
              dropdownClassName="dropdownClassName"
                :disabled="commonValidityTypeInfo.restrictionType !== '2'"
                valueFormat="MM-DD"
                format="MM-DD"
                v-model="commonValidityTypeInfo.monthDay"
                @change="changeMonthDay"
              ></a-date-picker>
              <!-- <selectMonthDate :inputWidth="'150'"></selectMonthDate> -->
              定期清零
            </div>
            <div class="singleRegularContent">
              去年
              <!-- <a-date-picker
                :disabled="commonValidityTypeInfo.restrictionType !== '2' || !commonValidityTypeInfo.monthDay"
                valueFormat="MM-DD"
                format="MM-DD"
                :disabled-date="e => disableBeforeDate(commonValidityTypeInfo.monthDay, e)"
                v-model="commonValidityTypeInfo.lastYearMonthDay"
                @change="changePreviousDate"
              ></a-date-picker> -->
              <a-date-picker
                :getCalendarContainer="() => $refs['integral_rules_container']"
                dropdownClassName="dropdownClassName"
                :disabled-date="e => disableBeforeDate(commonValidityTypeInfo.monthDay, e)"
                :disabled="commonValidityTypeInfo.restrictionType !== '2'"
                valueFormat="MM-DD"
                format="MM-DD"
                v-model="commonValidityTypeInfo.lastYearMonthDay"
                @change="changePreviousDate"
              ></a-date-picker>
              至下一年
              <a-date-picker
                :disabled="true"
                valueFormat="MM-DD"
                format="MM-DD"
                v-model="commonValidityTypeInfo.nextYearMonthDay"
              ></a-date-picker>
            </div>
          </div>
        </a-radio>
        <a-radio class="singleRadioDiv" :value="'3'">
          <!-- <div class="singleRadioTitle">每笔积分有效期</div> -->
          <div class="singleRadioContent">
            <div class="singleRadioTitle">每笔积分有效期为</div>
            <a-input-number
              v-model="commonValidityTypeInfo.ytdNum"
              placeholder="请输入"
              :min="commonValidityTypeInfo.minNumber"
              :max="commonValidityTypeInfo.maxNumber"
              :disabled="commonValidityTypeInfo.restrictionType !== '3'"
              class="inputSelectClass">
            </a-input-number>
            <a-select
              v-model="commonValidityTypeInfo.ytdType"
              :disabled="commonValidityTypeInfo.restrictionType !== '3'"
              class="inputSelectClass"
              @change="changeSingleValidateType">
              <a-select-option v-for="integralItem in singleIntegralValidityTypeList" :key="integralItem.code" :value="integralItem.code">{{ integralItem.name }}</a-select-option>
            </a-select>
            <!-- <a-input-number placeholder="请输入" :disabled="commonValidityTypeInfo.restrictionType !== '3'">
              <a-select slot="addonAfter" v-model="singlgeIntegralName" :disabled="commonValidityTypeInfo.restrictionType !== '3'">
                <a-select-option v-for="integralItem in singleIntegralValidityList" :key="integralItem.id" :value="integralItem.name">
                  {{ integralItem.name }}
                </a-select-option>
              </a-select>
            </a-input-number> -->
          </div>
        </a-radio>
      </a-radio-group>
      <template slot="footer">
        <a-button
          @click="closeCommonValidityModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmCommonValidity">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="积分上限"
      :maskCloseable="false"
      :width="1000"
      :visible="commonLimitShowStatus"
      class="limitModalClass"
      @cancel="closeCommonLimitModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <a-radio-group class="radioLimitGroupDiv" v-model="commonValidityTypeInfo.restrictionType" @change="changeLimit">
        <a-radio class="singleRadioDiv" :value="'4'">
          <div class="singleRadioTitle">不限制</div>
        </a-radio>
        <a-radio class="singleRadioDiv" :value="'5'">
          <div class="singleRadioContent">
            <div class="singleRadioTitle">员工每日获取积分上限</div>
            <a-input-number
              v-model="commonValidityTypeInfo.integralMaxNum"
              placeholder="请输入"
              :min="1"
              :disabled="commonValidityTypeInfo.restrictionType !== '5'"
              class="inputSelectClass">
            </a-input-number>
          </div>
        </a-radio>
      </a-radio-group>
      <!-- <a-radio-group class="radioLimitGroupDiv" v-model="limitTypeName">
        <a-radio class="singleRadioDiv" v-for="item in commonLimitTypeList" :key="item.id" :value="item.value">
          <div class="singleRadioTitle" v-if="item.value === 'noLimit'">{{ item.name }}</div>
          <div class="singleRadioContent" v-if="item.value === 'limit'">
            <div class="singleRadioTitle">{{ item.name }}</div>
            <a-input></a-input>
          </div>
        </a-radio>
      </a-radio-group> -->
      <template slot="footer">
        <a-button
          @click="closeCommonLimitModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmCommonLimit">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="到期提醒"
      :maskCloseable="false"
      :width="1000"
      :visible="commonRemindShowStatus"
      class="remindModalClass"
      @cancel="closeCommonRemindModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <a-radio-group class="radioRemindGroupDiv" v-model="commonValidityTypeInfo.restrictionType" @change="changeRemind">
        <a-radio class="singleRadioDiv" :value="'6'">
          <div class="singleRadioTitle">不提醒</div>
        </a-radio>
        <a-radio class="singleRadioDiv" :value="'7'">
          <div class="singleRadioContent">
            <div class="singleRadioTitle">到期前</div>
            <a-input-number
              v-model="commonValidityTypeInfo.beforeDayNum"
              placeholder="请输入"
              :min="1"
              :disabled="commonValidityTypeInfo.restrictionType !== '7'"
              class="inputSelectClass">
            </a-input-number>
            <div class="singleRadioText">天</div>
            <a-time-picker
              v-model="commonValidityTypeInfo.beforeDayTime"
              :disabled="commonValidityTypeInfo.restrictionType !== '7'"
              placeholder="请输入时间"
              class="inputSelectClass"
              valueFormat="HH:mm"
              format="HH:mm"
            ></a-time-picker>
            <div class="singleRadioText">提醒员工</div>
          </div>
        </a-radio>
      </a-radio-group>
      <!-- <a-radio-group class="radioRemindGroupDiv" v-model="remindTypeName">
        <a-radio class="singleRadioDiv" v-for="item in commonRemindTypeList" :key="item.id" :value="item.value">
          <div class="singleRadioTitle" v-if="item.value === 'noRemind'">{{ item.name }}</div>
          <div class="singleRadioContent" v-if="item.value === 'remind'">
            <div class="singleRadioTitle">{{ item.name }}</div>
            <a-input></a-input>
            <div class="singleRadioText">天</div>
            <a-date-picker></a-date-picker>
            <div class="singleRadioText">提醒员工</div>
          </div>
        </a-radio>
      </a-radio-group> -->
      <template slot="footer">
        <a-button
          @click="closeCommonRemindModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmCommonRemind">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="执行群发朋友圈任务"
      :maskCloseable="false"
      :width="1000"
      :visible="integralFriendCircleShowStatus"
      class="friendCircleModalClass"
      @cancel="closeIntegralFriendCircleModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <div class="formDivContent">
        <div class="singleFormDiv">
          <div class="singleFormTitle">规则状态</div>
          <a-switch
            :checked="integralRulesTypeInfo.state === '1' ? true : false"
            @click="setRules(integralRulesTypeInfo)"
            checked-children="开"
            un-checked-children="关"
          />
          <div class="switchText">{{ integralRulesTypeInfo.state === '1' ? '已启用' : '未启用' }}</div>
        </div>
        <div class="singleFormDiv">
          <div class="singleFormTitle">积分规则</div>
          <div class="singleFormText">任务时间内完成朋友圈群发任务，可获得</div>
          <a-input-number
            v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo && integralRulesTypeInfo.creditsRuleJsonDetailVo.integral"
            placeholder="请选择"
            class="singleInputClass"
            :min="1"
            v-model="integralRulesTypeInfo.creditsRuleJsonDetailVo.integral">
          </a-input-number>
          <div class="singleFormText">积分</div>
        </div>
        <div class="singleFormDiv">
          <div class="singleFormTitle">适用员工</div>
          <selectPersonnel
            v-if="treeData"
            :record="treeData"
            class="selectPersonnelCom"
            type="button"
            name="添加员工"
            v-model="employeeIds"
            @getVal="employeeIdsChange"
          />
        </div>
        <div class="formRulesDesc">积分奖励将在员工执行群发朋友圈任务后立即发放</div>
      </div>
      <template slot="footer">
        <a-button
          @click="closeIntegralFriendCircleModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmIntegralFriendCircle">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="加好友"
      :maskCloseable="false"
      :width="1000"
      :visible="integralAddFriendShowStatus"
      class="addFriendModalClass"
      @cancel="closeIntegralAddFriendModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <div class="formDivContent">
        <div class="singleFormDiv">
          <div class="singleFormTitle">规则状态</div>
          <a-switch
            :checked="integralRulesTypeInfo.state === '1' ? true : false"
            @click="setRules(integralRulesTypeInfo)"
            checked-children="开"
            un-checked-children="关"
          />
          <div class="switchText">{{ integralRulesTypeInfo.state === '1' ? '已启用' : '未启用' }}</div>
        </div>
        <div class="singleFormDiv">
          <div class="singleFormTitle">积分规则</div>
          <div class="singleFormText">新添加1个好友，且</div>
          <a-input-number
            class="singleInputClass"
            :min="1"
            v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo
              && integralRulesTypeInfo.creditsRuleJsonDetailVo.friendDayNum"
            v-model="integralRulesTypeInfo.creditsRuleJsonDetailVo.friendDayNum">
          </a-input-number>
          <div class="singleFormText">天</div>
          <div class="singleFormText">未流失，员工可获得</div>
          <a-input-number
            :min="1"
            v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo
              && integralRulesTypeInfo.creditsRuleJsonDetailVo.integral"
            v-model="integralRulesTypeInfo.creditsRuleJsonDetailVo.integral"
            class="singleInputClass">
          </a-input-number>
          <div class="singleFormText">积分</div>
        </div>
        <div class="singleFormDiv">
          <div class="singleFormTitle">适用员工</div>
          <selectPersonnel
            v-if="treeData"
            :record="treeData"
            class="selectPersonnelCom"
            type="button"
            name="添加员工"
            v-model="employeeIds"
            @getVal="employeeIdsChange"
          />
        </div>
        <div class="formRulesDesc">积分奖励将在满足条件的后一天0点，集中发放，发放的积分数量，以最新的规则为准</div>
      </div>
      <template slot="footer">
        <a-button
          @click="closeIntegralAddFriendModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmIntegralAddFriend">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="目标客户产生购买"
      :maskCloseable="false"
      :width="1000"
      :zIndex="600"
      :visible="integralBuyShowStatus"
      class="buyModalClass"
      @cancel="closeIntegralBuyModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <div class="formDivContent">
        <div class="singleFormDiv">
          <div class="singleFormTitle">规则状态</div>
          <a-switch
            :checked="integralRulesTypeInfo.state === '1' ? true : false"
            @click="setRules(integralRulesTypeInfo)"
            checked-children="开"
            un-checked-children="关"
          />
          <div class="switchText">{{ integralRulesTypeInfo.state === '1' ? '已启用' : '未启用' }}</div>
        </div>
        <div class="singleFormRulesDiv">
          <div class="singleFormTitle">积分规则</div>
          <div class="singleFormContent">
            <div class="singleRulesContent">
              <div class="singleFormText">好友查看了</div>
              <!-- <a-input placeholder="请选择互动雷达"></a-input> -->
              <div class="radarContentDiv" @click="chooseRadarMethod">
                <div v-if="radarList.length === 0" class="noRadarDiv">+互动雷达</div>
                <div v-else class="tagDiv">
                  <div v-for="item in radarList.slice(0,1)" :key="item.id" class="singleTagDiv">
                    {{ item.title }}
                    <div class="delete" @click.stop="deleteSingleTag(item)">+</div>
                  </div>
                  <div v-if="radarList.length > 1" class="singleTagDiv">{{ `+${radarList.length - 1}` }}</div>
                  <div v-if="radarList.length !== 0" class="clearTagDiv" @click.stop="clearTagMethod">X</div>
                </div>
              </div>
              <div class="singleFormText">后</div>
              <a-input
                v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo && integralRulesTypeInfo.creditsRuleJsonDetailVo.lookAfterDayNum"
                v-model="integralRulesTypeInfo.creditsRuleJsonDetailVo.lookAfterDayNum"
                placeholder="请输入"
                class="singleInputClass">
              </a-input>
              <div class="singleFormText">天内,购买了</div>
              <!-- <a-button @click="chooseGoods()">+添加商品</a-button> -->
              <div class="goodsContentDiv" @click="chooseGoodsMethod">
                <div v-if="goodsList.length === 0" class="noGoodsDiv">+商品库</div>
                <div v-else class="tagDiv">
                  <div v-for="item in goodsList" :key="item.id" class="singleTagDiv">
                    {{ item.name }}
                    <div class="delete" @click.stop="deleteSingleGoods(item)">+</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="singleRulesContent">
              <div class="singleFormText">且</div>
              <a-input
                v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo && integralRulesTypeInfo.creditsRuleJsonDetailVo.salesReturnDayNum"
                v-model="integralRulesTypeInfo.creditsRuleJsonDetailVo.salesReturnDayNum"
                placeholder="请输入"
                class="singleInputClass">
              </a-input>
              <div class="singleFormText">天内，未退货，员工可获得</div>
              <a-input
                v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo && integralRulesTypeInfo.creditsRuleJsonDetailVo.integral"
                v-model="integralRulesTypeInfo.creditsRuleJsonDetailVo.integral"
                placeholder="请输入"
                class="singleInputClass">
              </a-input>
              <div class="singleFormText">积分</div>
            </div>
          </div>
        </div>
        <div class="singleFormDiv">
          <div class="singleFormTitle">适用员工</div>
          <selectPersonnel
            v-if="treeData"
            :record="treeData"
            class="selectPersonnelCom"
            type="button"
            name="添加员工"
            v-model="employeeIds"
            @getVal="employeeIdsChange"
          />
        </div>
        <div class="formRulesDesc">积分奖励将在满足条件的后一天0点，集中发放，发放的积分数量，以最新的规则为准</div>
      </div>
      <template slot="footer">
        <a-button
          @click="closeIntegralBuyModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmIntegralBuy">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="好友查看素材"
      :maskCloseable="false"
      :width="1000"
      :visible="integralMaterialShowStatus"
      class="materialModalClass"
      @cancel="closeIntegralMaterialModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <div class="formDivContent">
        <div class="singleFormDiv">
          <div class="singleFormTitle">规则状态</div>
          <a-switch
            :checked="integralRulesTypeInfo.state === '1' ? true : false"
            @click="setRules(integralRulesTypeInfo)"
            checked-children="开"
            un-checked-children="关"
          />
          <div class="switchText">{{ integralRulesTypeInfo.state === '1' ? '已启用' : '未启用' }}</div>
        </div>
        <div class="singleFormRulesDiv">
          <div class="singleFormTitle">积分规则</div>
          <div class="singleFormContent">
            <div class="singleRulesContent">
              <div class="singleFormText">好友查看了</div>
              <!-- <a-input placeholder="请选择互动雷达"></a-input> -->
              <div class="radarContentDiv" @click="chooseRadarMethod">
                <div v-if="radarList.length === 0" class="noRadarDiv">+互动雷达</div>
                <div v-else class="tagDiv">
                  <div v-for="item in radarList.slice(0,1)" :key="item.id" class="singleTagDiv">
                    {{ item.title }}
                    <div class="delete" @click.stop="deleteSingleTag(item)">+</div>
                  </div>
                  <div v-if="radarList.length > 1" class="singleTagDiv">{{ `+${radarList.length - 1}` }}</div>
                  <div v-if="radarList.length !== 0" class="clearTagDiv" @click.stop="clearTagMethod">X</div>
                </div>
              </div>
              <div class="singleFormText">后，员工可获得</div>
              <a-input
                v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo && integralRulesTypeInfo.creditsRuleJsonDetailVo.integral"
                v-model="integralRulesTypeInfo.creditsRuleJsonDetailVo.integral"
                placeholder="请输入"
                class="singleInputClass">
              </a-input>
              <div class="singleFormText">积分</div>
            </div>
            <div class="singleRulesContent">
              <div class="singleFormText">每个素材</div>
              <!-- <a-input default-value="10" class="singleInputClass"></a-input> -->
              <a-input
                v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo && integralRulesTypeInfo.creditsRuleJsonDetailVo.validDayNum"
                v-model="integralRulesTypeInfo.creditsRuleJsonDetailVo.validDayNum"
                placeholder="请输入"
                class="singleInputClass">
              </a-input>
              <div class="singleFormText">天内可生效1次</div>
            </div>
          </div>
        </div>
        <div class="singleFormDiv">
          <div class="singleFormTitle">适用员工</div>
          <selectPersonnel
            v-if="treeData"
            :record="treeData"
            class="selectPersonnelCom"
            type="button"
            name="添加员工"
            v-model="employeeIds"
            @getVal="employeeIdsChange"
          />
        </div>
        <div class="formRulesDesc">积分奖励将在满足条件的后一天0点，集中发放，发放的积分数量，以最新的规则为准</div>
      </div>
      <template slot="footer">
        <a-button
          @click="closeIntegralMaterialModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmIntegralMaterial">确定</a-button>
      </template>
    </a-modal>
    <goodsManager
      :isRadioStatus="true"
      :zIndex="1200"
      :showStatus.sync="chooseGoodsManagerShowStatus"
      :permissionText="''"
      @submitConfirm="submitGoodsConfirm">
    </goodsManager>
    <chooseRadar :zIndex="800" :isRadioStatus="false" v-model="radarVisible" @handleAddRadarOk="handleAddRadarOk"></chooseRadar>
  </div>
</template>

<script>
import selectMonthDate from './selectMonthDate.vue'
import moment from 'moment'
import goodsManager from './goodsManager.vue'
import chooseRadar from './chooseRadar.vue'
import { getDict } from '@/api/common'
import { getCommonRulesApi, setCommonRulesApi, getIntegralRulesApi, setIntegralRulesApi, getTempCommonData, getTempIntegralData } from '@/api/integralManager'
export default {
  name: 'BackendIntegralRules',
  data () {
    return {
      integralRulesTypeDetail: {}, // 积分规则设置详情
      integralRulesTypeInfo: {}, // 积分规则设置对象
      commonValidityTypeInfo: {}, // 通用规则设置有效期对象
      commonRuleTypeList: [], // 通用规则限制类型列表
      radarList: [], // 选中的雷达列表
      goodsList: [], // 选中的商品列表
      // 雷达素材组件显示状态
      radarVisible: false,
      // 商品库组件显示状态
      chooseGoodsManagerShowStatus: false,
      treeData: [],
      employeeIds: [],
      // 积分规则设置好友查看素材任务弹框
      integralMaterialShowStatus: false,
      // 积分规则设置群发朋友圈任务弹框
      integralFriendCircleShowStatus: false,
      // 积分规则设置加好友任务弹框
      integralAddFriendShowStatus: false,
      // 积分规则设置购买任务弹框
      integralBuyShowStatus: false,
      // 通用规则积分到期提醒单选value值
      remindTypeName: 'noRemind',
      // 通用规则积分到期提醒弹框
      commonRemindShowStatus: false,
      // 通用规则设置积分过期提醒选项列表
      commonRemindTypeList: [],
      // 通用规则积分上限单选value值
      limitTypeName: 'noLimit',
      // 通用规则有效期单选value值
      validityTypeName: '',
      singleIntegralName: '年',
      // 通用规则设置有效期弹框
      commonValidityShowStatus: false,
      // 通用规则设置有效期选项列表
      commonValidityTypeList: [],
      // 通用规则设置积分上限弹框
      commonLimitShowStatus: false,
      // 通用规则设置积分上限选项列表
      commonLimitTypeList: [],
      // 通用规则每笔积分有效期维度列表
      singleIntegralValidityTypeList: [],
      // 通用规则列表加载动画
      commonTableLoading: false,
      // 通用规则列表数据
      commonTableData: [],
      // 通用规则列表表头
      commonTableColumns: [
        {
          title: '规则名称',
          dataIndex: 'setName',
          align: 'center',
          width: 200
        },
        {
          title: '规则详情',
          dataIndex: 'setDetail',
          align: 'center',
          width: 300
        },
        {
          title: '更新时间',
          dataIndex: 'updatedAt',
          align: 'center',
          width: 200
        },
        {
          title: '操作',
          align: 'center',
          width: 250,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      // 通用规则列表翻页数据
      commonPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      },
      // 积分规则列表加载动画
      integralTableLoading: false,
      // 积分规则列表数据
      integralTableData: [],
      // 积分规则列表表头
      integralTableColumns: [
        {
          title: '规则名称',
          dataIndex: 'ruleName',
          align: 'center',
          width: 200
        },
        {
          title: '规则详情',
          dataIndex: 'rulesDetail',
          align: 'center',
          width: 300
        },
        {
          title: '更新时间',
          dataIndex: 'updatedAt',
          align: 'center',
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'state',
          align: 'center',
          width: 200
        },
        {
          title: '类型',
          dataIndex: 'sysRuleType',
          align: 'center',
          width: 200
        },
        {
          title: '操作',
          align: 'center',
          width: 250,
          fixed: 'right',
          scopedSlots: { customRender: 'options' },
          all: true
        }
      ],
      // 积分规则列表翻页数据
      integralPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  components: {
    goodsManager,
    chooseRadar,
    selectMonthDate
  },
  created () {
    this.getIntegralValidateType()
    // this.getCommonRuleLimitData()
    // 正式的通用规则数据
    // this.getCommonRulesData()
    // 正式的积分规则数据
    // this.getIntegralRulesData()
    // 临时获取通用规则
    this.commonTableData = getTempCommonData()
    this.integralTableData = getTempIntegralData()
  },
  methods: {
    // 切换每次清空时间
    changeMonthDay (e) {
      console.log(e, '切换每次清空时间')
      this.$set(this.commonValidityTypeInfo, 'lastYearMonthDay', '')
      this.$set(this.commonValidityTypeInfo, 'nextYearMonthDay', '')
    },
    // 切换是否生效
    setRules (info) {
      if (info.state === '1') {
        this.$set(this.integralRulesTypeInfo, 'state', '0')
      } else {
        this.$set(this.integralRulesTypeInfo, 'state', '1')
      }
    },
    // 获取积分规则列表
    async getIntegralRulesData () {
      this.integralTableLoading = true
      const params = {
        page: this.integralPagination.current,
        perPage: this.integralPagination.pageSize
      }
      await getIntegralRulesApi(params).then(response => {
        this.integralTableLoading = false
        // console.log(response)
        this.integralTableData = response.data.list
        this.$set(this.integralPagination, 'total', Number(response.data.page.total))
        if (this.integralTableData.length === 0) {
          // 列表中没有数据
          if (this.integralPagination.total !== 0) {
            // 总数据有,但当前页没有
            // 重新将页码换成1
            this.$set(this.integralPagination, 'current', 1)
            this.getIntegralRulesData()
          } else {
            // 是真没有数据
          }
        }
      }).catch(() => {
        this.integralTableLoading = false
      })
    },
    // 积分规则切换页码
    handleTableChange ({ current, pageSize }, filters, sorter) {
      this.integralPagination.current = current
      this.integralPagination.pageSize = pageSize
      // if (sorter.order) {
      //   if (sorter.order === 'ascend') {
      //     this.sorter = 'asc'
      //   } else {
      //     this.sorter = 'desc'
      //   }
      // } else {
      //   this.sorter = ''
      // }
      this.getIntegralRulesData()
    },
    // 通用更新积分规则
    commonIntegralRulesSend () {
      setIntegralRulesApi().then(response => {
        console.log(response, '更新积分规则')
      })
    },
    // 切换到期提醒
    changeRemind () {
      if (this.commonValidityTypeInfo.restrictionType === '7') {
        // 选择的是到期提醒
        this.$set(this.commonValidityTypeInfo, 'beforeDayNum', '1')
        this.$set(this.commonValidityTypeInfo, 'beforeDayTime', moment('2022-10-10 10:00:00').format('HH:mm'))
        debugger
      } else {
        // 不提醒
        this.$set(this.commonValidityTypeInfo, 'beforeDayNum', '')
        this.$set(this.commonValidityTypeInfo, 'beforeDayTime', '')
      }
      this.$set(this.commonValidityTypeInfo, 'isChecked', '1')
    },
    // 切换积分上限
    changeLimit () {
      if (this.commonValidityTypeInfo.restrictionType === '5') {
        // 选择的是积分上限
        this.$set(this.commonValidityTypeInfo, 'integralMaxNum', 10)
      } else {
        // 无上限
        this.$set(this.commonValidityTypeInfo, 'integralMaxNum', '')
      }
      this.$set(this.commonValidityTypeInfo, 'isChecked', '1')
    },
    // 获取积分有效期类型
    getIntegralValidateType () {
      const params = { dictType: 'ytd_type' }
      getDict(params).then(response => {
        this.singleIntegralValidityTypeList = response.data
      })
    },
    // 切换每笔积分类型
    changeSingleValidateType (e) {
      console.log(e, '切换每笔积分类型')
      // debugger
      const tempValue = e
      if (tempValue === '1') {
        // 为年,最小值为1,最大值为3,初始值为1
        this.$set(this.commonValidityTypeInfo, 'minNumber', 1)
        this.$set(this.commonValidityTypeInfo, 'maxNumber', 3)
        this.$set(this.commonValidityTypeInfo, 'ytdNum', 1)
      } else if (tempValue === '2') {
        // 为月,最小值为1,最大值为18
        this.$set(this.commonValidityTypeInfo, 'minNumber', 1)
        this.$set(this.commonValidityTypeInfo, 'maxNumber', 18)
        this.$set(this.commonValidityTypeInfo, 'ytdNum', 1)
      } else if (tempValue === '3') {
        // 为日,最小值为1,最大值为365
        this.$set(this.commonValidityTypeInfo, 'minNumber', 1)
        this.$set(this.commonValidityTypeInfo, 'maxNumber', 365)
        this.$set(this.commonValidityTypeInfo, 'ytdNum', 1)
      }
    },
    // 切换有效期选项
    changeValidity (e) {
      console.log(e, '切换有效期选项')
      const targetValue = e.target.value
      // 将其他字段清空
      for (const item in this.commonValidityTypeInfo) {
        if (item !== 'restrictionType') {
          this.$set(this.commonValidityTypeInfo, `${item}`, '')
        }
      }
      this.$set(this.commonValidityTypeInfo, 'isChecked', '1')
      if (targetValue === '3') {
        // 为3,表示是每笔积分设置
        this.$set(this.commonValidityTypeInfo, 'minNumber', 1)
        this.$set(this.commonValidityTypeInfo, 'maxNumber', 3)
        this.$set(this.commonValidityTypeInfo, 'ytdNum', 1)
        this.$set(this.commonValidityTypeInfo, 'ytdType', this.singleIntegralValidityTypeList[0].code)
      }
      // const targetIndex = this.commonValidityTypeList.findIndex(item => item.restrictionType === targetValue)
      // const tempArray = this.commonValidityTypeList.map(item => {
      //   item.isChecked = '0'
      //   return item
      // })
      // this.$set(tempArray[targetIndex], 'isChecked', '1')
      // this.commonValidityTypeList = Object.assign([], tempArray)
    },
    // 切换去年时间
    changePreviousDate () {
      console.log('切换去年时间')
      const tempNextMonthDay = moment(this.commonValidityTypeInfo.monthDay).subtract(1, 'd')
      this.$set(this.commonValidityTypeInfo, 'nextYearMonthDay', moment(tempNextMonthDay).format('MM-DD'))
    },
    disableBeforeDate (targetDate, currentDate) {
      // targetDate 为固定值,currentDate为变化值
      const tempTargetDate = moment(targetDate).format('MM-DD')
      const tempTargetAllDate = '2023-' + tempTargetDate
      const tempCurrentDate = moment(currentDate).format('MM-DD')
      const tempCurrentAllDate = '2023-' + tempCurrentDate
      const targetMinDate = moment('2023-01-01').format('YYYY-MM-DD')
      if (moment(targetMinDate).valueOf() <= moment(tempCurrentAllDate).valueOf() &&
        moment(tempTargetAllDate).valueOf() >= moment(tempCurrentAllDate).valueOf()
      ) {
        // 大于当年最小时间,小于等于设置的时间
        return false
      } else {
        return true
      }
    },
    // 获取规则限制类型数据字典
    async getCommonRuleLimitData () {
      const params = { dictType: 'restriction_type' }
      await getDict(params).then(response => {
        this.commonRuleTypeList = response.data
      })
    },
    // 获取通用规则设置
    getCommonRulesData () {
      getCommonRulesApi().then(response => {
        console.log(response, '获取通用规则设置')
        this.commonTableData = response.data
      })
    },
    // 返回选项姓名
    returnRadioName (info) {
      // console.log(info, 'info')
      const index = this.commonRuleTypeList.findIndex(item => item.code === info.restrictionType)
      return this.commonRuleTypeList[index].name
    },
    // 选择商品
    chooseGoodsMethod () {
      this.chooseGoodsManagerShowStatus = true
    },
    // 商品库确认回调
    submitGoodsConfirm (e) {
      this.chooseGoodsManagerShowStatus = false
      console.log(e, '选择商品库回调')
      this.goodsList = Object.assign([], e)
    },
    // 删除单个商品标签
    deleteSingleGoods (item) {
      const deleteIndex = this.goodsList.findIndex(info => info.id === item.id)
      this.goodsList.splice(deleteIndex, 1)
    },
    // 选择雷达素材
    chooseRadarMethod () {
      this.radarVisible = true
    },
    // 雷达素材选择回调
    handleAddRadarOk (e) {
      console.log(e, '选择雷达素材回调')
      this.radarVisible = false
      this.radarList = Object.assign([], e)
    },
    // 清空雷达选择
    clearTagMethod () {
      this.radarList = []
    },
    // 删除单个标签
    deleteSingleTag (item) {
      const deleteIndex = this.radarList.findIndex(info => info.id === item.id)
      this.radarList.splice(deleteIndex, 1)
    },
    // 选择组织机构
    employeeIdsChange (e) {
      console.log(e, 'eeee')
    },
    // 通用规则设置
    setCommonMethod (info) {
      // console.log(info, 'info')
      if (info.setType === '1') {
        // 点击的是有效期
        this.commonValidityShowStatus = true
        this.$nextTick(() => {
          // 得到当前生效的对象
          this.commonValidityTypeInfo = Object.assign({}, info.creditsSetDeatilVo)
          // 筛选出当前生效的数据
          // this.validityTypeName = this.commonValidityTypeList.filter(item => item.isChecked === '1')[0].restrictionType
          // this.singleIntegralValidityList = getSingleIntegralTypeData()
        })
        // this.singleIntegralValidityList = getSingleIntegralTypeData()
      } else if (info.setType === '2') {
        // 点击的是积分上限
        this.commonLimitShowStatus = true
        // this.commonLimitTypeList = Object.assign([], info.creditsSetDeatilVoList)
        this.$nextTick(() => {
          // this.commonLimitTypeList = Object.assign([], info.creditsSetDeatilVoList)
          this.commonValidityTypeInfo = Object.assign({}, info.creditsSetDeatilVo)
        })
      } else if (info.setType === '3') {
        // 点击的是到期提醒
        this.commonRemindShowStatus = true
        // this.commonRemindTypeList = Object.assign([], info.creditsSetDeatilVoList)
        this.$nextTick(() => {
          // this.commonRemindTypeList = Object.assign([], info.creditsSetDeatilVoList)
          this.commonValidityTypeInfo = Object.assign({}, info.creditsSetDeatilVo)
        })
      }
      this.$set(this.commonValidityTypeInfo, 'id', info.id)
    },
    // 通用规则有效期点击确定
    confirmCommonValidity () {
      const tempType = this.commonValidityTypeInfo.restrictionType
      if (tempType === '2') {
        // 选择的为定期清零
        if (this.commonValidityTypeInfo.monthDay && this.commonValidityTypeInfo.lastYearMonthDay && this.commonValidityTypeInfo.nextYearMonthDay) {
          // 可以提交
          console.log(this.commonValidityTypeInfo, '有效期提交对象')
        } else {
          // 不可提交
          this.$message.error('请填写全部数据')
          return false
        }
      } else if (tempType === '3') {
        // 选择的为每笔积分有效期
        if (this.commonValidityTypeInfo.ytdType && this.commonValidityTypeInfo.ytdNum) {
          // 可以提交
          console.log(this.commonValidityTypeInfo, '有效期提交对象')
        } else {
          // 不可提交
          this.$message.error('请填写全部数据')
          return false
        }
      } else {
        console.log(this.commonValidityTypeInfo, '有效期提交对象')
      }
      // console.log(this.commonValidityTypeInfo, '有效期提交对象')
      debugger
      this.commonValidityShowStatus = false
      this.commonRulesSendMethod()
    },
    // 通用规则提交方法
    commonRulesSendMethod () {
      setCommonRulesApi().then(response => {
        console.log(response, '设置有效期弹框接口返回')
      })
    },
    // 通用规则有效期点击取消
    closeCommonValidityModal () {
      this.commonValidityShowStatus = false
    },
    // 通用规则积分上限点击确定
    confirmCommonLimit () {
      // this.commonLimitShowStatus = false
      const tempType = this.commonValidityTypeInfo.restrictionType
      if (tempType === '5') {
        // 选择的为积分上限
        if (this.commonValidityTypeInfo.integralMaxNum) {
          // 可以提交
          console.log(this.commonValidityTypeInfo, '积分上限提交对象')
        } else {
          // 不可提交
          this.$message.error('请填写全部数据')
          return false
        }
      } else {
        console.log(this.commonValidityTypeInfo, '积分上限提交对象')
      }
      // console.log(this.commonValidityTypeInfo, '有效期提交对象')
      debugger
      this.commonLimitShowStatus = false
      this.commonRulesSendMethod()
    },
    // 通用规则积分上限点击取消
    closeCommonLimitModal () {
      this.commonLimitShowStatus = false
    },
    // 通用规则积分到期提醒点击确定
    confirmCommonRemind () {
      // this.commonRemindShowStatus = false
      const tempType = this.commonValidityTypeInfo.restrictionType
      if (tempType === '7') {
        // 选择的为到期提醒
        if (this.commonValidityTypeInfo.beforeDayNum && this.commonValidityTypeInfo.beforeDayTime) {
          // 可以提交
          console.log(this.commonValidityTypeInfo, '到期提醒提交对象')
        } else {
          // 不可提交
          this.$message.error('请填写全部数据')
          return false
        }
      } else {
        console.log(this.commonValidityTypeInfo, '到期提醒提交对象')
      }
      // console.log(this.commonValidityTypeInfo, '有效期提交对象')
      debugger
      this.commonRemindShowStatus = false
      this.commonRulesSendMethod()
    },
    // 通用规则积分过期提醒点击取消
    closeCommonRemindModal () {
      this.commonRemindShowStatus = false
    },
    // 积分规则设置
    setIntegralMethod (info) {
      console.log(info, 'info')
      if (info.ruleType === '1') {
        // 群发朋友圈任务
        this.integralFriendCircleShowStatus = true
        // integralRulesTypeDetail
      } else if (info.ruleType === '2') {
        // 加好友
        this.integralAddFriendShowStatus = true
      } else if (info.ruleType === '3') {
        // 购买商品
        this.integralBuyShowStatus = true
      } else if (info.ruleType === '4') {
        // 查看素材
        this.integralMaterialShowStatus = true
      }
      this.$nextTick(() => {
        const tempInfo = Object.assign({}, info)
        if (!tempInfo.creditsRuleJsonDetailVo.integral) {
          // 积分为空时
          tempInfo.creditsRuleJsonDetailVo.integral = '10'
        }
        this.$set(tempInfo, 'creditsRuleJsonDetailVo', tempInfo.creditsRuleJsonDetailVo)
        this.integralRulesTypeInfo = Object.assign({}, tempInfo)
      })
    },
    // 设置朋友圈弹框点击取消
    closeIntegralFriendCircleModal () {
      this.integralFriendCircleShowStatus = false
    },
    // 设置朋友圈弹框点击确定
    confirmIntegralFriendCircle () {
      if (this.integralRulesTypeInfo.ruleType === '1') {
        // 朋友圈
        if (this.integralRulesTypeInfo.creditsRuleJsonDetailVo.integral) {
          console.log('朋友圈可以提交', this.integralRulesTypeInfo)
        } else {
          this.$message.error('请填写全部数据')
        }
      }
      // this.integralFriendCircleShowStatus = false
    },
    // 设置加好友弹框点击取消
    closeIntegralAddFriendModal () {
      this.integralAddFriendShowStatus = false
    },
    // 设置加好友弹框点击确定
    confirmIntegralAddFriend () {
      // debugger
      if (this.integralRulesTypeInfo.ruleType === '2') {
        // 加好友
        if (this.integralRulesTypeInfo.creditsRuleJsonDetailVo.integral &&
          this.integralRulesTypeInfo.creditsRuleJsonDetailVo.friendDayNum) {
          console.log('加好友可以提交', this.integralRulesTypeInfo)
        } else {
          this.$message.error('请填写全部数据')
          return
        }
      }
      this.integralAddFriendShowStatus = false
    },
    // 设置购买弹框点击取消
    closeIntegralBuyModal () {
      this.integralBuyShowStatus = false
    },
    // 设置购买弹框点击确定
    confirmIntegralBuy () {
      if (this.integralRulesTypeInfo.ruleType === '3') {
        // 购买
        if (this.integralRulesTypeInfo.creditsRuleJsonDetailVo.integral &&
          this.integralRulesTypeInfo.creditsRuleJsonDetailVo.lookAfterDayNum &&
          this.integralRulesTypeInfo.creditsRuleJsonDetailVo.salesReturnDayNum) {
          console.log('购买可以提交', this.integralRulesTypeInfo)
        } else {
          this.$message.error('请填写全部数据')
          return
        }
      }
      this.integralBuyShowStatus = false
    },
    // 设置购买弹框点击取消
    closeIntegralMaterialModal () {
      this.integralMaterialShowStatus = false
    },
    // 设置购买弹框点击确定
    confirmIntegralMaterial () {
      if (this.integralRulesTypeInfo.ruleType === '4') {
        // 查看素材
        if (this.integralRulesTypeInfo.creditsRuleJsonDetailVo.integral &&
          this.integralRulesTypeInfo.creditsRuleJsonDetailVo.validDayNum) {
          console.log('购买可以提交', this.integralRulesTypeInfo)
        } else {
          this.$message.error('请填写全部数据')
          return
        }
      }
      this.integralMaterialShowStatus = false
    },
    // 新增商品
    addGoodsMethod (info) {
      console.log(info, '新增商品')
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../css/integralRules.less');;
</style>
