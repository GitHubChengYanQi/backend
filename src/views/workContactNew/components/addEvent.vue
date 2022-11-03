<template>
  <div class="add-event">
    <a-modal v-model="modalShow" :width="485" :footer="false" centered title="添加事件">
      <div class="title flex">
        <div :class="{'item': true,'mr32': true, 'active': nav === 0}" @click="nav = 0">
          自定义事件
        </div>
        <div :class="{'item': true, 'active': nav === 1}" @click="nav = 1">
          模板事件
        </div>
      </div>

      <div class="content" v-if="nav === 0">
        <textarea maxlength="100" placeholder="请输入要添加的备注信息吧，添加成功后将出现在客户动态列表里~" v-model="form.content"/>
      </div>

      <div class="content" v-if="nav === 1">
        <div class="select flex mb18">
          <span style="width: 130px;">选择事件：</span>

          <a-select v-if="!getEvent" v-model="form.followTemplateId">
            <a-select-option :value="v.id" v-for="v in tempData" :key="v.id">
              {{ v.name }}
            </a-select-option>
          </a-select>

          <div v-if="!getEvent" @click="getEvent = true,form.followTemplateId=null" style="color: #1890ff;white-space: nowrap;margin: 0 7px;cursor: pointer">
            <a-icon type="plus" />
            新建
          </div>

          <a-input style="width: 77%;" v-model="eventValue" v-if="getEvent" placeholder="请输入事件名称" />

          <div
            v-if="getEvent"
            style="    white-space: nowrap;
    margin: 0px 7px;
    cursor: pointer;
    width: 85px;
    display: flex;
    justify-content: space-between;">
            <span v-if="!eventValue" style="rgba(0,0,0,.25)">确定</span>
            <span v-else @click="addEventData" style="color: #1890ff">确定</span>
            <span @click="getEvent = false">取消</span>
          </div>
        </div>
        <div class="textarea flex mb16">
          <span style="width: 130px;">备注：</span>
          <textarea maxlength="100" placeholder="请输入要添加的备注信息吧，添加成功后将出现在客户动态列表里~" v-model="form.content"/>
        </div>
      </div>

      <div class="footer">
        <a-button class="mr8" @click="modalShow = false">取消</a-button>
        <a-button type="primary" @click="add">添加</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { templateList, addFollow, templateStore } from '@/api/workContact'

export default {
  data () {
    return {
      modalShow: false,
      nav: 0,
      tempData: [],
      form: {
        content: '',
        followTemplateId: ''
      },
      getEvent: false,
      eventValue: ''
    }
  },
  methods: {
    add () {
      if (!this.form.followTemplateId) {
        this.$message.warning('请选择模板')
        return
      }
      addFollow({
        contactId: this.$route.query.id,
        employeeId: 5,
        ...this.form
      }).then(() => {
        this.$message.success('添加成功')
        this.$parent.updataNews()
        this.modalShow = false
      })
    },

    show () {
      this.getData()

      this.modalShow = true
    },

    getData (e) {
      templateList().then(res => {
        this.tempData = res.data
        if (!e) {
          this.form.followTemplateId = res.data[0].id
        } else {
          this.form.followTemplateId = res.data[res.data.length - 1].id
        }
      })
    },
    addEventData () {
      templateStore({
        contactId: this.$route.query.id,
        name: this.eventValue
      }).then(res => {
        this.getData(true)
        this.getEvent = false
        this.eventValue = ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  color: #00000073;
  font-size: 15px;

  .item {
    cursor: pointer;
  }

  .active {
    position: relative;
    font-weight: 700;
    font-size: 15px;
    color: #1890ff;

    &:after {
      position: absolute;
      content: "";
      display: block;
      width: 40px;
      height: 2px;
      left: 50%;
      bottom: -5px;
      transform: translateX(-50%);
      background: #1890ff;
    }
  }
}

.content {
  margin-top: 23px;

  textarea {
    width: 434px;
    height: 209px;
    background: #fbfbfb;
    border: 1px solid #eee;
    box-sizing: border-box;
    border-radius: 2px;
    resize: none;
    outline: none;
    padding: 11px 13px;
  }
}

.textarea {
  align-items: start;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
}

/deep/ .ant-modal-body {
  padding-top: 6px;
}

/deep/ .ant-select {
  width: 85%;
}
</style>
