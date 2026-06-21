// React 상태 관리와 화면 첫 로딩 시 API 호출을 위해 사용
import { useEffect, useMemo, useState } from "react";

// 공통 하단 Footer 컴포넌트
import MainFooter from "../../components/layout/MainFooter";

// 거래처 로그인 기준 수금관리 대시보드 조회 API
// 현재 파일 위치: src/features/payment/CollectionManagementPage.jsx
// API 파일 위치: src/apis/paymentApi.js
// payment 폴더에서 src까지 두 번 올라가야 하므로 ../../apis/paymentApi 사용
import { getCollectionDashboard } from "../../apis/account";

// 상단 요약 카드 색상 스타일 정의
const cardStyles = {
  // 입금 완료 카드 스타일
  emerald: {
    border: 'border-emerald-100',
    icon: 'bg-emerald-50 text-emerald-600',
    amount: 'text-emerald-600',
  },

  // 입금 예정 카드 스타일
  blue: {
    border: 'border-blue-100',
    icon: 'bg-blue-50 text-blue-600',
    amount: 'text-blue-600',
  },

  // 미수금 카드 스타일
  amber: {
    border: 'border-amber-100',
    icon: 'bg-amber-50 text-amber-500',
    amount: 'text-amber-500',
  },
};

// 수금관리 페이지 컴포넌트
function CollectionManagementPage() {
  // 거래처 사업자 기본 정보 상태
  const [businessInfo, setBusinessInfo] = useState(null);

  // 상단 요약 카드 데이터 상태
  const [summary, setSummary] = useState({
    paidAmount: 0,
    paidCount: 0,
    scheduledAmount: 0,
    scheduledCount: 0,
    unpaidAmount: 0,
    unpaidCount: 0,
  });

  // 입금 계좌 또는 입금 내역 상태
  const [depositAccounts, setDepositAccounts] = useState([]);

  // 거래처 수금 이력 테이블 상태
  const [collectionRows, setCollectionRows] = useState([]);

  // 거래처명 필터 선택 상태
  const [selectedClient, setSelectedClient] = useState('전체');

  // 금액을 1,000원 형식으로 변환하는 함수
  const money = (value) => {
    // 값이 없으면 0으로 처리하고 원화 형식으로 반환
    return `${Number(value || 0).toLocaleString()}원`;
  };

  // 수금관리 대시보드 데이터 조회 함수
  const fetchCollectionDashboard = async () => {
    // 현재 로그인한 거래처의 선택 매장 번호 가져오기
    const storeSeq = localStorage.getItem('storeSeq');

    // storeSeq가 없으면 API 호출 중단
    if (!storeSeq) {
      console.log('선택된 매장 없음');
      return;
    }

    try {
      // 백엔드 수금관리 API 호출
      const data = await getCollectionDashboard(storeSeq);

      // 사업자 기본 정보 저장
      setBusinessInfo(data.businessInfo || null);

      // 상단 요약 카드 데이터 저장
      setSummary(data.summary || {
        paidAmount: 0,
        paidCount: 0,
        scheduledAmount: 0,
        scheduledCount: 0,
        unpaidAmount: 0,
        unpaidCount: 0,
      });

      // 입금 내역 데이터 저장
      setDepositAccounts(data.depositAccounts || []);

      // 거래처 수금 이력 데이터 저장
      setCollectionRows(data.collectionRows || []);
    } catch (error) {
      // API 호출 실패 시 콘솔에 에러 출력
      console.error('수금관리 조회 실패:', error);
    }
  };

  // 화면이 처음 열릴 때 수금관리 데이터 조회
  useEffect(() => {
    // 첫 렌더링 시 API 호출
    fetchCollectionDashboard();
  }, []);

  // 상단 요약 카드에 표시할 데이터 생성
  const summaryCards = [
    // 이번 달 입금 완료 카드
    {
      label: '이번 달 입금 완료',
      amount: money(summary.paidAmount),
      description: `총 ${summary.paidCount || 0}건의 입금이 확인됐어요`,
      color: 'emerald',
    },

    // 월 입금 예정 금액 카드
    {
      label: '월 입금 예정 금액',
      amount: money(summary.scheduledAmount),
      description: `앞으로 ${summary.scheduledCount || 0}건의 입금이 예정돼요`,
      color: 'blue',
    },

    // 미수금 카드
    {
      label: '미수금',
      amount: money(summary.unpaidAmount),
      description: `확인이 필요한 미수금 ${summary.unpaidCount || 0}건`,
      color: 'amber',
    },
  ];

  // 수금 이력에 있는 거래처명으로 필터 버튼 생성
  const clientFilters = useMemo(() => {
    // 수금 이력에서 거래처명만 추출
    const names = collectionRows.map((row) => row.client);

    // 전체 버튼과 중복 제거된 거래처명 반환
    return ['전체', ...new Set(names)];
  }, [collectionRows]);

  // 선택한 거래처명에 맞는 테이블 데이터 필터링
  const filteredRows = useMemo(() => {
    // 전체 선택 시 모든 수금 이력 반환
    if (selectedClient === '전체') {
      return collectionRows;
    }

    // 특정 거래처 선택 시 해당 거래처 데이터만 반환
    return collectionRows.filter((row) => row.client === selectedClient);
  }, [collectionRows, selectedClient]);

  // 수금관리 페이지 화면 반환
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-5 py-8 lg:px-8">
        {/* 페이지 제목 영역 */}
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold text-emerald-600">수금 관리</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">월 결제 현황</h1>
            <p className="mt-2 text-sm text-slate-500">
              거래처 기준 수금 현황과 입금 내역을 한눈에 확인하세요.
            </p>
          </div>

          {/* 내보내기 버튼 */}
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 shadow-sm hover:border-emerald-200 hover:text-emerald-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            내보내기
          </button>
        </section>

        {/* 상단 요약 카드 영역 */}
        <section className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => {
            // 카드 색상 스타일 가져오기
            const style = cardStyles[card.color];

            // 요약 카드 반환
            return (
              <article key={card.label} className={`rounded-3xl border bg-white p-6 shadow-sm ${style.border}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-500">{card.label}</p>
                    <p className={`mt-3 text-3xl font-black tracking-tight ${style.amount}`}>{card.amount}</p>
                    <p className="mt-3 text-xs font-medium text-slate-400">{card.description}</p>
                  </div>

                  {/* 카드 아이콘 */}
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${style.icon}`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7h16M7 3v4m10-4v4M5 11h14v9H5z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        {/* 사업자 정보와 입금 계좌 영역 */}
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* 사업자 기본 정보 카드 */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-600">사업자 정보</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">기본 정보 관리</h2>
              </div>

              {/* 사업자 유형 배지 */}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                {businessInfo?.businessType || '-'}
              </span>
            </div>

            {/* 사업자 기본 정보 목록 */}
            <dl className="space-y-4">
              {[
                ['사업자 유형', businessInfo?.businessType || '-'],
                ['사업자번호', businessInfo?.businessNumber || '-'],
                ['대표자명', businessInfo?.ownerName || '-'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[110px_1fr] items-center border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <dt className="text-sm font-semibold text-slate-400">{label}</dt>
                  <dd className="text-sm font-bold text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>

            {/* 사업자 정보 버튼 영역 */}
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
              >
                정보 확인
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                수정
              </button>
            </div>
          </article>

          {/* 입금 계좌 확인 카드 */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600">입금 계좌</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">들어온 계좌 확인</h2>
              </div>

              {/* 전체 보기 버튼 */}
              <button type="button" className="text-xs font-bold text-slate-400 hover:text-emerald-600">
                전체 보기
              </button>
            </div>

            {/* 입금 내역 목록 */}
            <div className="space-y-3">
              {depositAccounts.length === 0 ? (
                // 입금 내역이 없을 때 표시
                <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-400">
                  입금 내역이 없습니다.
                </p>
              ) : (
                // 입금 내역이 있을 때 목록 출력
                depositAccounts.map((item, index) => (
                  <div
                    key={`${item.bank || 'bank'}-${index}`}
                    className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-black text-blue-600 shadow-sm">
                        {(item.bank || '계좌').slice(0, 2)}
                      </span>

                      <div>
                        <p className="text-sm font-black text-slate-800">{item.bank || '-'}</p>
                        <p className="mt-1 text-xs font-medium text-slate-400">{item.account || '-'}</p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm font-black text-emerald-600">+ {money(item.amount)}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.date || '-'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 입금 내역 새로고침 버튼 */}
            <button
              type="button"
              onClick={fetchCollectionDashboard}
              className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              입금 내역 새로고침
            </button>
          </article>
        </section>

        {/* 거래처 수금 이력 테이블 영역 */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600">거래처별 현황</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">거래처 수금 이력</h2>
            </div>

            {/* 거래처명 필터 버튼 영역 */}
            <div className="flex flex-wrap gap-2">
              {clientFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedClient(filter)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold ${
                    selectedClient === filter
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* 수금 이력 테이블 */}
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full table-fixed text-center">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4">거래처명</th>
                  <th className="px-6 py-4">사업자 구분</th>
                  <th className="px-6 py-4">예정 금액</th>
                  <th className="px-6 py-4">입금된 금액</th>
                  <th className="px-6 py-4">입금 카드</th>
                  <th className="px-6 py-4 text-center">상태</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRows.length === 0 ? (
                  // 수금 이력이 없을 때 표시
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm font-bold text-slate-400">
                      수금 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  // 수금 이력이 있을 때 테이블 행 출력
                  filteredRows.map((row) => {
                    // 상태별 배지 스타일 지정
                    const statusStyle = {
                      입금완료: 'bg-emerald-50 text-emerald-700',
                      입금예정: 'bg-amber-50 text-amber-600',
                      미수금: 'bg-red-50 text-red-600',
                    }[row.status] || 'bg-slate-100 text-slate-500';

                    // 수금 이력 행 반환
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-5 text-sm font-black text-slate-800">{row.client || '-'}</td>
                        <td className="px-6 py-5 text-sm text-slate-500">{row.type || '-'}</td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-700">
                          {money(row.expected)}
                        </td>
                        <td className="px-6 py-5 text-sm font-black text-slate-900">
                          {money(row.paid)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">{row.account || '-'}</td>
                        <td className="px-6 py-5 text-center">
                          <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${statusStyle}`}>
                            {row.status || '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* 공통 Footer 출력 */}
      <MainFooter />
    </div>
  );
}

// 수금관리 페이지 컴포넌트 export
export default CollectionManagementPage;
