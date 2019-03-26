import { queryWorkerBudget } from '@/services/api';

export default {
  namespace: 'attendanceProfile',

  state: {
    data: {
      data: []
    },
  },

  effects: {
    * queryWorkerBudget({ payload }, { call, put }) {
      const response = yield call(queryWorkerBudget, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
