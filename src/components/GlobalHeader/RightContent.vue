<template>
  <div :class="wrpCls">
    <!-- <a-select :value="corpName" class="select" placeholder="请选择企业" @change="handleChange">
      <a-select-option v-for="(item, index) in options" :value="item.corpName" :key="index">
        {{ item.corpName }}
      </a-select-option>
    </a-select> -->
    <a-dropdown>
      <div class="box">
        <div class="divider m1">
          <span/>
        </div>
        <div class="name">
          {{ corpName }}
          <!-- <div class="mask"></div> -->
        </div>
        <div class="icon">
          <a-icon type="down"/>
        </div>
        <div class="divider m2">
          <span/>
        </div>
      </div>
      <a-menu slot="overlay">
        <a-menu-item
          class="corp-menu"
          v-for="(item, index) in options"
          :value="item.corpName"
          :key="index"
          @click="handleChange(item.corpName)"
        >
          {{ item.corpName }}
        </a-menu-item>
        <a-menu-item
          class="corp-menu"
          style="border-top: 1px dashed #e5e5e5"
          @click="$router.push('/corp/create')"
        >
          <a-icon type="plus-circle"/>
          添加企业
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <avatar-dropdown :menu="showMenu" :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import { corpSelect, corpBind } from '@/api/login'
// import store from '@/store'
import { mapGetters } from 'vuex'
export default {
  name: 'RightContent',
  components: {
    AvatarDropdown
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      // corpId: undefined,
      options: []
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        'ant-pro-global-header-index-light': true
      }
    },
    ...mapGetters(['corpName'])
  },
  mounted () {
    this.getList()
  },
  methods: {
    async getList () {
      try {
        const { data } = await corpSelect()
        this.options = data
      } catch (e) {
        console.log(e)
      }
    },
    async handleChange (corpName) {
      const ary = this.options.filter(item => {
        return item.corpName == corpName
      })
      const corpId = ary[0].corpId
      try {
        await corpBind({ corpId })
        this.$router.push({
          path: '/corpData/index'
        })
        window.location.reload()
        // store.commit('SET_CORP_ID', corpId)
        // store.commit('SET_CORP_NAME', corpName)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang='less' scoped>
.select {
  width: 150px;
}

.corp-menu {
  height: 45px;
  display: flex;
  align-items: center;
}

.box {
  display: flex;
  align-items: center;
  font-size: 15px;
  cursor: pointer;

  .divider {
    width: 1px;
    height: 59px;
    background-color: none;
  }

  .name {
    width: auto;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    // .mask {
    //   width: 20px;
    //   height: 20px;
    //   position: absolute;
    //   right: 0;
    //   top: 23px;
    //   background: linear-gradient(to right, #ffffff6e, #000);
    // }
  }

  .m1 {
    margin-right: 16px;
  }

  .m2 {
    margin-left: 16px;
  }

  .icon {
    margin-left: 6px;
  }
}
</style>
