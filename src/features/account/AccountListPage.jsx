import React from 'react';
import { Link } from 'react-router-dom';
import { useAccountList } from './hooks/useAccountList';

/**
 * @file AccountListPage.jsx
 * @description 거래처 목록 조회 페이지 컴포넌트입니다.
 * 실제 DB 데이터를 기반으로 등록된 거래처 목록을 출력합니다.
 */
function AccountListPage() {
  const { accounts, isLoading, handleDeleteAccount } = useAccountList();

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">거래처 목록</h1>
            <p className="text-gray-500 mt-1">등록된 거래처 정보를 확인하고 관리할 수 있습니다.</p>
          </div>
          <Link to="/account/register" className="px-4 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
            신규 거래처 등록
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-semibold bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">전체 거래처</button>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="거래처명 또는 대표자명 검색" 
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-80"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-20 text-center">
                <div className="animate-spin text-4xl mb-4 inline-block text-emerald-500">⏳</div>
                <p className="text-gray-500 font-bold">거래처 목록을 불러오는 중입니다...</p>
              </div>
            ) : accounts.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">거래처명</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">대표자</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">사업자번호</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">메모</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">등록일</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {accounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{acc.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{acc.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{acc.ceo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{acc.bizNum}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                        {acc.memo ? (
                          <span title={acc.memo}>{acc.memo}</span>
                        ) : (
                          <span className="text-gray-300 italic text-xs">메모 없음</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {acc.createdAt ? new Date(acc.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <Link 
                          to={`/account/management?partnerSeq=${acc.partnerSeq}&name=${encodeURIComponent(acc.name)}`}
                          className="text-emerald-600 hover:text-emerald-700 font-bold mr-4"
                        >
                          상세
                        </Link>
                        <button 
                          onClick={() => handleDeleteAccount(acc.id, acc.name)}
                          className="text-red-400 hover:text-red-600 font-bold"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-32 text-center">
                <div className="text-6xl mb-6">🤝</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">등록된 거래처가 없습니다</h3>
                <p className="text-gray-400 font-medium mb-8">새로운 비즈니스 파트너를 등록하고 협업을 시작해 보세요.</p>
                <Link 
                  to="/account/register" 
                  className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  거래처 등록하러 가기
                </Link>
              </div>
            )}
          </div>

          {accounts.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
              <nav className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400">{"<"}</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400">{">"}</button>
              </nav>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AccountListPage;
