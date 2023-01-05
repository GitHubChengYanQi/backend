<template>
  <div>
    <a-modal
      :closable="false"
      class="previewModal"
      centered
      destroyOnClose
      :visible="preview"
      @cancel="()=>$emit('close')"
      :footer="[]"
    >
      <div class="preview">
        <div class="title">
          <a-icon type="close" />
          <div>
            <div>{{ title }}</div>
          </div>
          <a-icon type="more" />
        </div>
        <div class="content">
          <div class="url">
            <slot></slot>
          </div>
          <div class="ql-editor">
            <div v-html="content"></div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    preview: Boolean,
    title: {
      type: String,
      default: _ => ''
    },
    content: {
      type: String,
      default: _ => ''
    }
  }
}
</script>

<style lang="less">
.previewModal {
  .ant-modal-content {
    background-color: transparent;
    box-shadow: none;
  }
}

.preview {
  border-radius: 60px;
  background-color: #fff;
  margin: auto;
  width: 379px;
  height: 758px;
  background-image: url("../../../../assets/mobile.png");
  background-repeat: no-repeat;
  padding: 65px 45px;

  .title {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 24px;

    > div {
      flex-grow: 1;

      > div {
        margin: auto;
        white-space: nowrap;
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .url {
    padding-bottom: 24px;
  }

  .content {
    overflow: hidden auto;
    max-width: 289px;
    max-height: 580px;
  }
}
</style>
