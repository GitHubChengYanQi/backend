<template>
  <div style="width: 100%; height: 100%">
    <Node
      :render-content="renderContent"
      v-for="item in root"
      :key="item._treeId"
      :data="item"
      :active-id.sync="activeId"
      :isTree="true"
    ></Node>
  </div>
</template>

<script>
import Node from "./node.vue";
import { initTree, findNearestComponent } from "./utils/util";
export default {
  name: "TreeDrag",
  components: {
    Node,
  },
  provide() {
    return {
      draggableColor: this.draggableColor,
      height: this.height,
      fontSize: this.fontSize,
      icon: this.icon,
    };
  },
  props: {
    data: {
      type: Array,
    },
    renderContent: Function,
    draggable: {
      // 是否开启拖拽
      type: Boolean,
      default: false,
    },
    defaultExpandAll: {
      // 是否默认展开所有节点
      type: Boolean,
      default: false,
    },
    draggableColor: {
      // 拖拽时的颜色
      type: String,
      default: "409EFF",
    },
    height: {
      // 每行高度
      type: String,
      default: "40px",
    },
    fontSize: {
      type: String,
      default: "14px",
    },
    icon: {
      type: String,
      default: "",
    },
    props: {
      type: Object,
      default() {
        return {
          label: "label",
          children: "children",
        };
      },
    },
  },
  watch: {
    data(nerVal) {
      this.root = initTree(nerVal, this.props, this.defaultExpandAll); // 新树
      if (this.root?.length && !this.activeId) {
        this.activeId = this.root[0].id;
      }
    },
    deep: true
  },
  data() {
    return {
      activeId: 0,
      startData: {}, // 拖拽时被拖拽的节点
      lg1: null, // 拖拽经过的最后一个节点
      lg2: null, // 拖拽经过的最后第二个节点
      root: null, // data的数据
      dragState: {
        showDropIndicator: false,
        draggingNode: null, // 拖动的节点
        dropNode: null,
        allowDrop: true,
      },
      odata: "",
    };
  },
  created() {
    this.odata = this.data;
    this.isTree = true; // 这是最高级
    this.root = initTree(this.data, this.props, this.defaultExpandAll); // 新树

    // 选择移动的元素 事件
    this.$on("node-start", (data, that, ev) => {
      this.startData = data;
      this.dragState.draggingNode = that;
      this.$emit("tree-start", that.data.data, that.data, ev);
    });

    // 移动事件
    this.$on("node-over", (data, that, ev) => {
      console.log(2222)
      console.log(ev.target)
      if (that.$refs.item.id != this.lg1) {
        this.lg2 = this.lg1;
        this.lg1 = that.$refs.item.id;
      }
      let dropNode = findNearestComponent(ev.target, "MyNode"); // 现在的节点
      const oldDropNode = this.dragState.dropNode; // 上一个节点
      if (oldDropNode && oldDropNode !== dropNode) {
        // 判断节点改没改变
        oldDropNode.dropType = "none";
      }

      const draggingNode = this.dragState.draggingNode; // 移动的节点
      console.log(draggingNode)
      console.log(dropNode)
      console.log(this.dragState)
      if (!draggingNode || !dropNode) return;

      console.log(33333)
      let dropPrev = true; // 上
      let dropInner = true; // 中
      let dropNext = true; // 下
      ev.dataTransfer.dropEffect = dropInner ? "move" : "none";
      this.dragState.dropNode = dropNode;

      const targetPosition = dropNode.$el.getBoundingClientRect();
      const prevPercent = dropPrev
        ? dropInner
          ? 0.25
          : dropNext
            ? 0.45
            : 1
        : -1;
      const nextPercent = dropNext
        ? dropInner
          ? 0.75
          : dropPrev
            ? 0.55
            : 0
        : 1;
      var dropType = "";

      const distance = ev.clientY - targetPosition.top;
      if (distance < targetPosition.height * prevPercent) {
        // 在上面
        dropType = "before";
      } else if (distance > targetPosition.height * nextPercent) {
        // 在下面
        dropType = "after";
      } else if (dropInner) {
        dropType = "inner";
      } else {
        dropType = "none";
      }
      if (this.digui(draggingNode.data, dropNode.data._treeId)) {
        dropType = "none";
      }
      dropNode.dropType = dropType;
      console.log(1111111)
      console.log(dropType)
      this.$emit("tree-over", that.data.data, that.data, ev, dropType);
    });

    // 移动结束 事件
    this.$on("node-drop", (data, that, ev) => {
      console.log(data, that, ev)
      console.log(this.startData)
      let sd = JSON.stringify(this.startData.data);
      let ad = JSON.stringify(this.data);
      let ss = ad.split(sd);
      let newData;
      ss = ss.join("");
      console.log(that.dropType)
      if (that.dropType == "none") {
        return;
      }
      console.log(that.dropType)
      if (this.lg2 != null && this.lg1 != this.startData._treeId) {
        // 删除startData
        ss = this.deleteStr(ss);
        let od = JSON.stringify(data.data);
        let a = ss.indexOf(od);
        console.log(newData)
        if (that.dropType == "after") {
          newData = JSON.parse(
            ss.substring(0, a + od.length) +
            "," +
            sd +
            ss.substring(a + od.length)
          );
        } else if (that.dropType == "before") {
          if (a == -1) {
            let s = this.deleteStr(od.split(sd).join(""));
            newData = JSON.parse(
              ss.substring(0, ss.indexOf(s)) +
              sd +
              "," +
              ss.substring(ss.indexOf(s))
            );
          } else {
            newData = JSON.parse(
              ss.substring(0, a) + sd + "," + ss.substring(a)
            );
          }
        } else if (that.dropType == "inner") {
          ss = JSON.parse(ss);
          this.oldData(ss, data.data, JSON.parse(sd));
          newData = ss;
        }
        console.log(newData)
        this.root = initTree(newData, this.props, this.defaultExpandAll); // 新树
        this.$parent.data = newData;
        this.lg1 = null;
        this.lg2 = null;
      }

      this.$emit(
        "tree-drop",
        this.data.data,
        this.data,
        ev,
        this.startData.id,
        data.id,
        that.dropType,
        this.root
      );
      that.dropType = "none";
    });
  },
  methods: {
    /**
     * 修改data，添加输入
     * @param {Array} ss 需要被加入的数据
     * @param {Object} data 落点
     * @param {Object} sd 需要加入的数据
     */
    oldData(ss, data, sd) {
      for (let i = 0; i < ss.length; i++) {
        if (JSON.stringify(ss[i]) == JSON.stringify(data)) {
          if ("children" in ss[i]) {
            ss[i].children.push(sd);
          } else {
            ss[i].children = [];
            ss[i].children.push(sd);
          }
          break;
        } else if ("children" in ss[i]) {
          this.oldData(ss[i].children, data, sd);
        }
      }
    },
    // 判断拖拽时贴近的是不是自己的子元素
    digui(data, id) {
      if (data.children && data.children.length != 0) {
        for (let i = 0; i < data.children.length; i++) {
          if (data.children[i]._treeId == id) {
            return true;
          }
          let s = this.digui(data.children[i], id);
          if (s == true) {
            return true;
          }
        }
      }
    },
    deleteStr(ss) {
      if (ss.indexOf(",,") !== -1) {
        ss = ss.split(",,");
        if (ss.length !== 1) {
          ss = ss.join(",");
        }
      } else if (ss.indexOf("[,") !== -1) {
        ss = ss.split("[,");
        if (ss.length !== 1) {
          ss = ss.join("[");
        }
      } else if (ss.indexOf(",]") !== -1) {
        ss = ss.split(",]");
        if (ss.length !== 1) {
          ss = ss.join("]");
        }
      }
      return ss;
    },
  },
};
</script>

<style scoped>
.drag {
  font-size: 14px;
  text-align: right;
  padding-right: 5px;
  cursor: pointer;
}
</style>
