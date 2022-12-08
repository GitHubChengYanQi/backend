import store from '@/store'
import router, { newRouter } from '@/router'

// 更改菜单路由
export function exChangeMenu (path) {
  const firstMenu = store.getters.permissionList.filter((item) => {
    return item.routes.includes(path)
  })
  if (firstMenu.length !== 0) {
    const title = store.state.permission.topMenuKey.title
    if (firstMenu[0].title !== title) {
      store.commit('SET_TOP_MENU_KEY', firstMenu[0])
    }
    const { children } = firstMenu[0]
    if (children.length > 0) {
      store.commit('SET_SIDE_MENUS', children)
    }
  }
}
export function setBreadcrumb (path, data) {
  const sideMenus = store.state.permission.sideMenus
  let firstTitle = ''
  let secondTitle = ''
  const newReturnPathData = {
    0: {
      path: [
        '/increaseWinCustomer/taskPrize/addPrize',
        '/increaseWinCustomer/taskPrize/redactPrize',
        '/increaseWinCustomer/taskPrize/redeemCodeManagement'],
      returnPath: '/increaseWinCustomer/taskPrize'
    },
    1: {
      path: [
        '/wxCustomer/publicAccountsAuthorization',
        '/wxCustomer/add',
        '/wxCustomer/edit',
        '/wxCustomer/data',
        '/wxCustomer/popularize'],
      returnPath: '/wxCustomer/index'
    },
    2: {
      path: [
        '/clientFollow/labelInfo',
        '/clientFollow/addRule'],
      returnPath: '/clientFollow/autoLabel'
    },
    3: {
      path: ['/riskEarlyWarning/creatingWarningRule'],
      returnPath: '/riskEarlyWarning/warningRule'
    },
    4: {
      path: ['/riskEarlyWarning/creatingScoringTemplate'],
      returnPath: '/riskEarlyWarning/scoringTemplate'
    },
    5: {
      path: ['/salesManagement/addSop', '/salesManagement/editSop'],
      returnPath: '/salesManagement/userSop'
    },
    6: {
      path: ['/healthManage/patientDetails'],
      returnPath: '/healthManage/currentProgrammeDetail'
    },
    7: {
      path: ['/templateLibrary/createNotice'],
      returnPath: '/templateLibrary/messageNotice'
    },
    8: {
      path: ['/channelCodeNew/store'],
      returnPath: '/channelCodeNew/index'
    },
    9: {
      path: ['/workContact/contactFieldPivot'],
      returnPath: '/workContact/index'
    },
    10: {
      path: [
        '/marketing/drawAdd',
        '/marketing/drawEdit',
        '/marketing/drawData'
      ],
      returnPath: '/marketing/draw'
    },
    11: {
      path: [
        '/sales/generalAdd',
        '/sales/generalEdit',
        '/sales/activityAdd',
        '/sales/activityEdit',
        '/sales/regularAdd',
        '/sales/regularEdit',
        '/sales/friendAdd',
        '/sales/friendEdit',
        '/sales/birthdayAdd',
        '/sales/birthdayEdit',
        '/sales/clusterAdd',
        '/sales/clusterEdit'
      ],
      returnPath: '/sales/sop'
    },
    12: {
      path: ['/dict/dictDataDetail'],
      returnPath: '/dict/dictData'
    },
    13: {
      path: ['/dict/dictTreeDict'],
      returnPath: '/dict/dictTreeType'
    },
    14: {
      path: ['/clientFollow/momentsOperation/add', '/clientFollow/momentsOperation/edit'],
      returnPath: '/clientFollow/momentsOperation'
    },
    15: {
      path: ['/sop/addClusterSop', '/sop/editClusterSop'],
      returnPath: '/sop/clusterSop'
    },
    16: {
      path: ['/sop/addClusterCalendar', '/sop/editClusterCalendar'],
      returnPath: '/sop/clusterCalendar'
    },
    17: {
      path: ['/mall/combination/edit', '/mall/combination/add'],
      returnPath: '/mall/combination'
    },
    18: {
      path: ['/groupMess/setGroup', '/groupMess/taskInfo'],
      returnPath: '/groupMess/index'
    },
    19: {
      path: ['/groupsOperation/groupList/groupItemDetail'],
      returnPath: '/groupsOperation/groupList/index'
    },
    20: {
      path: ['/groupsOperation/joinGroupSaying/add', '/groupsOperation/joinGroupSaying/edit'],
      returnPath: '/groupsOperation/joinGroupSaying/index'
    },
    21: {
      path: ['/interactionRadar/setRadar', '/interactionRadar/radarInfo'],
      returnPath: '/interactionRadar/index'
    }
  }

  const returnBtnPath = []

  for (const [, value] of Object.entries(newReturnPathData)) {
    returnBtnPath.push(...value.path)
  }

  const setBranch = [{
    path: '/clientFollow/addRule', // 需要改变面包屑的地址
    title: '编辑规则', // 改变的名称
    key: 'label'// 根据参数
  },
  {
    path: '/riskEarlyWarning/creatingWarningRule', // 需要改变面包屑的地址
    title: '编辑预警策略', // 改变的名称
    key: 'id'// 根据参数
  }, {
    path: '/riskEarlyWarning/creatingScoringTemplate', // 需要改变面包屑的地址
    title: '编辑评分模型', // 改变的名称
    key: 'id'// 根据参数
  }, {
    path: '/interactionRadar/setRadar', // 需要改变面包屑的地址
    title: '修改互动雷达', // 改变的名称
    key: 'id'// 根据参数
  }]

  // 无需匹配地址  直接获取上一个全路径自动back
  const backList = ['/healthManage/patientDetails', '/healthManage/patientDetails1', '/workContact/contactFieldPivot', '/contactTransfer/resignAllotRecord', '/contactTransfer/workAllotRecord']
  sideMenus.find((item) => {
    const title = item.meta.title
    item.children.find((inner) => {
      if (inner.path == path) {
        firstTitle = returnBtnPath.includes(inner.path) ? true : title
        secondTitle = inner.meta.title
        setBranch.map(item => {
          if (inner.path == item.path && data[item.key]) {
            secondTitle = item.title
          }
        })
        if (inner.path == '/groupMess/setGroup' && data.type != 0) {
          secondTitle = data.type == 1 ? '编辑群群发' : '复制群群发'
        }
        if (backList.includes(inner.path)) {
          firstTitle = 'isBack'
          return
        }
        for (const [key, value] of Object.entries(newReturnPathData)) {
          if (value.path.includes(inner.path)) {
            let returnPath
            if (key == 2) {
              returnPath = value.returnPath + '?id=' + data.id
            } else if (key == 5) {
              returnPath = value.returnPath + '?type=' + data.type
            } else {
              returnPath = value.returnPath
            }
            store.commit('SER_RETURN_PATH', returnPath)
          }
        }
        return true
      }
    })
  })
  store.commit('SET_BREADCRUMB', [firstTitle, secondTitle])
}
export function resetRoutes () {
  router.matcher = newRouter().matcher
  store.commit('CLEAR_ROUTERS')
}
