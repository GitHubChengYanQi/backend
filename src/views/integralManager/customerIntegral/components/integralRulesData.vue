<template>
  <div id="integral_data_container" ref="integral_data_container">
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
        <div slot="sysRuleType" slot-scope="text, record">
          <template>
            {{ record.sysRuleType === '1' ? '系统类型' : '' }}
          </template>
        </div>
        <div slot="state" slot-scope="text, record">
          <template>
            <!-- {{ record.sysRuleType === '1' ? '系统类型' : ''}} -->
            <a-tag color="#1890ff" v-if="record.state === '1'">已启用</a-tag>
            <a-tag color="#d1d1d1" v-if="record.state === '0'">未启用</a-tag>
          </template>
        </div>
        <div slot="options" slot-scope="text, record">
          <template>
            <div style="display: flex;justify-content: space-around;">
              <a-button type="link" @click="setIntegralMethod(record)">设置</a-button>
              <a-button type="link" @click="addGoodsMethod(record)" v-if="record.ruleType === '3' && record.isFirst">新增商品</a-button>
              <a-button type="link" style="color: #b1b1b1" @click="deleteGoodsMethod(record)" v-if="record.ruleType === '3' && !record.isFirst">删除</a-button>
            </div>
          </template>
        </div>
      </a-table>
    </div>
    <a-modal
      title="执行群发朋友圈任务"
      :maskCloseable="false"
      :width="1000"
      :visible="integralFriendCircleShowStatus"
      class="friendCircleModalClass"
      @cancel="closeIntegralFriendCircleModal()"
      :getContainer="() => $refs['integral_data_container']"
    >
      <a-spin :spinning="integralFriendCircleLoading">
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
              :value="integralRulesTypeInfo.creditsRuleJsonDetailVo.integral ? Number(integralRulesTypeInfo.creditsRuleJsonDetailVo.integral) : ''"
              @change="changeFriendCircleIntegralNumber">
            </a-input-number>
            <div class="singleFormText">积分</div>
          </div>
          <div class="singleFormDiv">
            <div class="singleFormCustomerTitle">适用员工</div>
            <selectPersonnel
              v-if="treeData"
              :record="treeData"
              class="selectPersonnelCom"
              type="button"
              name="添加员工"
              v-model="integralRulesTypeInfo.employeeIds"
              @getVal="employeeIdsChange"
            />
          </div>
          <div class="formRulesDesc">积分奖励将在员工执行群发朋友圈任务后立即发放</div>
        </div>
      </a-spin>
      <template slot="footer">
        <a-button
          :disabled="integralFriendCircleLoading === true"
          @click="closeIntegralFriendCircleModal()"
        >取消</a-button>
        <a-button type="primary" :disabled="integralFriendCircleLoading === true" @click="confirmIntegralFriendCircle">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="加好友"
      :maskCloseable="false"
      :width="1000"
      :visible="integralAddFriendShowStatus"
      class="addFriendModalClass"
      @cancel="closeIntegralAddFriendModal()"
      :getContainer="() => $refs['integral_data_container']"
    >
      <a-spin :spinning="integralAddFriendLoading">
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
              :value="integralRulesTypeInfo.creditsRuleJsonDetailVo.friendDayNum ?
                Number(integralRulesTypeInfo.creditsRuleJsonDetailVo.friendDayNum) : ''"
              @change="changeFriendDayNumber">
            </a-input-number>
            <div class="singleFormText">天</div>
            <div class="singleFormText">未流失，员工可获得</div>
            <a-input-number
              :min="1"
              v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo
                && integralRulesTypeInfo.creditsRuleJsonDetailVo.integral"
              :value="integralRulesTypeInfo.creditsRuleJsonDetailVo.integral ?
                Number(integralRulesTypeInfo.creditsRuleJsonDetailVo.integral) : ''"
              class="singleInputClass"
              @change="changeAddFriendIntegral">
            </a-input-number>
            <div class="singleFormText">积分</div>
          </div>
          <div class="singleFormDiv">
            <div class="singleFormCustomerTitle">适用员工</div>
            <selectPersonnel
              v-if="treeData"
              :record="treeData"
              class="selectPersonnelCom"
              type="button"
              name="添加员工"
              v-model="integralRulesTypeInfo.employeeIds"
              @getVal="employeeIdsChange"
            />
          </div>
          <div class="formRulesDesc">积分奖励将在满足条件的后一天0点，集中发放，发放的积分数量，以最新的规则为准</div>
        </div>
      </a-spin>
      <template slot="footer">
        <a-button
          :disabled="integralAddFriendLoading === true"
          @click="closeIntegralAddFriendModal()"
        >取消</a-button>
        <a-button type="primary" :disabled="integralAddFriendLoading === true" @click="confirmIntegralAddFriend">确定</a-button>
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
      :getContainer="() => $refs['integral_data_container']"
    >
      <a-spin :spinning="integralBuyLoading">
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
                  :value="integralRulesTypeInfo.creditsRuleJsonDetailVo.lookAfterDayNum ? Number(integralRulesTypeInfo.creditsRuleJsonDetailVo.lookAfterDayNum) : ''"
                  placeholder="请输入"
                  class="singleInputClass"
                  @change="changeBuyLookAfterDayNumber">
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
                  :value="integralRulesTypeInfo.creditsRuleJsonDetailVo.salesReturnDayNum ? Number(integralRulesTypeInfo.creditsRuleJsonDetailVo.salesReturnDayNum) : ''"
                  placeholder="请输入"
                  class="singleInputClass"
                  @change="changeBuySalesReturnDayNumber">
                </a-input>
                <div class="singleFormText">天内，未退货，员工可获得</div>
                <a-input
                  v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo && integralRulesTypeInfo.creditsRuleJsonDetailVo.integral"
                  :value="integralRulesTypeInfo.creditsRuleJsonDetailVo.integral ? Number(integralRulesTypeInfo.creditsRuleJsonDetailVo.integral) : ''"
                  placeholder="请输入"
                  class="singleInputClass"
                  @change="changeBuyIntegralNumber">
                </a-input>
                <div class="singleFormText">积分</div>
              </div>
            </div>
          </div>
          <div class="singleFormDiv">
            <div class="singleFormCustomerTitle">适用员工</div>
            <selectPersonnel
              v-if="treeData"
              :record="treeData"
              class="selectPersonnelCom"
              type="button"
              name="添加员工"
              v-model="integralRulesTypeInfo.employeeIds"
              @getVal="employeeIdsChange"
            />
          </div>
          <div class="formRulesDesc">积分奖励将在满足条件的后一天0点，集中发放，发放的积分数量，以最新的规则为准</div>
        </div>
      </a-spin>
      <template slot="footer">
        <a-button
          :disabled="integralBuyLoading === true"
          @click="closeIntegralBuyModal()"
        >取消</a-button>
        <a-button :disabled="integralBuyLoading === true" type="primary" @click="confirmIntegralBuy">确定</a-button>
      </template>
    </a-modal>
    <a-modal
      title="好友查看素材"
      :maskCloseable="false"
      :width="700"
      :visible="integralMaterialShowStatus"
      class="materialModalClass"
      @cancel="closeIntegralMaterialModal()"
      :getContainer="() => $refs['integral_data_container']"
    >
      <a-spin :spinning="integralMaterialLoading">
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
            <div class="singleFormContent singleFormContentDiv">
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
                <a-input-number
                  :min="1"
                  v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo && integralRulesTypeInfo.creditsRuleJsonDetailVo.integral"
                  :value="integralRulesTypeInfo.creditsRuleJsonDetailVo.integral ? Number(integralRulesTypeInfo.creditsRuleJsonDetailVo.integral) : ''"
                  placeholder="请输入"
                  class="singleInputClass"
                  @change="changeMaterialIntergralNumber">
                </a-input-number>
                <div class="singleFormText">积分</div>
              </div>
              <div class="singleRulesContent">
                <div class="singleFormText">每个素材</div>
                <!-- <a-input default-value="10" class="singleInputClass"></a-input> -->
                <a-input-number
                  :min="1"
                  v-if="integralRulesTypeInfo.creditsRuleJsonDetailVo && integralRulesTypeInfo.creditsRuleJsonDetailVo.validDayNum"
                  :value="integralRulesTypeInfo.creditsRuleJsonDetailVo.validDayNum ? Number(integralRulesTypeInfo.creditsRuleJsonDetailVo.validDayNum) : ''"
                  placeholder="请输入"
                  class="singleInputClass"
                  @change="changeMaterialValidDayNumber">
                </a-input-number>
                <div class="singleFormText">天内可生效1次</div>
              </div>
            </div>
          </div>
          <div class="singleFormDiv">
            <div class="singleFormCustomerTitle">适用员工</div>
            <selectPersonnel
              v-if="treeData"
              :record="treeData"
              class="selectPersonnelCom"
              type="button"
              name="添加员工"
              v-model="integralRulesTypeInfo.employeeIds"
              @getVal="employeeIdsChange"
            />
          </div>
          <div class="formRulesDesc">积分奖励将在满足条件的后一天0点，集中发放，发放的积分数量，以最新的规则为准</div>
        </div>
      </a-spin>
      <template slot="footer">
        <a-button
          :disabled="integralMaterialLoading === true"
          @click="closeIntegralMaterialModal()"
        >取消</a-button>
        <a-button :disabled="integralMaterialLoading === true" type="primary" @click="confirmIntegralMaterial">确定</a-button>
      </template>
    </a-modal>
    <goodsManager
      :isRadioStatus="true"
      :zIndex="1200"
      :showStatus.sync="chooseGoodsManagerShowStatus"
      :permissionText="''"
      @submitConfirm="submitGoodsConfirm">
    </goodsManager>
    <chooseRadar :zIndex="1200" :isRadioStatus="false" v-model="radarVisible" @handleAddRadarOk="handleAddRadarOk"></chooseRadar>
  </div>

</template>

<script>
import { deepClonev2 } from '@/utils/util'
import goodsManager from './goodsManager.vue'
import chooseRadar from './chooseRadar.vue'
import { getDict } from '@/api/common'
import { getIntegralRulesApi, setIntegralRulesApi } from '@/api/integralManager'
export default {
  name: 'BackendIntegralRulesData',
  data () {
    return {
      deepClonev2,
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
          dataIndex: 'ruleDetail',
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
          scopedSlots: { customRender: 'state' },
          width: 200
        },
        {
          title: '类型',
          dataIndex: 'sysRuleType',
          align: 'center',
          scopedSlots: { customRender: 'sysRuleType' },
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
      // 积分规则朋友圈任务弹框
      integralFriendCircleLoading: false,
      // 积分规则设置群发朋友圈任务弹框
      integralFriendCircleShowStatus: false,
      // 积分规则加好友弹框加载动画
      integralAddFriendLoading: false,
      // 积分规则设置加好友任务弹框
      integralAddFriendShowStatus: false,
      // 积分规则设置购买任务弹框
      integralBuyShowStatus: false,
      // 积分规则购买弹框加载动画
      integralBuyLoading: false,
      // 积分规则设置好友查看素材任务弹框
      integralMaterialShowStatus: false,
      // 积分规则好友查看素材弹框加载动画
      integralMaterialLoading: false,
      // 雷达素材组件显示状态
      radarVisible: false,
      // 商品库组件显示状态
      chooseGoodsManagerShowStatus: false,
      radarList: [], // 选中的雷达列表
      goodsList: [], // 选中的商品列表
      employeeIds: [],
      treeData: [],
      integralRulesTypeInfo: {}, // 积分规则设置对象
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
    chooseRadar
  },
  created () {
    this.getIntegralRulesData()
  },
  methods: {
    // 获取积分规则列表
    async getIntegralRulesData () {
      this.integralTableLoading = true
      const params = {
        page: this.integralPagination.current,
        perPage: this.integralPagination.pageSize
      }
      await getIntegralRulesApi(params).then(response => {
        console.log(response, '积分规则列表数据')
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
        } else if (this.integralPagination.current === 1) {
          // 为第一个出现的商品购买
          const tempArray = this.integralTableData.map(item => {
            item.isFirst = false
            return item
          })
          const tempIndex = this.integralTableData.findIndex(item => item.ruleType === '3')
          tempArray[tempIndex].isFirst = true
          this.integralTableData = this.deepClonev2(tempArray)
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
    // 点击积分规则设置
    setIntegralMethod (info) {
      console.log(info, 'info')
      if (info.ruleType === '1') {
        // 群发朋友圈任务
        this.integralFriendCircleShowStatus = true
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
        const tempInfo = this.deepClonev2(info)
        if (!tempInfo.creditsRuleJsonDetailVo.integral) {
          // 积分为空时
          tempInfo.creditsRuleJsonDetailVo.integral = '10'
        }
        this.$set(tempInfo, 'creditsRuleJsonDetailVo', tempInfo.creditsRuleJsonDetailVo)
        this.integralRulesTypeInfo = this.deepClonev2(tempInfo)
      })
    },
    // 切换是否生效
    setRules (info) {
      if (info.state === '1') {
        this.$set(this.integralRulesTypeInfo, 'state', '0')
      } else {
        this.$set(this.integralRulesTypeInfo, 'state', '1')
      }
    },
    // 改变朋友圈积分数值
    changeFriendCircleIntegralNumber (e) {
      this.$set(this.integralRulesTypeInfo.creditsRuleJsonDetailVo, 'integral', String(e))
    },
    // 设置朋友圈弹框点击取消
    closeIntegralFriendCircleModal () {
      if (!this.integralFriendCircleLoading) {
        this.integralFriendCircleShowStatus = false
      }
    },
    // 设置朋友圈弹框点击确定
    confirmIntegralFriendCircle () {
      if (this.integralRulesTypeInfo.ruleType === '1') {
        // 朋友圈
        if (this.integralRulesTypeInfo.creditsRuleJsonDetailVo.integral) {
          console.log('朋友圈可以提交', this.integralRulesTypeInfo)
        } else {
          this.$message.error('请填写全部数据')
          return false
        }
        debugger
        this.commonIntegralRulesSend()
      }
      // this.integralFriendCircleShowStatus = false
    },
    // 公共的积分规则提交
    commonIntegralRulesSend () {
      this.integralAddFriendLoading = true
      this.integralFriendCircleLoading = true
      this.integralBuyLoading = true
      setIntegralRulesApi(this.integralRulesTypeInfo).then(response => {
        if (response.code === 200) {
          this.integralFriendCircleLoading = false
          this.integralFriendCircleShowStatus = false
          this.integralAddFriendLoading = false
          this.integralAddFriendShowStatus = false
          this.integralBuyLoading = false
          this.integralBuyShowStatus = false
          // this.integralPagination.current
          this.$set(this.integralPagination, 'current', 1)
          this.$set(this.integralPagination, 'pageSize', 10)
          this.getIntegralRulesData()
        }
      }).catch(() => {
        this.integralFriendCircleLoading = false
        this.integralAddFriendLoading = false
        this.integralBuyLoading = false
      })
    },
    // 选择组织机构
    employeeIdsChange (e) {
    //   console.log(e, 'eeee', this.integralRulesTypeInfo.employeeIds)
      this.$set(this.integralRulesTypeInfo, 'employeeId', e.join(','))
    },
    // 改变新增好友弹框未流失天数
    changeFriendDayNumber (e) {
      // this.integralRulesTypeInfo.creditsRuleJsonDetailVo.friendDayNum
      this.$set(this.integralRulesTypeInfo.creditsRuleJsonDetailVo, 'friendDayNum', String(e))
    },
    // 改变新增好友弹框积分
    changeAddFriendIntegral (e) {
      this.$set(this.integralRulesTypeInfo.creditsRuleJsonDetailVo, 'integral', String(e))
    },
    // 设置加好友弹框点击取消
    closeIntegralAddFriendModal () {
      if (!this.integralAddFriendLoading) {
        this.integralAddFriendShowStatus = false
      }
    },
    // 设置加好友弹框点击确定
    confirmIntegralAddFriend () {
      // debugger
      if (this.integralRulesTypeInfo.ruleType === '2') {
        // 加好友
        if (this.integralRulesTypeInfo.creditsRuleJsonDetailVo.integral &&
          this.integralRulesTypeInfo.creditsRuleJsonDetailVo.friendDayNum) {
          console.log('加好友可以提交', this.integralRulesTypeInfo)
          debugger
          this.commonIntegralRulesSend()
        } else {
          this.$message.error('请填写全部数据')
        }
      }
    //   this.integralAddFriendShowStatus = false
    },
    // 改变购买弹框看素材后购买天数
    changeBuyLookAfterDayNumber (e) {
      this.$set(this.integralRulesTypeInfo.creditsRuleJsonDetailVo, 'lookAfterDayNum', String(e))
    },
    // 改变购买弹框未退换天数
    changeBuySalesReturnDayNumber (e) {
      this.$set(this.integralRulesTypeInfo.creditsRuleJsonDetailVo, 'salesReturnDayNum', String(e))
    },
    // 改变购买弹框积分数
    changeBuyIntegralNumber (e) {
      this.$set(this.integralRulesTypeInfo.creditsRuleJsonDetailVo, 'integral', String(e))
    },
    // 改变查看素材弹框积分
    changeMaterialIntergralNumber (e) {
      this.$set(this.integralRulesTypeInfo.creditsRuleJsonDetailVo, 'integral', String(e))
    },
    // 改变查看素材弹框生效一次天数
    changeMaterialValidDayNumber (e) {
      // integralRulesTypeInfo.creditsRuleJsonDetailVo.validDayNum
      this.$set(this.integralRulesTypeInfo.creditsRuleJsonDetailVo, 'validDayNum', String(e))
    },
    // 获取规则限制类型数据字典
    async getCommonRuleLimitData () {
      const params = { dictType: 'restriction_type' }
      await getDict(params).then(response => {
        this.commonRuleTypeList = response.data
      })
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
    // 设置购买弹框点击取消
    closeIntegralBuyModal () {
      if (!this.integralBuyLoading) {
        this.integralBuyShowStatus = false
      }
    },
    // 设置购买弹框点击确定
    confirmIntegralBuy () {
      if (this.integralRulesTypeInfo.ruleType === '3') {
        // 购买
        if (this.integralRulesTypeInfo.creditsRuleJsonDetailVo.integral &&
          this.integralRulesTypeInfo.creditsRuleJsonDetailVo.lookAfterDayNum &&
          this.integralRulesTypeInfo.creditsRuleJsonDetailVo.salesReturnDayNum) {
          console.log('购买可以提交', this.integralRulesTypeInfo)
          debugger
          this.commonIntegralRulesSend()
        } else {
          this.$message.error('请填写全部数据')
          return
        }
      }
      this.integralBuyShowStatus = false
    },
    // 设置查看素材弹框点击取消
    closeIntegralMaterialModal () {
      if (!this.integralMaterialLoading) {
        this.integralMaterialShowStatus = false
      }
    },
    // 设置查看素材弹框点击确定
    confirmIntegralMaterial () {
      if (this.integralRulesTypeInfo.ruleType === '4') {
        // 查看素材
        if (this.integralRulesTypeInfo.creditsRuleJsonDetailVo.integral &&
          this.integralRulesTypeInfo.creditsRuleJsonDetailVo.validDayNum &&
          this.radarList.length !== 0) {
          console.log('查看素材可以提交', this.integralRulesTypeInfo)
          debugger
          this.commonIntegralRulesSend()
        } else {
          this.$message.error('请填写全部数据')
        }
      }
      // this.integralMaterialShowStatus = false
    },
    // 新增商品
    addGoodsMethod (info) {
      console.log(info, '新增商品')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../css/integralRules.less');
</style>
