/* eslint-disable */
<!-- 随访方案库 -->
<template>
  <div>
    <a-card>
      <a-row type="flex" justify="space-between">
        <div class="flex-row-center">
          <div>预制方案分类：</div>
          <a-select style="width: 300px" v-model="searchData.dictCode" @change="handleChange" allowClear>
            <a-select-option v-for="item in classList" :key="item.code"> {{ item.name }} </a-select-option>
          </a-select>
        </div>
        <div>
          <a-button type="primary" @click="pushDetail('add')" v-permission="'all_programme@submit'">创建企业随访方案</a-button>
        </div>
      </a-row>
      <a-divider></a-divider>
      <a-spin :spinning="loading">
        <div class="list_content_">
          <ProgrammeItemrog
            v-for="item in list"
            :key="item.planId"
            :planName="item.planName"
            :isDefault="item.isDefault"
          >
            <template v-slot:body>
              <div class="describe">方案描述：{{ item.description }}</div>
            </template>
            <template v-slot:footer>
              <div class="btns flex-row-center">
                <a-button type="primary" ghost @click="addProgramme(item)" v-permission="'/planTemplate/addToPlan#post'"> 添加到随访方案 </a-button>
                <a-button type="primary" ghost @click="pushDetail('edit', item.planId)" v-permission="'all_programme@edit'"> 编辑 </a-button>
                <a-button type="primary" ghost @click="toDetail(item.planId)" v-permission="'/planTemplate/detail#post'"> 查看 </a-button>
              </div>
            </template>
          </ProgrammeItemrog>
        </div>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import ProgrammeItemrog from '../components/programmeItem/index.vue'
import { planTemplateList, planTemplateAddToPlan } from '@/api/healthManage'
import { getDict } from '@/api/common.js'
export default {
  name: 'AllProgramme',
  components: {
    ProgrammeItemrog
  },
  data () {
    return {
      loading: false,
      list: [],
      searchData: {},
      classList: []
    }
  },
  created () {
    this.getList()
    this.getClass()
  },
  beforeDestroy () {},
  methods: {
    // 列表
    async getList () {
      this.loading = true
      const data = await planTemplateList(this.searchData)
      if (data.code == 200) this.list = data.data.data
      this.loading = false
    },
    handleChange () {
      // select选择器变化
      this.getList()
    },
    // 跳转详情页
    pushDetail (type, id = '') {
      // this.$router.push('/healthManage/allProgrammeDetail')
      this.$router.push(`/healthManage/addProgramme?planId=${id}&type=${type}&pageType=enterprise`)
    },
    toDetail (id) {
      this.$router.push(`/healthManage/allProgrammeDetail?planId=${id}`)
    },
    // 添加到随访方案库
    addProgramme ({ planId }) {
      this.$confirm({
        content: '确定要添加到随访方案中吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          const { code } = await planTemplateAddToPlan({ planId })
          if (code == 200) {
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败')
          }
        }
      })
    },
    // 获取方案分类
    async getClass () {
      const { data } = await getDict({ dictType: 'diagnosis_care_plan_template_type' })
      this.classList = data
    }
  }
}
</script>

<style lang="less" scoped>
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.searchInput {
  width: 270px;
  margin-right: 20px;
}

.list_content_ {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: calc(100vh - 270px);
  overflow-y: auto;
  align-content: flex-start;
  .btns {
    height: 100%;
    justify-content: space-between;
  }

  .describe {
    margin-top: 10px;
    font-size: 14px;
    padding-left: 20px;
    height: calc(100% - 80px);
    height: 42px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
