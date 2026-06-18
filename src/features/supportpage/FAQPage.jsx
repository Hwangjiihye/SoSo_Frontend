import React, { useState, useEffect } from 'react';
import { getBoardsByType } from '../../apis/boardApi';

/**
 * @file FAQPage.jsx
 * @description 자주 묻는 질문(FAQ) 페이지 컴포넌트입니다.
 * DB의 boards 테이블에서 board_type이 'TIP'인 데이터를 가져와 출력합니다.
 */
function FAQPage() {
  const [openId, setOpenId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getBoardsByType('TIP');
        const formattedFaqs = data.results.map(item => ({
          id: item.boardSeq,
          category: item.csType || '일반', // csType 정보가 있으면 활용, 없으면 '일반'
          q: item.title,
          a: item.content
        }));
        setFaqs(formattedFaqs);
      } catch (error) {
        console.error('FAQ 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-3">자주 묻는 질문</h1>
          <p className="text-gray-500 font-medium">고객님들께서 자주 문의하시는 내용을 모았습니다.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-16 text-center">
                <div className="animate-spin text-4xl mb-4 inline-block text-emerald-500">⏳</div>
                <p className="text-gray-500 font-bold">자주 묻는 질문을 불러오는 중입니다...</p>
              </div>
            ) : faqs.length > 0 ? (
              faqs.map((faq) => (
                <div key={faq.id} className="group">
                  <button 
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors flex justify-between items-center"
                  >
                    <div className="flex gap-4 items-center">
                      <span className="text-xl font-black text-emerald-500">Q.</span>
                      <div>
                        <span className="text-xs font-bold text-gray-400 mb-1 block">
                          [{faq.category === 'PAY' ? '결제' : faq.category === 'SERVICE' ? '서비스' : faq.category === 'ACCOUNT' ? '계정' : faq.category === 'BUG' ? '오류' : faq.category}]
                        </span>
                        <span className="text-lg font-bold text-gray-800">{faq.q}</span>
                      </div>
                    </div>
                    <span className={`text-xl text-gray-400 transition-transform duration-200 ${openId === faq.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 bg-gray-50 ${openId === faq.id ? 'max-h-[500px]' : 'max-h-0'}`}>
                    <div className="p-6 pl-14 flex gap-4 border-t border-gray-100">
                      <span className="text-xl font-black text-gray-300">A.</span>
                      {/* 서버에서 온 컨텐츠에 줄바꿈이 있을 경우를 대비해 whitespace-pre-wrap 적용 */}
                      <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center text-gray-400 font-medium">
                등록된 자주 묻는 질문이 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default FAQPage;