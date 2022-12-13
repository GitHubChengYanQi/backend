<template>
  <div>
    <div class="lessonAnalysis">
      <div class="head">
        <div class="headImg">
          <img
            height="220"
            src="data:image/jpeg;base64,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"
          >
          <div class="info">
            <span>共13个课件</span>
            <span style="float: right">12:23:23</span>
          </div>
        </div>
        <div class="column">
          <div class="title">健康知识培训</div>
          <div class="space">
            <div>
              <div>创建人：小乔</div>
              <div>试卷分数：20</div>
              <div>答卷时长：30:09:00</div>
              <div>重复考试：不允许重复考试</div>
            </div>
            <div>
              <div>创建时间：2022.10.1</div>
              <div>通过分数：20</div>
              <div>限定时长：2022.10.1</div>
              <div>试卷名称：尿酸是怎样升高的</div>
            </div>
          </div>
          <div class="note">
            本次课程..............................
          </div>
        </div>
      </div>
    </div>

    <div class="examinationContent">
      <div class="title">考试内容</div>
      <div class="question">
        <div class="questionName">
          <div class="name">
            1.脚气有哪几种常见类型
          </div>
          <div class="my-space">
            （5分）
            <a-tag color="#108ee9">
              单选
            </a-tag>
          </div>
        </div>
        <div class="options">
          <a-radio :style="radioStyle" :checked="false">
            A.糜烂型/脱皮型/干裂型
          </a-radio>
          <a-radio :style="radioStyle" :checked="false">
            B.糜烂型/脱皮型/干裂型
          </a-radio>
          <a-radio :style="radioStyle" :checked="true">
            C.糜烂型/脱皮型/干裂型
          </a-radio>
          <a-radio :style="radioStyle" :checked="false">
            D.糜烂型/脱皮型/干裂型
          </a-radio>
        </div>
        <div class="answer">
          <div class="tip">正确答案</div>
          C.糜烂型/脱皮型/干裂型
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      radioStyle: {
        display: 'block',
        height: '50px'
      },
      imgUrl: '',
      imgName: '',
      uploadVisible: false,
      fileName: String,
      visible: false,
      screenData: {
        gender: 3,
        addWay: '全部',
        fieldId: 0
      },
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'center',
          width: '200px'
        },
        {
          title: '所属机构',
          width: '200px',
          dataIndex: 'size',
          align: 'center'
        },
        {
          title: '所属门店',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '学习状态',
          dataIndex: 'user',
          align: 'center'
        },
        {
          title: '学习进度',
          dataIndex: '1',
          align: 'center',
          sorter: true
        },
        {
          title: '累计学习时长',
          dataIndex: '2',
          align: 'center',
          sorter: true
        },
        {
          title: '上次学习',
          dataIndex: '3',
          align: 'center',
          sorter: true
        },
        {
          title: '完成时间',
          dataIndex: '4',
          align: 'center',
          sorter: true
        },
        {
          title: '总考状态',
          dataIndex: '5',
          align: 'center'
        },
        {
          title: '考试结果',
          dataIndex: '6',
          align: 'center'
        }
      ],
      tableData: [],
      checkIds: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共 ${total} 条数据`
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    handleOk () {
      console.log('ok')
    },
    deleteAttribute (id) {
      console.log(id)
    },
    getTableData () {
      // const params = {
      //   keyWords: this.screenData.keyWords,
      //   remark: this.screenData.remark,
      //   fieldId: this.screenData.fieldId,
      //   fieldType: Number(this.fieldType),
      //   fieldValue: this.fieldTypeText ? this.screenData.fieldValue : this.optionsSelect,
      //   gender: this.screenData.gender,
      //   addWay: this.screenData.addWay,
      //   roomId: this.roomIdList.join(','),
      //   groupNum: this.groupNum,
      //   employeeId: this.employeeIdList,
      //   startTime: this.screenData.startTime,
      //   endTime: this.screenData.endTime,
      //   businessNo: this.screenData.businessNo,
      //   page: this.pagination.current,
      //   perPage: this.pagination.pageSize
      // }
      // workContactList(params).then(res => {
      //   this.roomIdList = []
      //   this.employeeIdList = ''
      //   this.employees = []
      //   this.tableData = res.data.list
      //   this.pagination.total = res.data.page.total
      // })
      this.tableData = [{
        id: '123',
        name: '需求文档.dox',
        size: '856.6kb',
        createTime: '2022-12-05',
        user: 'me'
      }]
      this.pagination.total = 666
    },
    handleTableChange ({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    selectChange (row) {
      this.checkIds = row
    },
    // 群聊筛选
    // 重置
    reset () {
      this.screenData = {
        gender: 3,
        addWay: '全部',
        fieldId: 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.lessonAnalysis {

  .title {
    font-weight: bold;
    font-size: 24px;
  }

  .space {
    display: flex;
    gap: 24px;
  }

  .head {
    padding: 24px;
    background-color: #fff;
    display: flex;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
  }

  .note {
    border-radius: 4px;
    padding: 12px;
    color: #a4a1a4;
    font-size: 12px;
  }

  .headImg {
    display: inline-block;
    width: 270px;
    position: relative;

    img {
      max-width: 270px;
      border-radius: 2px;
    }

    .info {
      padding: 12px;
      color: #fff;
      border-top: solid 1px #fff;
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }

  .count {
    background-color: #fbfbfb;
    padding: 12px 24px;
    border-radius: 8px;
    display: flex;
    width: max-content;

    > div {
      width: 100px;
    }

    .number {
      font-weight: bold;

      .num {
        font-size: 18px;
      }
    }
  }
}

.examinationContent {
  border-radius: 8px;
  background-color: #fff;
  padding: 24px 0;

  .title {
    border-left: solid 2px #1890ff;
    padding-left: 8px;
  }

  .question {
    padding-top: 24px;

    .questionName {
      padding: 24px 40px 24px 110px;
      background-color: #FBFBFB;
      display: flex;
      align-items: center;

      .name {
        flex-grow: 1;
      }
    }

    .options {
      padding: 24px 110px 0;
    }

    .answer {
      padding: 18px 110px 18px 24px;
      margin-left: 110px;
      background-color: rgba(16, 142, 233,0.1);
      display: inline-block;
      border-radius: 8px;

      .tip {
        color: #108ee9;
        padding-bottom: 8px;
      }
    }
  }
}
</style>
