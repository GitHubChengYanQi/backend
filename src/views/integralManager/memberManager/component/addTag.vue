<template>
  <div class="add-tag">
    <a-button type="primary" :loading="loading" ghost class="mr16" @click="addTags">批量打标签</a-button>

    <SelectTag ref="selectTag" @change="selectChange"/>
  </div>
</template>

<script>
import { batchCreateTag } from '@/api/workContact'

export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectRows: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    addTags () {
      if (this.value.length <= 0) {
        this.$message.warning('请先选择一个客户')
        return
      }
      this.$refs.selectTag.show()
    },
    selectChange (e) {
      this.loading = true
      if (this.value.length === 0) {
        this.$message.error('未选择成员')
        this.loading = false
        return false
      }

      if (e.length === 0) {
        this.$message.error('未选择标签')
        this.loading = false
        return false
      }

      const tagIds = e.map(v => {
        return v.id
      })

      // const list = this.value.map(v => {
      //   return {
      //     contactId: v.contactId,
      //     employeeId: v.employeeId
      //   }
      // })
      // const contactIds = this.value.map(v => {
      //   return v.contactId
      // })
      // const contactIds = this.value
      const contactIds = []
      for (const tmp in this.selectRows) {
        this.selectRows[tmp].map(v => {
          contactIds.push(v.contactId)
        })
      }
      batchCreateTag({
        contactIds,
        tagIds
      }).then(() => {
        this.$message.success('操作成功')
        this.loading = false
        this.$emit('change')
      })
    }
  }
}
</script>

<style scoped>

</style>
