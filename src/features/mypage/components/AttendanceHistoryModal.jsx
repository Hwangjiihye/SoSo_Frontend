import React, { useState, useEffect } from 'react';
import { getAttendanceHistory } from '../../../apis/employeeApi';

/**
 * @file AttendanceHistoryModal.jsx
 * @description 특정 직원의 월별 상세 출퇴근(근태) 이력 조회 팝업 모달
 */
const AttendanceHistoryModal = ({ isOpen, onClose, employee }) => {
  const [history, setHistory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 현재 월 기본값 세팅 (YYYY-MM)
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    setSelectedMonth(`${yyyy}-${mm}`);
  }, [isOpen]);

  // 월 선택이 바뀌거나 모달이 열리면 이력 로드
  useEffect(() => {
    if (!isOpen || !employee || !selectedMonth) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getAttendanceHistory(employee.employeeSeq, selectedMonth);
        setHistory(data || []);
      } catch (err) {
        console.error('근태 이력 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [isOpen, employee, selectedMonth]);

  if (!isOpen || !employee) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case '정상':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case '지각':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case '조퇴':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case '결근':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-fade-in border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* 헤더 */}
        <div className="bg-emerald-500 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div>
            <h3 className="font-bold text-lg">📅 근태 기록 정보 조회</h3>
            <p className="text-xs text-emerald-100 mt-0.5">{employee.empName} 직원의 출퇴근 상세 리스트</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-emerald-100 text-xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 overflow-hidden flex-grow">
          {/* 조회 월 선택 영역 */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-150 shrink-0">
            <span className="text-sm font-bold text-gray-700">📆 조회 기준 월</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 테이블 영역 */}
          <div className="overflow-auto border border-gray-100 rounded-xl flex-grow max-h-[400px]">
            {isLoading ? (
              <div className="p-20 text-center text-gray-400 text-sm">기록을 불러오는 중입니다...</div>
            ) : history.length === 0 ? (
              <div className="p-20 text-center text-gray-400 text-sm">해당 월에 기록된 출퇴근 이력이 없습니다.</div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-gray-50 text-gray-500 font-bold sticky top-0 border-b border-gray-100 z-10">
                  <tr>
                    <th className="px-4 py-3">근무 일자</th>
                    <th className="px-4 py-3">실제 출근시간</th>
                    <th className="px-4 py-3">실제 퇴근시간</th>
                    <th className="px-4 py-3">근태 상태</th>
                    <th className="px-4 py-3">비고/메모</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.map((row) => (
                    <tr key={row.attendanceSeq} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-bold text-gray-700">{row.workDate}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono">{row.actualStartTime || '-'}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono">{row.actualEndTime || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${getStatusBadge(row.attendanceStatus)}`}>
                          {row.attendanceStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 truncate max-w-[180px]" title={row.memo}>
                        {row.memo || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all cursor-pointer shadow-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryModal;
