import request from '@/utils/request';

export async function queryCurrent(params) {
  return request('api/ddsp/finance/home/getFinanceUserIfo', {
    method: 'GET',
    params,
  });
}
