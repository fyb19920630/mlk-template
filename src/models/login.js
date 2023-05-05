import { parse, stringify } from 'qs';
import { routerRedux } from 'dva/router';
import { scanningLogin, passWordLogin } from '../services/login';
import { message } from 'antd';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    data: [],
  },
  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(scanningLogin, payload);
      yield put({
        type: 'addNewCard',
        payload: response,
      });
    },
    // 账号密码登陆
    *pasLogin({ payload, callback }, { call, put }) {
      const response = yield call(passWordLogin, payload);
      if (response.code === 200) {
        sessionStorage.setItem('financeAuth_loginToken', response.data.loginToken);
        callback(response);
      } else {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
          }),
        );
      }
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status, type: payload.type };
    },
    addNewCard(state, { payload: newCard }) {
      const nextCounter = 1;
      const nextData = { ...newCard, id: nextCounter };
      return {
        data: nextData,
        counter: nextCounter,
      };
    },
  },
};
export default Model;
