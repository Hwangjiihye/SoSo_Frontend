import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAccounts, registerPartnerAccount } from '../../../apis/accountApi';
import authStore from '../../../store/authStore';

/**
 * @file useAccountRegistration.js
 * @description 거래처 등록 페이지의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useAccountRegistration = () => {
  const navigate = useNavigate();
  const { user_seq, selectedStoreSeq } = authStore();

  // 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // 검색 수행 여부
  const [isLoading, setIsLoading] = useState(false);

  // 모달 및 등록 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [memo, setMemo] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim().length === 0) {
      alert('검색어를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchAccounts(searchTerm);
      // 백엔드 필드명에 맞춰 매핑 (storeSeq 보존)
      const formattedResults = data.results.map(item => ({
        seq: item.storeSeq,
        name: item.companyName,
        bizNum: item.bizNumber ? item.bizNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') : '',
        ceo: item.ceoName,
        address: `${item.address1} ${item.address2 || ''}`.trim()
      }));
      setSearchResults(formattedResults);
      setHasSearched(true);
    } catch (error) {
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
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

    // business_seq 결정 (selectedStoreSeq가 있으면 그것으로, 없으면 user_seq)
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
    setHasSearched(false);
    setSearchResults([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    hasSearched,
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
