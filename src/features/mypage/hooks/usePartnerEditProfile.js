import { useState, useEffect } from 'react';
import { getPartnerProfileApi } from '../../../apis/memberApi';

/**
 * @file usePartnerEditProfile.js
 * @description 거래처 업체 정보 수정을 위한 커스텀 훅
 */
export const usePartnerEditProfile = () => {
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    email: '',
    bizNumber: '',
    companyName: '',
    representativeName: '',
    openingDate: '',
    zonecode: '',
    address1: '',
    address2: '',
    exteriorImg: null, // File object or URL
    interiorImg: null, // File object or URL
    exteriorPreview: null,
    interiorPreview: null,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const result = await getPartnerProfileApi();
        console.log(result)
      const sysNamesArray = result?.storeSysNames ? result.storeSysNames.split(',') : [];
         const storeImg1 = sysNamesArray[0]
    ? `https://storage.googleapis.com/study_jcr/${sysNamesArray[0]}`
    : '/images/default-store.png';
    const storeImg2 = sysNamesArray[1]
    ? `https://storage.googleapis.com/study_jcr/${sysNamesArray[1]}`
    : '/images/default-store.png';
        setFormData(prev => ({
          ...prev,
          nickname: result.nickname,
          phone: result.phone,
          email: result.email,
          bizNumber: result.bizNumber,
          companyName: result.companyName,
          representativeName: result.repName,
          openingDate: result.openingDate,
          zonecode: result.zonecode,
          address1: result.address1,
          address2: result.address2,
          exteriorPreview: storeImg1,
          interiorPreview: storeImg2
        }));
      } catch (err) {
        console.error('초기 데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

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
          zonecode: data.zonecode,
          address1: data.roadAddress,
        }));
      },
    }).open();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      // API 호출 시 FormData 객체 생성하여 파일 전송 가능
      const uploadData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          uploadData.append(key, formData[key]);
        }
      });
      
      console.log('수정 데이터 전송 (FormData 가상 확인):', formData);
      alert('변경 사항이 저장되었습니다.');
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isLoading,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleRemovePhoto,
    handleAddressSearch,
    handleSubmit,
    setFormData
  };
};
