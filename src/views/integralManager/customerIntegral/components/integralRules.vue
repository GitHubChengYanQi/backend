<template>
  <div id="integral_rules_container" ref="integral_rules_container">
    <div class="commonRulesDiv">
      <div class="headTitleDiv">通用设置</div>
      <a-table
        :loading="commonTableLoading"
        :row-key="record => record.id"
        :data-source="commonTableData"
        :columns="commonTableColumns"
        :pagination="commonPagination"
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
      <a-radio-group class="radioValityGroupDiv" v-model="validityTypeName">
        <a-radio class="singleRadioDiv" v-for="item in commonValidityTypeList" :value="item.type" :key="item.id">
          <div v-if="item.type === 'allValidity'" class="singleRadioTitle">{{ item.name }}</div>
          <div v-if="item.type === 'regularReset'" class="singleRegularTopDiv">
            <div class="singleRadioTitle">{{ item.name }}</div>
            <div class="regularText">可设置清零时间与清零周期，例：每年9月1号，清零去年8月1号到今年7月31号获得的积分。</div>
          </div>
          <div class="regularContentView" v-if="item.type === 'regularReset'">
            <div class="singleRegularContent">
              每年
              <a-date-picker></a-date-picker>
              定期清零
            </div>
            <div class="singleRegularContent">
              去年
              <a-date-picker></a-date-picker>
              至下一年
              <a-date-picker></a-date-picker>
            </div>
          </div>
          <div v-if="item.type === 'singleIntegralValidity'" class="singleRadioContent">
            <div class="singleRadioTitle">{{ item.name + '为' }}</div>
            <a-input defaultValue="请输入值">
              <a-select slot="addonAfter" v-model="singlgeIntegralName">
                <a-select-option v-for="integralItem in singleIntegralValidityList" :key="integralItem.id" :value="integralItem.name">
                  {{ integralItem.name }}
                </a-select-option>
              </a-select>
            </a-input>
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
      <a-radio-group class="radioLimitGroupDiv" v-model="limitTypeName">
        <a-radio class="singleRadioDiv" v-for="item in commonLimitTypeList" :key="item.id" :value="item.value">
          <div class="singleRadioTitle" v-if="item.value === 'noLimit'">{{ item.name }}</div>
          <div class="singleRadioContent" v-if="item.value === 'limit'">
            <div class="singleRadioTitle">{{ item.name }}</div>
            <a-input></a-input>
          </div>
        </a-radio>
      </a-radio-group>
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
      <a-radio-group class="radioRemindGroupDiv" v-model="remindTypeName">
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
      </a-radio-group>
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
      :visible="integralFriendCircleShowSatus"
      class="friendCircleModalClass"
      @cancel="closeIntegralFriendCircleModal()"
      :getContainer="() => $refs['integral_rules_container']"
    >
      <div class="formDivContent">
        <div class="singleFormDiv">
          <div>规则状态</div>
          <div>已启用</div>
        </div>
        <div class="singleFormDiv">
          <div>积分规则</div>
          <div>任务时间内完成朋友圈群发任务，可获得</div>
        </div>
        <div class="singleFormDiv">
          <div>适用员工</div>
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
      </div>
      <template slot="footer">
        <a-button
          @click="closeIntegralFriendCircleModal()"
        >取消</a-button>
        <a-button type="primary" @click="confirmIntegralFriendCircle">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { getTempCommonData, getTempIntegralData, getValidityTypeData, getSingleIntegralTypeData, getCommonLimitListData, getCommonRemindListData } from '@/api/integralManager'
export default {
  name: 'BackendIntegralRules',
  data () {
    return {
      treeData: [],
      employeeIds: [],
      // 积分规则设置群发朋友圈任务弹框
      integralFriendCircleShowSatus: false,
      // 积分规则设置加好友任务弹框
      integralAddFriendShowStatus: false,
      // 积分规则设置购买任务弹框
      integralBuyShowStatus: false,
      // 积分规则设置查看素材任务弹框
      integralMaterialShowStatus: false,
      // 通用规则积分到期提醒单选value值
      remindTypeName: 'noRemind',
      // 通用规则积分到期提醒弹框
      commonRemindShowStatus: false,
      // 通用规则设置积分过期提醒选项列表
      commonRemindTypeList: [],
      // 通用规则积分上限单选value值
      limitTypeName: 'noLimit',
      // 通用规则有效期单选value值
      validityTypeName: 'allValidity',
      singlgeIntegralName: '年',
      // 通用规则设置有效期弹框
      commonValidityShowStatus: false,
      // 通用规则设置有效期选项列表
      commonValidityTypeList: [],
      // 通用规则设置积分上限弹框
      commonLimitShowStatus: false,
      // 通用规则设置积分上限选项列表
      commonLimitTypeList: [],
      // 通用规则每笔积分有效期维度列表
      singleIntegralValidityList: [],
      // 通用规则列表加载动画
      commonTableLoading: false,
      // 通用规则列表数据
      commonTableData: [],
      // 通用规则列表表头
      commonTableColumns: [
        {
          title: '规则名称',
          dataIndex: 'rulesName',
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
          dataIndex: 'updateDate',
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
          dataIndex: 'rulesName',
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
          dataIndex: 'updateDate',
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
          dataIndex: 'typeText',
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
  created () {
    this.commonTableData = getTempCommonData()
    this.integralTableData = getTempIntegralData()
  },
  methods: {
    // 选择组织机构
    employeeIdsChange (e) {
      console.log(e, 'eeee')
    },
    // 通用规则设置
    setCommonMethod (info) {
      console.log(info, 'info')
      if (info.type === 'validity') {
        // 点击的是有效期
        this.commonValidityShowStatus = true
        this.commonValidityTypeList = getValidityTypeData()
        this.singleIntegralValidityList = getSingleIntegralTypeData()
      } else if (info.type === 'limit') {
        this.commonLimitShowStatus = true
        this.commonLimitTypeList = getCommonLimitListData()
      } else if (info.type === 'remind') {
        this.commonRemindShowStatus = true
        this.commonRemindTypeList = getCommonRemindListData()
      }
    },
    // 通用规则有效期点击确定
    confirmCommonValidity () {
      this.commonValidityShowStatus = false
    },
    // 通用规则有效期点击取消
    closeCommonValidityModal () {
      this.commonValidityShowStatus = false
    },
    // 通用规则积分上限点击确定
    confirmCommonLimit () {
      this.commonLimitShowStatus = false
    },
    // 通用规则积分上限点击取消
    closeCommonLimitModal () {
      this.commonLimitShowStatus = false
    },
    // 通用规则积分到期提醒点击确定
    confirmCommonRemind () {
      this.commonRemindShowStatus = false
    },
    // 通用规则积分过期提醒点击取消
    closeCommonRemindModal () {
      this.commonRemindShowStatus = false
    },
    // 积分规则设置
    setIntegralMethod (info) {
      console.log(info, 'info')
      if (info.type === 'friendCircle') {
        // 群发朋友圈任务
        this.integralFriendCircleShowSatus = true
      } else if (info.type === 'addFriend') {
        // 加好友
        this.integralAddFriendShowStatus = true
      } else if (info.type === 'buy') {
        // 购买商品
        this.integralBuyShowStatus = true
      } else if (info.type === 'material') {
        // 查看素材
        this.integralMaterialShowStatus = true
      }
    },
    // 设置朋友圈弹框点击取消
    closeIntegralFriendCircleModal () {
      this.integralFriendCircleShowSatus = false
    },
    // 设置朋友圈弹框点击确定
    confirmIntegralFriendCircle () {
      this.integralFriendCircleShowSatus = false
    },
    // 新增商品
    addGoodsMethod (info) {
      console.log(info, '新增商品')
    }
  }
}
</script>

<style lang="less" scoped>
.commonRulesDiv {
  .headTitleDiv {
    font-size: 20px;
    font-weight: bolder;
    color: black;
  }
  .tableBox {
    background-color: white;
    margin-top: 20px;
  }
}
.integralRulesDiv {
  margin-top: 30px;
  .headTitleDiv {
    font-size: 20px;
    font-weight: bolder;
    color: black;
  }
  .tableBox {
    background-color: white;
    margin-top: 20px;
  }
}
.radioValityGroupDiv {
  /deep/.singleRadioDiv {
    margin-top: 20px;
    display: flex;
    .singleRadioTitle {
      font-size: 16px;
      color: black;
    }
    .singleRegularTopDiv {
      display: flex;
      align-items: center;
      .singleRadioTitle {
        font-size: 16px;
        color: black;
      }
      .regularText {
        font-size: 10px;
        color: #4e4e4e;
        margin-left: 20px;
      }
    }
    .singleRadioContent {
      display: flex;
      align-items: center;
      .singleRadioTitle {
        margin-right: 10px;
        font-size: 16px;
        color: black;
      }
    }
    .ant-radio {
      padding-top: 4px;
    }
    .regularContentView {
      .singleRegularContent {
        margin-top: 20px;
        font-size: 14px;
        color: black;
      }
    }
  }
}
.radioLimitGroupDiv {
  /deep/.singleRadioDiv {
    display: flex;
    margin-top: 20px;
    .ant-radio {
      display: flex;
      align-items: center;
    }
    .singleRadioTitle {
      font-size: 16px;
      color: black;
    }
    .singleRadioContent {
      display: flex;
      align-items: center;
      .singleRadioTitle {
        font-size: 16px;
        color: black;
        margin-right: 10px;
      }
    }
  }
}
.radioRemindGroupDiv {
  /deep/.singleRadioDiv {
    display: flex;
    margin-top: 20px;
    .ant-radio {
      display: flex;
      align-items: center;
    }
    .singleRadioTitle {
      font-size: 16px;
      color: black;
    }
    .singleRadioContent {
      display: flex;
      align-items: center;
      .singleRadioTitle {
        font-size: 16px;
        color: black;
        margin-right: 10px;
      }
      .singleRadioText {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
  }
}
.friendCircleModalClass {
  .formDivContent {
    /deep/.singleFormDiv {
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
    }
  }
}
</style>
