/**
 * @file BusinessUpdateMyPage.jsx
 * @description 사업자 정보 수정 페이지 컴포넌트입니다.
 * BusinessMyPage와 동일한 레이아웃을 유지하며, 정보를 수정할 수 있는 폼을 제공합니다.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainFooter from '../../components/layout/MainFooter';
import logo from "../../assets/soso로고.png";
import authStore from "../../store/authStore";
import { useBusinessInfo } from './hooks/useBusinessInfo';

const UserUpdateTab = () => {
  const { profile, isLoading, storeImg1, storeImg2 } = useBusinessInfo();
  const navigate = useNavigate();

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    bizNumber: '',
    bizname: '',
    address: '',
    detailAddress: '',
    openDate: ''
  });

  // 사진 상태 관리 (파일 객체 및 미리보기 URL)
  const [images, setImages] = useState({ exterior: null, interior: null });
  const [previews, setPreviews] = useState({ exterior: '', interior: '' });

  // 데이터 로드 완료 시 폼 초기값 설정
  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.user_nickname || '',
        phone: profile.phone || '',
        email: profile.email || '',
        password: '',
        confirmPassword: '',
        bizNumber: profile.bizNumber || '',
        bizname: profile.bizname || '',
        address: profile.address1 || '',
        detailAddress: profile.address2 || '',
        openDate: profile.openingDate?.split('T')[0] || ''
      });
      setPreviews({
        exterior: storeImg1 || '',
        interior: storeImg2 || ''
      });
    }
  }, [profile, storeImg1, storeImg2]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">정보를 불러오는 중입니다...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setImages(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    // TODO: 회원정보 및 사진 수정 API 연동 (FormData 사용)
    console.log("수정된 텍스트 데이터:", formData);
    console.log("수정된 이미지 데이터:", images);
    
    alert("정보 및 사진이 성공적으로 수정되었습니다. (API 연동 필요)");
    navigate("/business-mypage");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-emerald-100 rounded-lg p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-2">개인정보 수정</h2>
      <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">회원님의 정보를 최신 상태로 유지하세요.</p>
      
      {/* 기본 계정 정보 수정 */}
      <div className="mb-10">
        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
          기본 계정 정보 수정
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">아이디 (변경 불가)</label>
            <div className="p-2 border-b bg-gray-50 text-gray-400">{profile?.userId}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">닉네임</label>
            <input 
              type="text" 
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">전화번호</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">이메일</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">새 비밀번호</label>
            <input 
              type="password" 
              name="password"
              placeholder="변경할 때만 입력"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">비밀번호 확인</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="변경할 때만 입력"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
        </div>
      </div>
      
      {/* 사업자 정보 수정 */}
      <div className="mb-10">
        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
          사업자 정보 수정
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">상호명</label>
            <input 
              type="text" 
              name="bizname"
              value={formData.bizname}
              onChange={handleChange}
              className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">사업자 번호</label>
            <input 
              type="text" 
              name="bizNumber"
              value={formData.bizNumber}
              onChange={handleChange}
              className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">가게 주소</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                name="address"
                value={formData.address}
                readOnly
                className="flex-grow p-2 border-b border-gray-200 bg-gray-50 outline-none"
              />
              <button type="button" className="px-3 py-1 bg-gray-100 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">주소 검색</button>
            </div>
            <input 
              type="text" 
              name="detailAddress"
              placeholder="상세 주소를 입력하세요"
              value={formData.detailAddress}
              onChange={handleChange}
              className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">오픈일자</label>
            <input 
              type="date" 
              name="openDate"
              value={formData.openDate}
              onChange={handleChange}
              className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 가게 사진 수정 */}
      <div className="mb-10">
        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
          가게 사진 수정
        </h3>
        <div className="grid grid-cols-2 gap-8">
          {/* 외관 사진 */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-3">가게 외관</label>
            <div className="relative group">
              <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-emerald-100 bg-gray-50 flex items-center justify-center">
                {previews.exterior ? (
                  <img src={previews.exterior} alt="Exterior Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">사진을 선택해 주세요</span>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                <span className="text-white text-xs font-bold bg-emerald-500 px-4 py-2 rounded-full shadow-lg">사진 변경</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'exterior')} />
              </label>
            </div>
          </div>
          {/* 내관 사진 */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-3">가게 내관</label>
            <div className="relative group">
              <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-emerald-100 bg-gray-50 flex items-center justify-center">
                {previews.interior ? (
                  <img src={previews.interior} alt="Interior Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">사진을 선택해 주세요</span>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                <span className="text-white text-xs font-bold bg-emerald-500 px-4 py-2 rounded-full shadow-lg">사진 변경</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'interior')} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button 
          type="button" 
          onClick={() => navigate("/business-mypage")}
          className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button 
          type="submit"
          className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"
        >
          저장하기
        </button>
      </div>
    </form>
  );
};

function BusinessUpdateMyPage() {
  const { logout, user_type, user_nickname, bizname } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('개인정보 수정');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
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

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <header className="grid grid-cols-3 items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="SoSo Logo" className="w-12 h-12 object-contain relative top-[5px]" />
          <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">SoSo</div>
        </div>
        <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-lg p-1 bg-gray-50 w-fit mx-auto">
          <a href="/" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">홈</a>
          {['발주 관리', '수금 관리', '공동 발주', '업체 홍보', '통계'].map(m => (
            <a key={m} href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">{m}</a>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-4">
          <button className="text-gray-400 hover:text-emerald-600 relative">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white hover:bg-emerald-50 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                {user_nickname ? user_nickname.substring(0, 1) : 'G'}
              </div>
              <span className="text-sm font-semibold whitespace-nowrap text-gray-700">
                {user_nickname || '회원님'} 
                <span className="text-xs text-gray-400 font-normal ml-1">
                  {bizname || '상호명 미등록'}
                </span>
              </span>
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-[60] animate-fade-in-up">
                <div className="p-3 border-b border-gray-50">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">나의 매장</span>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl mb-1 flex justify-between items-center">
                    {bizname || '강남 본점'}
                    <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase">Main</span>
                  </button>
                </div>
                <div className="border-t border-gray-50 pt-2 mt-2">
                  <button 
                    onClick={handleProfileClick}
                    className="w-full text-center py-3 text-sm font-black text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                  >
                    마이페이지
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleLogout} className="text-xs text-gray-400 hover:underline">/로그아웃</button>
        </div>
      </header>
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
          {activeTab === '개인정보 수정' ? (
            <UserUpdateTab />
          ) : (
            <div className="bg-white border border-gray-100 rounded-lg p-12 text-center text-gray-400">
              <h2 className="font-bold text-lg mb-2">{activeTab}</h2>
              <p>콘텐츠 준비 중입니다.</p>
            </div>
          )}
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

export default BusinessUpdateMyPage;
