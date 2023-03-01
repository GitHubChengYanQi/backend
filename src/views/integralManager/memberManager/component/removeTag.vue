<template>
  <div class="add-tag">
    <a-button type="primary" ghost class="mr16" :loading="loading" @click="removeTags">批量移除标签</a-button>

    <SelectTag ref="selectTag" @change="selectChange"/>
  </div>
</template>

<script>
import { batchDestroyContactTag } from '@/api/workContact'

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
      batchDestroyContactTag({
        contactIds,
        tagIds
      }).then(() => {
        this.$message.success('操作成功')
        this.loading = false
        this.$emit('change')
      })
    },
    removeTags () {
      if (this.value.length <= 0) {
        this.$message.warning('请先选择一个客户')
        return
      }
      this.$refs.selectTag.show()
    }
  }
}
</script>

<style scoped>

</style>
