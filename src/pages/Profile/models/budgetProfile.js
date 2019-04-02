import {queryWorkerBudget, queryWorkerById, addWorkerBudget, deleteWorkerBudget} from '@/services/api';

export default {
  namespace: 'budgetProfile',

  state: {
    budgetData: [],
    budgetNote: {},
    workerData: {},
  },

  effects: {
    * queryWorkerBudget({payload}, {call, put}) {
      const {workerId} = payload;
      const budgetResponse = yield call(queryWorkerBudget, payload);
      const workerResponse = yield call(queryWorkerById, {workerId: workerId});
      const budgetData = budgetResponse.data.data;
      const budgetNote = budgetResponse.data.note;
      const workerData = workerResponse.data;
      const response = {
        budgetData: budgetData,
        budgetNote: budgetNote,
        workerData: workerData,
      };
      yield put({
        type: 'show',
        payload: response,
      });
    },
    * addWorkerBudget({payload, callback}, {call, put}) {
      const addResponse = yield call(addWorkerBudget, payload);
      const queryParams = {
        year: payload.year,
        month: payload.month,
        workerId: payload.workerId,
        orderByField: 'budget_date',
        orderByType: 1,
      };
      const budgetResponse = yield call(queryWorkerBudget, queryParams);
      const {workerId} = payload;
      const workerResponse = yield call(queryWorkerById, {workerId: workerId});
      const budgetData = budgetResponse.data.data;
      const budgetNote = budgetResponse.data.note;
      const workerData = workerResponse.data;
      const response = {
        budgetData: budgetData,
        budgetNote: budgetNote,
        workerData: workerData,
      };
      yield put({
        type: 'show',
        payload: response,
      });
    },

    * deleteWorkerBudget({payload, callback}, {call, put}) {
      console.log('payload');
      console.log(payload);
      const deleteResponse = yield call(deleteWorkerBudget, {budgetId: payload.budgetId});
      const queryParams = {
        year: payload.year,
        month: payload.month,
        workerId: payload.workerId,
        orderByField: 'budget_date',
        orderByType: 1,
      };
      const budgetResponse = yield call(queryWorkerBudget, queryParams);
      const {workerId} = payload;
      const workerResponse = yield call(queryWorkerById, {workerId: workerId});
      const budgetData = budgetResponse.data.data;
      const budgetNote = budgetResponse.data.note;
      const workerData = workerResponse.data;
      const response = {
        budgetData: budgetData,
        budgetNote: budgetNote,
        workerData: workerData,
      };
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
