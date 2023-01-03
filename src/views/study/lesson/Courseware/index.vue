<template>
  <div>
    <breadcrumb :titles="['课程管理','课件管理']" back></breadcrumb>
    <a-tabs v-model="key" class="tabs" @change="setKey">
      <a-tab-pane key="1" tab="文件">
        <FileList />
      </a-tab-pane>
      <a-tab-pane key="2" tab="视频">
        <VideoList />
      </a-tab-pane>
      <a-tab-pane key="3" tab="图文">
        <ImageTextList />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import FileList from './components/FileList/index'
import VideoList from './components/VideoList/index'
import ImageTextList from './components/ImageTextList/index'
import breadcrumb from '../../components/Breadcrumd'
import router from '@/router'

export default {
  data () {
    return {
      key: '1'
    }
  },
  created () {
    this.key = router.history.current.query.key || '1'
  },
  methods: {
    setKey (key) {
      router.replace({ path: `/study/lesson/Courseware?key=${key}` })
    }
  },
  components: { FileList, VideoList, ImageTextList, breadcrumb }
}
</script>

<style lang="less" scoped>

.tabs {

  /deep/ .ant-tabs-bar {
    background-color: #fff;
    padding: 0 12px;
    margin: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
}

</style>
