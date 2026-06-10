import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerMultiProfileApi, checkBusinessApi } from '../../../apis/memberApi';

/**
 * @file useBusinessMultiProfile.js
 * @description 다중 매장 등록을 위한 커스텀 훅입니다.
 * 사업자 번호 인증 기능과 입력 데이터 관리, 서버 전송 로직을 포함합니다.
 */
export const useBusinessMultiProfile = () => {
  const navigate = useNavigate();
  
  // 1. 매장 등록에 필요한 폼 데이터 상태 관리
  // 국세청 API 규격(b_no, start_dt 등)에 맞추어 변수명을 통일했습니다.
  const [formData, setFormData] = useState({
    b_nm: '',         // 상호명
    b_no: '',         // 사업자 등록 번호
    p_nm: '',         // 대표자 성명
    start_dt: '',     // 개업 일자 (YYYY-MM-DD 형식으로 입력받음)
    zipcode: '',
    address1: '',
    address2: '',
    exteriorImg: null,
    interiorImg: null,
    exteriorPreview: null,
    interiorPreview: null,
  });

  // 2. 사업자 번호 인증 여부 상태 (인증이 완료되어야 등록 가능)
  const [isBizVerified, setIsBizVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력 값이 변경될 때 호출되는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 만약 사업자 관련 핵심 정보를 수정하면 다시 인증을 받도록 초기화합니다.
    if (name === 'b_no' || name === 'p_nm' || name === 'start_dt' || name === 'b_nm') {
      setIsBizVerified(false);
    }
  };

  /**
   * ✅ 사업자 번호 진위 확인 함수
   * 입력된 정보를 바탕으로 국세청 데이터와 대조합니다.
   */
  const handleVerifyBusiness = async () => {
    const { b_no, start_dt, b_nm, p_nm } = formData;

    if (!b_no || !start_dt || !b_nm || !p_nm) {
      alert('상호명, 사업자 번호, 대표자명, 오픈일자를 모두 입력한 후 인증해 주세요.');
      return;
    }

    try {
      // 날짜 형식을 YYYYMMDD로 변환 (API 요구사항)
      const formattedDate = start_dt.replace(/-/g, '');
      
      // 서버의 사업자 인증 API를 호출합니다.
      const response = await checkBusinessApi(b_no, formattedDate, p_nm, b_nm);
      
      if (response) {
        setIsBizVerified(true);
        alert('사업자 인증이 완료되었습니다.');
      } else {
        alert('사업자 정보가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('인증 오류:', error);
      const errorStr = error.response?.data;
      if (errorStr === "DUPLICATED_BIZ_NO") {
        alert("이미 등록된 사업자 번호입니다.");
      } else {
        alert(errorStr || "인증 중 오류가 발생했습니다.");
      }
    }
  };

  // 이미지 파일 선택 시 미리보기 생성 및 상태 저장
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

  // 선택한 사진 제거 함수
  const handleRemovePhoto = (type) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Img`]: null,
      [`${type}Preview`]: null
    }));
  };

  /**
   * 🔍 다음 주소 검색 팝업 실행
   */
  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 이용할 수 없습니다.');
      return;
    }
    
    new window.daum.Postcode({
      oncomplete: (data) => {
        // 도로명 주소 또는 지번 주소 선택
        let fullAddress = data.roadAddress || data.jibunAddress;
        
        setFormData(prev => ({
          ...prev,
          zipcode: data.zonecode,
          address1: fullAddress,
        }));
      },
    }).open();
  };

  /**
   * 🚀 최종 폼 제출 (매장 등록)
   */
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // 필수 정보 입력 확인
    if (!formData.b_nm || !formData.b_no || !formData.address1 || !formData.start_dt) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    // 사업자 인증 여부 확인 (중요!)
    if (!isBizVerified) {
      alert('사업자 번호 인증이 필요합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const registerData = {
        b_nm: formData.b_nm,
        b_no: formData.b_no,
        p_nm: formData.p_nm,
        zipcode: formData.zipcode,
        address1: formData.address1,
        address2: formData.address2,
        // 서버로 보낼 때는 YYYYMMDD 형식으로 변환해서 보냅니다.
        start_dt: formData.start_dt.replace(/-/g, ''), 
      };

      // API를 통해 서버로 전송합니다.
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
    isBizVerified,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleRemovePhoto,
    handleAddressSearch,
    handleVerifyBusiness,
    handleSubmit
  };
};
