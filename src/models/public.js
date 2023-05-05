import {
  organizationList,
  getMemberList,
  getSearchNode,
  assignMember,
  businessLineList,
  myHospList,
} from '@/services/public';
import { message } from 'antd';

const PublicModel = {
  namespace: 'publicService',
  state: {
    memberList: [],
    memberTotalNum: 0,
    businessList: [],
    businessTotalNum: 0,
    orgList: [],
    orgTotalNum: 0,
    nodeList: [],
  },
  effects: {
    *getOrganizationList({ payload, callback }, { call, put }) {
      const response = yield call(organizationList, payload);
      if (response.code === 200) {
        if (callback && typeof callback === 'function') {
          callback(response);
        } else {
          yield put({
            type: 'saveOrgList',
            payload: response,
          });
        }
      } else {
        message.error(response.msg);
      }
    },
    *getSearchNode({ payload }, { call, put }) {
      const response = yield call(getSearchNode, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveNode',
          payload: response,
        });
      } else {
        message.error(response.msg);
      }
    },
    *getMemberList({ payload, callback }, { call, put }) {
      const response = yield call(getMemberList, payload);
      if (response.code === 200) {
        if (callback && typeof callback === 'function') {
          callback(response);
        } else {
          yield put({
            type: 'saveList',
            payload: response,
          });
        }
      } else {
        message.error(response.msg);
      }
    },
    *assignMember({ payload, callback }, { call }) {
      const response = yield call(assignMember, payload);
      if (response.code === 200) {
        callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *getBusinessLineList({ payload, callback }, { call, put }) {
      const response = yield call(businessLineList, payload);
      if (response.code === 200) {
        if (callback && typeof callback === 'function') {
          callback(response);
        } else {
          yield put({
            type: 'saveBusList',
            payload: response,
          });
        }
      } else {
        message.error(response.msg);
      }
    },
    *myHospList({ payload, callback }, { call, put }) {
      const response = yield call(myHospList, payload);
      if (callback && typeof callback === 'function') {
        callback(response);
      } else {
        yield put({
          type: '',
          payload: response,
        });
      }
    },
  },
  reducers: {
    saveOrgList(state = { orgList: [] }, action) {
      return {
        ...state,
        orgList: action.payload.data.content,
        orgTotalNum: action.payload.data.totalElements,
      };
    },
    saveBusList(state = { businessList: [] }, action) {
      return {
        ...state,
        businessList: action.payload.data.content,
        businessTotalNum: action.payload.data.totalElements,
      };
    },
    saveNode(state = { nodeList: [] }, action) {
      return {
        ...state,
        nodeList: action.payload.data,
      };
    },
    saveList(
      state = {
        memberList: [],
      },
      action,
    ) {
      return {
        ...state,
        memberList: action.payload.data.content,
        memberTotalNum: action.payload.data.totalElements,
      };
    },
  },
};
export default PublicModel;
