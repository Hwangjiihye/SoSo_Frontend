import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroupBuy } from './hooks/useGroupBuy';

/**
 * @file GroupBuyDetailPage.jsx
 * @description 사업자용 그룹 참여 상세 페이지
 * 요구사항: 
 * 1. 공동구매 목록에서 '그룹참여' 버튼 클릭 시 전환
 * 2. 채팅보기 버튼 삭제
 */
const GroupBuyDetailPage = () => {
  const { seq } = useParams();
  const navigate = useNavigate();
  const { handleJoinGroupBuy } = useGroupBuy();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 연동 시 상세 조회 API 호출
    const fetchDetail = async () => {
      // Mock 데이터
      setTimeout(() => {
        setItem({
          seq: seq,
          title: '한우 등심 (1+ 등급, 10kg)',
          category: '육류',
          supplier_name: '상생 농장',
          current_participants: 15,
          target_participants: 20,
          total_amount: 7600000,
          price: 380000,
          deadline: '2024-06-30',
          d_day: 'D-12',
          delivery_note: '매장 정문 앞 무인 택배함에 보관 예정입니다.',
        });
        setIsLoading(false);
      }, 500);
    };
    fetchDetail();
  }, [seq]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-black text-gray-400">LOADING...</div>;

  const progress = Math.min(Math.round((item.current_participants / item.target_participants) * 100), 100);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-gray-900">
      <main className="max-w-2xl mx-auto px-6 py-12">
        <button onClick={() => navigate(-1)} className="mb-8 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="bg-white rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
          <div className="p-12 space-y-10">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-[10px] font-black">{item.d_day}</span>
              </div>
              <h2 className="text-3xl font-black mb-2">{item.title}</h2>
              <p className="text-gray-400 font-bold">{item.supplier_name}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Recruitment Progress</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">{item.current_participants}</span>
                  <span className="text-sm font-bold text-gray-300"> / {item.target_participants}명</span>
                </div>
              </div>
              <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-8 border-y border-dashed border-gray-100">
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase mb-1">참여 비용</p>
                <p className="text-2xl font-black">₩{item.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase mb-1">마감 일자</p>
                <p className="text-lg font-black">{item.deadline}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                배송 유의사항
              </h3>
              <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                <p className="text-sm font-bold text-gray-600 leading-relaxed">{item.delivery_note}</p>
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => {
                  handleJoinGroupBuy(item.seq);
                  navigate('/group-buy');
                }}
                className="w-full py-6 bg-emerald-600 text-white rounded-[28px] font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95 hover:-translate-y-1"
              >
                공동구매 참여하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupBuyDetailPage;
