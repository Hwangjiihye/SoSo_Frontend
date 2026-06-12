import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';
import authStore from '../../store/authStore';
import { useStores } from '../../hooks/useStores';

const ExportFileIcon = ({ accentClass }) => (
  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentClass}`}>
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 12l6 6M15 12l-6 6" strokeLinecap="round" />
    </svg>
  </div>
);

const ExportPage = () => {
  const navigate = useNavigate();
  const { logout, user_nickname, bizname, selectedStoreSeq, setSelectedStore } = authStore();
  const { stores, isLoading: isStoresLoading } = useStores();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettlementMenuOpen, setIsSettlementMenuOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleStoreSwitch = (storeSeq, companyName) => {
    setSelectedStore(storeSeq, companyName);
    setIsProfileOpen(false);
  };

  const exportCards = [
    {
      title: '월 매출액 내보내기',
      description: '이번 달 전체 매출 데이터를 엑셀(.xlsx) 형식으로 저장합니다.',
      detail: '거래처별, 품목별 상세 내역 포함',
      buttonLabel: '매출 엑셀 다운로드',
      accentClass: 'bg-emerald-50 text-emerald-600',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-200',
    },
    {
      title: '비용 카테고리 내보내기',
      description: '식자재, 소모품, 기타 비용을 카테고리별로 분류하여 내보냅니다.',
      detail: '카테고리별 지출 금액 및 비중 포함',
      buttonLabel: '비용 엑셀 다운로드',
      accentClass: 'bg-blue-50 text-blue-600',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="sticky top-0 z-50 grid grid-cols-3 items-center border-b border-gray-200 bg-white px-6 py-5 md:px-12">
        <div className="flex cursor-pointer items-center gap-1" onClick={() => navigate('/')}>
          <img src={logo} alt="SoSo Logo" className="relative top-[5px] h-12 w-12 object-contain" />
          <div className="text-[40px] font-black leading-none tracking-tighter text-[#1d9e75]">SoSo</div>
        </div>

        <nav className="relative mx-auto hidden w-fit justify-center gap-1 rounded-lg border border-gray-100 bg-gray-50 p-1 md:flex">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="whitespace-nowrap px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-emerald-600"
          >
            홈
          </button>
          <button type="button" className="whitespace-nowrap px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-emerald-600">
            발주 관리
          </button>

          <div
            className="relative"
            onMouseEnter={() => setIsSettlementMenuOpen(true)}
            onMouseLeave={() => setIsSettlementMenuOpen(false)}
          >
            <div className="cursor-pointer whitespace-nowrap rounded border border-gray-200 bg-white px-4 py-1.5 text-sm font-bold text-emerald-600 shadow-sm">
              수금 관리
            </div>
            <div className={`absolute left-0 top-full z-[60] w-40 pt-2 transition-all duration-200 ${
              isSettlementMenuOpen
                ? 'visible translate-y-0 opacity-100'
                : 'invisible -translate-y-2 opacity-0'
            }`}>
              <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                {['이체 관리', '비용 카테고리', '결제 요약', '내보내기'].map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      if (sub === '이체 관리') navigate('/transfer-management');
                      else if (sub === '비용 카테고리') navigate('/expense-category');
                      else if (sub === '결제 요약') navigate('/settlement');
                      else if (sub === '내보내기') navigate('/export');
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-[11px] font-bold transition-all ${
                      sub === '내보내기'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {['공동 발주', '업체 홍보', '통계'].map((menu) => (
            <button
              key={menu}
              type="button"
              className="whitespace-nowrap px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-emerald-600"
            >
              {menu}
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-4">
          <button type="button" className="relative text-gray-400 hover:text-emerald-600">
            <span className="text-xl">♢</span>
            <span className="absolute -right-1 -top-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <div className="relative">
            <div
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 transition-colors hover:bg-emerald-50"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">
                {user_nickname ? user_nickname.substring(0, 1) : 'G'}
              </div>
              <span className="whitespace-nowrap text-sm font-semibold text-gray-700">
                {user_nickname || '회원'}
                <span className="ml-1 text-xs font-normal text-gray-400">
                  {bizname || '상호명 미등록'}
                </span>
              </span>
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 z-[60] mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-50 p-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">나의 매장 목록</span>
                  {isStoresLoading && <span className="animate-pulse text-[10px] text-emerald-500">로딩 중...</span>}
                </div>
                <div className="max-h-60 overflow-y-auto py-2">
                  {stores.length > 0 ? (
                    stores.map((store) => (
                      <button
                        key={store.storeSeq}
                        type="button"
                        onClick={() => handleStoreSwitch(store.storeSeq, store.companyName)}
                        className={`mb-1 flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                          selectedStoreSeq == store.storeSeq ||
                          (!selectedStoreSeq && stores[0].storeSeq === store.storeSeq)
                            ? 'border border-emerald-100 bg-emerald-50 font-bold text-emerald-600'
                            : 'font-medium text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm">{store.companyName}</span>
                          <span className="text-[10px] font-normal text-gray-400">
                            {store.bizNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-xs text-gray-400">등록된 매장이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button type="button" onClick={handleLogOut} className="text-xs text-gray-400 hover:underline">
            /로그아웃
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-10 md:px-12 md:py-14">
        <section>
          <div className="mb-8">
            <span className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-600">
              데이터 내보내기
            </span>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">내보내기</h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              월 매출액 및 비용 데이터를 엑셀 파일로 내보냅니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {exportCards.map((card) => (
              <article
                key={card.title}
                className="flex min-h-80 flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <ExportFileIcon accentClass={card.accentClass} />

                <div className="mt-6">
                  <h2 className="text-xl font-black text-gray-900">{card.title}</h2>
                  <p className="mt-3 max-w-md text-sm font-medium leading-6 text-gray-500">
                    {card.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400">
                    <svg
                      className="h-4 w-4 text-emerald-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {card.detail}
                  </div>
                </div>

                <button
                  type="button"
                  className={`mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-black text-white shadow-sm transition-colors focus:outline-none focus:ring-4 ${card.buttonClass}`}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {card.buttonLabel}
                </button>
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 8v.1" strokeLinecap="round" />
            </svg>
            <p className="text-xs font-medium leading-5 text-gray-500">
              다운로드 파일은 현재 선택된 매장의 이번 달 데이터를 기준으로 생성됩니다.
            </p>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
};

export default ExportPage;
