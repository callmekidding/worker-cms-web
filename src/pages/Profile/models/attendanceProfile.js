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
      const workerResponse = yield call(queryWorkerById, {workerId: workerId});
      const workerData = workerResponse.data;
      const attendanceResponse = yield call(queryWorkerAttendance, payload);
      const attendanceData = attendanceResponse.data;
      const response = {
        workerData: workerData,
        attendanceData: attendanceData,
      };
      yield put({
        type: 'show',
        payload: response,
      });
    },
    * insertOrUpdateWorkerAttendance({payload, callback}, {call, put}) {
      const editResponse = yield call(insertOrUpdateWorkerAttendance, payload);
      const {workerId} = payload;
      const workerResponse = yield call(queryWorkerById, {workerId: workerId});
      const workerData = workerResponse.data;
      const attendanceResponse = yield call(queryWorkerAttendance, {
        attendanceYear: payload.attendanceYear,
        attendanceMonth: payload.attendanceMonth,
        workerId: payload.workerId,
      });
      const attendanceData = attendanceResponse.data;
      const response = {
        workerData: workerData,
        attendanceData: attendanceData,
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
