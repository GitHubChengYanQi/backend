<template>
  <div>
    <a-button type="primary" style="border-radius: 8px" class="add" @click="openSelect">
      创建任务
    </a-button>
    <a-modal
      :footer="null"
      destroyOnClose
      :width="1200"
      title="选择课程"
      :visible="visible"
      @cancel="visible = false"
    >
      <lesson
        select
        :rows="selectCourses"
        @selectRows="selectRows"
      />
      <div style="text-align: center">
        <a-button
          type="primary"
          style="border-radius: 8px"
          class="add"
          :disabled="courses.length === 0"
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
import lesson from '../../../../../lesson/index'
import CreateTask from '../../../CreateTask/index'
import { courseTaskAdd } from '@/api/study/task'
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
  components: { lesson, CreateTask },
  data () {
    return {
      loading: false,
      courses: [],
      selectCourses: [],
      createVisible: false,
      visible: false
    }
  },
  methods: {
    openSelect () {
      this.visible = true
      this.courses = []
      this.selectCourses = []
    },
    selectRows (rows) {
      this.courses = rows
    },
    submit () {
      this.selectCourses = this.courses
      this.visible = false
      this.createVisible = true
    },
    onSubmit (values) {
      const data = {
        courseIds: this.selectCourses.map(item => item.courseId),
        applicableObject: values.applicableObject[0] === 'all' ? 1 : 2,
        haveTimeLimit: values.timeLimit.length > 0 ? 2 : 1,
        empIds: values.applicableObject[0] === 'all' ? [] : values.applicableObject,
        startTime: values.timeLimit[0],
        endTime: values.timeLimit[1]
      }
      this.loading = true
      courseTaskAdd(data).then(() => {
        message.success('课程任务创建成功！')
        this.createVisible = false
        this.$emit('success')
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
