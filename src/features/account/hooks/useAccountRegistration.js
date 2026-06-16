import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPartners, registerPartnerAccount } from '../../../apis/accountApi';
import authStore from '../../../store/authStore';

/**
 * @file useAccountRegistration.js
 * @description 거래처 등록 페이지의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useAccountRegistration = () => {
  const navigate = useNavigate();
  const { user_seq, selectedStoreSeq } = authStore();

  // 검색 및 데이터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [allPartners, setAllPartners] = useState([]); // 전체 파트너사 목록
  const [searchResults, setSearchResults] = useState([]); // 화면에 보여줄 필터링된 목록
  const [isLoading, setIsLoading] = useState(true);

  // 모달 및 등록 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [memo, setMemo] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // 컴포넌트 마운트 시 전체 파트너사 목록 로드
  useEffect(() => {
    const fetchAllPartners = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPartners();
        const formattedResults = data.results.map(item => ({
          seq: item.storeSeq,
          name: item.companyName,
          bizNum: item.bizNumber ? item.bizNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') : '',
          ceo: item.ceoName,
          address: `${item.address1} ${item.address2 || ''}`.trim()
        }));
        setAllPartners(formattedResults);
        setSearchResults(formattedResults); // 초기 화면엔 전체 목록 표시
      } catch (error) {
        console.error('전체 거래처 목록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPartners();
  }, []);

  // 검색어 입력에 따른 클라이언트 사이드 필터링
  const handleSearch = () => {
    if (searchTerm.trim().length === 0) {
      setSearchResults(allPartners);
      return;
    }

    const filtered = allPartners.filter(partner => 
      (partner.name && partner.name.includes(searchTerm)) || 
      (partner.bizNum && partner.bizNum.replace(/-/g, '').includes(searchTerm.replace(/-/g, '')))
    );
    setSearchResults(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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

    const businessSeq = selectedStoreSeq || user_seq;

    if (!businessSeq) {
      alert('로그인 정보가 유효하지 않습니다.');
      return;
    }

    setIsRegistering(true);
    try {
      const result = await registerPartnerAccount({
        businessSeq: parseInt(businessSeq),
        partnerSeq: selectedPartner.seq,
        memo: memo
      });

      if (result.status === 'success') {
        alert(result.message);
        navigate('/account/list');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setIsRegistering(false);
      handleCloseModal();
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    setSearchResults(allPartners);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    isModalOpen,
    memo,
    setMemo,
    selectedPartner,
    isRegistering,
    handleSearch,
    handleKeyDown,
    handleOpenModal,
    handleCloseModal,
    handleConfirmRegistration,
    resetSearch
  };
};
