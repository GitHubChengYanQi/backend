<template>
  <div>
    <a-button type="primary" style="border-radius: 8px" class="add" @click="visible = true">
      创建任务
    </a-button>
    <a-modal
      :footer="null"
      destroyOnClose
      :width="1200"
      title="选择考试"
      :visible="visible"
      @cancel="visible = false"
    >
      <examination
        select
        checkbox
        :rows="selectExamination"
        @selectRows="selectRows"
      />
      <div style="text-align: center">
        <a-button
          type="primary"
          style="border-radius: 8px"
          class="add"
          @click="submit"
        >
          确定
        </a-button>
      </div>
    </a-modal>

    <a-modal
      :footer="null"
      destroyOnClose
      :width="800"
      title="选择课程"
      :visible="createVisible"
      @cancel="cancel"
    >
      <CreateTask :loading="loading" @onSubmit="onSubmit" />
    </a-modal>
  </div>
</template>

<script>
import examination from '../../../../../examination/index'
import CreateTask from '../../../CreateTask/index'
import { courseTask } from '@/api/study/task'
import { message } from 'ant-design-vue'

export default {
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: { examination, CreateTask },
  data () {
    return {
      examination: [],
      selectExamination: [],
      createVisible: false,
      visible: false,
      loading: false
    }
  },
  methods: {
    selectRows (rows) {
      this.examination = rows
    },
    submit () {
      this.selectExamination = this.examination
      this.visible = false
      this.createVisible = true
    },
    onSubmit (values) {
      const data = {
        examIds: this.selectExamination.map(item => item.examId),
        applicableObject: values.applicableObject[0] === 'all' ? 1 : 2,
        haveTimeLimit: values.timeLimit.length > 0 ? 2 : 1,
        empIds: values.applicableObject[0] === 'all' ? [] : values.applicableObject,
        startTime: values.timeLimit[0],
        endTime: values.timeLimit[1]
      }
      this.loading = true
      courseTask(data).then(() => {
        message.success('考试任务创建成功！')
        this.createVisible = false
      }).finally(() => {
        this.loading = false
      })
    },
    cancel () {
      this.createVisible = false
      this.visible = true
    }
  }
}
</script>
