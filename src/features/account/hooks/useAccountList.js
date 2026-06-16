import { useState, useEffect } from 'react';
import { getRegisteredAccounts, deletePartnerAccount, getFirstStoreSeq, getAllPartners, registerPartnerAccount } from '../../../apis/accountApi';
import authStore from '../../../store/authStore';

/**
 * @file useAccountList.js
 * @description 거래처 목록 페이지의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useAccountList = () => {
  const { user_seq, selectedStoreSeq } = authStore();
  const [accounts, setAccounts] = useState([]); // 등록된 거래처
  const [unregisteredAccounts, setUnregisteredAccounts] = useState([]); // 미등록 거래처
  const [isLoading, setIsLoading] = useState(true);

  // 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 등록 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [memo, setMemo] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // 검색어 디바운싱 처리 (500ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchAccounts = async () => {
    if (!user_seq && !selectedStoreSeq) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let businessSeq = selectedStoreSeq;

      if (!businessSeq) {
        const firstStoreData = await getFirstStoreSeq(user_seq);
        if (firstStoreData && firstStoreData.storeSeq) {
          businessSeq = firstStoreData.storeSeq;
        } else {
          setAccounts([]);
          setUnregisteredAccounts([]);
          setIsLoading(false);
          return;
        }
      }

      // DB 저장 방식(다음 우편번호 API 기준)에 맞게 시/도 이름 매핑
      const getShortCityName = (city) => {
        const map = {
          "서울특별시": "서울",
          "부산광역시": "부산",
          "대구광역시": "대구",
          "인천광역시": "인천",
          "광주광역시": "광주",
          "대전광역시": "대전",
          "울산광역시": "울산",
          "세종특별자치시": "세종",
          "경기도": "경기",
          "강원특별자치도": "강원",
          "충청북도": "충북",
          "충청남도": "충남",
          "전북특별자치도": "전북",
          "전라남도": "전남",
          "경상북도": "경북",
          "경상남도": "경남",
          "제주특별자치도": "제주",
        };
        return map[city] || city;
      };

      const params = {
        searchTerm: debouncedSearchTerm,
        city: getShortCityName(selectedCity),
        district: selectedDistrict
      };

      // 1. 등록된 거래처 목록 가져오기 (서버 사이드 필터링)
      const data = await getRegisteredAccounts(parseInt(businessSeq), params);
      const formattedAccounts = data.results.map(item => ({
        id: item.relationSeq,
        partnerSeq: item.partnerSeq,
        name: item.companyName,
        ceo: item.ceoName,
        tel: '-', 
        bizNum: item.bizNumber ? item.bizNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') : '',
        address: `${item.address1} ${item.address2 || ''}`.trim(),
        status: '거래중', 
        memo: item.memo,
        createdAt: item.createdAt
      }));
      setAccounts(formattedAccounts);

      // 2. 전체 파트너사 목록 가져오기 (서버 사이드 필터링)
      const allData = await getAllPartners(params);
      const allPartners = allData.results.map(item => ({
        partnerSeq: item.storeSeq,
        name: item.companyName,
        ceo: item.ceoName,
        bizNum: item.bizNumber ? item.bizNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') : '',
        address: `${item.address1} ${item.address2 || ''}`.trim()
      }));

      // 3. 미등록 거래처 계산 (전체 - 등록된)
      const registeredPartnerSeqs = new Set(formattedAccounts.map(acc => acc.partnerSeq));
      const unregistered = allPartners.filter(partner => !registeredPartnerSeqs.has(partner.partnerSeq));
      setUnregisteredAccounts(unregistered);

    } catch (error) {
      console.error('거래처 목록 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터가 변경될 때마다 fetchAccounts 호출
  useEffect(() => {
    fetchAccounts();
  }, [user_seq, selectedStoreSeq, debouncedSearchTerm, selectedCity, selectedDistrict]);

  const handleDeleteAccount = async (relationSeq, companyName) => {
    const confirmMessage = `[${companyName}] 거래처를 정말 삭제하시겠습니까?\n삭제 후에는 해당 거래처와의 연결이 즉시 해제됩니다.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const result = await deletePartnerAccount(relationSeq);
        if (result.status === 'success') {
          alert('거래처가 성공적으로 삭제되었습니다.');
          fetchAccounts(); // 목록 갱신
        } else {
          alert(result.message || '삭제에 실패했습니다.');
        }
      } catch (error) {
        alert('거래처 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleOpenModal = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
    setMemo('');
  };

  const handleConfirmRegistration = async () => {
    if (!selectedPartner) return;

    let businessSeq = selectedStoreSeq;
    if (!businessSeq) {
      const firstStoreData = await getFirstStoreSeq(user_seq);
      if (firstStoreData && firstStoreData.storeSeq) {
        businessSeq = firstStoreData.storeSeq;
      }
    }

    if (!businessSeq) {
      alert('로그인 정보가 유효하지 않습니다.');
      return;
    }

    setIsRegistering(true);
    try {
      const result = await registerPartnerAccount({
        businessSeq: parseInt(businessSeq),
        partnerSeq: selectedPartner.partnerSeq,
        memo: memo
      });

      if (result.status === 'success') {
        alert(result.message);
        handleCloseModal();
        fetchAccounts(); // 등록 후 목록 갱신
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setIsRegistering(false);
    }
  };

  return { 
    accounts, 
    unregisteredAccounts, 
    isLoading, 
    searchTerm,
    setSearchTerm,
    selectedCity,
    setSelectedCity,
    selectedDistrict,
    setSelectedDistrict,
    handleDeleteAccount,
    isModalOpen,
    selectedPartner,
    memo,
    setMemo,
    isRegistering,
    handleOpenModal,
    handleCloseModal,
    handleConfirmRegistration
  };
};
