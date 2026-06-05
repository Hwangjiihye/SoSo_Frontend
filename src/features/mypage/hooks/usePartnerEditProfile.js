import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPartnerProfileApi, updatePartnerProfileApi, changePasswordApi } from '../../../apis/memberApi';

/**
 * @file usePartnerEditProfile.js
 * @description 거래처 업체 정보 수정을 위한 커스텀 훅
 */
export const usePartnerEditProfile = () => {
  const navigate = useNavigate();
  
  // 업체 정보 폼 상태
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
    exteriorImg: null, 
    interiorImg: null, 
    exteriorPreview: null,
    interiorPreview: null,
  });

  // 비밀번호 변경 폼 상태
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

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

  // 업체 정보 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
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

  // 업체 정보 저장
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.nickname || !formData.phone || !formData.email) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        nickname: formData.nickname,
        phone: formData.phone,
        email: formData.email,
        zonecode: formData.zonecode,
        address1: formData.address1,
        address2: formData.address2,
      };

      const result = await updatePartnerProfileApi(
        updateData, 
        formData.exteriorImg, 
        formData.interiorImg
      );
      
      if (result && result.status === 'success') {
        alert('업체 정보가 성공적으로 수정되었습니다.');
        navigate('/partner-info');
      } else if (result && (result.status === 'duplNickname' || result.status === 'duplEmail')) {
        alert(result.message);
      } else {
        alert(result?.message || '알 수 없는 응답이 반환되었습니다.');
      }
    } catch (err) {
      console.error('저장 중 오류 발생:', err);
      alert('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 비밀번호 변경 저장
  const handlePasswordSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('비밀번호 정보를 모두 입력해주세요.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return false;
    }

    setIsPasswordSubmitting(true);
    try {
      const result = await changePasswordApi({ currentPassword, newPassword });
      if (result && result.status === 'success') {
        alert(result.message);        
        return true; // 모달 닫기용
      }else if(result && (result.status === 'isNotPw' || result.status === 'difPw' || result.status === 'fail' )){
        alert(result.message);
         setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      alert(err.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return {
    formData,
    passwordForm,
    isLoading,
    isSubmitting,
    isPasswordSubmitting,
    handleChange,
    handlePasswordChange,
    handleFileChange,
    handleRemovePhoto,
    handleAddressSearch,
    handleSubmit,
    handlePasswordSubmit,
    setFormData
  };
};
