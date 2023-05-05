import { getInfo } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'home',
  state: {},
  effects: {
    *getInfo({ payload, callback }, { call, put }) {
      const response = yield call(getInfo, payload);
      if (callback && typeof callback === 'function') {
        callback(response);
      } else {
        yield put({
          type: 'saveOrderList',
          payload: response,
        });
      }
    },
  },
  reducers: {
    saveOrderList(state, action) {
      return {
        ...state,
      };
    },
  },
};
export default Model;
