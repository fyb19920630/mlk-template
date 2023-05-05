import { registerLogin, AuthCode, verifyCode } from '@/services/user';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

const UserModel = {
  namespace: 'register',
  state: {
    currentUser: {},
  },
  effects: {
    *register({ payload, callback }, { call, put }) {
      const response = yield call(registerLogin, payload);
      console.log('response', response);
      if (response.code == 200) {
        message.info('注册成功');
        yield put(
          routerRedux.push({
            pathname: '/check',
          }),
        );
      } else {
        message.error(response.msg);
        yield put(
          routerRedux.push({
            pathname: '/user/register',
          }),
        );
      }
    },
    *getAuthCode({ payload }, { call, put }) {
      const response = yield call(AuthCode, payload);
      if (response.errno == 200) {
        yield put({
          type: 'getCode',
          payload: response,
        });
      } else {
        message.error(response.errmsg);
      }
    },
    *verifyAuthCode({ payload, callback }, { call, put }) {
      const response = yield call(verifyCode, payload);
      if (response) {
        callback(response);
      } else {
        message.error(response.errmsg);
      }
    },
  },
  reducers: {
    getCode(state, { payload: newCard }) {
      const nextData = { ...newCard };
      return {
        data: nextData,
      };
    },
  },
};
export default UserModel;
