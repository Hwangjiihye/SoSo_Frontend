import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';
import authStore from '../../store/authStore';

const summaryCards = [
  {
    label: '이번 달 입금 완료',
    amount: '4,820,000원',
    description: '총 8건의 입금이 확인됐어요',
    color: 'emerald',
  },
  {
    label: '월 입금 예정 금액',
    amount: '6,300,000원',
    description: '앞으로 3건의 입금이 예정돼요',
    color: 'blue',
  },
  {
    label: '미수금',
    amount: '1,480,000원',
    description: '확인이 필요한 미수금 1건',
    color: 'amber',
  },
];

const depositAccounts = [
  {
    bank: '국민은행',
    account: '123-456-789012',
    amount: '+ 4,820,000원',
    date: '5월 10일 입금',
  },
  {
    bank: '신한은행',
    account: '123-456-789012',
    amount: '+ 4,820,000원',
    date: '5월 10일 입금',
  },
  {
    bank: '신한은행',
    account: '123-456-789012',
    amount: '+ 4,820,000원',
    date: '5월 10일 입금',
  },
];

const collectionRows = [
  {
    id: 1,
    client: '한국저격',
    type: '법인사업자',
    date: '5월 15일',
    expected: '$1,200,000',
    paid: '$1,200,000',
    account: '국민 123-456-789012',
    status: '입금완료',
  },
  {
    id: 2,
    client: '신선마트',
    type: '개인사업자',
    date: '5월 15일',
    expected: '$1,200,000',
    paid: '$1,200,000',
    account: '국민 123-456-789012',
    status: '입금예정',
  },
  {
    id: 3,
    client: '해산물유통',
    type: '법인사업자',
    date: '5월 15일',
    expected: '$1,200,000',
    paid: '$1,200,000',
    account: '국민 123-456-789012',
    status: '미수금',
  },
];

const cardStyles = {
  emerald: {
    border: 'border-emerald-100',
    icon: 'bg-emerald-50 text-emerald-600',
    amount: 'text-emerald-600',
  },
  blue: {
    border: 'border-blue-100',
    icon: 'bg-blue-50 text-blue-600',
    amount: 'text-blue-600',
  },
  amber: {
    border: 'border-amber-100',
    icon: 'bg-amber-50 text-amber-500',
    amount: 'text-amber-500',
  },
};

function CollectionManagementPage() {
  const navigate = useNavigate();
  const { logout, member, user_nickname } = authStore();
  const displayName = member?.nickname || user_nickname || '거래처 담당자';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button type="button" onClick={() => navigate('/')} className="flex items-center gap-1">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
            <span className="text-3xl font-black tracking-tight text-emerald-600">SoSo</span>
          </button>

          <nav className="hidden items-center gap-1 rounded-xl bg-slate-50 p-1 md:flex">
            <Link to="/" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:text-emerald-600">
              홈
            </Link>
            <button type="button" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:text-emerald-600">
              발주 관리
            </button>
            <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-emerald-600 shadow-sm ring-1 ring-slate-200">
              수금 관리
            </span>
            <button type="button" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:text-emerald-600">
              공동 발주
            </button>
            <button type="button" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:text-emerald-600">
              통계
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                {displayName.slice(0, 1)}
              </span>
              <span className="text-sm font-bold text-slate-700">{displayName}</span>
            </div>
            <button type="button" onClick={handleLogout} className="text-xs font-medium text-slate-400 hover:text-slate-700">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-5 py-8 lg:px-8">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold text-emerald-600">수금 관리</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">월 결제 현황</h1>
            <p className="mt-2 text-sm text-slate-500">
              사업자 구분별 수금 현황과 거래처 입금 내역을 한눈에 확인하세요.
            </p>
          </div>
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

        <section className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => {
            const style = cardStyles[card.color];

            return (
              <article key={card.label} className={`rounded-3xl border bg-white p-6 shadow-sm ${style.border}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-500">{card.label}</p>
                    <p className={`mt-3 text-3xl font-black tracking-tight ${style.amount}`}>{card.amount}</p>
                    <p className="mt-3 text-xs font-medium text-slate-400">{card.description}</p>
                  </div>
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

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-600">사업자 정보</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">기본 정보 관리</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">개인 / 법인</span>
            </div>

            <dl className="space-y-4">
              {[
                ['사업자 유형', '개인 / 법인'],
                ['사업자번호', '000-00-00000'],
                ['대표자명', '김철수'],
                ['업태 / 종목', '도매 / 식품'],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[110px_1fr] items-center border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <dt className="text-sm font-semibold text-slate-400">{label}</dt>
                  <dd className="text-sm font-bold text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex gap-2">
              <button type="button" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
                정보 확인
              </button>
              <button type="button" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">
                수정
              </button>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600">입금 계좌</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">들어온 계좌 확인</h2>
              </div>
              <button type="button" className="text-xs font-bold text-slate-400 hover:text-emerald-600">
                전체 보기
              </button>
            </div>

            <div className="space-y-3">
              {depositAccounts.map((item, index) => (
                <div key={`${item.bank}-${index}`} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-black text-blue-600 shadow-sm">
                      {item.bank.slice(0, 2)}
                    </span>
                    <div>
                      <p className="text-sm font-black text-slate-800">{item.bank}</p>
                      <p className="mt-1 text-xs font-medium text-slate-400">{item.account}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-black text-emerald-600">{item.amount}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
              입금 내역 새로고침
            </button>
          </article>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600">거래처별 현황</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">거래처 수금 이력</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['전체', '한국저격', '신선마트', '해산물유통'].map((filter, index) => (
                <button
                  key={filter}
                  type="button"
                  className={`rounded-xl px-4 py-2 text-xs font-bold ${
                    index === 0
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4">거래처명</th>
                  <th className="px-6 py-4">사업자 구분</th>
                  <th className="px-6 py-4">입금 예정일</th>
                  <th className="px-6 py-4 text-right">예정 금액</th>
                  <th className="px-6 py-4 text-right">입금된 금액</th>
                  <th className="px-6 py-4">입금 계좌</th>
                  <th className="px-6 py-4 text-center">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collectionRows.map((row) => {
                  const statusStyle = {
                    입금완료: 'bg-emerald-50 text-emerald-700',
                    입금예정: 'bg-amber-50 text-amber-600',
                    미수금: 'bg-red-50 text-red-600',
                  }[row.status];

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-5 text-sm font-black text-slate-800">{row.client}</td>
                      <td className="px-6 py-5 text-sm text-slate-500">{row.type}</td>
                      <td className="px-6 py-5 text-sm text-slate-500">{row.date}</td>
                      <td className="px-6 py-5 text-right text-sm font-bold text-slate-700">{row.expected}</td>
                      <td className="px-6 py-5 text-right text-sm font-black text-slate-900">{row.paid}</td>
                      <td className="px-6 py-5 text-sm text-slate-500">{row.account}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${statusStyle}`}>{row.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}

export default CollectionManagementPage;
