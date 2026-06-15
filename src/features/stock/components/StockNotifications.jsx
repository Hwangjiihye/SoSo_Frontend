import React from 'react';

/**
 * @file StockNotifications.jsx
 * @description 재고 변동 알림 섹션 (stock3.png 기반)
 */
const StockNotifications = ({ notifications }) => {
  const unconfirmedCount = 5; // 예시 데이터

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">알림</h3>
        <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[11px] font-black rounded-full border border-rose-100">
          {unconfirmedCount} 미확인
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1 max-h-[480px] scrollbar-hide">
        {notifications.map((note) => (
          <div 
            key={note.id}
            className="p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="flex gap-4">
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${note.dotColor} animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-[14px] font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {note.title}
                  </h4>
                  <span className="text-[11px] font-bold text-gray-300 whitespace-nowrap">
                    {note.time}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                  {note.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-[12px] font-black rounded-2xl transition-all">
        전체 알림 보기
      </button>
    </div>
  );
};

export default StockNotifications;
