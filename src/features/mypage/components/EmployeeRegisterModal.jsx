import React, { useState } from 'react';

/**
 * @file EmployeeRegisterModal.jsx
 * @description 신규 직원 등록을 위한 입력 모달 컴포넌트
 */
const EmployeeRegisterModal = ({ isOpen, onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    empName: '',
    phone: '',
    workStartTime: '09:00',
    workEndTime: '18:00'
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 에러 리셋
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // 전화번호 자동 하이픈 포맷팅 헬퍼
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.empName.trim()) newErrors.empName = '직원 이름을 입력해주세요.';
    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요.';
    } else if (!/^010-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 휴대폰 번호 형식을 입력해주세요. (010-XXXX-XXXX)';
    }
    if (!formData.workStartTime) newErrors.workStartTime = '출근 시간을 선택해주세요.';
    if (!formData.workEndTime) newErrors.workEndTime = '퇴근 시간을 선택해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 백엔드 데이터에 전송하기 쉽도록 초(:00)를 덧붙여 전송 가능하게 설정
    const payload = {
      ...formData,
      workStartTime: formData.workStartTime + ':00',
      workEndTime: formData.workEndTime + ':00'
    };

    const success = await onRegister(payload);
    if (success) {
      // 폼 리셋 및 닫기
      setFormData({
        empName: '',
        phone: '',
        workStartTime: '09:00',
        workEndTime: '18:00'
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in border border-gray-100">
        <div className="bg-emerald-500 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">➕ 신규 직원 등록</h3>
          <button onClick={onClose} className="text-white hover:text-emerald-100 text-xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 직원명 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">직원 이름 *</label>
            <input
              type="text"
              name="empName"
              value={formData.empName}
              onChange={handleChange}
              placeholder="예: 홍길동"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.empName ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.empName && <p className="text-[10px] text-red-500 mt-1">{errors.empName}</p>}
          </div>

          {/* 연락처 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">연락처 *</label>
            <input
              type="text"
              name="phone"
              maxLength="13"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="010-XXXX-XXXX"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.phone ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 지정 출근 시각 */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">출근 시간 *</label>
              <input
                type="time"
                name="workStartTime"
                value={formData.workStartTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* 지정 퇴근 시각 */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">퇴근 시간 *</label>
              <input
                type="time"
                name="workEndTime"
                value={formData.workEndTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 cursor-pointer"
            >
              등록 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeRegisterModal;
