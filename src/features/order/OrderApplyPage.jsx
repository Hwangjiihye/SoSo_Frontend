import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';
import authStore from '../../store/authStore';
import { useOrderApply } from './hooks/useOrderApply';
import {check} from '../../apis/orderApi';

/**
 * @file OrderApplyPage.jsx
 * @description 발주 신청 페이지 UI입니다.
 * 발주서 작성, 품목 목록, 결제 및 배송 조건을 입력할 수 있습니다.
 */
function OrderApplyPage() {
  const navigate = useNavigate();
  const logout = authStore((state) => state.logout);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  const [recommendedStocks, setRecommendedStocks] = useState([]);
  const [recommendList, setRecommendList] = useState([]);
  const [selectedSupplierItem, setSelectedSupplierItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const {
    orderInfo,
    items,
    totalSummary,
    supplierItems,
    supplierNames,
    filteredSupplierItems,
    handleInfoChange,
    handleItemChange,
    addItem,
    addSelectedItem,
    removeItem,
    handleSubmit,
  } = useOrderApply();

  const handleLogOut = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // 재고랑 발주랑 맞는지 확인 후 선택
  const handleSelectSupplierItem = async (item) => {
  console.log('선택한 품목:', item);
  
  try {
    const result = await check(item.itemName);

    console.log('재고 추천 응답:', result);

    // 예: 추천 결과 state에 저장
    setRecommendedStocks(result);

    // 기존 발주 품목 목록에 추가
    addSelectedItem(item);

    // 어떤 거래처 품목을 눌렀는지 저장
    setSelectedSupplierItem(item);

    // 모달 Open은 데이터 저장 후에
    setOpenModal(true);

  } catch (error) {
    console.error('재고 추천 조회 실패:', error);
    alert('재고 추천 조회에 실패했습니다.');
  }
};

// 모달 Close
const handleCloseModal = () => {
  setOpenModal(false);
}

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans">
      {/* Header */}
      <header className="grid grid-cols-3 items-center py-4 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="SoSo Logo" className="w-10 h-10 object-contain" />
          <div className="text-[32px] font-black text-[#1d9e75] tracking-tighter leading-none">SoSo</div>
        </div>
        <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-xl p-1 bg-gray-50 w-fit mx-auto relative">
          <Link to="/" className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">홈</Link>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsOrderDropdownOpen(true)}
            onMouseLeave={() => setIsOrderDropdownOpen(false)}
          >
            <div className={`px-5 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all whitespace-nowrap ${isOrderDropdownOpen ? 'bg-white text-emerald-600 border-gray-100' : 'text-gray-500 hover:text-emerald-600'}`}>
              발주 관리
            </div>
            
            <div className={`absolute top-full left-0 w-48 pt-2 z-[60] transition-all duration-200 ${isOrderDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-2">
                <Link to="/orders" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  일반 발주 현황
                </Link>
                <Link to="/group-orders" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  공동 발주 현황
                </Link>
              </div>
            </div>
          </div>

          <Link to="/orders/new" className="px-5 py-2 text-sm font-bold text-emerald-600 bg-white rounded-lg shadow-sm border border-gray-100 whitespace-nowrap cursor-pointer">
            발주 신청
          </Link>
        </nav>
        <div className="flex items-center justify-end gap-5">
          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white hover:border-emerald-200 cursor-pointer transition-all"
            >
              <div className="w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">김</div>
              <span className="text-sm font-bold text-gray-700">김민준</span>
            </div>
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-[60]">
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">마이페이지</button>
                <button onClick={handleLogOut} className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">로그아웃</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">신규 발주 신청</h2>
            <p className="text-gray-500 font-semibold">정확한 정보를 입력하여 발주서를 작성해주세요.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              취소
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              발주 신청하기
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* 섹션 1: 발주 기본 정보 */}
            <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                발주 기본 정보
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-black text-gray-600 mb-2 uppercase tracking-tighter">발주 날짜</label>
                  <input 
                    type="date" 
                    value={orderInfo.orderDate}
                    onChange={(e) => handleInfoChange('orderDate', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-black text-gray-600 mb-2 uppercase tracking-tighter">공급업체</label>
                  <select 
                    value={orderInfo.supplier}
                    onChange={(e) => handleInfoChange('supplier', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  >
                    <option value="">공급업체 선택</option>
                      {supplierNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-black text-gray-600 mb-2 uppercase tracking-tighter">발주 담당자</label>
                  <input 
                    type="text" 
                    value={orderInfo.manager}
                    readOnly
                    className="w-full bg-gray-100 border-none rounded-2xl py-4 px-4 text-sm font-bold text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            {/* 신규 섹션: 공급업체 등록 물품 (공급업체 선택 시 표시) */}
            {orderInfo.supplier && (
              <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-top-4">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                    {orderInfo.supplier} 등록 물품
                    <span className="text-[14px] font-medium text-gray-500 ml-2">업체에서 공급하는 품목 리스트입니다.</span>
                  </h3>
                </div>
                <div className="max-h-[500px] overflow-x-auto custom-scrollbar">
                  <table className="w-auto min-w-[780px] text-left border-collapse">
                    <thead className="bg-gray-100/100 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-4 text-[14px] font-black text-gray-600 uppercase tracking-wide text-center align-middle border-b border-gray-50">이미지</th>
                        <th className="px-3 py-4 text-[14px] font-black text-gray-600 uppercase tracking-wide text-center align-middle whitespace-nowrap border-b border-gray-50">품목코드</th>
                        <th className="px-6 py-4 text-[14px] font-black text-gray-600 uppercase tracking-wide text-center align-middle whitespace-nowrap border-b border-gray-50">품목명</th>
                        <th className="px-3 py-4 text-[14px] font-black text-gray-600 uppercase tracking-wide text-center align-middle whitespace-nowrap border-b border-gray-50">카테고리</th>
                        <th className="w-[120px] px-2 py-4 text-[14px] font-black text-gray-600 uppercase tracking-wide text-center align-middle whitespace-nowrap border-b border-gray-50">규격</th>
                        <th className="w-[100px] px-2 py-4 text-[14px] font-black text-gray-600 uppercase tracking-wide text-center align-middle whitespace-nowrap border-b border-gray-50">판매단가</th>
                        <th className="px-4 py-4 text-[14px] font-black text-gray-600 uppercase tracking-wide text-center align-middle border-b border-gray-50"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                       {filteredSupplierItems.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-3 py-10 text-center text-sm font-bold text-gray-400">
                            표시할 거래처 품목이 없습니다.
                          </td>
                        </tr>
                      ) : (filteredSupplierItems.map((item) => (
                        <tr key={item.itemSeq} className="group hover:bg-emerald-50/40 transition-all cursor-default">
                          <td className="px-3 py-4 text-center align-middle">
                            이미지{/* <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover mx-auto border border-gray-100 bg-white shadow-sm group-hover:border-emerald-200 transition-all" /> */}
                          </td>
                          <td className="px-3 py-4 text-center align-middle text-sm font-bold text-gray-500 font-mono truncate whitespace-nowrap">{item.itemCode}</td>
                          <td className="px-3 py-4 text-center align-middle text-sm font-black text-gray-800 truncate whitespace-nowrap">{item.itemName}</td>
                          <td className="px-3 py-4 text-center align-middle whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-[12px] font-black rounded-md uppercase">{item.categoryName}</span>
                          </td>
                          <td className="w-[120px] px-2 py-4 text-center align-middle text-sm font-bold text-gray-400 whitespace-nowrap">{item.spec}</td>
                          <td className="w-[100px] px-2 py-4 text-center align-middle text-sm font-black text-emerald-600 whitespace-nowrap">₩{(item.unitPrice ?? 0).toLocaleString()}</td>
                          <td className="px-3 py-4 text-center align-middle">
                            <button onClick={() => handleSelectSupplierItem(item)} className="px-3 py-2 bg-emerald-50 text-emerald-600 text-[12px] font-black rounded-lg hover:bg-emerald-600 hover:text-white transition-all active:scale-95 border border-emerald-100/50 whitespace-nowrap">선택</button>
                          </td>
                        </tr>
                      ))
                    )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 섹션 2: 발주 품목 목록 */}
            <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                  발주 품목 목록
                </h3>
              </div>

              {!orderInfo.supplier ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 px-10 text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <h4 className="text-2xl font-black text-gray-400 mb-2">공급 업체를 선택해주세요</h4>
                  <p className="text-gray-300 font-bold max-w-xs">상단의 공급업체를 먼저 선택하시면 해당 업체에서 취급하는 물품 리스트가 나타납니다.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full table-fixed text-left border-collapse">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="align-middle px-7 py-4 text-[12px] font-black text-gray-600 uppercase tracking-widest w-[7%] text-center">No.</th>
                          <th className="align-middle px-14 py-4 text-[12px] font-black text-gray-600 uppercase tracking-widest w-[21%] text-center">품목명</th>
                          <th className="align-middle px-7 py-4 text-[12px] font-black text-gray-600 uppercase tracking-widest w-[17%] text-center">카테고리</th>
                          <th className="align-middle px-4 py-4 text-[12px] font-black text-gray-600 uppercase tracking-widest w-[10%] text-center">수량</th>
                          <th className="align-middle px-6 py-4 text-[12px] font-black text-gray-600 uppercase tracking-widest w-[10%] text-center">규격</th>
                          <th className="align-middle px-4 py-4 text-[12px] font-black text-gray-600 uppercase tracking-widest w-[15%] text-center">단가(원)</th>
                          <th className="align-middle px-4 py-4 text-[12px] font-black text-gray-600 uppercase tracking-widest w-[15%] text-center">합계</th>
                          <th className="align-middle px-1 py-4 text-[12px] font-black text-gray-600 uppercase tracking-widest w-[5%] text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {items.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="align-middle px-9 py-4 text-center font-bold text-gray-400 text-sm">{index + 1}</td>
                            <td className="align-middle px-6 py-4">
                              <input type="text" placeholder="품목명" value={item.name} readOnly className="w-[120px] bg-gray-50 border border-gray-100 rounded-lg py-2 px-3 text-sm font-bold text-gray-500 cursor-not-allowed outline-none transition-all text-center" />
                            </td>
                            <td className="align-middle px-2 py-4">
                              <select value={item.categoryName || ''} readOnly className="w-[115px] bg-gray-50 border border-gray-100 rounded-lg py-2 px-3 text-sm font-bold text-gray-500 cursor-not-allowed appearance-none text-center">
                                   <option value={item.categoryName || ''}>
                                      {item.categoryName || '미분류'}
                                   </option>
                              </select>
                            </td>
                            <td className="align-middle px-4 py-4 text-center">
                              <input type="number" readOnly value={item.quantity === 0 ? '' : item.quantity} className="w-full max-w-[60px] bg-gray-50 border border-gray-100 rounded-lg py-2 px-2 text-sm font-bold text-gray-500 text-center cursor-not-allowed outline-none transition-all mx-auto" />
                            </td>
                            <td className="align-middle px-2 py-4 text-center">
                              <select value={item.spec} readOnly className="w-[70px] bg-gray-50 border border-gray-100 rounded-lg py-2 px-3 text-sm font-bold text-gray-500 cursor-not-allowed appearance-none text-center">
                                <option value={item.spec || ''}>
                                      {item.spec || '미분류'}
                                   </option>
                              </select>
                            </td>
                            <td className="align-middle px-4 py-4 text-center">
                              <input type="text" value={item.price === 0 ? '' : `₩${item.price.toLocaleString()}`} readOnly className="w-[90px] max-w-[120px] bg-gray-50 border border-gray-100 rounded-lg py-2 px-3 text-sm font-bold text-gray-500 text-center cursor-not-allowed outline-none transition-all ml-auto" />
                            </td>
                            <td className="align-middle px-4 py-4 text-center">
                              <div className="text-sm font-black text-gray-900 pr-2">₩{item.total.toLocaleString()}</div>
                            </td>
                            <td className="align-middle px-1 py-4 text-center">
                              <button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="삭제">✕</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-8 bg-gray-50/30 flex justify-end gap-10 border-t border-gray-50">
                    <div className="text-right">
                      <div className="text-[14px] font-black text-gray-500 uppercase mb-1">총 공급가액</div>
                      <div className="text-lg font-bold text-gray-700">₩{totalSummary.supplyValue.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-black text-gray-500 uppercase mb-1">총 부가세</div>
                      <div className="text-lg font-bold text-gray-700">₩{totalSummary.tax.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-black text-emerald-500 uppercase mb-1 tracking-widest">최종 합계 금액</div>
                      <div className="text-3xl font-black text-emerald-600">₩{totalSummary.total.toLocaleString()}</div>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
          
          {/* 발주 추천 ui */}
          {openModal && selectedSupplierItem && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                내 재고 추천
              </h3>

              <p className="text-base text-gray-500 font-semibold mb-5">
                선택한 거래처 품목: 
                <span className="text-emerald-600 font-black ml-2">
                  {selectedSupplierItem?.itemName}
                </span>
              </p>

              

              {recommendedStocks.length === 0 ? (
                <>
                <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center">
                  <p className="text-[15px] font-bold text-gray-600 mb-4">
                    내 재고 목록에서 비슷한 품목을 찾지 못했습니다.
                  </p>
                </div>
                <div className="flex justify-center mt-5">
                <button
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 bg-gray-200 text-gray-600 text-xs font-black rounded-xl hover:bg-gray-300 transition-all active:scale-95"
                  >
                    닫기
                  </button>
                </div>
                </>
              ) : (
                <div className="space-y-3">
                  {recommendedStocks.map((stock) => (
                    <div
                      key={stock.stockSeq}
                      className="border border-emerald-100 bg-emerald-50/40 rounded-2xl p-5 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-base font-black text-gray-800">
                          {stock.stock}
                        </p>
                        <p className="text-xs font-bold text-gray-500 mt-1">
                          현재 수량: {stock.quantity} / 안전재고: {stock.safety_stock}
                        </p>
                      </div>

            <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-all" onClick={handleCloseModal}>
              이 재고로 연결
            </button>
          </div>
        ))}
      </div>
    )}
  </section>
  </div>
)}







          {/* Right Column: 결제 및 배송 조건 */}
          <div className="space-y-8">
            <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm h-fit">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                결제 및 배송 조건
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-gray-600 mb-2 uppercase tracking-tighter">결제 방식</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['계좌이체'].map((method) => (
                      <button
                        key={method}
                        onClick={() => handleInfoChange('paymentMethod', method)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                          orderInfo.paymentMethod === method
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100'
                          : 'bg-white text-gray-500 border-gray-100 hover:border-emerald-200'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-600 mb-2 uppercase tracking-tighter">배송지 정보</label>
                  <textarea 
                    value={orderInfo.deliveryAddress}
                    readOnly
                    rows="3"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold text-gray-500 cursor-not-allowed outline-none resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-600 mb-2 uppercase tracking-tighter">배송 요청 사항</label>
                  <textarea 
                    value={orderInfo.deliveryNotes}
                    onChange={(e) => handleInfoChange('deliveryNotes', e.target.value)}
                    placeholder="예: 부재 시 문 앞에 놓아주세요."
                    rows="3"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50">
                <div className="bg-emerald-50 rounded-2xl p-6">
                  <div className="text-[11px] font-black text-emerald-600 uppercase mb-2 tracking-widest">예상 결제 총액</div>
                  <div className="text-2xl font-black text-emerald-700">₩{totalSummary.total.toLocaleString()}</div>
                  <p className="text-[10px] text-emerald-500 mt-2 font-medium">* 부가세 포함 금액입니다.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}

export default OrderApplyPage;
