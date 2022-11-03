<template>
  <div class="add">
    <a-modal v-model="showFlag" :title="`${edit ? '编辑' : '新建'}标签组`">
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="标签组名称">
          <a-input placeholder="请输入标签组名称" :maxLength="30" v-model="form.groupName"/>
        </a-form-item>
        <a-form-item label="标签名">
          <div class="inputs">
            <div class="item flex" v-for="(v,i) in form.tags" :key="i">
              <div class="input">
                <a-input placeholder="请输入标签名" :maxLength="30" v-model="v.name"/>
              </div>
              <div class="icons">
                <a-icon type="minus-circle" class="mr8" @click="del(i)"/>
                <a-icon type="up-circle" class="mr8" @click="up(i)"/>
                <a-icon type="down-circle" @click="down(i)"/>
              </div>
            </div>
          </div>
          <div class="add">
            <a @click="addLabel()">
              <a-icon type="plus-circle"/>
              添加标签
            </a>
          </div>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <div class="flex-between">
          <div class="del">
            <span @click="delGroup">
              {{ edit ? '删除标签组' : '' }}
            </span>
          </div>
          <div class="btn">
            <a-button @click="showFlag = false">取消</a-button>
            <a-button type="primary" @click="ok" :loading="loading">确定</a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { addContactTagGroup, editContactTagGroup, delContactTagGroup } from '@/api/workContactTag'

export default {
  data () {
    return {
      loading: false,
      showFlag: false,
      edit: false,
      form: {
        groupName: '',
        tags: [
          { name: '', order: 1 }
        ]
      },
      deleteTags: []
    }
  },
  methods: {
    up (i) {
      if (i === 0) {
        this.$message.error('不能在上了')
        return false
      }
      const order = this.form.tags[i - 1].order
      this.form.tags[i - 1].order = this.form.tags[i].order
      this.form.tags[i].order = order
      this.form.tags.sort(function (a, b) {
        return b.order - a.order
      })
    },

    down (i) {
      if (i + 1 === this.form.tags.length) {
        this.$message.error('不能在下了')
        return false
      }
      const order = this.form.tags[i + 1].order
      this.form.tags[i + 1].order = this.form.tags[i].order
      this.form.tags[i].order = order
      this.form.tags.sort(function (a, b) {
        return b.order - a.order
      })
    },
    isRepeat (arr) {
      var hash = {}
      for (var i in arr) {
        if (hash[arr[i]]) { return true }
        hash[arr[i]] = true
      }
      return false
    },
    ok () {
      const h = _ => {
        this.$message.success('操作成功')
        this.$emit('change')
        this.showFlag = false
        this.loading = false
      }
      const arr = []
      const nameArr = []
      for (let i = 0; i < this.form.tags.length; i++) {
        if (this.form.tags[i].name !== '') {
          this.form.tags[i].order = this.form.tags.length - i
          arr.push(this.form.tags[i])
          nameArr.push(this.form.tags[i].name)
        }
      }

      this.form.tags = arr
      if (this.isRepeat(nameArr)) {
        this.$message.error('标签已存在')
        return false
      }

      // 新增
      if (!this.edit) {
        if (this.$parent.list.length > 0) {
          this.form.groupOrder = this.$parent.list[0].groupOrder + 1
        } else {
          this.form.groupOrder = 1
        }
        this.loading = true
        addContactTagGroup(this.form).then(h).catch(() => {
          this.loading = false
        })
      }
      // 编辑
      if (this.edit) {
        this.loading = true
        editContactTagGroup({
          ...this.form,
          deleteTags: this.deleteTags,
          isUpdate: 1
        }).then(h).catch(() => {
          this.loading = false
        })
      }
    },

    delGroup () {
      if (!this.edit) return false

      const _this = this

      this.$confirm({
        title: '提示',
        content: '确认后将会删除该标签组，是否删除？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          _this.loading = true
          delContactTagGroup({
            groupId: _this.form.groupId
          }).then(() => {
            _this.loading = false
            _this.showFlag = false
            _this.$message.success('删除成功')
            _this.$emit('change')
          })
        }
      })
    },

    $show (data) {
      console.log(data, 'data')
      if (data) {
        this.form = JSON.parse(JSON.stringify(data))
        this.edit = true
      } else {
        this.edit = false
        this.form = {
          groupName: '',
          tags: [
            { name: '', order: 1 }
          ]
        }
      }

      this.deleteTags = []
      this.showFlag = true
    },

    del (i) {
      if (this.form.tags.length === 1) {
        this.$message.error('不能删除最后一个哦')
        return false
      }

      this.deleteTags.push(this.form.tags[i])
      this.form.tags.splice(i, 1)
    },
    addLabel () {
      const arr = this.form.tags
      this.form.tags.push({ name: '', order: arr.length + 1 })
      for (let i = 0; i < arr.length; i++) {
        arr[i].order = arr.length - i
      }
    }
  }
}
</script>

<style lang="less" scoped>
.inputs {
  .item {
    margin-bottom: 8px;

    .input {
      width: 79.5%;
      margin-right: 10px;
    }

    .icons {
      flex: 1;

      i {
        cursor: pointer;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.del {
  font-size: 13px;
  cursor: pointer;
}
</style>
