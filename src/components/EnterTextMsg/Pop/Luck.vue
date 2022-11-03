<!-- <template>
  <div class="radar">
    <a-modal @cancel="show = false" :title="`${edit ? '编辑' : '添加'}抽奖活动`" :visible="show" width="780px">
      <loading :loading="loading" height="100%">
        <div class="links flex">
          <div :class="{ item: true, active: getActive(v) }" v-for="v in list" :key="v.id" @click="select(v)">
            <div class="top flex-between">
              <div class="title flex">
                <div class="title fz13">
                  {{ v.name }}
                </div>
              </div>
              <div class="radio">
                <a-checkbox :checked="getActive(v)" />
              </div>
            </div>
            <div class="link-card flex-between">
              <div class="left mr4">
                <div class="desc text">
                  {{ v.description ? v.description : '-' }}
                </div>
              </div>
              <div class="right">
                <img src="../../../assets/lottery-default-cover.png" />
              </div>
            </div>
          </div>
        </div>
      </loading>
      <template slot="footer">
        <a-button @click="show = false"> 取消 </a-button>
        <a-button type="primary" @click="confirm"> 确定 </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
// import { getList } from '@/api/lottery'

export default {
  data () {
    return {
      edit: false,
      show: false,
      list: [],
      loading: true,
      selects: [],
      maxSelectCount: 1
    }
  },
  methods: {
    getActive (data) {
      const find = this.selects.find(v => {
        return v.id === data.id
      })

      if (find) return true

      return false
    },

    select (data) {
      const find = this.selects.find(v => {
        return v.id === data.id
      })

      if (find) {
        this.selects.deleteObj('id', data.id)

        return false
      }

      if (this.selects.length >= this.maxSelectCount) {
        this.$message.error(`最多只能选${this.maxSelectCount}个哦`)

        return false
      }

      this.selects.push(data)
    },

    switchType (data) {
      this.type.current = data

      this.getData()
    },

    getData () {
      this.loading = true
      getList({
        status: 0
      }).then(res => {
        this.list = res.data.list

        this.$forceUpdate()

        this.loading = false
      })
    },

    confirm () {
      if (!this.selects.length) {
        this.$message.error('必须选择一个抽奖活动')

        return false
      }

      const ids = this.selects.map(v => {
        return v.id
      })

      this.show = false

      this.$emit(this.edit ? 'edit' : 'change', {
        ids,
        old: this.selects
      })
    },

    $show (data = null, maxSelectCount = 1) {
      if (data) {
        this.selects = data.old

        this.edit = true
      } else {
        this.selects = []

        this.edit = false
      }

      this.getData()

      this.maxSelectCount = maxSelectCount

      this.show = true
    }
  }
}
</script>

<style lang="less" scoped>
.active {
  font-size: 16px;
  color: #000 !important;

  .ant-divider {
    margin-left: 3px;
  }
}

.links {
  max-height: 800px;
  overflow: auto;
  flex-wrap: wrap;

  .item {
    width: 233px;
    padding: 12px;
    background: #fff;
    border: 1px solid #f0f0f0;
    margin-right: 12px;
    margin-bottom: 12px;
    border-radius: 4px;
    cursor: pointer;

    .type {
      height: 19px;
      background: #fff;
      border-radius: 2px;
      border: 1px solid #1890ff;
      font-size: 12px;
      color: #1890ff;
      line-height: 12px;
      padding: 2px 6px;
      margin-right: 4px;
    }

    .link-card {
      padding: 12px;
      padding-left: 0;
      padding-bottom: 6px;
      align-items: start;

      .title {
        font-size: 14px;
        color: #000000a6;
        margin-bottom: 2px;
      }

      .desc {
        font-size: 13px;
        color: #00000066;
      }

      .text {
        width: 139px;
        height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
      }

      img {
        width: 48px;
        height: 48px;
      }
    }

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  .active {
    background: #f1f8ff;
    border: 1px solid #1990ff;
  }
}

/deep/ .ant-checkbox-inner {
  border-radius: 50%;
}
</style> -->
