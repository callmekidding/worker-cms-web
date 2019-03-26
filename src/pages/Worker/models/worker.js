import { queryWorker, addWorker, updateWorker, deleteWorker } from '@/services/api';

export default {
  namespace: 'worker',

  state: {
    data: {
      data: []
    },
  },

  effects: {
    * query({ payload }, { call, put }) {
      const response = yield call(queryWorker, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addWorker, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteWorker, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateWorker, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
