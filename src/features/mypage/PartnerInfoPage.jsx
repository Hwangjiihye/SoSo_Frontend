/**
 * @file PartnerInfoPage.jsx
 * @description 거래처 전용 마이페이지 컴포넌트입니다.
 * 사업자 마이페이지(BusinessMyPage)의 UI를 동일하게 유지하며,
 * 파트너 훅(usePartnerInfo) 데이터 로직만 연동합니다.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from "../../store/authStore";
import { usePartnerInfo } from './hooks/usePartnerInfo';

// '업체 정보 확인' 탭에 대한 상세 콘텐츠
const UserProfileTab = () => {
  const { profile, isLoading, error, formattedDate, formattedOpeningDate, fullAddress, storeImg1, storeImg2 } = usePartnerInfo();

  if (isLoading) return <div className="p-8 text-center text-gray-500">정보를 불러오는 중입니다...</div>;
  if (error) return <div className="p-8 text-center text-red-500">정보를 불러오는데 실패했습니다.</div>;

  // 데이터가 없을 경우를 대비한 초기값 설정
  const userData = {
    id: profile?.userId || '정보 없음',
    nickname: profile?.nickname || '정보 없음',
    name: profile?.name || '정보 없음',
    joinDate: formattedDate, 
    phone: profile?.phone || '정보 없음',
    email: profile?.email || '정보 없음',
    bizNumber: profile?.bizNumber?.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') || '정보 없음',
    bizName: profile?.companyName || '정보 없음',
    ceoName: profile?.repName || '정보 없음', // Partner용 필드(repName)
    address: fullAddress,
    openDate: formattedOpeningDate
  };

  return (
    <div className="bg-white border border-emerald-100 rounded-lg p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-2">업체 정보 확인</h2>
      <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">가입 시 등록된 마이페이지 상세 정보를 확인합니다.</p>
      
      {/* 기본 계정 정보 */}
      <div className="mb-10">
        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
          기본 계정 정보
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">아이디</label>
            <div className="p-2 border-b">{userData.id}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">닉네임</label>
            <div className="p-2 border-b">{userData.nickname}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">이름 (서비스 실명)</label>
            <div className="p-2 border-b">{userData.name}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">가입 일자</label>
            <div className="p-2 border-b">{userData.joinDate}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">휴대전화</label>
            <div className="p-2 border-b">{userData.phone}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">이메일</label>
            <div className="p-2 border-b">{userData.email}</div>
          </div>
        </div>
      </div>
      
      {/* 사업자 정보 */}
      <div className="mb-10">
        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
          사업자 정보
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">대표자명 (실명)</label>
            <div className="p-2 border-b">{userData.ceoName}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">사업자 번호</label>
            <div className="p-2 border-b">{userData.bizNumber}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">상호명</label>
            <div className="p-2 border-b">{userData.bizName}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">개업일자</label>
            <div className="p-2 border-b">{userData.openDate}</div>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">가게 주소</label>
            <div className="p-2 border-b">{userData.address}</div>
          </div>
        </div>
      </div>

      {/* 가게 사진 정보 */}
      <div>
        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
          가게 사진
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">가게 외관</label>
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center text-4xl">
              {storeImg1 ? <img src={storeImg1} alt="가게 외관" className="w-full h-full object-cover" /> : '🏢'}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">가게 내관</label>
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center text-4xl">
              {storeImg2 ? <img src={storeImg2} alt="가게 내관" className="w-full h-full object-cover" /> : '🏪'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PartnerInfoPage = () => {
  const { bizname } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('업체 정보 확인');

  // 사업자 UI와 동일하되, '운영' 부분만 제거됨
  const menuGroups = [
    { title: '계정', items: ['업체 정보 확인', '업체 정보 수정', '회원 탈퇴'] },
    { title: '설정', items: ['스마트 알림 설정'] }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-10 flex gap-8">
        {/* 사이드바 */}
        <aside className="w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-gray-900">{bizname || '거래처 업체'}</h2>
            <p className="text-xs text-gray-500 mt-1">거래처 회원</p>
          </div>
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-gray-400 mb-2 px-2">{group.title}</h4>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        if (item === '업체 정보 확인') navigate("/partner-info");
                        else if (item === '업체 정보 수정') navigate("/partner-edit");
                        else if (item === '회원 탈퇴') navigate("/partner-withdrawal");
                        else if (item === '스마트 알림 설정') navigate("/partner-notification");
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
          {activeTab === '업체 정보 확인' ? (
            <UserProfileTab />
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
};

export default PartnerInfoPage;
