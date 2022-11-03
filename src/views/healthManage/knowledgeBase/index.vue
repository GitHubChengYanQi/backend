<!-- 知识库 -->
<template>
  <div>
    <a-card>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="问卷">
          <Questionnaire v-if="currentKey == '1'"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="患教">
          <Article v-if="currentKey == '2'" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="嘱托">
          <Entrust v-if="currentKey == '3'" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import Questionnaire from './components/questionnaire.vue'
import Article from './components/article.vue'
import Entrust from './components/entrust.vue'
export default {
  components: {
    Questionnaire,
    Article,
    Entrust
  },
  data () {
    return {
      currentKey: '1'
    }
  },
  created () {
  },
  beforeDestroy () {
  },
  methods: {
    callback (key) {
      this.currentKey = key
      console.log(key)
    }

  }
}
</script>
