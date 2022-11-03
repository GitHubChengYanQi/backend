<template>
  <div class="link">
    <a-modal :title="`${edit ? '编辑' : '添加'}链接`" :visible="show">
      <div class="f-blod mb8">
        链接设置
      </div>
      <div class="mb12">
        <a-input placeholder="链接地址请以http或https开头"/>
      </div>
      <div class="mb18">
        <a-button type="primary" @click="$refs.radar.$show()">选择互动雷达</a-button>
      </div>
      <div class="flex mb12">
        <span class="f-blod">高级设置：</span>
        <a-switch checked-children="开" un-checked-children="关"/>
      </div>
      <div class="mb23 link-cut" v-if="false">
        <div class="flex mb16">
          <span>链接标题：</span>
          <div class="input">
            <a-input placeholder="请输入链接标题"/>
          </div>
        </div>
        <div class="flex mb18">
          <span>链接描述：</span>
          <div class="input">
            <a-input placeholder="请输入链接描述"/>
          </div>
        </div>
        <div class="flex img-row">
          <span>链接封面：</span>
          <div class="input">
            <upload/>
          </div>
        </div>
      </div>
      <div class="flex mb16">
        <span class="f-blod">链接追踪设置：</span>
        <a-switch checked-children="开" un-checked-children="关"/>
      </div>
      <div class="mb13">
        <a-checkbox/>
        <span class="ml8">行为通知</span>
        <span class="desc-text fz13">（当客户点击雷达链接时，发送雷达链接的员工将会收到消息提醒）</span>
      </div>
      <div class="mb13">
        <a-checkbox/>
        <span class="ml8">动态通知</span>
        <span class="desc-text fz13">（当客户点击雷达链接时，会将客户的打开行为、阅读时长和阅读完成率记录在客户动态里）</span>
      </div>
      <div class="mb13">
        <a-checkbox/>
        <span class="ml8">客户标签</span>
        <span class="desc-text fz13">（给点击雷达链接的客户打上选中的标签）</span>
      </div>
      <div class="mb13 flex" v-if="false">
        <a-button type="primary" ghost>添加标签</a-button>
        <div class="tags ml16">
          <a-tag>标签1</a-tag>
          <a-tag>标签2</a-tag>
        </div>
      </div>
      <template slot="footer">
        <a-button @click="show = false">
          取消
        </a-button>
        <a-button type="primary" @click="confirm">
          确定
        </a-button>
      </template>
    </a-modal>

    <Radar ref="radar"/>
  </div>
</template>

<script>
import Upload from '@/components/Upload/Upload'
import Radar from '@/components/EnterTextMsg/Pop/Radar'

export default {
  data () {
    return {
      show: false,
      edit: false,
      form: {}
    }
  },
  methods: {
    confirm () {
    },
    $show (data = null) {
      if (data) {
        this.edit = true
      } else {
        this.edit = true
      }

      this.show = true
    }
  },
  components: { Upload, Radar }
}
</script>

<style lang="less" scoped>
.link-cut {
  .input {
    flex: 1;
  }
}

.img-row {
  align-items: start;
}

.tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .ant-tag {
    margin-bottom: 3px;
  }
}
</style>
