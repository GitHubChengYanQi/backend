<template>
  <div class="department">
    <div class="list">
      <div class="item">
        <div :class="{'flex': true, 'name': true, 'active': current.id === data.id}" @click="select">
          <div class="down mr3" @click.stop="downClick">
            <a-icon :type="!data.down ? 'caret-up' : 'caret-down'" v-if="data.childDepartment.length > 0"/>
          </div>
          <div class="icon mr4">
            <a-icon type="folder" theme="twoTone"/>
          </div>
          <span style="white-space: nowrap">
            {{ data.name }}
          </span>
        </div>

        <div v-show="data.down">
          <Department
            class="ml16"
            v-for="v in data.childDepartment"
            :key="v.id"
            :data="v"
            @change="clickChange"
            :current="current"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Department',
  // eslint-disable-next-line vue/require-prop-types
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    current: {
      type: Object,
      default: function () {
        return {
          id: ''
        }
      }
    }
  },
  data () {
    return {
      down: true
    }
  },
  created () {
    console.log(this.data)
  },
  methods: {
    clickChange (e) {
      this.$emit('change', e)
    },

    select () {
      this.active = true

      this.$emit('change', this.data)
    },

    downClick () {
      this.data.down = !this.data.down

      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
.department {
  margin-top: 8px;
}

.list {
  .item {
    cursor: pointer;
    font-size: 14px;

    .name{
      padding: 3px 16px;
    }

    .down {
      font-size: 12px;
      color: #47A7FF;
    }

    span {
      color: #000000a6;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .active {
    background: #f9f9f9;
  }
}
</style>
