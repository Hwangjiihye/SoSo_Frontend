import axiosInstance from './axiosConfig.js';

/**
 * @file employeeApi.js
 * @description 직원 및 근태 이력(출퇴근) 관련 API 통신 모듈
 */

// 1. 직원 목록 조회
// GET /api/employees?storeSeq=값
export const getEmployeeList = async (storeSeq) => {
  const response = await axiosInstance.get('/api/employees', {
    params: { storeSeq }
  });
  return response.data;
};

// 2. 신규 직원 등록
// POST /api/employees
export const registerEmployee = async (employeeData) => {
  // employeeData: { businessSeq, empName, phone, workStartTime, workEndTime }
  const response = await axiosInstance.post('/api/employees', employeeData);
  return response.data;
};

// 3. 직원 출근 처리
// POST /api/employees/{employeeSeq}/check-in
export const checkInEmployee = async (employeeSeq) => {
  const response = await axiosInstance.post(`/api/employees/${employeeSeq}/check-in`);
  return response.data;
};

// 4. 직원 퇴근 처리
// POST /api/employees/{employeeSeq}/check-out
export const checkOutEmployee = async (employeeSeq) => {
  const response = await axiosInstance.post(`/api/employees/${employeeSeq}/check-out`);
  return response.data;
};

// 5. 직원의 월별 근태 이력 조회
// GET /api/employees/{employeeSeq}/attendance?yearMonth=YYYY-MM
export const getAttendanceHistory = async (employeeSeq, yearMonth) => {
  const response = await axiosInstance.get(`/api/employees/${employeeSeq}/attendance`, {
    params: { yearMonth }
  });
  return response.data;
};
