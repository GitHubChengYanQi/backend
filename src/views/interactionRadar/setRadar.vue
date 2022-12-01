<template>
  <div class="a_page">
    <div class="a_card">
      <div class="a_content">
        <div class="title">
          基础设置
        </div>
        <div class="content">
          <div class="input_box">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDict } from '@/api/common.js'

export default {
  data () {
    return {
      addData: {
        inputType: [
          {
            title: '雷达标题',
            type: 'input',
            key: 'radarTitle'
          },
          {
            title: '选择分组',
            type: 'select',
            key: 'selectGrouping',
            selectKey: 'grouping'
          },
          {
            title: '选择渠道',
            type: 'checkbox',
            key: 'selectChannel',
            selectKey: 'channel'
          },
          {
            title: '内容类型',
            type: 'radio',
            key: 'contentType',
            selectKey: 'type'
          }
        ],
        inputData: {
          grouping: '',
          channel: [],
          type: '1'
        }
      },
      selectArr: {
        type: [],
        grouping: [],
        channel: []
      }
    }
  },
  created () {
    this.getSelect('radar_type', 'type')
  },
  methods: {
    getSelect (e, key) {
      if (key == 'type') {
        const obj = {
          dictType: e
        }
        getDict(obj).then((res) => {
          console.log(res)
          const { data } = res
          this.selectArr[key] = data.slice(1, data.length)
          console.log(this.selectArr)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.a_page {
  width: 100%;
  color: #333333;
  font-size: 14px;
  font-family: 'Arial Normal', 'Arial';
  font-weight: 400;
  font-style: normal;
  .a_card {
    width: 100%;
    min-height: 770px;
    box-sizing: border-box;
    padding: 20px 10px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 20px;
    .a_content {
    }
  }
}
</style>
