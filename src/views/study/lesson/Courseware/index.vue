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
.my-space {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-search {
  .ant-form-inline {
    .ant-form-item {
      margin-bottom: 24px;
    }
  }
}

.warnButton {
  color: rgba(255, 152, 0, 1);
  background-color: rgba(252, 192, 104, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.linkButton {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.delButton {
  color: #ff4d4f;
  background-color: rgba(255, 77, 79, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.successButton {
  color: #01ba77;
  background-color: rgba(1, 186, 119, 0.1);
  border: none;
  height: auto;
  padding: 4px 12px;
  border-radius: 8px;
}

.my-table-search {
  border-radius: 8px;

  .ant-form-inline .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-input,
  .ant-select-selection,
  .ant-time-picker-input {
    border-radius: 8px !important;
  }

  .ant-btn {
    margin-right: 10px;
    border-radius: 8px;
  }
}

.my-table-wrapper {
  border-radius: 8px;

  .btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 24px;

    > .ant-btn {
      margin-left: 12px;
      border-radius: 8px;
    }
  }
}

.my-table {
  background-color: #fff;

  .ant-table-pagination {
    padding: 24px;
    float: none;
    text-align: center;
  }
}

.myTooltip {
  background-color: #fff;

  .ant-tooltip-inner {
    color: #000;
    background-color: #fff;
  }

  .ant-tooltip-arrow::before {
    background-color: #fff;
  }
}

.myLabelBox {
  width: 400px;

  span {
    margin-bottom: 10px;
  }
}

.my-modal {
  .ant-modal-footer {
    padding: 24px;
    text-align: center;

    .ant-btn {
      padding: 0 24px;
      border-radius: 8px;
    }

    .ant-modal-footer button + button {
      margin-left: 24px;
    }
  }
}

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
