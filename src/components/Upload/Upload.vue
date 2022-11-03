<template>
  <div class="upload">
    <a-upload
      name="file"
      list-type="picture-card"
      :headers="headers"
      method="post"
      :show-upload-list="false"
      :action="api"
      :accept="accept || '*'"
      @change="uploadChange"
    >
      <div v-if="!loading">
        <div v-if="!value">
          <a-icon type="plus"/>
          <div class="ant-upload-text">
            上传图片
          </div>
        </div>
        <div v-else>
          <img :src="value.fullPath">
        </div>
      </div>
      <div v-else>
        <a-icon type="loading"/>
      </div>
    </a-upload>
  </div>
</template>

<script>
import storage from 'store'

export default {
  data () {
    return {
      api: process.env.VUE_APP_API_BASE_URL + 'common/upload',
      loading: false
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'accept'],
  computed: {
    headers () {
      const token = storage.get('ACCESS_TOKEN')
      return {
        Accept: `application/json`,
        Authorization: token
      }
    }
  },
  methods: {
    uploadChange (e) {
      if (e.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (e.file.type == 'image/webp') {
        this.$message.warning('暂不支持上传webp格式')
        this.loading = false
        return
      }

      const data = e.file.response.data
      if (e.file.status === 'done') {
        this.$emit('input', data)

        this.loading = false
      }

      if (e.file.status === 'error') this.$message.error(data.msg)
    }
  }
}
</script>

<style lang="less" scoped>
img {
  max-width: 130px;
  max-height: 130px;
}
</style>
