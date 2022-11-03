<template>
  <div class="add-event">
    <a-modal
      v-model="modalShow"
      :width="485"
      :footer="false"
      centered
      title="购买席位"
    >
      <img
        src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F01%2F37%2F28%2F34573c44a5954c7.jpg&refer=http%3A%2F%2Fku.90sjimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1646755232&t=05836311eb10bb3e501e26a9321e1954">
    </a-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modalShow: false
    }
  },
  methods: {
    confirm () {

    },

    $show () {
      this.modalShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
}

img {
  width: 80%;
  display: block;
  margin: 0 auto;
}

/deep/ .ant-modal-body {
  padding-top: 6px;
}

/deep/ .ant-select {
  width: 100%;
}
</style>
