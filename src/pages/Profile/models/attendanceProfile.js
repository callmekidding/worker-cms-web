import {queryWorkerAttendance, queryWorkerById, insertOrUpdateWorkerAttendance} from '@/services/api';

export default {
  namespace: 'attendanceProfile',

  state: {
    attendanceData: {},
    workerData: {},
  },

  effects: {
    * queryWorkerAttendance({payload}, {call, put}) {
      const {workerId} = payload;
      // const budgetResponse = yield call(queryWorkerBudget, payload);
      const workerResponse = yield call(queryWorkerById, {workerId: workerId});
      const workerData = workerResponse.data;
      const attendanceResponse = yield call(queryWorkerAttendance, payload);
      const attendanceData = attendanceResponse.data;
      // const budgetData = budgetResponse.data.data;
      // const budgetNote = budgetResponse.data.note;
      const response = {
        // budgetData:budgetData,
        // budgetNote:budgetNote,
        workerData: workerData,
        attendanceData: attendanceData,
      };
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *insertOrUpdateWorkerAttendance({ payload, callback }, { call, put }) {
      const response = yield call(insertOrUpdateWorkerAttendance, payload);
      yield put({
        type: 'show',
        payload: response,
      });
      if (callback) callback();
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
