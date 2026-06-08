import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerMultiProfileApi } from '../../../apis/memberApi';

/**
 * @file useBusinessMultiProfile.js
 * @description 다중 매장 등록을 위한 커스텀 훅
 */
export const useBusinessMultiProfile = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bizName: '',
    bizNumber: '',
    address: '',
    detailAddress: '',
    openDate: '',
    exteriorImg: null,
    interiorImg: null,
    exteriorPreview: null,
    interiorPreview: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [`${type}Img`]: file,
          [`${type}Preview`]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (type) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Img`]: null,
      [`${type}Preview`]: null
    }));
  };

  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 이용할 수 없습니다.');
      return;
    }
    
    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData(prev => ({
          ...prev,
          address: data.roadAddress,
        }));
      },
    }).open();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.bizName || !formData.bizNumber || !formData.address || !formData.openDate) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const registerData = {
        bizName: formData.bizName,
        bizNumber: formData.bizNumber,
        address: formData.address,
        detailAddress: formData.detailAddress,
        openDate: formData.openDate,
      };

      const result = await registerMultiProfileApi(
        registerData, 
        formData.exteriorImg, 
        formData.interiorImg
      );
      
      if (result && result.status === 'success') {
        alert('새로운 매장이 성공적으로 등록되었습니다.');
        navigate('/business-mypage');
      } else {
        alert(result?.message || '매장 등록 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('등록 중 오류 발생:', err);
      alert('등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleRemovePhoto,
    handleAddressSearch,
    handleSubmit
  };
};
