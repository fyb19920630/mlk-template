import request from '@/utils/request';

export async function scanningLogin(params) {
  return request('api/ddsp/finance/login/getWeChatScanLoginUrl', {
    method: 'GET',
    params,
  });
}

export async function passWordLogin(params) {
  return request('api/ddsp/finance/login/accLogin', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
