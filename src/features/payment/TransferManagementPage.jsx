import React, { useState } from 'react';
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

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettlementMenuOpen, setIsSettlementMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ 
    bank: '', 
    number: '', 
    name: '',
    paymentDate: '',
    isAutoTransfer: false,
    partnerName: '',
    managerName: ''
  });

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
            {/* 등록된 계좌 리스트 */}
            {transferData.accounts.map((acc) => (
              <div key={acc.id} className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg shadow-emerald-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <img src={logo} alt="watermark" className="w-40 h-40 object-contain" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="text-emerald-100 text-sm font-bold mb-1 uppercase tracking-widest">{acc.bankName}</div>
                      <div className="text-xl font-medium tracking-tighter opacity-80">{acc.accountNumber}</div>
                    </div>
                    {acc.isMain && <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase">주계좌</div>}
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
            ))}

            <button 
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full py-12 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all flex flex-col items-center gap-2 group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">+</span>
              <span className="text-sm">새로운 결제 계좌를 등록해 주세요</span>
            </button>
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
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">거래처명</label>
                    <input 
                      type="text" 
                      placeholder="거래처 검색"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      value={newAccount.partnerName}
                      onChange={(e) => setNewAccount({...newAccount, partnerName: e.target.value})}
                    />
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
              onClick={() => {
                alert("계좌 정보 등록이 완료되었습니다.");
                setIsRegisterModalOpen(false);
              }}
              className="w-full mt-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
            >
              등록 완료
            </button>
          </div>
        </div>
      )}

      <MainFooter />
    </div>
  );
};

export default TransferManagementPage;
