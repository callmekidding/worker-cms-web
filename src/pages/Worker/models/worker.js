import {pageWorkerList, addWorker, updateWorker, deleteWorker} from '@/services/api';

export default {
  namespace: 'worker',

  state: {
    data: [],
  },

  effects: {
    * queryWorker({payload}, {call, put}) {
      const response = yield call(pageWorkerList, {
        ...payload,
        orderByField: 'gmt_create',
        orderByType: 1,
      });
      yield put({
        type: 'save',
        payload: response.data.data,
      });
    },
    * addWorker({payload, callback}, {call, put}) {
      console.log(payload);
      console.log('payload');
      const addResponse = yield call(addWorker, payload);
      const queryResponse = yield call(pageWorkerList,
        {
          orderByField: 'gmt_create',
          orderByType: 1,
        });
      yield put({
        type: 'save',
        payload: queryResponse.data.data,
      });
      if (callback) callback();
    },
    * deleteWorker({payload, callback}, {call, put}) {
      const response = yield call(deleteWorker, payload);
      const queryResponse = yield call(pageWorkerList,
        {
          orderByField: 'gmt_create',
          orderByType: 1,
        });
      yield put({
        type: 'save',
        payload: queryResponse.data.data,
      });
      if (callback) callback();
    },
    * updateWorker({payload, callback}, {call, put}) {
      const response = yield call(updateWorker, payload);
      const queryResponse = yield call(pageWorkerList,
        {
          orderByField: 'gmt_create',
          orderByType: 1,
        });
      yield put({
        type: 'save',
        payload: queryResponse.data.data,
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
