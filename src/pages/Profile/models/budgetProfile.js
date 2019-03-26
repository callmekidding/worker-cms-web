import { queryWorkerBudget } from '@/services/api';

export default {
  namespace: 'budgetProfile',

  state: {
    data: {
      data: [],
      note: {},
    },
  },

  effects: {
    *queryWorkerBudget({ payload }, { call, put }) {
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
