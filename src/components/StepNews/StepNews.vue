<template>
  <div class="box">
    <div class="list" v-if="value.length">
      <div class="item" v-for="(v,i) in value" :key="i">
        <div class="date">
          {{ v.week }} {{ v.day }}
        </div>
        <div class="tags mt12">
          <div class="tag" v-for="(v2,i2) in v.list" :key="i2">
            <div class="tag-time">
              <a-icon type="tag" class="mr6"/>
              {{ v2.time }}
            </div>
            <div class="tag-content">
              <div class="card mt10">
                <div class="title">{{ v2.content.title }}</div>
                {{ v2.content.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <Empty />
    </div>
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['value'],
  components: { Empty }
}
</script>

<style lang="less" scoped>
.date {
  color: rgba(0, 0, 0, .85);
  font-size: 13px;
  font-weight: 700;
}

.tag-time {
  display: flex;
  align-items: center;
  color: #aeb4bf;
  font-size: 13px;
}

.tag-content {
  margin-left: 7px;
  border-left: 1px dashed #b4b9c3;
  padding-left: 20px;
  padding-bottom: 14px;
  display: flex;
  flex-direction: column;

  .card {
    padding: 10px 20px;
    border: 1px solid #d0e8ff;
    border-radius: 2px;
    background: #f6fbfe;
    margin-right: 14px;

    .title {
      font-size: 14px;
      color: rgba(0, 0, 0, .9);
      font-weight: 700;
      margin-bottom: 6px;
    }
  }
}
</style>
