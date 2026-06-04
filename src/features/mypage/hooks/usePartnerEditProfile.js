import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPartnerProfileApi, updatePartnerProfileApi } from '../../../apis/memberApi';

/**
 * @file usePartnerEditProfile.js
 * @description 거래처 업체 정보 수정을 위한 커스텀 훅
 */
export const usePartnerEditProfile = () => {
  const navigate = useNavigate();
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
        
        const sysNamesArray = result?.storeSysNames ? result.storeSysNames.split(',') : [];
        const storeImg1 = sysNamesArray[0]
          ? `https://storage.googleapis.com/study_jcr/${sysNamesArray[0]}`
          : null;
        const storeImg2 = sysNamesArray[1]
          ? `https://storage.googleapis.com/study_jcr/${sysNamesArray[1]}`
          : null;

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
    
    // 유효성 검사 (필요 시 추가)
    if (!formData.nickname || !formData.phone || !formData.email) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. 서버로 보낼 순수 데이터 DTO 추출 (이미지 제외)
      const updateData = {
        nickname: formData.nickname,
        phone: formData.phone,
        email: formData.email,
        zonecode: formData.zonecode,
        address1: formData.address1,
        address2: formData.address2,
        // 필요에 따라 추가 필드 포함
      };

      // 2. API 호출
      const result = await updatePartnerProfileApi(
        updateData, 
        formData.exteriorImg, 
        formData.interiorImg
      );
      
      if (result.status === 'success' || result) {
        alert('업체 정보가 성공적으로 수정되었습니다.');
        // 3. 업체 정보 확인 페이지로 이동
        navigate('/partner-info');
      }
    } catch (err) {
      console.error('저장 중 오류 발생:', err);
      alert('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
