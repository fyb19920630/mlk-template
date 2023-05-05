import request from '@/utils/request';

// 成员列表
export async function getMemberList(params) {
  return request('api/ae/member/list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 组织列表
export async function organizationList(params) {
  return request('api/ae/org/list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取组织层级树
export async function getSearchNode(params) {
  return request('api/ae/org/searchNode', {
    method: 'GET',
    params,
  });
}
// 成员分配
export async function assignMember(params) {
  return request('api/ae/member/assign', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 获取业务线列表
export async function businessLineList(params) {
  return request('api/ae/business/list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 门诊列表
export async function myHospList(params) {
  return request('api/ddsp/finance/acc/myHospList', {
    method: 'GET',
    params,
  });
}
