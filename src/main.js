// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios, axios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import loading from '@/components/loading/loading'
import selectEmployee from '@/components/SelectEmployeeNew/Select'
import selectEmployeeInput from '@/components/SelectEmployeeNew/Input'

import selectPersonnel from './components/SelectPersonnel/index'
import selectDepartment from './components/SelectDepartment/index'
// 引入新的组织架构组件多选(全选)
import selectPersonAll from '@/components/SelectPersonnelAll/index'
// 引入新的组织架构组件多选(只选人)
import selectPersonOnlyPerson from '@/components/SelectPersonnelOnlyPerson/index'
// 引入新的组织架构组件多选(只选机构)
import selectPersonOnlyDepart from '@/components/SelectPersonnelOnlyDepart/index'
// 引入新的组织架构组件单选(只选人)
import selectReadonlyPersonOnlyPerson from '@/components/SelectReadonlyPersonOnlyPerson'
// 引入新的组织架构组件单选(只选机构)
import selectReadonlyPersonOnlyDepart from '@/components/SelectReadonlyPersonOnlyDepart'
import selectTag from '@/components/Select/tag'
import selectGroupTag from '@/components/Select/groupTags'
import selectTagInput from '@/components/SelectTag/Input'
import selectGroup from '@/components/Select/group'
import selectGroupInput from '@/components/SelectGroup/Input'
import stepNews from '@/components/StepNews/StepNews'
import ExportExcel from '@/components/ExportDownload/ExportExcel'
import preview from '@/components/Preview/index'
import More from '@/components/More/More'

// 引入富文本编辑器
import '@/assets/css/quill.core.css'
import '@/assets/css/quill.snow.css'
import '@/assets/css/quill.bubble.css'

import './core/lazy_use'
import './router/navigationGuards' // permission control
import './utils/filter' // global filter
import './global.less'
import './utils/inherit'

// 图片查看器
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

import VueDragResize from 'vue-drag-resize'

Vue.prototype.$http = axios
Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueQuillEditor)
Vue.use(VueViewer)

Vue.use(VueAxios)
Vue.component('SelectEmployee', selectEmployee)
Vue.component('SelectEmployeeInput', selectEmployeeInput)
Vue.component('SelectPersonnel', selectPersonnel)
Vue.component('SelectDepartment', selectDepartment)
Vue.component('SelectTag', selectTag)
Vue.component('selectGroupTags', selectGroupTag)
Vue.component('SelectTagInput', selectTagInput)
Vue.component('SelectGroup', selectGroup)
Vue.component('SelectGroupInput', selectGroupInput)
Vue.component('StepNews', stepNews)
Vue.component('ExportExcel', ExportExcel)
Vue.component('m-preview', preview)
Vue.component('More', More)
// 使用新的组织架构组件多选(全选)
Vue.component('SelectPersonAll', selectPersonAll)
// 使用新的组织架构组件多选(只选人)
Vue.component('SelectPersonOnlyPerson', selectPersonOnlyPerson)
// 使用新的组织架构组件多选(只选部门)
Vue.component('SelectPersonOnlyDepart', selectPersonOnlyDepart)
// 使用新的组织架构组件单选(只选人)
Vue.component('SelectReadonlyPersonOnlyPerson', selectReadonlyPersonOnlyPerson)
// 使用新的组织架构组件单选(只选部门)
Vue.component('SelectReadonlyPersonOnlyDepart', selectReadonlyPersonOnlyDepart)
Vue.component('vue-drag-resize', VueDragResize)
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('Loading', loading)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
