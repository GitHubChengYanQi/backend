<template>
  <div>
    <!--图片-->
    <div v-if="imgShow"><img :src="downloadUrl" /></div>
    <!--doc，excel-->
    <div v-else-if="docShow || excelShow">
      <iframe
        class="child"
        frameborder="0"
        :src="'https://view.officeapps.live.com/op/view.aspx?src=' + this.downloadUrl "
        :style=" { width: '500px', height: '500px' } ">
      </iframe>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      fileName: '',
      downloadUrl: 'https://yfscrm.oss-cn-beijing.aliyuncs.com/upload/16715071275660088211.doc?Expires=1671510727&OSSAccessKeyId=LTAIAX24MUz7rbXu&Signature=8tc2CEHZSIteVihDzgt6PwGII1E%3D',
      imgShow: false,
      docShow: true,
      excelShow: false
    }
  }
}
</script>
<style scoped>
.child {
  width: 100%;
  height: 100%;
  scrolling: no;
  frameborder: 0;
  border: 0;
  marginwidth: 0;
  marginheight: 0;
}
</style>
