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
    <div className="w-full min-h-screen bg-gray-50/50 flex flex-col font-sans">
      {/* 상단 헤더 섹션 */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* 좌측 로고 (클릭 시 메인 이동) */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="SoSo Logo" className="w-8 h-8 object-contain transition-transform group-hover:scale-110" />
            <div className="text-2xl font-black text-emerald-600 tracking-tighter">SoSo</div>
          </Link>

          {/* 우측 알림 및 로그아웃 */}
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-emerald-600 transition-colors relative">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 섹션 */}
      <main className="flex-grow py-10 px-4 md:px-8">
        <div className="w-full max-w-2xl mx-auto space-y-10 animate-fade-in-up">
          
          {/* 페이지 타이틀 헤더 */}
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">업체 정보 확인</h1>
            <p className="text-gray-500 font-medium">가입 시 등록된 마이페이지 상세 정보를 확인합니다.</p>
          </div>

          <div className="space-y-8">
            {/* 1. 기본 계정 정보 섹션 */}
            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <SectionTitle title="기본 계정 정보" colorClass="border-blue-500" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* 2. 사업자 정보 섹션 */}
            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <SectionTitle title="사업자 정보" colorClass="border-emerald-500" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="사업자 번호" value={store?.biz_number} />
                <InfoItem label="상호명" value={store?.company_name} />
                <div className="md:col-span-2">
                  <InfoItem label="가게 주소" value={fullAddress} />
                </div>
              </div>
            </section>

            {/* 3. 가게 사진 섹션 */}
            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <SectionTitle title="가게 사진" colorClass="border-amber-500" />
              <StoreImage exteriorImg={store?.exterior_img} />
            </section>
          </div>

          {/* 하단 푸터 영역 (페이지 내부) */}
          <footer className="pt-10 pb-20 text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-gray-300">
              <div className="h-px w-10 bg-gray-200"></div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">SOSO Information Service</span>
              <div className="h-px w-10 bg-gray-200"></div>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">
              본 페이지는 읽기 전용입니다. 정보 수정을 원하시면 관리자에게 문의해 주세요.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default PartnerInfoPage;
