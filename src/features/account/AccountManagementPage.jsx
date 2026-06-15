import React from 'react';
import { Link } from 'react-router-dom';
import { useAccountManagement } from './hooks/useAccountManagement';

/**
 * @file AccountManagementPage.jsx
 * @description 품목 관리 페이지 컴포넌트입니다.
 * 특정 거래처의 품목 목록을 조회하고 관리합니다.
 */
function AccountManagementPage() {
  const { items, isLoading, partnerName } = useAccountManagement();

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">품목 관리</h1>
              {partnerName && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  {partnerName}
                </span>
              )}
            </div>
            <p className="text-gray-500">거래처의 등록된 품목을 조회하고 관리할 수 있습니다.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/account/list" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              거래처 목록으로 돌아가기
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-semibold bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">전체 품목</button>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="품목명 검색" 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-20 text-center">
                <div className="animate-spin text-4xl mb-4 inline-block text-emerald-500">⏳</div>
                <p className="text-gray-500 font-bold">품목 데이터를 불러오는 중입니다...</p>
              </div>
            ) : items.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">품목명</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">카테고리</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">규격/단위</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">단가</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">상태</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                          )}
                          <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">{item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-[10px] font-bold rounded uppercase bg-emerald-100 text-emerald-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <button className="text-gray-400 hover:text-emerald-600 mr-3">수정</button>
                        <button className="text-gray-400 hover:text-red-500">삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-32 text-center">
                <div className="text-6xl mb-6">📦</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">등록된 품목이 없습니다</h3>
                <p className="text-gray-400 font-medium">이 거래처에는 아직 등록된 품목 정보가 없습니다.</p>
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
              <nav className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all">{"<"}</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all">{">"}</button>
              </nav>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AccountManagementPage;
