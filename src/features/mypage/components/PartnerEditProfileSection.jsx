import React from 'react';
/**
 * 편집 필드 공통 컴포넌트
 */
export const EditField = ({ label, type = "text", value, onChange, name, disabled, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-400 ml-1">{label}</label>
    <input 
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`h-10 px-4 rounded-xl text-sm border outline-none transition-all ${
        disabled 
        ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' 
        : 'bg-white text-gray-800 border-gray-200 focus:border-emerald-500'
      }`}
    />
  </div>
);

/**
 * 사진 슬롯 컴포넌트
 */
export const PhotoSlot = ({ label, preview, onRemove }) => (
  <div className="w-full aspect-video md:aspect-[4/3] bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center justify-center relative group overflow-hidden shadow-inner">
    <img src={preview} alt={label} className="w-full h-full object-cover" />
    <button 
      onClick={onRemove}
      className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white text-lg hover:bg-black/70 transition-colors z-10"
    >
      ×
    </button>
    <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-2 backdrop-blur-[2px]">
      <p className="text-[11px] text-white font-bold text-center tracking-tight">{label}</p>
    </div>
  </div>
);

/**
 * 사진 추가 버튼 컴포넌트
 */
export const AddPhotoBtn = ({ label, onClick }) => (
  <div 
    onClick={onClick}
    className="w-full aspect-video md:aspect-[4/3] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group"
  >
    <span className="text-3xl text-gray-300 group-hover:text-emerald-500 transition-transform group-hover:scale-110 duration-200">+</span>
    <span className="text-[11px] text-gray-400 font-bold mt-2 group-hover:text-emerald-600 transition-colors">{label} 추가</span>
  </div>
);