<template>
  <div class="selectBox">
    <p>
      <a-button size="small" @click="handleAdd" icon="plus">添加</a-button>&nbsp;
      <a-select
        v-show="show"
        show-search
        placeholder="Select a person"
        option-filter-prop="children"
        style="width: 200px"
        :filter-option="filterOption"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
        <a-select-option value="jack">
          Jack
        </a-select-option>
        <a-select-option value="lucy">
          Lucy
        </a-select-option>
        <a-select-option value="tom">
          Tom
        </a-select-option>
      </a-select>
    </p>
    <p>
      <a-tag closable v-for="(item, index) in list" :key="index" @close="handleDelete">
        {{ item.name }}
      </a-tag>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        
      }
    }
  },
  data () {
    return {
      show:false,
      list: []
    }
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
      this.show = false
      this.list.push({
        name: value
      })
    },
    handleBlur() {
      console.log('blur');
    },
    handleFocus() {
      console.log('focus');
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    handleAdd(){
      this.show = true
    },
    handleDelete(e) {
      console.log(e)
    }
  }
}
</script>

<style lang="less" scoped>
.selectBox{
  width:100%;
  overflow: hidden;
  p{
    margin-right:10px;
  }
}
</style>
