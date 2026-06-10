import { useState, useEffect } from 'react';

/**
 * @file useBusinessAttendance.js
 * @description 직원 근태 관리를 위한 커스텀 훅 (더미 데이터 포함)
 */
export const useBusinessAttendance = () => {
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 더미 데이터 로드
  useEffect(() => {
    const timer = setTimeout(() => {
      setStaffList([
        { id: 1, name: '김철수', position: '매니저', status: '출근', checkInTime: '09:00', checkOutTime: '-', workHours: '5시간' },
        { id: 2, name: '이영희', position: '아르바이트', status: '퇴근', checkInTime: '10:00', checkOutTime: '15:00', workHours: '5시간' },
        { id: 3, name: '박지성', position: '아르바이트', status: '결근', checkInTime: '-', checkOutTime: '-', workHours: '0시간' },
        { id: 4, name: '최유리', position: '직원', status: '출근', checkInTime: '08:30', checkOutTime: '-', workHours: '5.5시간' },
      ]);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setStaffList(prev => prev.map(staff => 
      staff.id === id ? { ...staff, status: newStatus } : staff
    ));
  };

  return {
    staffList,
    isLoading,
    handleStatusChange
  };
};
