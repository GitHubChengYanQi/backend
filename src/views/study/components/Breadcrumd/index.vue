<template>
  <div class="breadcrumb" :style="{'padding-bottom':back ? '0' : '12px'}">
    <a-breadcrumb separator=">">
      <a-breadcrumb-item
        v-for="(item, index) in titles"
        :key="'a' + index"
      >
        {{ item }}
      </a-breadcrumb-item>
    </a-breadcrumb>
    <div
      v-if="back"
      class="back"
      @click.stop="goBack">
      <span class="return_lt"></span>
      <span class="return">返回</span>
    </div>
  </div>
</template>

<script>
import router from '@/router'

export default {
  props: {
    titles: {
      type: Array,
      default () {
        return []
      }
    },
    back: Boolean,
    backTip: Boolean
  },
  methods: {
    goBack () {
      if (this.backTip) {
        this.$confirm({
          title: '当前内容未保存，确定离开?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          centered: true,
          onOk () {
            router.back(-1)
          },
          onCancel () {

          }
        })
        return
      }
      router.back(-1)
    }
  }
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
.breadcrumb {
  padding: 12px 0 0;
}

.back {
  padding: 12px 0;
  display: inline-block;
  cursor: pointer;
}
</style>
