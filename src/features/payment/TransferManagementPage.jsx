import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';
import authStore from '../../store/authStore';
import { useStores } from '../../hooks/useStores';
import { useTransfer } from './hooks/useTransfer';

/**
 * @file TransferManagementPage.jsx
 * @description 이체 관리 페이지 (payment 도메인)
 * '이체 관리.jpg' 디자인 참고 반영
 */
const TransferManagementPage = () => {
  const navigate = useNavigate();
  const { logout, user_nickname, bizname, selectedStoreSeq, setSelectedStore } = authStore();
  const { stores, isLoading: isStoresLoading } = useStores();
  const { transferData, isLoading, formatCurrency } = useTransfer();

  const [accounts, setAccounts] = useState([]);
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettlementMenuOpen, setIsSettlementMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태 추가
  const [editingAccount, setEditingAccount] = useState(null); // 수정 중인 계좌 상태 추가
  const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState(false); // 거래처 드롭다운 상태 추가
  const [newAccount, setNewAccount] = useState({ 
    bank: '', 
    number: '', 
    name: '',
    paymentDate: '',
    isAutoTransfer: false,
    partnerName: '',
    managerName: ''
  });

  // 초기 데이터 연동 및 여러 개의 예시 계좌 설정
  useEffect(() => {
    if (transferData && transferData.accounts) {
      const mockAccounts = [
        ...transferData.accounts,
        {
          id: 2,
          bankName: '국민은행',
          accountNumber: '456-789-012345',
          balance: 12500000,
          isMain: false,
        },
        {
          id: 3,
          bankName: '우리은행',
          accountNumber: '1002-345-678901',
          balance: 870000,
          isMain: false,
        },
        {
          id: 4,
          bankName: '하나은행',
          accountNumber: '234-567-890123',
          balance: 3210000,
          isMain: false,
        }
      ];
      setAccounts(mockAccounts);
    }
  }, [transferData]);

  const handleAddAccount = () => {
    if (!newAccount.bank) {
      alert("은행을 선택해 주세요.");
      return;
    }
    if (!newAccount.number) {
      alert("계좌번호를 입력해 주세요.");
      return;
    }
    if (!newAccount.name) {
      alert("예금주를 입력해 주세요.");
      return;
    }

    const nextId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const addedAccount = {
      id: nextId,
      bankName: newAccount.bank,
      accountNumber: newAccount.number,
      balance: Math.floor(Math.random() * 800 + 100) * 10000, // 100만 ~ 900만원 랜덤 설정
      isMain: accounts.length === 0,
    };

    const updatedAccounts = [...accounts, addedAccount];
    setAccounts(updatedAccounts);
    setIsRegisterModalOpen(false);
    
    // 모달 필드 초기화
    setNewAccount({
      bank: '', 
      number: '', 
      name: '',
      paymentDate: '',
      isAutoTransfer: false,
      partnerName: '',
      managerName: ''
    });
    alert("새 계좌 등록이 완료되었습니다.");
    // 새로 등록한 계좌로 포커스 이동
    setActiveAccountIndex(updatedAccounts.length - 1);
  };

  const handleOpenEditModal = (acc, e) => {
    e.stopPropagation();
    setEditingAccount({ ...acc });
    setIsEditModalOpen(true);
  };

  const handleUpdateAccount = () => {
    if (!editingAccount.bankName) {
      alert("은행을 선택해 주세요.");
      return;
    }
    if (!editingAccount.accountNumber) {
      alert("계좌번호를 입력해 주세요.");
      return;
    }

    setAccounts(accounts.map(a => a.id === editingAccount.id ? editingAccount : a));
    setIsEditModalOpen(false);
    alert("계좌 정보가 수정되었습니다.");
  };

  const handleDeleteAccount = (acc, e) => {
    e.stopPropagation();
    if (confirm(`정말 ${acc.bankName} (${acc.accountNumber}) 계좌를 삭제하시겠습니까?`)) {
      const updated = accounts.filter(a => a.id !== acc.id);
      if (acc.isMain && updated.length > 0) {
        const nextMain = { ...updated[0], isMain: true };
        setAccounts([nextMain, ...updated.slice(1)]);
      } else {
        setAccounts(updated);
      }
      setActiveAccountIndex(0);
      alert("계좌가 삭제되었습니다.");
    }
  };

  const handlePrevAccount = () => {
    setActiveAccountIndex((prev) => (prev === 0 ? accounts.length - 1 : prev - 1));
  };

  const handleNextAccount = () => {
    setActiveAccountIndex((prev) => (prev === accounts.length - 1 ? 0 : prev + 1));
  };

  const handleLogOut = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleStoreSwitch = (storeSeq, companyName) => {
    setSelectedStore(storeSeq, companyName);
    setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="grid grid-cols-3 items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="SoSo Logo" className="w-12 h-12 object-contain relative top-[5px]" />
          <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">SoSo</div>
        </div>
        
        <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-lg p-1 bg-gray-50 w-fit mx-auto relative">
          <Link to="/" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">홈</Link>
          <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">발주 관리</a>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsSettlementMenuOpen(true)}
            onMouseLeave={() => setIsSettlementMenuOpen(false)}
          >
            <div 
              onClick={() => navigate("/settlement")}
              className={`px-4 py-1.5 text-sm font-bold rounded shadow-sm border cursor-pointer transition-all whitespace-nowrap ${isSettlementMenuOpen ? 'bg-white text-emerald-600 border-gray-100' : 'bg-white text-emerald-600 border-gray-200'}`}
            >
              수금 관리
            </div>
            
            <div className={`absolute top-full left-0 w-40 pt-2 z-[60] transition-all duration-200 ${isSettlementMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-2">
                {['이체 관리', '비용 카테고리', '결제 요약', '내보내기'].map((sub) => (
                  <button 
                    key={sub} 
                    onClick={() => {
                      if (sub === '이체 관리') navigate("/transfer-management");
                      else if (sub === '비용 카테고리') navigate("/expense-category");
                      else if (sub === '결제 요약') navigate("/settlement");
                    }}
                    className={`w-full text-left px-3 py-2 text-[11px] font-bold rounded-lg transition-all ${sub === '이체 관리' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">공동 발주</a>
          <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">업체 홍보</a>
          <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">통계</a>
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
              </span>
            </div>
          </div>
          <button onClick={handleLogOut} className="text-xs text-gray-400 hover:underline">/로그아웃</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">이체 관리</h2>
            <p className="text-sm text-gray-500">계좌 잔액 확인 및 안전한 이체 서비스를 이용하세요.</p>
          </div>
          <button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            + 새 계좌 등록
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* 등록된 계좌 리스트 (캐러셀 슬라이더) */}
            {accounts.length > 0 ? (
              <div className="relative overflow-hidden rounded-3xl bg-gray-50 py-1">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeAccountIndex * 100}%)` }}
                >
                  {accounts.map((acc) => (
                    <div key={acc.id} className="w-full flex-shrink-0 px-12">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg shadow-emerald-200/50 relative overflow-hidden group min-h-[320px] flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                          <img src={logo} alt="watermark" className="w-40 h-40 object-contain" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div className="flex justify-between items-start mb-8">
                            <div>
                              <div className="text-emerald-100 text-sm font-bold mb-1 uppercase tracking-widest flex items-center gap-2">
                                {acc.bankName}
                                {acc.isMain && <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-tighter uppercase">주계좌</span>}
                              </div>
                              <div className="text-xl font-medium tracking-tighter opacity-85">{acc.accountNumber}</div>
                            </div>
                            <div className="flex gap-2">
                              {!acc.isMain && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updated = accounts.map(a => ({...a, isMain: a.id === acc.id}));
                                    setAccounts(updated);
                                    alert(`${acc.bankName} 계좌가 주계좌로 설정되었습니다.`);
                                  }}
                                  className="text-[10px] bg-white/20 hover:bg-white/40 text-white px-2.5 py-1 rounded-lg font-bold transition-all"
                                >
                                  대표 설정
                                </button>
                              )}
                              <button 
                                onClick={(e) => handleOpenEditModal(acc, e)}
                                className="text-[10px] bg-white/20 hover:bg-white/40 text-white px-2.5 py-1 rounded-lg font-bold transition-all"
                              >
                                수정
                              </button>
                              <button 
                                onClick={(e) => handleDeleteAccount(acc, e)}
                                className="text-[10px] bg-red-500/20 hover:bg-red-500/40 text-white px-2.5 py-1 rounded-lg font-bold transition-all"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                          <div className="mb-8">
                            <div className="text-emerald-100 text-xs font-bold mb-2 uppercase">현재 잔액</div>
                            <div className="text-5xl font-black tracking-tight">{formatCurrency(acc.balance)}</div>
                          </div>
                          <div className="flex gap-3">
                            <button className="flex-grow py-4 bg-white text-emerald-600 rounded-2xl text-sm font-black hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-900/10">이체하기</button>
                            <button className="flex-grow py-4 bg-emerald-400/30 text-white border border-emerald-300/30 backdrop-blur-sm rounded-2xl text-sm font-black hover:bg-emerald-400/40 transition-all">내역조회</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 캐러셀 좌우 컨트롤러 */}
                {accounts.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevAccount}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-emerald-600 hover:bg-emerald-50 flex items-center justify-center shadow-lg transition-all z-20 border border-gray-100 hover:scale-105 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button 
                      onClick={handleNextAccount}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-emerald-600 hover:bg-emerald-50 flex items-center justify-center shadow-lg transition-all z-20 border border-gray-100 hover:scale-105 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400 font-bold">
                등록된 결제 계좌가 없습니다. 새 계좌를 추가해 주세요.
              </div>
            )}

            {/* 인디케이터 도트 */}
            {accounts.length > 1 && (
              <div className="flex justify-center gap-2 mt-2">
                {accounts.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveAccountIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeAccountIndex ? 'bg-emerald-600 w-5' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            )}

            {/* 내 보유 계좌 목록 대시보드 */}
            {accounts.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-black text-gray-800 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full"></span>
                    내 보유 계좌 목록 ({accounts.length}개)
                  </h4>
                  <span className="text-xs text-gray-400 font-bold">
                    총 잔액: {formatCurrency(accounts.reduce((sum, a) => sum + a.balance, 0))}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {accounts.map((acc, index) => {
                    let bankColor = "bg-emerald-100 text-emerald-600";
                    if (acc.bankName.includes("신한")) bankColor = "bg-blue-100 text-blue-600";
                    else if (acc.bankName.includes("국민")) bankColor = "bg-amber-100 text-amber-600";
                    else if (acc.bankName.includes("우리")) bankColor = "bg-sky-100 text-sky-600";
                    else if (acc.bankName.includes("하나")) bankColor = "bg-emerald-100 text-emerald-600";
                    
                    const isActive = index === activeAccountIndex;

                    return (
                      <div 
                        key={acc.id}
                        onClick={() => setActiveAccountIndex(index)}
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                          isActive 
                            ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20 shadow-sm' 
                            : 'border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${bankColor}`}>
                            {acc.bankName.substring(0, 2)}
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                              {acc.bankName}
                              {acc.isMain && <span className="bg-emerald-100 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded">대표</span>}
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold">{acc.accountNumber}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right mr-1">
                            <div className="text-xs font-black text-gray-900">{formatCurrency(acc.balance)}</div>
                            <span className="text-[9px] text-emerald-600 font-extrabold">{isActive ? '선택됨' : '선택'}</span>
                          </div>
                          <div className="flex gap-1.5">
                            <button 
                              onClick={(e) => handleOpenEditModal(acc, e)}
                              className="px-2.5 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-100"
                            >
                              수정
                            </button>
                            <button 
                              onClick={(e) => handleDeleteAccount(acc, e)}
                              className="px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 hover:text-red-700 transition-all border border-red-100"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-fit sticky top-24">
            <h3 className="font-bold text-gray-700 mb-6 flex justify-between items-center">
              즐겨찾는 계좌
              <button className="text-[10px] text-emerald-500 font-bold hover:underline">+ 추가</button>
            </h3>
            <div className="space-y-4">
              {[
                { name: '김철수', label: '식자재', color: 'bg-orange-100 text-orange-600' },
                { name: '박영희', label: '임대료', color: 'bg-blue-100 text-blue-600' },
                { name: '최지우', label: '야채', color: 'bg-purple-100 text-purple-600' },
              ].map((fav, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-50 rounded-2xl hover:border-emerald-100 hover:bg-emerald-50/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${fav.color}`}>
                      {fav.name.substring(0, 1)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{fav.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{fav.label}</div>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-emerald-500 font-bold text-xs transition-opacity">송금</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">최근 이체 상세 내역</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <tr>
                  <th className="px-8 py-4">일시</th>
                  <th className="px-8 py-4">받는 분 / 내용</th>
                  <th className="px-8 py-4 text-right">이체 금액</th>
                  <th className="px-8 py-4 text-center">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transferData.recentTransfers.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="px-8 py-6 text-sm text-gray-400 font-medium">{item.date}</td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-800">{item.recipient}</td>
                    <td className="px-8 py-6 text-sm font-black text-right text-gray-900">{formatCurrency(item.amount)}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsRegisterModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-fade-in-up my-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-900">새 계좌 등록</h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <div className="space-y-8 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
              {/* 계좌 관리 섹션 */}
              <section>
                <h4 className="text-sm font-black text-emerald-600 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                  계좌 관리
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">은행명</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      value={newAccount.bank}
                      onChange={(e) => setNewAccount({...newAccount, bank: e.target.value})}
                    >
                      <option value="">은행을 선택해 주세요</option>
                      <option value="신한은행">신한은행</option>
                      <option value="국민은행">국민은행</option>
                      <option value="우리은행">우리은행</option>
                      <option value="하나은행">하나은행</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">계좌번호</label>
                      <input 
                        type="text" 
                        placeholder="- 없이 입력"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        value={newAccount.number}
                        onChange={(e) => setNewAccount({...newAccount, number: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">예금주</label>
                      <input 
                        type="text" 
                        placeholder="실명 입력"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 결제일 설정 섹션 */}
              <section>
                <h4 className="text-sm font-black text-emerald-600 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                  결제일 설정
                </h4>
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">결제일</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      value={newAccount.paymentDate}
                      onChange={(e) => setNewAccount({...newAccount, paymentDate: e.target.value})}
                    >
                      <option value="">일자 선택</option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}일</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <input 
                      type="checkbox" 
                      id="autoTransfer"
                      className="w-4 h-4 accent-emerald-500"
                      checked={newAccount.isAutoTransfer}
                      onChange={(e) => setNewAccount({...newAccount, isAutoTransfer: e.target.checked})}
                    />
                    <label htmlFor="autoTransfer" className="text-sm font-bold text-gray-600 cursor-pointer">자동이체 활성화</label>
                  </div>
                </div>
              </section>

              {/* 거래처 선택 섹션 */}
              <section>
                <h4 className="text-sm font-black text-emerald-600 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                  거래처 선택
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">거래처명</label>
                    <input 
                      type="text" 
                      placeholder="거래처 검색"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      value={newAccount.partnerName}
                      onChange={(e) => setNewAccount({...newAccount, partnerName: e.target.value})}
                      onFocus={() => setIsPartnerDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsPartnerDropdownOpen(false), 200)}
                    />
                    
                    {/* 거래처명 아래로 내려오는 스크롤 창 UI */}
                    {isPartnerDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto custom-scrollbar animate-fade-in">
                        {['(주)대박식자재', '대성농산', '우진주류', '농협하나로마트', '정성유통', '동보수산', '대원축산'].map((partner, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setNewAccount({...newAccount, partnerName: partner});
                              setIsPartnerDropdownOpen(false);
                            }}
                            className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
                          >
                            {partner}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">담당자</label>
                    <input 
                      type="text" 
                      placeholder="담당자명"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      value={newAccount.managerName}
                      onChange={(e) => setNewAccount({...newAccount, managerName: e.target.value})}
                    />
                  </div>
                </div>
              </section>
            </div>

            <button 
              onClick={handleAddAccount}
              className="w-full mt-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
            >
              등록 완료
            </button>
          </div>
        </div>
      )}

      {/* 계좌 수정 모달 */}
      {isEditModalOpen && editingAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-fade-in-up my-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-900">계좌 정보 수정</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">은행명</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={editingAccount.bankName}
                  onChange={(e) => setEditingAccount({...editingAccount, bankName: e.target.value})}
                >
                  <option value="신한은행">신한은행</option>
                  <option value="국민은행">국민은행</option>
                  <option value="우리은행">우리은행</option>
                  <option value="하나은행">하나은행</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">계좌번호</label>
                <input 
                  type="text" 
                  placeholder="- 없이 입력"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={editingAccount.accountNumber}
                  onChange={(e) => setEditingAccount({...editingAccount, accountNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">잔액 (원)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={editingAccount.balance}
                  onChange={(e) => setEditingAccount({...editingAccount, balance: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-grow py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
              >
                취소
              </button>
              <button 
                onClick={handleUpdateAccount}
                className="flex-grow py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      <MainFooter />
    </div>
  );
};

export default TransferManagementPage;
