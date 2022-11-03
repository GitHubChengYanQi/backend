<template>
  <div class="box">
    <div class="card" v-show="loading">
      <loading :loading="loading" />
    </div>
    <div class="card" v-show="!loading">
      <div class="block">
        <div class="title">基础信息</div>
        <div class="content">
          <div class="input-row">
            <div class="title must">二维码名称：</div>
            <div class="content">
              <a-input
                :maxLength="30"
                placeholder="名称不会展示给用户，用于企业记录渠道名称或使用场景"
                v-model="form.base.name"
                :disabled="edit"
              />
            </div>
          </div>
          <div class="input-row">
            <div class="title must">选择分组：</div>
            <div class="content">
              <a-popover @click="groupShow = false" v-model="groupShow" trigger="click" placement="bottom">
                <template slot="content">
                  <div class="add-group-btn" @click="group.add = !group.add">
                    <a-icon type="plus-circle" class="mr6" />
                    添加分组
                  </div>
                  <div class="add-group-input" v-if="group.add">
                    <a-input placeholder="输入名称后回车" v-model="group.name" @keyup.enter="addGroupClick" />
                  </div>
                  <div class="groups">
                    <div class="item flex-between" v-for="v in group.list" :key="v.id" @click="selectGroup(v)">
                      <div class="name">
                        {{ v.name }}
                      </div>
                      <div class="count">
                        {{ v.total }}
                      </div>
                    </div>
                  </div>
                </template>
                <a-select
                  v-if="form.base.group.show"
                  :default-value="form.base.group.name"
                  :open="false"
                  :showArrow="false"
                />
              </a-popover>
            </div>
          </div>
          <div class="input-row title-start">
            <div class="title must">员工人员：</div>
            <!-- <a-radio-group v-model="form.base.employee.type">
                <a-radio :value="1"> 全天在线 </a-radio>
                <a-radio :value="2"> 自动上下线 </a-radio>
              </a-radio-group> -->
            <!-- <div class="mt12" v-show="form.base.employee.type === 1"> -->
            <!-- <a-button @click="$refs.selectEmployee.$show(form.base.employee.list)">
                    <a-icon type="plus" />
                    添加成员
                  </a-button> -->
            <SelectPersonnel v-model="form.base.empIds" :name="'添加成员'" v-if="treeData" :record="treeData" :type="'button'"></SelectPersonnel>
            <!-- <div class="ml16 fz13 desc-text">
                    同一个二维码可选择多位员工成员进行接待，客户扫码后随机分配一名员工人员
                  </div> -->
            <!-- <div class="flex">
              <a-tag
                v-for="(v, i) in form.base.employee.list"
                :key="v.id"
                closable
                @close="form.base.employee.list.splice(i, 1)"
              >
                {{ v.name }}
              </a-tag>
            </div> -->
            <!-- <div class="mt12" v-show="form.base.employee.type === 2">
                <div class="times">
                  <div class="item flex" v-for="(v, i) in form.base.employee.autoList" :key="i">
                    <div class="line-card">
                      <div class="mb16">
                        <span>员工选择：</span>
                        <a-button @click="selectEmployeeAutoShow(v, i)">
                          <a-icon type="plus" />
                          添加成员
                        </a-button>
                        <div class="flex mt12" v-if="v.employees.length">
                          <div class="tags">
                            <a-tag
                              v-for="(employees, employeesIndex) in v.employees"
                              :key="employees.id"
                              closable
                              @close="v.employees.splice(employeesIndex, 1)"
                            >
                              {{ employees.name }}
                            </a-tag>
                          </div>
                        </div>
                      </div>
                      <div class="mb16">
                        <span>工作周期：</span>
                        <a-select mode="multiple" v-model="v.week" style="width: 480px">
                          <a-select-option
                            v-for="(week, weekIndex) in inputTemp.week"
                            :key="weekIndex"
                            :value="week.value"
                          >
                            {{ week.text }}
                          </a-select-option>
                        </a-select>
                      </div>
                      <div class="flex">
                        <span>上线时间：</span>
                        <div class="flex">
                          <a-time-picker v-model="v.startTime" format="HH:mm" />
                          <span class="ml8 mr8">～</span>
                          <a-time-picker v-model="v.endTime" format="HH:mm" />
                        </div>
                      </div>
                    </div>
                    <div class="del ml16" v-if="form.base.employee.autoList.length > 1">
                      <a-icon type="delete" @click="form.base.employee.autoList.splice(i, 1)" />
                    </div>
                  </div>
                  <a @click="addAuto">
                    <a-icon type="plus-circle" class="mr3" />
                    添加其他工作周期
                  </a>
                </div>
              </div> -->
          </div>
          <!-- <div class="input-row title-start">
            <div class="title">员工添加上限：</div>
            <div class="content">
              <div class="flex mb12">
                <a-switch
                  :disabled="form.base.employee.list.length <= 0 ? true : false"
                  checked-children="开"
                  un-checked-children="关"
                  v-model="switchTemp.addLimit"
                />
              </div>
              <div v-if="switchTemp.addLimit">
                <a-alert
                  message="员工添加上限：员工从该渠道添加的客户达到每日上限后将自动下线，当日不再接待该渠道新客户"
                  type="info"
                  class="mb16"
                />
                <div
                  style="
                    margin-bottom: 10px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <a-input
                    :allowClear="true"
                    v-model="serchUser"
                    style="width: 40%"
                    placeholder="搜索员工"
                    @pressEnter="pressEnter"
                  />
                  <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
                    <a-popconfirm
                      placement="bottomLeft"
                      class="cscscsc"
                      style="padding: 10px 12px !important"
                      @confirm="userConfirm"
                      :getPopupContainer="
                        (triggerNode) => {
                          return triggerNode.parentNode
                        }
                      "
                    >
                      <template slot="title">
                        员工每日添加上限：
                        <a-input-number
                          v-model="upperLimit"
                          size="small"
                          :min="1"
                          :max="100000"
                          :default-value="3"
                          @change="upperLimitChange"
                        />
                      </template>
                      <div style="color: #1890ff; cursor: pointer">批量设置</div>
                    </a-popconfirm>
                  </div>
                </div>

                <div class="member-table">
                  <div class="header">
                    <div class="left">
                      <a-checkbox
                        :indeterminate="indeterminate"
                        :checked="checkAll"
                        @change="onCheckAllChange"
                        style="margin-right: 10px"
                      >
                      </a-checkbox
                      >共{{ form.base.addMax.employees.length }}个员工
                    </div>
                    <div class="right">每日添加客户上限</div>
                  </div>
                  <a-checkbox-group v-model="checkedList" @change="onChanges" style="width: 100%">
                    <div class="" v-for="v in form.base.addMax.employees" :key="v.id">
                      <div class="item" v-if="!v.hide">
                        <div class="left flex">
                          <a-checkbox :value="v"> </a-checkbox>
                          <div class="avatar ml8">
                            <img :src="v.avatar" />
                          </div>
                          <div class="name ml12">
                            {{ v.name }}
                          </div>
                        </div>
                        <div class="right flex">
                          <input v-model="v.max" class="max-input" />
                        </div>
                      </div>
                    </div>
                    <a-empty name="暂无员工" v-if="form.base.addMax.employees.length <= 0" />
                    <div
                      style="display: flex; flex-direction: column; align-items: center; margin: 30px"
                      v-if="form.base.addMax.employees.length <= 0"
                    >
                      <img src="../../assets/search-empty.svg" alt="" />
                      <span>没有搜索到相关员工</span>
                    </div>
                  </a-checkbox-group>
                </div>
              </div>
            </div>
          </div> -->
          <!-- <div class="input-row title-start">
            <div class="title">备用员工：</div>
            <div class="content">
              <a-button @click="$refs.selectEmployeeSpare.$show(form.base.spareEmployee)">
                <a-icon type="plus" />
                添加备用成员
              </a-button>
              <div class="flex mt16" v-if="form.base.spareEmployee.length">
                <a-tag
                  v-for="(v, i) in form.base.spareEmployee"
                  :key="v.id"
                  closable
                  @close="form.base.spareEmployee.splice(i, 1)"
                >
                  {{ v.name }}
                </a-tag>
              </div>
            </div>
          </div> -->
          <div class="input-row title-start">
            <div class="title">客户标签：</div>
            <div class="content">
              <a-switch checked-children="开" un-checked-children="关" v-model="switchTemp.tag" />
              <div class="mt16" v-if="switchTemp.tag">
                <a-button type="primary" ghost @click="$refs.childRef.show(form.base.tags)">
                  <a-icon type="plus" />
                  添加标签
                </a-button>
                <div class="flex mt16">
                  <a-tag v-for="(v, i) in form.base.tags" :key="v.id" closable @close="form.base.tags.splice(i, 1)">
                    {{ v.name }}
                  </a-tag>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="input-row title-start">
            <div class="title">客户备注：</div>
            <div class="content">
              <a-switch checked-children="开" un-checked-children="关" v-model="switchTemp.remark" />
              <span class="desc-text ml8">开启后可为客户昵称加备注，方便查看客户来源</span>
              <div class="mt16" v-if="switchTemp.remark">
                <div class="line-card">
                  <div class="flex">
                    备注位置：
                    <a-radio-group v-model="form.base.remark.type">
                      <a-radio :value="1">备注在昵称后</a-radio>
                      <a-radio :value="2">备注在昵称前</a-radio>
                    </a-radio-group>
                  </div>
                  <div class="ml70 mt16">
                    <a-input
                      :maxLength="10"
                      :addon-before="form.base.remark.type === 1 ? '客户昵称-' : ''"
                      :addon-after="form.base.remark.type === 2 ? '-客户昵称' : ''"
                      default-value="mysite"
                      v-model="form.base.remark.remark"
                    />
                    <div style="display: flex; margin-top: 10px">
                      预览:
                      <div
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          margin-left: 10px;
                          height: 49px;
                          background: #fff;
                          border-radius: 4px;
                          border: 1px solid #dcdfe6;
                          padding: 8px 10px;
                          margin-left: 8px;
                          color: rgba(0, 0, 0, 0.45);
                        "
                      >
                         <img style="width: 35px; margin-right: 7px" src="../../assets/avatar-default.svg" alt="" />
                        <div v-if="form.base.remark.type === 1">
                          客户昵称 -
                          <span style="color: #000">{{ form.base.remark.remark }}</span>
                        </div>
                        <div v-else>
                          <span style="color: #000">{{ form.base.remark.remark }}</span>
                          - 客户昵称
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
          <!-- <div class="input-row title-start">
            <div class="title">客户描述：</div>
            <div class="content">
              <a-switch checked-children="开" un-checked-children="关" v-model="switchTemp.desc" />
              <span class="desc-text ml8">开启后可为客户添加描述，将在客户画像里展示</span>
              <div class="mt16" v-if="switchTemp.desc">
                <textarea
                  :maxLength="150"
                  class="textarea-box"
                  placeholder="请输入客户描述内容"
                  v-model="form.base.desc"
                />
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <!-- <div class="block">
        <div class="title">设置欢迎语</div>
        <div class="content">
          <div class="input-row">
            <div class="title">设置欢迎语：</div>
            <div class="content">
              <a-radio-group v-model="form.welcomeMsg.type">
                <a-radio :value="1">渠道欢迎语</a-radio>
                <a-radio :value="2">默认欢迎语</a-radio>
                <a-radio :value="3">不发送欢迎语</a-radio>
              </a-radio-group>
            </div>
          </div>
          <div class="input-row title-start" v-show="form.welcomeMsg.type === 1">
            <div class="title">消息内容：</div>
            <div class="content enter-text-box">
              <div class="flex-between">
                <div class="left">
                  <div class="box">
                    <EnterTextMsg ref="defaultEnter" v-model="form.welcomeMsg.defaultMsg" />
                  </div>
                </div>
                <div class="right">
                  <Preview ref="defaultMsg" />
                </div>
              </div>
            </div>
          </div>
          <div class="input-row title-start" v-show="form.welcomeMsg.type === 1">
            <div class="title">分时段欢迎语：</div>
            <div class="content">
              <a-switch checked-children="开" un-checked-children="关" v-model="switchTemp.timeWelcome" />
            </div>
          </div>
          <div class="welcome-box" v-show="switchTemp.timeWelcome">
            <div class="welcome-times">
              <div class="item flex-between" v-for="(v, i) in form.welcomeMsg.spanWelcome" :key="i">
                <div class="left flex">
                  <span class="title">时段{{ i + 1 }}:</span>
                  <div class="text-card">
                    <div class="mb8">发送日期：</div>
                    <div class="mb12">
                      <a-select mode="multiple" v-model="v.week" style="width: 470px; height: 45px" class="mr10">
                        <a-select-option
                          v-for="(week, weekIndex) in inputTemp.week"
                          :key="weekIndex"
                          :value="week.value"
                        >
                          {{ week.text }}
                        </a-select-option>
                      </a-select>
                      <div>
                        <a-time-picker format="hh:mm" v-model="v.startTime" />
                        <span class="ml6 mr6">~</span>
                        <a-time-picker format="hh:mm" v-model="v.endTime" />
                      </div>
                    </div>
                    <EnterTextMsg :ref="`spanEnter${i}`" v-model="v.msg" />
                    <div class="del" v-if="i !== 0">
                      <a-icon type="minus-circle" @click="form.welcomeMsg.spanWelcome.splice(i, 1)" />
                    </div>
                  </div>
                </div>
                <div class="right">
                  <Preview :ref="`spanWelcome${i}`" />
                </div>
              </div>
            </div>
            <div class="add" @click="addSpanWelcome">
              <a-icon type="plus-circle" />
              添加分时段欢迎语
            </div>
          </div>
          <div class="input-row title-start mt23">
            <div class="title">欢迎语屏蔽：</div>
            <div class="content">
              <div class="mb16 flex">
                <a-switch checked-children="开" un-checked-children="关" v-model="switchTemp.welcomeFilter" />
                <span class="desc-text ml8">开启后，客户昵称中包含设定的关键词的客户不会收到欢迎语</span>
              </div>
              <div class="flex" v-if="switchTemp.welcomeFilter">
                <a-button class="mr12" @click="form.welcomeMsg.filter.add = !form.welcomeMsg.filter.add">
                  <a-icon type="plus" />
                  添加屏蔽昵称
                </a-button>
                <a-input
                  placeholder="请输入昵称"
                  style="width: 105px"
                  v-if="form.welcomeMsg.filter.add"
                  @keyup.enter="addFilterName"
                />
                <div class="flex ml16">
                  <a-tag
                    closable
                    v-for="(v, i) in form.welcomeMsg.filter.names"
                    :key="i"
                    @close="form.welcomeMsg.filter.names.splice(i, 1)"
                  >
                    {{ v }}
                  </a-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div class="block">
        <div class="title">功能设置</div>
        <div class="content">
          <div class="input-row title-start">
            <div class="title">自动通过好友：</div>
            <div class="content">
              <a-switch checked-children="开" un-checked-children="关" v-model="switchTemp.autoPass" />
              <span class="desc-text ml12"> 开启后，客户添加该企业微信时，员工无需好友验证，将会自动添加成功 </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt32 flex">
        <a-button type="primary" class="mr16" @click="addClick"> 确定 </a-button>
        <a-button
          type="primary"
          ghost
          @click="
            $router.push({
              path: '/channelCodeNew/index',
              query: { groupId: group.current.groupId, groupName: group.current.name }
            })
          "
        >
          取消
        </a-button>
      </div>

      <SelectEmployee ref="selectEmployee" @change="selectEmployeeChange" />
      <SelectEmployee ref="selectEmployeeAuto" @change="selectEmployeeAuto" />
      <SelectEmployee ref="selectEmployeeSpare" @change="(e) => (form.base.spareEmployee = e)" />
      <SelectTag ref="selectTag" @change="(e) => (form.base.tags = e)" />
      <addLabelIndex @choiceTagsArr="tagsG" ref="childRef" />
    </div>
  </div>
</template>

<script>
import { departmentEmp } from '@/api/common.js'
import EnterTextMsg from '@/components/EnterTextMsg/EnterTextMsg'
import Preview from '@/components/Preview/index'
import { addGroup, getGroupList, getCodeDetail, addCode, updateCode } from '@/api/channelCodeNew'
// import moment from 'moment'
import addLabelIndex from '@/components/addlabel/index'
import SelectPersonnel from '@/components/SelectPersonnel/index.vue'

export default {
  data () {
    return {
      treeData: [],
      group: {
        list: [],
        add: false,
        current: {
          groupId: '',
          name: ''
        },
        name: ''
      },
      form: {
        base: {
          name: '',
          group: {
            name: '',
            id: '',
            show: true
          },
          empIds: [],
          employee: {
            type: 1,
            list: [],
            autoList: [
              {
                employees: [],
                week: [1, 2, 3, 4, 5, 6, 0],
                startTime: '',
                endTime: ''
              }
            ]
          },
          addMax: {
            filterName: '',
            employees: []
          },
          spareEmployee: [],
          tags: [],
          remark: {
            type: 1,
            remark: ''
          },
          desc: ''
        },
        welcomeMsg: {
          type: 1,
          defaultMsg: {},
          spanWelcome: [{
            week: [1, 2, 3, 4, 5, 6, 0],
            startTime: '',
            endTime: '',
            msg: {}
          }],
          filter: {
            add: false,
            name: '',
            names: []
          }
        }
      },
      temp: {
        autoEmployee: ''
      },
      inputTemp: {
        week: [
          { text: '周一', value: 1 },
          { text: '周二', value: 2 },
          { text: '周三', value: 3 },
          { text: '周四', value: 4 },
          { text: '周五', value: 5 },
          { text: '周六', value: 6 },
          { text: '周日', value: 0 }
        ]
      },
      switchTemp: {
        addLimit: false,
        allowOnline: false,
        tag: false,
        remark: false,
        desc: false,
        timeWelcome: false,
        welcomeFilter: false,
        autoPass: false
      },
      edit: false,
      loading: false,
      upperLimit: 1,
      buttonWidth: 70,
      //  批量设置
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      serchUser: '',
      serchData: [],
      checkAllC: null,
      groupShow: false
    }
  },
  watch: {
    // 'form.welcomeMsg.defaultMsg' () {
    //   this.updatePreview(this.$refs.defaultMsg, this.form.welcomeMsg.defaultMsg.words, this.form.welcomeMsg.defaultMsg.mediumId)
    // },
    // 'form.welcomeMsg.spanWelcome': {
    //   deep: true,
    //   handler: function () {
    //     setTimeout(() => {
    //       this.form.welcomeMsg.spanWelcome.forEach((v, i) => {
    //         if (this.$refs[`spanWelcome${i}`]) {
    //           this.updatePreview(this.$refs[`spanWelcome${i}`][0], v.msg.words, v.msg.mediumId)
    //         }
    //       })
    //     }, 0)
    //   }
    // },
    serchUser () {
      if (this.serchUser == '') {
        this.form.base.addMax.employees = this.serchData
      } else {
        if (this.serchData.length <= 0) {
          this.serchData = this.form.base.addMax.employees
        } else {
          var checkList = this.form.base.addMax.employees
          var list = this.serchData
          for (let i = 0; i < checkList.length; i++) {
            for (let k = 0; k < list.length; k++) {
              if (checkList[i].id == list[k].id) {
                list[k] = checkList[i]
              }
            }
          }
          this.form.base.addMax.employees = list
          this.serchData = this.form.base.addMax.employees
        }
        const result = this.form.base.addMax.employees.filter(i => {
          if (i.name.indexOf(this.serchUser) != -1) {
            return i
          }
        })
        this.form.base.addMax.employees = result
      }
    }
  },
  mounted () {
    this.departmentEmp()
    if (this.$route.query.id) {
      this.edit = true
      this.$route.meta.title = '修改活码'
      this.getDetailData()
    } else {
      this.edit = false
    }
    if (this.$route.query.groupId) {
      this.group.current.groupId = this.$route.query.groupId
      this.group.current.name = this.$route.query.groupName
    }
    this.getGroupList()
  },
  methods: {
    /**
     * 拉取部门数据
     */
    departmentEmp () {
      departmentEmp().then(res => {
        this.treeData = res.data
      })
    },
    updatePreview (nodeIns, text, files) {
      nodeIns.clean()
      nodeIns.setText(text)
      if (files) {
        files.forEach(v => {
          if (v.data.oldType === 'image') {
            nodeIns.setImage(v.data.image.fullPath)
          }

          if (v.data.oldType === 'link') {
            nodeIns.setLink(v.data.title, v.data.description, v.data.imagePath.fullPath)
          }

          // if (v.data.oldType === 'luck') {
          //   nodeIns.setLink(v.data.old[0].name, v.data.old[0].description, require('../../assets/lottery-default-cover.png'))
          // }

          if (v.data.oldType === 'applet') {
            nodeIns.setApplets(v.data.title, v.data.image.fullPath)
          }
        })
      }
    },

    addClick () {
      const errMsg = this.checkParam()

      if (errMsg) {
        this.$message.error(errMsg)

        return false
      }

      const tags = !this.form.base.tags ? [] : this.form.base.tags.map(value => {
        return value.id
      })
      this.form.base.employee.list = []
      this.form.base.empIds.forEach(e => {
        this.form.base.employee.list.push({
          selected: true,
          id: e
        })
      })
      let params = {
        baseInfo: {
          groupId: this.form.base.group.id,
          name: this.form.base.name,
          autoAddFriend: this.switchTemp.autoPass ? 1 : 2,
          tags: tags
          // contactRemark: {
          //   status: +this.switchTemp.remark,
          //   ...this.form.base.remark
          // },
          // contactDescription: this.form.base.desc
        },
        drainageEmployee: {
          type: this.form.base.employee.type,
          timeFull: this.form.base.employee.list
          // timeSlot: this.form.base.employee.autoList,
          // specialPeriod: this.form.base.spareEmployee,
          // addMax: {
          //   status: +this.switchTemp.addLimit,
          //   employees: this.form.base.addMax.employees
          // }
        }
        // welcomeMessage: {
        //   type: this.form.welcomeMsg.type,
        //   message: this.form.welcomeMsg.defaultMsg,
        //   spanWelcomeStatus: +this.switchTemp.timeWelcome,
        //   spanWelcome: this.form.welcomeMsg.spanWelcome,
        //   closeWords: {
        //     status: +this.switchTemp.welcomeFilter,
        //     words: this.form.welcomeMsg.filter.names
        // }
        // }
      }

      params = JSON.parse(JSON.stringify(params))

      // params.welcomeMessage.type = ''

      // params.drainageEmployee.timeSlot.forEach(v => {
      //   v.startTime = moment(v.startTime).format('HH:mm')
      //   v.endTime = moment(v.endTime).format('HH:mm')
      // })

      // params.welcomeMessage.spanWelcome.forEach(v => {
      //   v.startTime = moment(v.startTime).format('hh:mm')
      //   v.endTime = moment(v.endTime).format('hh:mm')
      //   v.msg.type = ''
      // })

      const h = () => {
        this.$message.success('操作成功')
        this.$router.push({ path: '/channelCodeNew/index', query: { groupId: this.group.current.groupId, groupName: this.group.current.name } })
      }

      if (!this.switchTemp.tag) {
        params.baseInfo.tags = []
      }
      // if (!this.switchTemp.desc) {
      //   params.baseInfo.contactDescription = ''
      // }
      // if (!this.switchTemp.remark) {
      //   params.baseInfo.contactRemark.status = 0
      //   params.baseInfo.contactRemark.remark = ''
      // }

      if (this.$route.query.id) {
        params.channelCodeId = this.$route.query.id
        // params.baseInfo.contactRemark.status = this.switchTemp.remark ? 1 : 0
        updateCode(params).then(h)

        return false
      }

      // var status = false
      // var timeStatus = false
      // params.drainageEmployee.timeSlot.forEach(i => {
      //   if (i.employees.length <= 0) {
      //     status = true
      //   }
      //   if (i.startTime == 'Invalid date' || i.endTime == 'Invalid date') {
      //     timeStatus = true
      //   }
      // })
      // if (this.form.base.employee.type == 2) {
      //   if (status) {
      //     this.$message.warning('请选择自动上下线员工')
      //     return
      //   }
      //   if (timeStatus) {
      //     this.$message.warning('请选择自动上下线时间')
      //     return
      //   }
      // }

      addCode(params).then(h)
    },
    checkParam () {
      if (!this.form.base.name) return '未填写二维码名称'
      if (!this.form.base.empIds.length) return '未选择成员'
      // if (this.form.welcomeMsg.type === 1 && JSON.stringify(this.form.welcomeMsg.defaultMsg) === '{}') return '欢迎语不能为空'
    },

    addFilterName (e) {
      const name = e.target.value

      if (!name) {
        this.form.welcomeMsg.filter.add = false

        return false
      }

      this.form.welcomeMsg.filter.names.push(name)

      this.form.welcomeMsg.filter.add = false
    },

    addSpanWelcome () {
      this.form.welcomeMsg.spanWelcome.push({
        week: [1, 2, 3, 4, 5, 6, 0],
        startTime: '',
        endTime: '',
        msg: {}
      })
    },

    selectEmployeeAuto (e) {
      this.form.base.employee.autoList[this.temp.autoEmployee].employees = e

      this.setAddMaxEmployee()
    },

    selectEmployeeChange (e) {
      this.form.base.employee.list = e

      this.setAddMaxEmployee()
    },

    setAddMaxEmployee () {
      const employees = []

      if (this.form.base.employee.type === 1) {
        this.form.base.employee.list.forEach(v => {
          employees.push(v)
        })
      } else {
        this.form.base.employee.autoList.forEach(v => {
          v.employees.forEach(v2 => {
            employees.push(v2)
          })
        })
      }

      const employeesNew = employees.duplicate('id')

      employeesNew.forEach(v => {
        v.max = 100
      })

      this.form.base.addMax.employees = employeesNew
    },

    addAuto () {
      this.form.base.employee.autoList.push({
        employees: [],
        week: [1, 2, 3, 4, 5, 6, 0],
        startTime: '',
        endTime: ''
      })
    },

    selectEmployeeAutoShow (data, index) {
      this.temp.autoEmployee = index
      this.$refs.selectEmployeeAuto.$show(data.employees)
    },

    selectGroup (data) {
      this.form.base.group.id = data.groupId
      this.form.base.group.name = data.name

      this.form.base.group.show = false

      setTimeout(() => {
        this.form.base.group.show = true
      }, 0)

      this.groupShow = false
    },

    addGroupClick () {
      if (!this.group.name) {
        this.$message.error('未填写分组名')
        return false
      }

      addGroup({
        name: this.group.name.split(',')
      }).then((res) => {
        this.$message.success('添加成功')
        const currentGroup = {
          id: res.data[0],
          name: this.group.name.split(',')[0]
        }
        this.group.current.groupId = currentGroup.id
        this.group.current.name = currentGroup.name
        this.group.name = ''
        this.getGroupList()
      })
    },

    getGroupList () {
      getGroupList().then(res => {
        this.group.list = res.data
        if (!this.group.current.groupId) {
          this.group.current = this.group.list[0]
        }
        this.selectGroup(this.group.current)
      })
    },

    getDetailData () {
      this.loading = true
      this.form.base.empIds = []
      getCodeDetail({
        channelCodeId: this.$route.query.id
      }).then(res => {
        // const curTime = moment().format('YYYY-MM-DD')
        const data = res.data

        this.form.base.name = data.baseInfo.name

        this.selectGroup({
          groupId: data.baseInfo.groupId,
          name: data.baseInfo.groupName
        })
        this.group.current.groupId = data.baseInfo.groupId
        this.group.current.name = data.baseInfo.groupName

        // this.form.base.employee.type = data.drainageEmployee.type

        this.form.base.employee.list = !data.drainageEmployee ? [] : data.drainageEmployee.timeFull

        data.drainageEmployee.timeFull.forEach(e => {
          this.form.base.empIds.push(e.id + '')
        })
        console.log('🚀 ~ getDetailData ~ this.form.base.empIds', this.form.base.empIds)
        // if (data.drainageEmployee.type === 2) {
        //   this.form.base.employee.autoList = data.drainageEmployee.timeSlot

        //   this.form.base.employee.autoList.forEach(v => {
        //     v.startTime = moment(`${curTime} ${v.startTime}`)
        //     v.endTime = moment(`${curTime} ${v.endTime}`)
        //   })
        // }

        // this.switchTemp.addLimit = Boolean(data.drainageEmployee.addMax.status)
        // this.form.base.addMax.employees = data.drainageEmployee.addMax.employees

        // this.form.base.spareEmployee = data.drainageEmployee.specialPeriod
        this.form.base.tags = []
        data.baseInfo.tags.forEach(
          item => {
            item.list.forEach(e => {
              if (e.isSelected == 1) {
                this.form.base.tags.push({ id: e.tagId, name: e.tagName, slelect: true })
              }
            })
          })
        if (this.form.base.tags.length > 0) this.switchTemp.tag = true
        // if (data.baseInfo.contactRemark.status) {
        //   this.switchTemp.remark = true
        // }
        // this.form.base.remark = data.baseInfo.contactRemark

        // if (data.baseInfo.contactDescription) this.switchTemp.desc = true
        // this.form.base.desc = data.baseInfo.contactDescription

        // this.form.welcomeMsg.type = data.type

        // this.form.welcomeMsg.defaultMsg = data.welcomeMessage
        // this.switchTemp.timeWelcome = Boolean(data.spanWelcomeStatus)
        // this.$refs.defaultEnter.setData(data.welcomeMessage)

        // data.spanWelcome.forEach((v, i) => {
        //   v.startTime = moment(`${curTime} ${v.startTime}`)
        //   v.endTime = moment(`${curTime} ${v.endTime}`)
        // })
        // if (data.spanWelcome.length > 0) {
        //   this.form.welcomeMsg.spanWelcome = data.spanWelcome
        // } else {
        //   this.form.welcomeMsg.spanWelcome.push({
        //     week: [1, 2, 3, 4, 5, 6, 0],
        //     startTime: '',
        //     endTime: '',
        //     msg: {}
        //   })
        // }
        // setTimeout(() => {
        //   data.spanWelcome.forEach((v, i) => {
        //     this.$refs[`spanEnter${i}`][0].setData(v.msg)
        //   })
        // }, 0)

        // this.switchTemp.welcomeFilter = Boolean(data.closeWords.status)
        // if (this.switchTemp.welcomeFilter) this.form.welcomeMsg.filter.names = data.closeWords.words

        this.switchTemp.autoPass = data.baseInfo.autoAddFriend === 1 ? true : (data.baseInfo.autoAddFriend !== 2)

        this.loading = false

        // this.form.welcomeMsg.spanWelcome.forEach(i => {
        //   if (new Date(i.startTime) == true && new Date(i.endTime) == true) {

        //   } else {
        //     i.startTime = ''
        //     i.endTime = ''
        //   }
        // })
      })
    },

    tagsG (e) {
      e.forEach(i => {
        i.select = true
      })
      this.form.base.tags = e
    },
    onChanges (unFarData) {
      this.indeterminate = !!unFarData.length && unFarData.length < this.form.base.addMax.employees.length
      this.checkAll = unFarData.length === this.form.base.addMax.employees.length
    },
    onCheckAllChange (e) {
      this.checkAllC = e
      Object.assign(this, {
        checkedList: e.target.checked ? this.form.base.addMax.employees : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    // 批量设置
    userConfirm () {
      if (this.checkedList.length <= 0) {
        this.$message.warning('请选择员工')
        return
      }
      this.checkedList.forEach(i => {
        i.max = this.upperLimit
      })

      var checkList = this.checkedList
      var list = this.form.base.addMax.employees

      for (let i = 0; i < checkList.length; i++) {
        for (let k = 0; k < list.length; k++) {
          if (checkList[i].id == list[k].id) {
            list[k] = checkList[i]
          }
        }
      }
      this.form.base.addMax.employees = []
      this.form.base.addMax.employees = list
      // this.onCheckAllChange(this.checkAllC)
      this.checkedList = []
      // this.indeterminate = false
    },
    upperLimitChange (e) {
    },
    // 搜索
    pressEnter (e) {
      if (this.serchUser == '') {
        this.form.base.addMax.employees = this.serchData
      } else {
        if (this.serchData.length <= 0) {
          this.serchData = this.form.base.addMax.employees
        } else {
          var checkList = this.form.base.addMax.employees
          var list = this.serchData
          for (let i = 0; i < checkList.length; i++) {
            for (let k = 0; k < list.length; k++) {
              if (checkList[i].id == list[k].id) {
                list[k] = checkList[i]
              }
            }
          }
          this.form.base.addMax.employees = list
          this.serchData = this.form.base.addMax.employees
        }
        const result = this.form.base.addMax.employees.filter(i => {
          if (i.name.indexOf(this.serchUser) != -1) {
            return i
          }
        })
        this.form.base.addMax.employees = result
      }
    }
  },
  components: { EnterTextMsg, Preview, addLabelIndex, SelectPersonnel }
}
</script>

<style lang="less" scoped>
/deep/.ant-tag {
  display: block !important;
}

.box {
  /deep/.ant-popover-inner-content {
    padding: 10px 12px !important;
  }
  /deep/.ant-popover-buttons {
    margin-top: 15px;
  }
  /deep/.ant-btn {
    height: 30px;
  }
}
.block {
  & > .title {
    font-size: 15px;
    font-weight: 500;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 16px;
    margin-bottom: 23px;
  }
}

.input-row {
  display: flex;
  margin-bottom: 23px;
  align-items: center;

  .title {
    margin-right: 3px;
  }

  .content {
    min-width: 480px;
  }

  .title {
    width: 140px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .must {
    position: relative;

    &:before {
      content: '*';
      display: block;
      color: red;
      font-size: 18px;
      margin-right: 8px;
    }
  }
}

.title-start {
  align-items: start;
}

.add-group-btn {
  padding-left: 22px;
  height: 51px !important;
  border-bottom: 1px dashed #eaeaea;
  color: #1890ff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.add-group-input {
  padding: 16px 22px 6px;

  .ant-input {
    background: #fbfbfb;
    height: 32px;
    border: 1px solid #eee;
  }
}

.groups {
  height: 300px;
  overflow-y: auto;
  .item {
    height: 48px;
    padding: 0 22px;
    color: #000000d9;
    cursor: pointer;

    .name {
      color: #000000a6;
    }

    .count {
      color: #00000040;
      font-size: 13px;
    }

    &:hover {
      background: #e6f7ff;
    }
  }
}

.line-card {
  width: 634px;
  background: #fbfbfb;
  border-radius: 4px;
  border: 1px solid #eee;
  padding: 16px;
}

.times {
  .item {
    align-items: end;
    margin-bottom: 16px;

    .del {
      width: 21px;
      height: 21px;
      background: #f0f0f0;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.member-table {
  border: 1px solid #e9e9e9;

  .header {
    width: 100%;
    height: 36px;
    padding: 0 20px;
    background: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    border-bottom: 1px solid #f2f2f2;

    .left {
      img {
        width: 30px;
        height: 30px;
        border-radius: 2px;
      }
    }

    &:last-child {
      border: none;
    }
  }
}

.batch-add-count {
  padding: 24px;
}

.textarea-box {
  width: 632px;
  height: 190px;
  padding: 8px 16px;
  background: #fbfbfb;
  border-radius: 2px;
  border: 1px solid #eee;
  font-size: 14px;
  outline: none;
}

.enter-text-box {
  width: 100%;

  .left {
    flex: 1;
    max-width: 888px;
    min-height: 405px;
    margin-right: 40px;

    /deep/ textarea {
      height: 300px !important;
    }
  }
}

.welcome-box {
  .welcome-times {
    margin-left: 32px;

    .text-card {
      width: 100%;
      background: #fbfbfb;
      border: 1px solid #eee;
      padding: 20px;
      position: relative;

      .del {
        position: absolute;
        right: 10px;
        top: 8px;
        cursor: pointer;
      }
    }

    .item {
      align-items: start;
      margin-bottom: 56px;

      .left {
        width: 850px;
        align-items: start;

        .title {
          display: block;
          width: 68px;
          text-align: center;
          margin-top: 12px;
        }
      }
    }
  }

  .add {
    color: #1890ff;
    margin-left: 91px;
    margin-top: -41px;
    cursor: pointer;
  }
}

.max-input {
  width: 80px;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  padding: 4px 11px;
  height: 36px;
  outline: none;
}

/deep/ .ant-select {
  width: 120px;
}
</style>

<style>
.ant-popover {
  width: 362px;
}

.ant-popover-inner-content {
  padding: 0;
}
</style>
