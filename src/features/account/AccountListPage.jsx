import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccountList } from './hooks/useAccountList';

/**
 * @file AccountListPage.jsx
 * @description 거래처 목록 조회 페이지 컴포넌트입니다.
 * 등록된 거래처와 미등록 거래처를 나누어 보여주며, 바로 등록할 수 있는 기능을 제공합니다.
 */
function AccountListPage() {
  const { 
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
  } = useAccountList();

  const [activeTab, setActiveTab] = useState('registered'); // 'registered' | 'unregistered'

  const regionData = {
    "서울특별시": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
    "부산광역시": ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
    "대구광역시": ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구", "군위군"],
    "인천광역시": ["강화군", "계양구", "미추홀구", "남동구", "동구", "부평구", "서구", "연수구", "옹진군", "중구"],
    "광주광역시": ["광산구", "남구", "동구", "북구", "서구"],
    "대전광역시": ["대덕구", "동구", "서구", "유성구", "중구"],
    "울산광역시": ["남구", "동구", "북구", "울주군", "중구"],
    "세종특별자치시": ["세종시"],
    "경기도": ["수원시 장안구", "수원시 권선구", "수원시 팔달구", "수원시 영통구", "성남시 수정구", "성남시 중원구", "성남시 분당구", "의정부시", "안양시 만안구", "안양시 동안구", "부천시", "광명시", "평택시", "동두천시", "안산시 상록구", "안산시 단원구", "고양시 덕양구", "고양시 일산동구", "고양시 일산서구", "과천시", "구리시", "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "용인시 처인구", "용인시 기흥구", "용인시 수지구", "파주시", "이천시", "안성시", "김포시", "화성시", "광주시", "양주시", "포천시", "여주시", "연천군", "가평군", "양평군"],
    "강원특별자치도": ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
    "충청북도": ["청주시 상당구", "청주시 서원구", "청주시 흥덕구", "청주시 청원구", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
    "충청남도": ["천안시 동남구", "천안시 서북구", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],
    "전북특별자치도": ["전주시 완산구", "전주시 덕진구", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
    "전라남도": ["목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
    "경상북도": ["포항시 남구", "포항시 북구", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
    "경상남도": ["창원시 의창구", "창원시 성산구", "창원시 마산합포구", "창원시 마산회원구", "창원시 진해구", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
    "제주특별자치도": ["제주시", "서귀포시"]
  };

  // 서버에서 이미 필터링되어 반환된 목록을 그대로 사용합니다.
  const currentList = activeTab === 'registered' ? accounts : unregisteredAccounts;

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">거래처 목록</h1>
            <p className="text-gray-500 mt-2 font-medium">나의 거래처를 관리하고 새로운 파트너를 발굴하세요.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* 상단 탭 및 검색 바 */}
          <div className="p-6 border-b border-gray-50 flex flex-col xl:flex-row gap-4 items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex gap-2 p-1 bg-gray-50 rounded-xl w-full xl:w-auto overflow-x-auto">
              <button 
                onClick={() => setActiveTab('registered')}
                className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'registered' ? 'bg-white text-emerald-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-emerald-600'}`}
              >
                나의 거래처 <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full text-xs">{accounts.length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('unregistered')}
                className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'unregistered' ? 'bg-white text-emerald-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-emerald-600'}`}
              >
                새로운 거래처 찾기 <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full text-xs">{unregisteredAccounts.length}</span>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
              {/* 지역 필터 */}
              <div className="flex gap-2 w-full sm:w-auto">
                <select 
                  value={selectedCity} 
                  onChange={(e) => { setSelectedCity(e.target.value); setSelectedDistrict(''); }}
                  className="w-full sm:w-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">시/도 전체</option>
                  {Object.keys(regionData).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedDistrict} 
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedCity}
                  className={`w-full sm:w-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all appearance-none ${!selectedCity ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <option value="">시/군/구 전체</option>
                  {selectedCity && regionData[selectedCity].map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* 검색어 */}
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="업체명 또는 대표자명 검색" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 transition-all"
                />
                <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              </div>
            </div>
          </div>

          {/* 목록 테이블 */}
          <div className="overflow-x-auto min-h-[400px]">
            {isLoading ? (
              <div className="p-32 text-center flex flex-col items-center justify-center h-full">
                <div className="animate-spin text-5xl mb-6 text-emerald-500">⏳</div>
                <p className="text-gray-500 font-bold text-lg">거래처 정보를 불러오는 중입니다...</p>
              </div>
            ) : currentList.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">거래처명</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">대표자</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">사업자번호</th>
                    {activeTab === 'registered' && (
                      <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">메모</th>
                    )}
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentList.map((acc, index) => (
                    <tr key={acc.id || index} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="text-base font-bold text-gray-900 mb-1">{acc.name}</div>
                        <div className="text-xs font-medium text-gray-400">{acc.address}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-600">{acc.ceo}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">{acc.bizNum}</td>
                      {activeTab === 'registered' && (
                        <td className="px-6 py-5 text-sm text-gray-500 max-w-[200px] truncate">
                          {acc.memo ? (
                            <span title={acc.memo}>{acc.memo}</span>
                          ) : (
                            <span className="text-gray-300 italic text-xs">메모 없음</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            to={`/account/management?partnerSeq=${acc.partnerSeq}&name=${encodeURIComponent(acc.name)}`}
                            className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 text-xs font-bold rounded-lg transition-colors"
                          >
                            상세
                          </Link>
                          {activeTab === 'registered' ? (
                            <button 
                              onClick={() => handleDeleteAccount(acc.id, acc.name)}
                              className="px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              삭제
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleOpenModal(acc)}
                              className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-lg shadow-md shadow-emerald-100 transition-all"
                            >
                              등록
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-32 text-center h-full flex flex-col items-center justify-center">
                <div className="text-7xl mb-6 opacity-50">📭</div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">
                  {activeTab === 'registered' ? '등록된 거래처가 없습니다' : '새로운 거래처가 없습니다'}
                </h3>
                <p className="text-gray-400 font-medium">
                  {searchTerm ? '검색어에 해당하는 결과가 없습니다.' : '목록을 확인하고 파트너를 관리해 보세요.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 📝 등록 메모 입력 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-black text-gray-900">거래처 등록</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  <span className="text-emerald-600 font-bold">[{selectedPartner?.name}]</span> 업체와 파트너 관계를 맺으시겠습니까?
                </p>
              </div>
            </div>
            
            <div className="p-8 space-y-4">
              <label className="text-sm font-bold text-gray-700 block ml-1">거래처 메모 (선택)</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="예: 신선 채소 전문, 매일 오전 배송 등"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none min-h-[120px]"
              />
              <p className="text-[11px] text-gray-400 leading-relaxed px-1">
                * 등록된 메모는 거래처 목록에서 확인할 수 있으며, 업무 효율을 높이는 데 도움이 됩니다.
              </p>
            </div>

            <div className="p-4 bg-gray-50 flex gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isRegistering}
                className="flex-1 py-4 bg-white border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
              >
                취소
              </button>
              <button
                onClick={handleConfirmRegistration}
                disabled={isRegistering}
                className={`flex-[1.5] py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
                  isRegistering ? 'bg-gray-300' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
                }`}
              >
                {isRegistering ? '등록 중...' : '등록 완료'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountListPage;