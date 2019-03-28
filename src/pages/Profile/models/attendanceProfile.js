import {queryWorkerAttendance, queryWorkerById} from '@/services/api';

export default {
  namespace: 'attendanceProfile',

  state: {
    budgetData:[],
    budgetNote:{},
    workerData:{},
  },

  effects: {
    * queryWorkerBudget({payload}, {call, put}) {
      const {workerId} = payload;
      // const budgetResponse = yield call(queryWorkerBudget, payload);
      const workerResponse = yield call(queryWorkerById, {workerId:workerId});
      // const budgetData = budgetResponse.data.data;
      // const budgetNote = budgetResponse.data.note;
      const workerData = workerResponse.data;
      const response = {
        // budgetData:budgetData,
        // budgetNote:budgetNote,
        workerData:workerData,
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
