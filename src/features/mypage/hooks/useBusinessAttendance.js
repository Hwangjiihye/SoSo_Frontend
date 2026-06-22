import { useState, useEffect, useCallback } from 'react';
import authStore from '../../../store/authStore';
import { 
  getEmployeeList, 
  registerEmployee, 
  checkInEmployee, 
  checkOutEmployee 
} from '../../../apis/employeeApi';

/**
 * @file useBusinessAttendance.js
 * @description 직원 근태 관리를 위한 커스텀 훅 (실제 API 바인딩 버전)
 */
export const useBusinessAttendance = () => {
  const selectedStoreSeq = authStore((state) => state.selectedStoreSeq);
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 직원 목록 로드 함수
  const fetchStaffList = useCallback(async () => {
    if (!selectedStoreSeq) return;
    setIsLoading(true);
    try {
      const data = await getEmployeeList(selectedStoreSeq);
      setStaffList(data || []);
    } catch (err) {
      console.error('직원 목록 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStoreSeq]);

  // 마운트 및 매장 변경 시 로드
  useEffect(() => {
    fetchStaffList();
  }, [fetchStaffList]);

  // 직원 신규 등록
  const handleRegisterStaff = async (formData) => {
    if (!selectedStoreSeq) return;
    try {
      const payload = {
        businessSeq: selectedStoreSeq,
        empName: formData.empName,
        phone: formData.phone,
        workStartTime: formData.workStartTime,
        workEndTime: formData.workEndTime
      };
      await registerEmployee(payload);
      alert('직원이 등록되었습니다.');
      await fetchStaffList(); // 리스트 갱신
      return true;
    } catch (err) {
      alert(err.response?.data || '직원 등록 중 오류가 발생했습니다.');
      return false;
    }
  };

  // 출근 처리
  const handleCheckIn = async (employeeSeq) => {
    try {
      await checkInEmployee(employeeSeq);
      alert('출근 처리가 완료되었습니다.');
      await fetchStaffList();
    } catch (err) {
      alert(err.response?.data || '출근 처리 중 오류가 발생했습니다.');
    }
  };

  // 퇴근 처리
  const handleCheckOut = async (employeeSeq) => {
    try {
      await checkOutEmployee(employeeSeq);
      alert('퇴근 처리가 완료되었습니다.');
      await fetchStaffList();
    } catch (err) {
      alert(err.response?.data || '퇴근 처리 중 오류가 발생했습니다.');
    }
  };

  return {
    staffList,
    isLoading,
    fetchStaffList,
    handleRegisterStaff,
    handleCheckIn,
    handleCheckOut
  };
};
