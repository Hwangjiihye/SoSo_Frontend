import React from 'react';

/**
 * @file StockAutoRules.jsx
 * @description 자동 재고 관리 규칙 설정 섹션 (stock2.png 기반)
 */
const StockAutoRules = ({ rules, onToggle }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">자동 관리 설정</h3>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">변동 발생 시 자동 적용</span>
      </div>

      <div className="space-y-4 flex-1">
        {rules.map((rule) => (
          <div 
            key={rule.id}
            className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between gap-4 ${
              rule.enabled ? 'border-emerald-100 bg-emerald-50/20' : 'border-gray-50 bg-gray-50/30'
            }`}
          >
            <div className="flex-1">
              <h4 className={`text-[15px] font-black mb-1 transition-colors ${rule.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                {rule.title}
              </h4>
              <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                {rule.description}
              </p>
            </div>
            
            {/* 토글 스위치 커스텀 */}
            <button
              onClick={() => onToggle(rule.id)}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                rule.enabled ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  rule.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockAutoRules;
