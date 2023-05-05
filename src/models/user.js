import { queryCurrent } from '@/services/user';
import { routerRedux } from 'dva/router';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } else {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
          }),
        );
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload.data.info || {} };
    },
  },
};
export default UserModel;
