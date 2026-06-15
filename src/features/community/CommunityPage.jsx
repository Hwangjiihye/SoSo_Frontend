import React, { useState } from 'react';

// 더미 데이터
const jobPosts = [
  { id: 5, category: '구인', title: '주방 보조 급구합니다 - 이번 주 금-일 오전', author: '홍길동', date: '05.24', comments: 3, views: 42 },
  { id: 4, category: '구직', title: '홀서빙 경력 3년, 단기 가능합니다', author: '김미래', date: '05.23', comments: 1, views: 28 },
  { id: 3, category: '구인', title: '설거지 · 청소 파트타임 - 주말 한정', author: '이상현', date: '05.22', comments: 5, views: 61 },
  { id: 2, category: '구직', title: '조리사 자격증 보유, 즉시 출근 가능', author: '박준호', date: '05.21', comments: 2, views: 33 },
  { id: 1, category: '구인', title: '카페 바리스타 단기 알바 구합니다', author: '최유나', date: '05.20', comments: 0, views: 19 },
];

const tipPosts = [
  { id: 5, category: 'Tip', title: '식자재 손질 시간 확 줄이는 꿀팁 공유', author: '나초보', date: '05.24', comments: 7, views: 95 },
  { id: 4, category: '질문', title: '소모품 발주 주기 어떻게 잡으시나요?', author: '박사장', date: '05.23', comments: 4, views: 52 },
  { id: 3, category: 'Tip', title: '냉장고 온도 관리로 식재료 낭비 줄이기', author: '김셰프', date: '05.22', comments: 6, views: 80 },
  { id: 2, category: '질문', title: '주말 피크타임 인력 배치 노하우 있으신 분?', author: '이대표', date: '05.21', comments: 3, views: 44 },
  { id: 1, category: 'Tip', title: '원가 절감 - 비수기 메뉴 구성 전략', author: '최원장', date: '05.20', comments: 2, views: 37 },
];

const commentsData = [
  { id: 1, author: '김미래', date: '05.24 14:02', content: '관심 있습니다! 연락처 주시면 바로 연락드릴게요.' },
  { id: 2, author: '이상현', date: '05.24 15:30', content: '저도 가능합니다. 월~수 오전 시간 비어 있어요.' },
  { id: 3, author: '박준호', date: '05.24 16:45', content: '위치가 어디쯤 되나요? 문의드립니다.', isMine: true },
];

function CommunityPage() {
  const [activeTab, setActiveTab] = useState('JOB'); // 'JOB' or 'TIP'
  const [viewState, setViewState] = useState('LIST'); // 'LIST', 'DETAIL', 'WRITE'
  const [selectedPost, setSelectedPost] = useState(null);

  // 카테고리별 색상 매핑
  const getCategoryColor = (category) => {
    switch (category) {
      case '구인': return 'bg-blue-100 text-blue-600 border border-blue-200';
      case '구직': return 'bg-green-100 text-green-600 border border-green-200';
      case 'Tip': return 'bg-amber-100 text-amber-600 border border-amber-200';
      case '질문': return 'bg-red-100 text-red-600 border border-red-200';
      default: return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setViewState('DETAIL');
  };

  // --- 화면 렌더링 함수들 ---

  const renderList = () => {
    const posts = activeTab === 'JOB' ? jobPosts : tipPosts;
    const categoryOptions = activeTab === 'JOB' 
      ? ['전체', '구인', '구직'] 
      : ['전체', 'Tip', '질문'];

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* 검색 및 액션 바 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 w-1/2">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="제목, 내용 검색..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              {categoryOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setViewState('WRITE')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            <span>✏️</span> 글 작성
          </button>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 text-center w-16">번호</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 text-center w-24">구분</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500">제목</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 text-center w-24">작성자</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 text-center w-20">날짜</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 text-center w-16">댓글</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 text-center w-16">조회</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handlePostClick(post)}>
                  <td className="py-4 px-4 text-sm text-gray-500 text-center">{post.id}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-800">{post.title}</td>
                  <td className="py-4 px-4 text-sm text-gray-600 text-center">{post.author}</td>
                  <td className="py-4 px-4 text-sm text-gray-500 text-center">{post.date}</td>
                  <td className="py-4 px-4 text-sm text-gray-500 text-center">{post.comments}</td>
                  <td className="py-4 px-4 text-sm text-gray-500 text-center">{post.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 gap-1">
          <button className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50">«</button>
          <button className="px-3 py-1 text-sm text-white bg-gray-900 rounded">1</button>
          <button className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50">3</button>
          <button className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50">»</button>
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!selectedPost) return null;
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
        {/* 상세 헤더 */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(selectedPost.category)}`}>
              {selectedPost.category}
            </span>
            <h2 className="text-2xl font-black text-gray-900">{selectedPost.title}</h2>
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600">👤</span>
              <span className="font-semibold text-gray-700">{selectedPost.author}</span>
            </div>
            <span>📅 2025.{selectedPost.date}</span>
            <span>👁️ {selectedPost.views}</span>
            <span>💬 {selectedPost.comments}</span>
          </div>
        </div>

        {/* 본문 내용 */}
        <div className="p-8 min-h-[200px] text-gray-700 leading-relaxed text-sm">
          안녕하세요. 이번 주 일요일부터 금요일까지 오전 9시~오후 2시 주방 보조 인력이 필요합니다.<br/><br/>
          경력 무관, 성실하신 분 환영합니다. 관심 있으신 분은 댓글 또는 연락처로 문의 부탁드립니다.<br/><br/>
          📍 위치: 서울 마포구 · 시급: 12,000원
        </div>

        {/* 액션 버튼 */}
        <div className="px-8 pb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors flex items-center gap-1">
              <span>👍</span> 추천
            </button>
            <button className="px-4 py-2 text-sm font-bold text-red-500 bg-white hover:bg-red-50 border border-gray-200 rounded-lg transition-colors">
              삭제
            </button>
          </div>
          <button 
            onClick={() => setViewState('LIST')}
            className="px-4 py-2 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>≣</span> 목록으로
          </button>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-gray-50 p-8 border-t border-gray-200 rounded-b-2xl">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>💬</span> 댓글 {commentsData.length}
          </h3>
          
          <div className="space-y-6 mb-8">
            {commentsData.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${comment.isMine ? 'bg-amber-500' : 'bg-indigo-500'}`}>
                  {comment.author.substring(0, 1)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-gray-800">{comment.author}</span>
                    <span className="text-xs text-gray-400">{comment.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">{comment.content}</p>
                  {comment.isMine && (
                    <div className="flex justify-end gap-2 mt-2">
                      <button className="text-xs text-gray-400 hover:text-gray-600">수정</button>
                      <button className="text-xs text-red-400 hover:text-red-600">삭제</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 댓글 입력 */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0">나</div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="댓글을 입력하세요..." 
                className="w-full pl-4 pr-20 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWrite = () => {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <span>📝</span> 글 작성
          </h2>
          <button 
            onClick={() => setViewState('LIST')}
            className="text-gray-400 hover:text-gray-600 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-bold transition-colors"
          >
            ✕ 취소
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">게시판</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none bg-white">
                <option>{activeTab === 'JOB' ? '인력 수급 게시판' : 'Tip / 질문 게시판'}</option>
                <option>{activeTab === 'JOB' ? 'Tip / 질문 게시판' : '인력 수급 게시판'}</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">구분 선택</label>
              <div className="flex gap-2">
                {activeTab === 'JOB' ? (
                  <>
                    <button className="flex-1 py-3 text-sm font-bold rounded-xl border border-blue-200 bg-blue-50 text-blue-600 transition-colors">구인</button>
                    <button className="flex-1 py-3 text-sm font-bold rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">구직</button>
                  </>
                ) : (
                  <>
                    <button className="flex-1 py-3 text-sm font-bold rounded-xl border border-amber-200 bg-amber-50 text-amber-600 transition-colors">Tip</button>
                    <button className="flex-1 py-3 text-sm font-bold rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">질문</button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">제목 <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="제목을 입력하세요" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">내용 <span className="text-red-500">*</span></label>
            <textarea 
              rows={10}
              placeholder="내용을 입력하세요..." 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">첨부 파일</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="파일을 선택하세요" 
                disabled
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
              />
              <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                <span>📎</span> 파일 선택
              </button>
            </div>
          </div>

          <div className="flex justify-start gap-3 pt-6 border-t border-gray-100">
            <button 
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-colors"
              onClick={() => setViewState('LIST')}
            >
              🚀 등록하기
            </button>
            <button 
              onClick={() => setViewState('LIST')}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              ✕ 취소
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans">
      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* 상단 타이틀 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
              📄
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">게시판</h1>
          </div>
          <p className="text-gray-500 font-medium ml-1">인력 수급 · Tip / 질문 커뮤니티</p>
        </div>

        {/* 메인 탭 */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => { setActiveTab('JOB'); setViewState('LIST'); }}
            className={`flex-1 py-4 text-center rounded-2xl font-black transition-all ${
              activeTab === 'JOB' 
              ? 'bg-white text-gray-900 border-2 border-gray-900 shadow-md' 
              : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">🧑‍🍳</span> 인력 수급 게시판
          </button>
          <button 
            onClick={() => { setActiveTab('TIP'); setViewState('LIST'); }}
            className={`flex-1 py-4 text-center rounded-2xl font-black transition-all ${
              activeTab === 'TIP' 
              ? 'bg-white text-gray-900 border-2 border-gray-900 shadow-md' 
              : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">💡</span> Tip / 질문 게시판
          </button>
        </div>

        {/* 서브 탭 (Breadcrumbs 스타일) */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
          <button 
            onClick={() => setViewState('LIST')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${viewState === 'LIST' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
          >
            목록
          </button>
          <button 
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${viewState === 'DETAIL' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800'} ${!selectedPost && viewState !== 'DETAIL' ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedPost && viewState !== 'DETAIL'}
          >
            상세 보기
          </button>
          <button 
            onClick={() => setViewState('WRITE')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${viewState === 'WRITE' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-gray-500 hover:text-gray-800'}`}
          >
            글 작성 / 수정
          </button>
        </div>

        {/* 현재 상태에 따른 뷰 렌더링 */}
        {viewState === 'LIST' && renderList()}
        {viewState === 'DETAIL' && renderDetail()}
        {viewState === 'WRITE' && renderWrite()}

      </main>
    </div>
  );
}

export default CommunityPage;
