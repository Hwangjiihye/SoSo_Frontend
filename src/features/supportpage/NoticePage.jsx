import React, { useState, useEffect } from 'react';
import { getBoardsByType } from '../../apis/boardApi';

/**
 * @file NoticePage.jsx
 * @description 공지사항 페이지 컴포넌트입니다.
 * DB의 boards 테이블에서 board_type이 'NOTICE'인 데이터를 가져와 출력합니다.
 * 클릭 시 아코디언 형태로 내용을 보여줍니다.
 */
function NoticePage() {
  const [openId, setOpenId] = useState(null);
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getBoardsByType('NOTICE');
        const formattedNotices = data.results.map(item => ({
          id: item.boardSeq,
          type: '공지', // 필요시 csType 매핑
          title: item.title,
          content: item.content, // 내용 추가
          date: new Date(item.createdAt).toLocaleDateString(),
          isNew: (new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24) <= 7
        }));
        setNotices(formattedNotices);
      } catch (error) {
        console.error('공지사항 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-3">공지사항</h1>
          <p className="text-gray-500 font-medium">SoSo의 새로운 소식과 유용한 정보를 확인하세요.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-16 text-center">
                <div className="animate-spin text-4xl mb-4 inline-block text-emerald-500">⏳</div>
                <p className="text-gray-500 font-bold">공지사항을 불러오는 중입니다...</p>
              </div>
            ) : notices.length > 0 ? (
              notices.map((notice) => (
                <div key={notice.id} className="group">
                  <button 
                    onClick={() => setOpenId(openId === notice.id ? null : notice.id)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-start"
                  >
                    <div className="w-full flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-600">
                          {notice.type}
                        </span>
                        {notice.isNew && <span className="text-[10px] font-black text-red-500 animate-pulse">N</span>}
                      </div>
                      <span className="text-sm text-gray-400 font-medium">{notice.date}</span>
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">{notice.title}</h2>
                      <span className={`text-xl text-gray-400 transition-transform duration-200 ${openId === notice.id ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 bg-gray-50 ${openId === notice.id ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-8 border-t border-gray-100">
                      <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center text-gray-400 font-medium">
                등록된 공지사항이 없습니다.
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {notices.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
              <nav className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400">{"<"}</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400">{">"}</button>
              </nav>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default NoticePage;