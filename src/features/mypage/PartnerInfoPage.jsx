import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePartnerInfo } from './hooks/usePartnerInfo';
import { InfoItem, SectionTitle, StoreImage } from './components/PartnerInfoSection';
import logo from "../../assets/soso로고.png";
import authStore from '../../store/authStore';

/**
 * @file PartnerInfoPage.jsx
 * @description 거래처 업체정보 확인 페이지 (아키텍처 규칙 및 반응형 가이드 준수)
 */
const PartnerInfoPage = () => {
  const navigate = useNavigate();
  const logout = authStore((state) => state.logout);
  const { profile, isLoading, error, formattedDate, fullAddress } = usePartnerInfo();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-500 font-medium">정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 bg-red-50 border border-red-100 rounded-3xl text-center space-y-4">
        <div className="text-4xl text-red-500">⚠️</div>
        <h2 className="text-xl font-bold text-red-800">데이터 로드 오류</h2>
        <p className="text-red-600">인증 세션이 만료되었거나 정보를 가져올 수 없습니다.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const { user, store } = profile || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-12">
      {/* 1. 상단 탑바 */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SoSo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-black text-emerald-600 tracking-tighter">SoSo</span>
        </Link>
        <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-emerald-600 flex items-center gap-1 transition-colors">
          <span>로그아웃</span>
        </button>
      </header>

      {/* 2. 네비게이션 탭 */}
      <nav className="bg-white border-b border-gray-200 flex px-6 overflow-x-auto scrollbar-hide">
        {[
          { name: '업체 정보 확인', icon: '🏢', path: '/partner-info' },
          { name: '업체 정보 수정', icon: '📝', path: '/partner-edit' },
          { name: '회원 탈퇴', icon: '👤', path: '/partner-withdrawal' },
          { name: '스마트 알림 설정', icon: '🔔', path: '/partner-notification' }
        ].map(tab => (
          <div
            key={tab.name}
            onClick={() => tab.path !== '#' && navigate(tab.path)}
            className={`px-4 py-4 text-sm font-bold flex items-center gap-2 cursor-pointer border-b-2 transition-all whitespace-nowrap ${
              tab.name === '업체 정보 확인' 
              ? 'text-emerald-600 border-emerald-600' 
              : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </div>
        ))}
      </nav>

      {/* 3. 페이지 헤더 */}
      <div className="max-w-[600px] w-full mx-auto mt-8 px-4">
        <h2 className="text-xl font-bold text-gray-900">업체 정보 확인</h2>
        <p className="text-sm text-gray-500 mt-1">가입 시 등록된 마이페이지 상세 정보를 확인합니다.</p>
      </div>

      {/* 4. 메인 콘텐츠 */}
      <div className="max-w-[600px] w-full mx-auto mt-6 px-4 flex flex-col gap-6">
        
        {/* 기본 계정 정보 섹션 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <SectionTitle title="기본 계정 정보" colorClass="border-blue-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="아이디" value={user?.user_id} />
            <InfoItem label="닉네임" value={user?.nickname} />
            <InfoItem label="이름" value={user?.name} />
            <InfoItem label="가입 일자" value={formattedDate} />
            <div className="md:col-span-2">
              <InfoItem label="이메일" value={user?.email} />
            </div>
            <InfoItem label="휴대전화" value={user?.phone} />
          </div>
        </section>

        {/* 사업자 정보 섹션 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <SectionTitle title="사업자 정보" colorClass="border-emerald-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="사업자 번호" value={store?.biz_number} />
            <InfoItem label="상호명" value={store?.company_name} />
            <InfoItem label="대표자명" value={store?.representative_name} />
            <InfoItem label="개업일자" value={store?.opening_date} />
            <div className="md:col-span-2">
              <InfoItem label="가게 주소" value={fullAddress} />
            </div>
          </div>
        </section>

        {/* 가게 사진 섹션 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <SectionTitle title="가게 사진" colorClass="border-amber-500" />
          <StoreImage exteriorImg={store?.exterior_img} interiorImg={store?.interior_img} />
        </section>

        {/* 수정 페이지 이동 버튼 */}
        <button 
          onClick={() => navigate('/partner-edit')}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          📝 정보 수정하러 가기
        </button>

        <p className="text-[10px] text-gray-400 font-medium text-center italic">
          ℹ️ 정보 수정을 원하시면 위 버튼을 클릭하거나 상단 탭을 이용해 주세요.
        </p>
      </div>
    </div>
  );
};

export default PartnerInfoPage;
