<template>
  <div
    class="drag-tree item"
    :draggable="tree.draggable"
    @dragstart.stop="dragstart"
    @dragover.stop="dragover"
    @drop.stop="drop"
    @contextmenu="($event) => this.handleContextMenu($event)"
    ref="item"
    :id="data._treeId"
  >
    <!-- 每一行 -->
    <div
      style="height: 1px"
      :style="{ background: dropType === 'before' ? `#${draggableColor}` : '' }"
    ></div>
    <div
      @click="itemClick($event, data)"
      :class="['text', active === data.id ? 'is-current' : '']"
      :style="{
        height: height,
        lineHeight: height,
        fontSize: fontSize,
        position: 'relative',
        margin: '0 auto',
      }"
    >
      <span
        :style="{
          display: 'inline-block',
          width: (data.layer - 1) * 18 + 'px',
        }"
      ></span>
      <img
        :class="[data.defaultExpandAll ? 'iconBottom' : 'iconRight']"
        v-show="data.children && data.children.length !== 0"
        :src="iconImg"
        :style="{
          width: fontSize,
          height: fontSize,
          display: 'inline-block',
          verticalAlign: 'middle',
          marginRight: '3px',
        }"
        alt=""
      />
      <span
        v-show="!data.children || data.children.length === 0"
        :style="{
          width: fontSize,
          height: fontSize,
          display: 'inline-block',
          verticalAlign: 'middle',
          marginRight: '3px',
        }"
      ></span>
      <img
        v-if="data.TreeImg"
        :src="dataImg"
        :style="{
          width: fontSize,
          height: fontSize + 5,
          display: 'inline-block',
          verticalAlign: 'middle',
          marginRight: '3px',
        }"
      />
      <div class="Action">
        <svg viewBox="0 0 20 20" width="12">
          <path
            d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
        </svg>
      </div>
      <span
        :style="{
          background: dropType == 'inner' ? `#${draggableColor}` : '',
          height: fontSize + 5,
          color: dropType == 'inner' ? '#fff' : '#7d90b2',
          overflow: 'hidden',
        }"
      >{{ data.label }}{{ data.isCurrent }}</span
      >
      <node-content :node="data"></node-content>
    </div>
    <div
      style="height: 1px"
      :style="{ background: dropType === 'after' ? `#${draggableColor}` : '' }"
    ></div>
    <div
      v-if="data.children && data.children.length !== 0"
      :class="[data.defaultExpandAll ? 'sonShow' : 'sonVanish', 'son']"
    >
      <my-node
        v-for="item in data.children"
        :key="item._treeId"
        :render-content="renderContent"
        :data="item"
        :active-id.sync="active"
      ></my-node>
    </div>
  </div>
</template>

<script>
import { findNearestComponent } from './utils/util'

export default {
  name: 'MyNode',
  props: {
    data: {
      // 接收的数据
      type: Object
    },
    activeId: {
      type: [Number, String]
    },
    renderContent: Function
  },
  components: {
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render (h) {
        const parent = this.$parent
        const tree = parent.tree
        const node = this.node
        const { data, store } = node
        return (
          parent.renderContent
            ? parent.renderContent.call(parent._renderProxy, h, { _self: tree.$vnode.context, node, data, store })
            : tree.$scopedSlots.default
              ? tree.$scopedSlots.default({ node, data })
              : ''
        )
      }
    }
  },
  inject: ['draggableColor', 'height', 'fontSize', 'icon'],
  data () {
    return {
      curNode: null,
      tree: '', // 最上一级
      dropType: 'none',
      iconImg: '',
      dataImg: ''
    }
  },
  computed: {
    active: {
      set (val) {
        this.$emit('update:activeId', val)
      },
      get () {
        return this.activeId
      }
    }
  },
  created () {
    let parent = this.$parent
    if (parent.isTree) {
      this.tree = parent
    } else {
      this.tree = parent.tree
    }
    // console.log(this.$parent)
    // console.log(this.tree)
    // console.log(parent)
    // console.log(parent.isTree)
    // console.log(parent.tree)
    // 有没有自定义icon
    if (this.icon.length != 0) {
      let s = this.icon.slice(0, 2)
      let url = this.icon.slice(2)
      if (s == '@/') {
        // this.iconImg = require(`@/${url}`)
      } else {
        this.iconImg = this.icon
      }
    } else {
      // this.iconImg = require('@/assets/images/business/tree/right.png')
    }
    if (this.data.TreeImg) {
      let s = this.data.TreeImg.slice(0, 2)
      let url = this.data.TreeImg.slice(2)
      if (s == '@/') {
        // this.dataImg = require(`@/${url}`)
      } else {
        this.dataImg = this.data.TreeImg
      }
    }
  },
  mounted () {
    document.body.addEventListener('click', this.closeMenu)
  },
  destroyed () {
    document.body.removeEventListener('click', this.closeMenu)
  },
  methods: {
    closeMenu () {
      this.tree.$emit('close-menu')
    },
    handleContextMenu (event) {
      if (this.tree._events['node-contextmenu'] && this.tree._events['node-contextmenu'].length > 0) {
        event.stopPropagation()
        event.preventDefault()
      }
      this.tree.$emit('node-contextmenu', event, this.data, this)
    },
    // 选择要滑动的元素
    dragstart (ev) {
      if (!this.tree.draggable) return
      this.tree.$emit('node-start', this.data, this, ev)
    },
    // 滑动中
    dragover (ev) {
      if (!this.tree.draggable) return
      ev.preventDefault()
      this.tree.$emit('node-over', this.data, this, ev)
    },
    // 滑动结束
    drop (ev) {
      if (!this.tree.draggable) return
      this.tree.$emit('node-drop', this.data, this, ev)
    },
    // 行点击事件
    itemClick (ev, data) {
      let dropNode = findNearestComponent(ev.target, 'MyNode') // 现在的节点
      this.active = data.id
      this.data.defaultExpandAll = !this.data.defaultExpandAll // 改变树的伸缩状态
      this.tree.$emit('tree-click', this.data, dropNode)
      let right = localStorage.getItem('right')
      if (this.data.defaultExpandAll === true) {
        if (right) {
          right = JSON.parse(right)
          right.push(this.data.id)
        } else {
          right = []
          right.push(this.data.id)
        }
      } else {
        if (right) {
          right = JSON.parse(right)
          right.indexOf(this.data.id) !== -1
            ? right.splice(right.indexOf(this.data.id), 1)
            : ''
        }
      }
      localStorage.setItem('right', JSON.stringify(right))
    }
  }
}
</script>

<style lang="less">
.drag-tree {
  .text {
    color: #7d90b2;
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;

    &.is-current {
      background: #f5f7fa;
    }
  }

  .text:hover {
    background: #f5f7fa;
  }

  .iconBottom {
    transition: 0.3s;
    transform: rotate(90deg);
  }

  .iconRight {
    transition: 0.3s;
    transform: rotate(0deg);
  }

  .son {
    max-height: 0px;
    overflow: hidden;
    transition: 0.3s max-height;
  }

  .sonVanish {
    max-height: 0px;
  }

  .sonShow {
    max-height: 1000px;
  }

  &-popover {
    width: 100px;
    height: auto;
    position: fixed;
    background: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 1px 6px rgba(54, 54, 54, 0.2);
    z-index: 9999;
    border-radius: 4px;

    &-item {
      color: #515a6e;
      line-height: 35px;
      text-align: center;
      cursor: pointer;
      transition: background .2s ease-in-out;

      &:hover, &:active {
        background: #f3f3f3;
      }
    }
  }

  .Action {
    display: inline-block;
    padding-right: 15px;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    touch-action: none;
    cursor: var(--cursor, pointer);
    border-radius: 5px;
    border: none;
    outline: none;
    appearance: none;
    background-color: transparent;
    -webkit-tap-highlight-color: transparent;

    svg {
      flex: 0 0 auto;
      margin: auto;
      height: 100%;
      overflow: visible;
      fill: #919eab;
    }
  }
}
</style>
