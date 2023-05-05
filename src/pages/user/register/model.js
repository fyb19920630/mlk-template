import { saveRegUserInfo, getCode, verifyCode, checkMobile, orgList } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'registerInfo',
  state: {
    orgList: [],
  },
  effects: {
    *saveRegUserInfo({ payload, callback }, { call, put }) {
      const response = yield call(saveRegUserInfo, payload);
      if (callback && typeof callback === 'function') {
        callback(response);
      } else {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *getCode({ payload, callback }, { call, put }) {
      const response = yield call(getCode, payload);
      if (callback && typeof callback === 'function') {
        callback(response);
      } else {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *verifyCode({ payload, callback }, { call, put }) {
      const response = yield call(verifyCode, payload);
      if (callback && typeof callback === 'function') {
        callback(response);
      } else {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *checkMobile({ payload, callback }, { call, put }) {
      const response = yield call(checkMobile, payload);
      if (callback && typeof callback === 'function') {
        callback(response);
      } else {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *orgList({ payload, callback }, { call, put }) {
      const response = yield call(orgList, payload);
      if (callback && typeof callback === 'function') {
        callback(response);
      } else {
        yield put({
          type: 'saveOrgList',
          payload: response,
        });
      }
    },
  },
  reducers: {
    saveOrgList(state, action) {
      return {
        ...state,
        orgList: action.payload.data.content || [],
      };
    },
  },
};
export default Model;
