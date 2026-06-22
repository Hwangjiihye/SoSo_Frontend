/**
 * @file BusinessAttendancePage.jsx
 * @description 직원 근태 관리 페이지 컴포넌트입니다.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/soso로고.png";
import authStore from "../../store/authStore";
import { useBusinessAttendance } from './hooks/useBusinessAttendance';
import EmployeeRegisterModal from './components/EmployeeRegisterModal';
import AttendanceHistoryModal from './components/AttendanceHistoryModal';

const AttendanceSection = () => {
  const { 
    staffList, 
    isLoading, 
    handleRegisterStaff, 
    handleCheckIn, 
    handleCheckOut 
  } = useBusinessAttendance();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  if (isLoading) return <div className="p-12 text-center text-gray-400">근태 정보를 불러오는 중입니다...</div>;

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <div className="bg-white border border-emerald-100 rounded-lg p-8 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-900">직원 근태 관리</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">실시간 현황</span>
          <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full">{todayStr}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">매장 직원들의 출퇴근 기록 및 근무 상태를 관리합니다.</p>

      {/* 대시보드 요약 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p className="text-xs text-emerald-600 font-bold mb-1">등록 직원</p>
          <p className="text-2xl font-black text-emerald-700">{staffList.length}명</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-xs text-blue-600 font-bold mb-1">현재 출근</p>
          <p className="text-2xl font-black text-blue-700">{staffList.filter(s => s.status === 'WORK').length}명</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
          <p className="text-xs text-orange-600 font-bold mb-1">현재 퇴근</p>
          <p className="text-2xl font-black text-orange-700">{staffList.filter(s => s.status === 'LEAVE').length}명</p>
        </div>
      </div>

      {/* 직원 리스트 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left rounded-l-xl">직원명</th>
              <th className="px-4 py-3 text-left">연락처</th>
              <th className="px-4 py-3 text-left">근무 상태</th>
              <th className="px-4 py-3 text-left">지정 출근</th>
              <th className="px-4 py-3 text-left">지정 퇴근</th>
              <th className="px-4 py-3 text-center">출퇴근 처리</th>
              <th className="px-4 py-3 text-center rounded-r-xl">근태 이력</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staffList.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center text-gray-400 text-sm">등록된 매장 직원이 없습니다.</td>
              </tr>
            ) : (
              staffList.map((staff) => (
                <tr key={staff.employeeSeq} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 font-bold text-gray-700">{staff.empName}</td>
                  <td className="px-4 py-4 text-gray-500 font-mono">{staff.phone || '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black ${
                      staff.status === 'WORK' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {staff.status === 'WORK' ? '근무 중' : '퇴근'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500 font-mono">{staff.workStartTime ? staff.workStartTime.slice(0, 5) : '-'}</td>
                  <td className="px-4 py-4 text-gray-500 font-mono">{staff.workEndTime ? staff.workEndTime.slice(0, 5) : '-'}</td>
                  <td className="px-4 py-4 text-center">
                    {staff.status === 'WORK' ? (
                      <button 
                        onClick={() => handleCheckOut(staff.employeeSeq)}
                        className="px-3 py-1 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-[10px] font-bold border border-red-200 cursor-pointer transition-colors"
                      >
                        퇴근 시키기
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleCheckIn(staff.employeeSeq)}
                        className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg text-[10px] font-bold border border-emerald-200 cursor-pointer transition-colors"
                      >
                        출근 시키기
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button 
                      onClick={() => {
                        setSelectedStaff(staff);
                        setIsHistoryOpen(true);
                      }}
                      className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      기록보기
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
        <p className="text-[11px] text-gray-400">* 매장 PC/태블릿을 통해 수동으로 직원의 출퇴근 근태를 기록하고 조회합니다.</p>
        <button 
          onClick={() => setIsRegisterOpen(true)}
          className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 cursor-pointer"
        >
          + 신규 직원 등록
        </button>
      </div>

      {/* 등록 모달 */}
      <EmployeeRegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onRegister={handleRegisterStaff} 
      />

      {/* 근태 이력 팝업 */}
      <AttendanceHistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        employee={selectedStaff} 
      />
    </div>
  );
};

import { useStores } from '../../hooks/useStores';

function BusinessAttendancePage() {
  const { logout, user_type, user_nickname, bizname, selectedStoreSeq, setSelectedStore } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('직원 근태 관리');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 🏪 [멀티 프로필] 사장님의 모든 매장 목록을 가져옵니다.
  const { stores, isLoading: isStoresLoading } = useStores();
  
  const menuGroups = [
    { title: '계정', items: ['개인정보 확인', '개인정보 수정', '회원 탈퇴'] },
    { title: '설정', items: ['스마트 알림 설정'] },
    { title: '운영', items: ['다중 매장 관리', '직원 근태 관리'] }
  ];

  const handleProfileClick = () => {
    if (user_type === 'BUSINESS') {
      navigate('/business-mypage');
      setIsProfileOpen(false);
    }
  };

  /**
   * 🔄 매장 전환 핸들러
   */
  const handleStoreSwitch = (storeSeq, companyName) => {
    setSelectedStore(storeSeq, companyName);
    navigate('/business-mypage');
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-10 flex gap-8">
        {/* 사이드바 */}
        <aside className="w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-gray-900">{bizname || '소소마을'}</h2>
            <p className="text-xs text-gray-500 mt-1">사업자 회원</p>
          </div>

          {menuGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-gray-400 mb-2 px-2">{group.title}</h4>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        if (item === '개인정보 확인') navigate("/business-mypage");
                        else if (item === '개인정보 수정') navigate("/business-update-mypage");
                        else if (item === '다중 매장 관리') navigate("/business-multiprofile");
                        else if (item === '회원 탈퇴') navigate("/business-withdrawal");
                        else if (item === '직원 근태 관리') navigate("/business-attendance");
                        else if (item === '스마트 알림 설정') navigate("/business-notification");
                        else setActiveTab(item);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                        activeTab === item ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
        
        {/* 콘텐츠 영역 */}
        <section className="flex-grow">
          {activeTab === '직원 근태 관리' ? (
            <AttendanceSection />
          ) : (
            <div className="bg-white border border-gray-100 rounded-lg p-12 text-center text-gray-400">
              <h2 className="font-bold text-lg mb-2">{activeTab}</h2>
              <p>콘텐츠 준비 중입니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BusinessAttendancePage;
