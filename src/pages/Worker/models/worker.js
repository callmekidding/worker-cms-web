import {pageWorkerList, addWorker, updateWorker, deleteWorker} from '@/services/api';

export default {
  namespace: 'worker',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * queryWorker({payload}, {call, put}) {
      const response = yield call(pageWorkerList, payload);
      const data = {
        list: response.data.data,
        pagination: {
          total: response.data.totalCount,
          pageSize: response.data.pageSize,
          current: response.data.pageNo,
        }
      };
      yield put({
        type: 'save',
        payload: data,
      });
    },
    * addWorker({payload, callback}, {call, put}) {
      const addResponse = yield call(addWorker, payload);
      const queryResponse = yield call(pageWorkerList,
        {
          orderByField: 'gmt_create',
          orderByType: 1,
          pageSize: 10,
          pageNo: 1,
        });
      const data = {
        list: queryResponse.data.data,
        pagination: {
          total: queryResponse.data.totalCount,
          pageSize: queryResponse.data.pageSize,
          current: queryResponse.data.pageNo,
        }
      };
      yield put({
        type: 'save',
        payload: data,
      });
      if (callback) callback();
    },
    * deleteWorker({payload, callback}, {call, put}) {
      const response = yield call(deleteWorker, payload);
      const queryResponse = yield call(pageWorkerList,
        {
          orderByField: 'gmt_create',
          orderByType: 1,
          pageSize: 10,
          pageNo: 1,
        });
      const data = {
        list: queryResponse.data.data,
        pagination: {
          total: queryResponse.data.totalCount,
          pageSize: queryResponse.data.pageSize,
          current: queryResponse.data.pageNo,
        }
      };
      yield put({
        type: 'save',
        payload: data,
      });
      if (callback) callback();
    },
    * updateWorker({payload, callback}, {call, put}) {
      const response = yield call(updateWorker, payload);
      const queryResponse = yield call(pageWorkerList,
        {
          orderByField: 'gmt_create',
          orderByType: 1,
          pageSize: 10,
          pageNo: 1,
        });
      const data = {
        list: queryResponse.data.data,
        pagination: {
          total: queryResponse.data.totalCount,
          pageSize: queryResponse.data.pageSize,
          current: queryResponse.data.pageNo,
        }
      };
      yield put({
        type: 'save',
        payload: data,
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
