<template>
  <div>
    <div class="breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <div
            style="display: inline-block;cursor:pointer;"
            @click.stop="$router.back(-1)">
            <span class="return_lt"></span>
            <span class="return">返回</span>
          </div>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <span class="pitch">课件管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="courseware">
      <div class="tabButton">
        <a-button :type="key === '1' ? 'primary' : 'default'" @click="setKey('1')">文件</a-button>
        <a-button :type="key === '2' ? 'primary' : 'default'" @click="setKey('2')">视频</a-button>
        <a-button :type="key === '3' ? 'primary' : 'default'" @click="setKey('3')">图文</a-button>
      </div>
      <FileList v-if="key === '1'" />
      <VideoList v-if="key === '2'" />
      <ImageTextList v-if="key === '3'" />
    </div>
  </div>
</template>

<script>
import FileList from './components/FileList/index'
import VideoList from './components/VideoList/index'
import ImageTextList from './components/ImageTextList/index'

export default {
  data () {
    return {
      key: '1'
    }
  },
  methods: {
    setKey (key) {
      this.key = key
    }
  },
  components: { FileList, VideoList, ImageTextList }
}
</script>

<style lang="less" scoped>

.courseware {
  background-color: #fff;
  padding: 24px;
  margin-top: 12px;

  .tabButton {
    display: flex;

    button {
      width: 200px;
    }
  }
}

</style>
