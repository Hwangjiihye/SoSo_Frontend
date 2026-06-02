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
    password: '',
    bizNumber: '',
    companyName: '',
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
        // 실제 연동 시: const result = await getPartnerProfileApi();
        
        // Mock 데이터 (HTML 구조에 맞춤)
        const mockData = {
          user: {
            nickname: '신선유통 팀장님',
            phone: '010-1234-5678',
            email: 'dealer1234@naver.com',
          },
          store: {
            biz_number: '000-00-00000',
            company_name: '신선유통(주)',
            zonecode: '12345',
            address1: '서울특별시 강남구 테헤란로 123',
            address2: '4층 402호',
            exterior_img: 'https://via.placeholder.com/120x100?text=Exterior',
            interior_img: 'https://via.placeholder.com/120x100?text=Interior',
          }
        };

        setFormData(prev => ({
          ...prev,
          nickname: mockData.user.nickname,
          phone: mockData.user.phone,
          email: mockData.user.email,
          bizNumber: mockData.store.biz_number,
          companyName: mockData.store.company_name,
          zonecode: mockData.store.zonecode,
          address1: mockData.store.address1,
          address2: mockData.store.address2,
          exteriorPreview: mockData.store.exterior_img,
          interiorPreview: mockData.store.interior_img,
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
