import request from '@/utils/request';

export async function saveRegUserInfo(params) {
  return request('api/ddsp/finance/login/signUp', {
    method: 'POST',
    data: { ...params },
  });
}
export async function getCode(params) {
  return request('api/ddsp/finance/login/getLoginSmsCode', {
    method: 'POST',
    data: { ...params },
  });
}
export async function verifyCode(params) {
  return request('api/ddsp/finance/login/checkSmsCode', {
    method: 'POST',
    data: { ...params },
  });
}
export async function checkMobile(params) {
  return request('api/ddsp/finance/login/checkMobile', {
    method: 'POST',
    data: { ...params },
  });
}
export async function orgList(params) {
  return request('api/ddsp/finance/pub/operate/orgList', {
    method: 'POST',
    data: { ...params },
  });
}
