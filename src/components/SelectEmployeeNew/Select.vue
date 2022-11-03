<template>
  <div class="select">
    <a-modal
      v-model="modalShow"
      on-ok="handleOk"
      :width="636"
      :footer="false"
      centered
      :maskClosable="false">
      <template slot="title">
        选择成员
      </template>
      <div class="content">
        <div class="left-content">
          <div>
            <div class="search">
              <a-input-search
                placeholder="请输入成员昵称"
                @search="searchClick"
                @input="searchThrottle"
                v-model="search.name"
              />
            </div>
            <div class="row">
              <div class="left">
                全部成员（{{ total }}）：
              </div>
              <div class="right" v-if="search.show">
                <div>
                  <a-checkbox
                    :checked="selectAll"
                    @click="selectAll = !selectAll"
                    @change="selectAllChange"
                  />
                  <span>全选</span>
                </div>
              </div>
            </div>
            <loading class="loading" :loading="loading" height="100%">
              <div v-show="!search.show">
                <div class="members">
                  <Department
                    :department="v"
                    :departSelect="depart"
                    :selectData="select"
                    v-for="v in depList"
                    :key="v.id"
                    @change="selectChange"
                    @depart="selectDepartChange"
                    ref="department"
                  />
                </div>
              </div>
              <div v-show="search.show">
                <loading :loading="search.loading" height="100%">
                  <Members
                    :list="search.members"
                    @change="searchSelectChange"
                    ref="members"
                  />
                </loading>
              </div>
            </loading>
          </div>
        </div>
        <div class="right-content">
          <div class="tips">
            <div v-if="!depart">
              已选成员：（{{ select.length }} / {{ maxCount }}）
            </div>
            <div v-else>
              已选成员和部门
            </div>
            <div class="emt" @click="cleanSelect">
              <a>清空全部</a>
            </div>
          </div>
          <Members
            :checkbox="false"
            :list="select"
            @change="delSelectChange"
          />
        </div>
      </div>
      <div class="confirm">
        <a-button @click="modalShow = false">取消</a-button>
        <a-button type="primary" @click="confirm">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Department from '@/components/SelectEmployeeNew/components/Department'
import loading from '@/components/loading/loading'
import Members from '@/components/SelectEmployeeNew/components/Members'

import Change from '@/components/SelectEmployeeNew/js/Change'
import Event from '@/components/SelectEmployeeNew/js/Event'
import External from '@/components/SelectEmployeeNew/js/External'
import Tool from '@/components/SelectEmployeeNew/js/Tool'

export default {
  data () {
    return {
      modalShow: false,
      loading: false,
      total: '-',
      oldTotal: '-',
      depList: [],
      search: {
        show: false,
        members: [],
        name: '',
        loading: false
      },
      selectAll: false,
      select: []
    }
  },
  props: {
    maxCount: {
      type: [Number, String],
      default: 200
    },
    depart: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    select: {
      deep: true,
      handler () {
        window.$members = this.select
      }
    },
    modalShow () {
      this.search.name = ''
      this.searchClick()
    }
  },
  methods: {
    ...Change.methods,
    ...Event.methods,
    ...External.methods,
    ...Tool.methods
  },
  components: { Members, Department, loading }
}
</script>

<style lang="less" scoped>
.loading {
  width: 100%;
  height: 100%;
  margin-top: 3px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #909090;
  margin-bottom: 10px;
  padding-right: 18px;

  span {
    margin-left: 6px;
  }
}

.name-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  .box {
    display: flex;
    align-items: center;
  }

  .checkbox {
    padding-right: 20px;
  }

  .icon {
    color: #47a7ff;
  }

  .down {
    font-size: 11px;
    margin-right: 6px;
    position: relative;
    top: -3px;
  }

  .folder {
    font-size: 18px;
  }

  .name {
    color: #000000a6;
    margin-left: 10px;
    position: relative;
    top: -2px;
    font-size: 14px;
  }
}

.department-box {
  margin: 10px 0;
}

.member {
  margin: 13px 0;
  margin-top: 6px;

  &::-webkit-scrollbar {
    width: 5px;
    height: 1px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #d7d7d7;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }

  .item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    .radio {
      margin-right: 20px;
    }

    .user-info {
      display: flex;
      align-items: center;
      flex: 1;

      .avatar img {
        width: 34px;
        height: 34px;
        margin-right: 10px;
        border-radius: 2px;
      }
    }
  }
}

.corp-box {
  height: 340px;
  overflow: auto;
}

.radio {
  cursor: pointer;
}

.content {
  min-height: 420px;
  margin-top: 24px;
  padding-right: 26px;
  display: flex;
  justify-content: flex-start;

  .left-content {
    overflow: auto;
    height: 400px;
    flex: 1;
  }

  .right-content {
    border-left: 1px solid #e8e8e8;
    flex: 1;
    padding-left: 15px;

    .member {
      height: 343px;
      overflow: auto;
    }

    .tips {
      margin-bottom: 16px;

      .emt {
        color: #1B91FF;
        font-size: 11px;
        margin-top: 3px;
        cursor: pointer;
      }
    }
  }

  .search {
    padding-right: 19px;
  }
}

.search {
  margin: 13px 0 20px;
  margin-top: 0;

  input {
    height: 28px;
  }
}

.confirm {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;

  button {
    margin-right: 10px;
  }
}

/deep/ .ant-modal-title {
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1px;
}

/deep/ .ant-modal-header {
  border: none;
}

/deep/ .ant-modal-body {
  padding-top: 0;
}

/deep/ .ant-checkbox-inner {
  border-radius: 50%;
}

///deep/ .ant-modal-content {
//  height: 567px;
//}
</style>
