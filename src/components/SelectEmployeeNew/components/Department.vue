<template>
  <div class="department">
    <div class="name-box">
      <div class="box" @click="corpDown = !corpDown">
        <div class="icon">
          <a-icon :type="!corpDown ? 'caret-up' : 'caret-down'" class="down"/>
          <a-icon type="folder" class="folder"/>
        </div>
        <div class="name">
          {{ department.name }}
        </div>
      </div>
      <div class="checkbox" @click.stop v-if="departSelect">
        <a-checkbox
          :checked="department.select"
          @click="departSelectClick"
          @change="departChange"
        />
      </div>
    </div>
    <div class="members" v-if="corpDown">
      <div class="member-down" @click="memberDownClick">
        <div class="icon">
          <a-icon :type="memberDown ? 'down-square' : 'up-square'"/>
        </div>
        <div class="title">
          {{ memberDown ? '折叠成员' : '展开成员' }}
        </div>
      </div>
      <div class="list" v-if="memberDown">
        <div v-if="!loading">
          <Members
            style="margin-left: 20px;"
            :list="members"
            v-if="members.length"
          />
          <div class="emt-tips" v-else>
            暂无成员
          </div>
          <div
            @click="getMemberData(false,true)"
            class="more"
            v-if="page.page !== page.totalPage && members.length"
          >
            <div class="box" v-if="!page.loading">
              <span>查看更多</span>
              <a-icon type="down"/>
            </div>
            <div class="loading" v-else>
              <a-spin size="small"/>
            </div>
          </div>
        </div>
        <div class="loading" v-else>
          <a-spin size="small"/>
        </div>

        <Department
          style="margin-left: 20px;"
          :department="v"
          :departSelect="departSelect"
          v-for="v in department.childDepartment"
          :key="v.id"
          @change="e => $emit('change', e)"
          @depart="e => $emit('depart', e)"
          :ref="`department${v.id}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Members from '@/components/SelectEmployeeNew/components/Members'
import { getMember } from '@/api/selectMember'

export default {
  name: 'Department',
  data () {
    return {
      memberDown: false,
      corpDown: true,
      loading: false,
      getFlag: false,
      members: [],
      page: {
        page: 1,
        totalPage: 1,
        limit: 100,
        loading: true
      }
    }
  },
  components: { Members },
  props: {
    department: {
      type: Object,
      default: function () {
        return {}
      }
    },
    departSelect: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    if (this.department.id === 1) {
      this.memberDown = true

      this.getMemberData()
    }
  },
  methods: {
    showChange () {
      if (!this.members.length) return false

      this.members.forEach(v => {
        const find = window.$members.find(v2 => {
          return v.wxUserId === v2.wxUserId
        })

        if (!find) this.updateSelect(v)
      })
    },

    departSelectClick () {
      this.department.select = !this.department.select

      this.$forceUpdate()
    },

    departChange (e) {
      this.$emit('depart', {
        select: e.target.checked,
        data: {
          department: this.department,
          members: this.members
        }
      })
    },

    updateDepartSelect (data, select = false) {
      if (this.department.id === data.id) {
        this.department.select = select

        this.$forceUpdate()
      }

      for (const k in this.$refs) {
        this.$refs[k][0].updateDepartSelect(data, select)
      }
    },

    updateSelect (data, select = false) {
      let count = 0

      const find = this.members.find(v => {
        return v.wxUserId === data.wxUserId
      })

      if (find) find.select = select

      for (const k in this.$refs) {
        this.$refs[k][0].updateSelect(data, select)

        // 兼容递归第一层
        if (count === 0) {
          const ins = this.$refs[k][0].$parent.$children

          if (ins[ins.length - 1].updateView) ins[ins.length - 1].updateView()
        }

        for (const k2 in this.$refs[k][0].$children) {
          const ins = this.$refs[k][0].$children[k2]

          if (ins.updateView) ins.updateView()
        }

        count++
      }
    },

    memberDownClick () {
      this.memberDown = !this.memberDown

      this.getMemberData(true)
    },

    getMemberData (sync = false, more = false) {
      if (this.getFlag && !more) return false

      if (more) {
        this.page.page++
        this.page.loading = true
      } else {
        this.loading = true
      }

      getMember({
        departmentId: this.department.id,
        ...this.page
      }).then(res => {
        this.page.totalPage = parseInt(res.data.page.totalPage)

        if (more) {
          res.data.list.forEach(v => {
            this.members.push(v)
          })
        } else {
          this.members = res.data.list
        }

        window.$members.forEach(v => {
          const find = this.members.find(v2 => {
            return v.wxUserId === v2.wxUserId
          })

          if (find) {
            this.updateSelect(find, true)
            find.select = true
          }
        })

        this.page.loading = false
        this.loading = false
        this.getFlag = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.department {
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

  .member-down {
    display: flex;
    align-items: center;
    color: #00000073;
    font-size: 12px;
    margin: 6px 0 10px 20px;
    cursor: pointer;

    .icon {
      margin-right: 6px;
    }
  }
}

.loading {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

.emt-tips {
  color: #d8d8d8;
  font-size: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

.more {
  cursor: pointer;

  .box {
    color: #d8d8d8;
    font-size: 12px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
  }

  span {
    margin-right: 3px;
  }

  &:hover {
    color: #1890ff;
  }
}

.department {
  margin: 10px 0;
}
</style>
