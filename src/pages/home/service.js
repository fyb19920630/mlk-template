import request from '@/utils/request';

export async function getInfo(params) {
  return request('api/ddsp/finance/home/index', {
    method: 'GET',
    params,
  });
}
