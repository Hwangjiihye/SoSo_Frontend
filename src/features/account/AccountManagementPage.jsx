import React from 'react';
import { Link } from 'react-router-dom';
import { useAccountManagement } from './hooks/useAccountManagement';

/**
 * @file AccountManagementPage.jsx
 * @description 품목 관리 페이지 컴포넌트입니다.
 * 특정 거래처의 상세 정보(마이페이지 형태)와 품목 목록을 조회하고 관리합니다.
 */
function AccountManagementPage() {
  const { items, partnerDetail, isLoading } = useAccountManagement();

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-10">
        
        {/* 상단 네비게이션 및 타이틀 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">거래처 상세 및 품목 관리</h1>
            <p className="text-gray-500 mt-1">거래처의 기본 정보와 취급 품목을 확인하세요.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/account/list" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              목록으로 돌아가기
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="p-32 text-center flex flex-col items-center justify-center">
            <div className="animate-spin text-5xl mb-6 text-emerald-500">⏳</div>
            <p className="text-gray-500 font-bold text-lg">데이터를 불러오는 중입니다...</p>
          </div>
        ) : (
          <>
            {/* 🏢 거래처 상세 프로필 (마이페이지 스타일) */}
            {partnerDetail && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8 flex flex-col md:flex-row">
                <div className="bg-emerald-50 p-8 flex flex-col items-center justify-center min-w-[250px] border-r border-emerald-100/50">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-4xl">
                    🏪
                  </div>
                  <h2 className="text-xl font-black text-gray-900 text-center">{partnerDetail.name}</h2>
                  <span className="mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    사업자번호: {partnerDetail.bizNum}
                  </span>
                </div>
                
                <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">대표자명</p>
                    <p className="text-base font-semibold text-gray-800">{partnerDetail.ceo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">연락처</p>
                    <p className="text-base font-semibold text-gray-800">{partnerDetail.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">이메일</p>
                    <p className="text-base font-semibold text-gray-800">{partnerDetail.email}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">사업장 주소</p>
                    <p className="text-base font-semibold text-gray-800">{partnerDetail.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 📦 품목 관리 리스트 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <button className="px-6 py-2.5 text-sm font-bold bg-gray-50 text-gray-700 rounded-lg border border-gray-200">
                    전체 품목 <span className="ml-1 px-2 py-0.5 bg-white text-emerald-600 rounded-full text-xs shadow-sm">{items.length}</span>
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="품목명 검색" 
                    className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 transition-all"
                  />
                  <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                </div>
              </div>

              <div className="overflow-x-auto min-h-[300px]">
                {items.length > 0 ? (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">품목명</th>
                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">카테고리</th>
                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">규격/단위</th>
                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">단가</th>
                        <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">상태</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors group">
                          <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xl">🍅</span>
                                )}
                              </div>
                              <span className="text-base font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">{item.category}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">{item.unit || '-'}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-emerald-600">{item.price}</td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-2.5 py-1 text-[10px] font-black rounded-md uppercase bg-emerald-100 text-emerald-700">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-32 text-center h-full flex flex-col items-center justify-center">
                    <div className="text-6xl mb-6 opacity-50">📦</div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">등록된 품목이 없습니다</h3>
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
          </>
        )}
      </main>
    </div>
  );
}

export default AccountManagementPage;