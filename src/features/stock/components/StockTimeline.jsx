import React from 'react';

/**
 * @file StockTimeline.jsx
 * @description 재고 변동 사건을 시간순으로 보여주는 피드형 타임라인 섹션
 */
const StockTimeline = ({ timeline }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">재고 타임라인</h3>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Live Feed
        </span>
      </div>

      <div className="relative space-y-6 overflow-y-auto pr-2 max-h-[520px] scrollbar-hide px-1">
        {/* 세로 타임라인 바 */}
        <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-gray-100" />

        {timeline.map((event) => (
          <div 
            key={event.id}
            className="relative pl-10 group cursor-default"
          >
            {/* 타임라인 노드 */}
            <div className={`absolute left-0 top-1.5 w-9 h-9 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-110 flex items-center justify-center text-[10px] ${event.dotColor} text-white font-black`}>
               {event.type === 'CRITICAL' ? '!' : event.type === 'WARNING' ? '?' : 'i'}
            </div>
            
            <div className="bg-gray-50/50 p-5 rounded-[1.5rem] border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-[15px] font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {event.title}
                </h4>
                <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap bg-white px-2 py-1 rounded-lg border border-gray-100">
                  {event.time}
                </span>
              </div>
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                {event.message}
              </p>
              
              {/* 피드 스타일 하단 장식 */}
              <div className="mt-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-100/50" />
                <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest italic">Stock Event</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-4 bg-gray-900 text-white hover:bg-emerald-600 text-[12px] font-black rounded-2xl transition-all shadow-lg shadow-gray-200 hover:shadow-emerald-100 active:scale-95">
        과거 타임라인 더 불러오기
      </button>
    </div>
  );
};

export default StockTimeline;
