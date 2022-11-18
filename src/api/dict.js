import request from '@/utils/request'
// 获取普通字典分类
export function getDictTypeData (data) {
  return request({
    url: '/dictType/common/getList',
    method: 'post',
    data
  })
}
// 新增普通字典分类
export function addDictType (data) {
  return request({
    url: '/dictType/common/add',
    method: 'post',
    data
  })
}
// 修改普通字典分类
export function editDictType (data) {
  return request({
    url: '/dictType/common/modify',
    method: 'post',
    data
  })
}
// 删除普通字典分类
export function deleteDictType (params) {
  return request({
    url: '/dictType/common/delete',
    method: 'get',
    params
  })
}

// 获取普通字典数据
export function getDictData (data) {
  return request({
    url: '/dictType/common/getDataList',
    method: 'post',
    data
  })
}
// 新增普通字典数据
export function addDictData (data) {
  return request({
    url: '/dictType/common/addData',
    method: 'post',
    data
  })
}
// 修改普通字典数据
export function editDictData (data) {
  return request({
    url: '/dictType/common/modifyData',
    method: 'post',
    data
  })
}
// 删除普通字典数据
export function deleteDictData (params) {
  return request({
    url: '/dictType/common/deleteData',
    method: 'get',
    params
  })
}
// // 获取多级字典分类数据
// export function getDictTreeTypeData (data) {
//   return request({
//     url: '/dictType/tree/getList',
//     method: 'post',
//     data
//   })
// }

// 获取多级字典分类数据
export function getDictTreeTypeData (data) {
  return request({
    url: '/dictType/tree/getList',
    method: 'post',
    data
  })
}

// 多级字典新增分类数据
export function addDictTreeTypeData (data) {
  return request({
    url: '/dictType/tree/add',
    method: 'post',
    data
  })
}

// 多级字典修改分类数据
export function editDictTreeTypeData (data) {
  return request({
    url: '/dictType/tree/modify',
    method: 'post',
    data
  })
}

// 多级字典删除分类数据
export function deleteDictTreeTypeData (params) {
  return request({
    url: '/dictType/tree/delete',
    method: 'get',
    params
  })
}

// 获取多级字典数据
export function getDictTreeData (params) {
  return request({
    url: '/dictType/tree/getTreeList',
    method: 'get',
    params
  })
}

// 多级字典新增数据
export function addDictTreeData (data) {
  return request({
    url: '/dictType/tree/addTree',
    method: 'post',
    data
  })
}

// 多级字典修改数据
export function editDictTreeData (data) {
  return request({
    url: '/dictType/tree/modifyTree',
    method: 'post',
    data
  })
}

// 多级字典删除数据
export function deleteDictTreeData (params) {
  return request({
    url: '/dictType/tree/deleteTree',
    method: 'get',
    params
  })
}
