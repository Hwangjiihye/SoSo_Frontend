import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withdrawMemberApi } from '../../../apis/memberApi';
import authStore from '../../../store/authStore';

/**
 * @file usePartnerWithdrawal.js
 * @description 회원 탈퇴 로직 처리를 위한 커스텀 훅 (Soft Delete 구현)
 */
export const usePartnerWithdrawal = () => {
  const navigate = useNavigate();
  const logout = authStore((state) => state.logout);
  
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    '서비스 이용이 불편해요',
    '원하는 기능이 없어요',
    '정보 보호를 위해 탈퇴하고 싶어요',
    '거래처 정보가 변경되었어요',
    '기타 (직접 입력)'
  ];

  const handleWithdrawal = async () => {
    if (!isChecked) {
      alert('유의사항 확인 및 탈퇴 동의에 체크해 주세요.');
      return;
    }

    if (!reason) {
      alert('탈퇴 사유를 선택해 주세요!');
      return;
    }

    if (reason === '기타 (직접 입력)' && !customReason.trim()) {
      alert('탈퇴 사유를 직접 입력해 주세요.');
      return;
    }

    const confirmResult = window.confirm('정말로 탈퇴하시겠습니까? 탈퇴 시 SoSo의 모든 서비스 이용이 중단됩니다.');
    
    if (confirmResult) {
      setIsSubmitting(true);
      try {
        const withdrawReason = reason === '기타 (직접 입력)' ? customReason : reason;
        
        // RESTful DELETE 요청 (실제 데이터 삭제가 아닌 status='WITHDRAWN' 및 사유 저장을 서버에서 처리)
        const result = await withdrawMemberApi({ withdrawReason });
        
        if (result.status === 'success' || result) {
          alert('그동안 SoSo를 이용해 주셔서 감사합니다. 회원 탈퇴가 완료되었습니다.');
          
          // 전역 상태 로그아웃 및 메인으로 이동
          logout();
          navigate('/');
        }
      } catch (err) {
        console.error('탈퇴 처리 오류:', err);
        alert(err.response?.data?.message || '탈퇴 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    reason,
    setReason,
    customReason,
    setCustomReason,
    isChecked,
    setIsChecked,
    isSubmitting,
    reasons,
    handleWithdrawal
  };
};
