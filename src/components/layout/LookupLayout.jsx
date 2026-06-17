import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

/**
 * @file LookupLayout.jsx
 * @description 조회/기록 센터 전용 사이드바 레이아웃
 */
const LookupLayout = () => {
  const location = useLocation();

  const menuItems = [
    { name: '조회 센터 홈', path: '/lookup', icon: '🏠' },
    { name: '재고 변동 이력', path: '/lookup/stock', icon: '📦' },
    { name: '발주 이력 조회', path: '/lookup/orders', icon: '📄' },
    { name: '공동구매 이력', path: '/lookup/group-orders', icon: '🤝' },
    { name: '영업 일지 기록', path: '/lookup/business-logs', icon: '📝' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-20 h-[calc(100vh-5rem)]">
        <div className="p-8">
          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Archive</div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">조회/기록 센터</h2>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/lookup'}
              className={({ isActive }) => `
                flex items-center gap-3 px-6 py-4 rounded-2xl text-[14px] font-bold transition-all
                ${isActive 
                  ? 'bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100/50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-8 border-t border-gray-50">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
              모든 활동 기록은 안전하게 보관되며, 최대 5년까지 조회 가능합니다.
            </p>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default LookupLayout;
