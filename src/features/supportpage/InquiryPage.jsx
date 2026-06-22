import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from "../../store/authStore";
import { getMyInquiries, submitInquiry } from "../../apis/boardApi";

/**
 * @file InquiryPage.jsx
 * @description 1:1 문의하기 페이지 컴포넌트입니다.
 * 내 문의 내역을 리스트로 보여주고, 모달창을 통해 새로운 문의를 작성할 수 있습니다.
 */
function InquiryPage() {
  const navigate = useNavigate();
  const { user_seq } = authStore();

  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    csType: '',
    title: '',
    content: ''
  });

  const fetchMyInquiries = async () => {
    if (!user_seq) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getMyInquiries(user_seq);
      const formattedInquiries = data.results.map(item => ({
        id: item.boardSeq,
        csType: item.csType,
        title: item.title,
        content: item.content,
        date: new Date(item.createdAt).toLocaleDateString(),
        status: '답변 대기' // 우선은 기본값으로 표시 (추후 답변 테이블과 연동 시 상태 변경 가능)
      }));
      setInquiries(formattedInquiries);
    } catch (error) {
      console.error('문의 내역 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInquiries();
  }, [user_seq]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    if (!user_seq) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ csType: '', title: '', content: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user_seq) return;

    setIsSubmitting(true);
    try {
      const result = await submitInquiry({
        userSeq: user_seq,
        csType: formData.csType,
        title: formData.title,
        content: formData.content
      });

      if (result.status === 'success') {
        alert('문의가 성공적으로 접수되었습니다. 담당자가 확인 후 안내해 드리겠습니다.');
        handleCloseModal();
        fetchMyInquiries(); // 새 문의 등록 후 리스트 새로고침
      } else {
        alert(result.message || '문의 접수에 실패했습니다.');
      }
    } catch (error) {
      alert('문의 접수 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCsTypeLabel = (type) => {
    switch(type) {
      case 'PAY': return '결제';
      case 'SERVICE': return '서비스';
      case 'ACCOUNT': return '계정';
      case 'BUG': return '오류';
      default: return type || '기타';
    }
  };

  const getCsTypeColor = (type) => {
    switch(type) {
      case 'PAY': return 'bg-blue-50 text-blue-600';
      case 'SERVICE': return 'bg-emerald-50 text-emerald-600';
      case 'ACCOUNT': return 'bg-purple-50 text-purple-600';
      case 'BUG': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // 아코디언 상태 관리용
  const [openId, setOpenId] = useState(null);

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-10 text-center relative">
          <h1 className="text-3xl font-black text-gray-900 mb-3">1:1 문의 내역</h1>
          <p className="text-gray-500 font-medium">고객님께서 남겨주신 문의와 답변을 확인하실 수 있습니다.</p>
        </div>

        {/* 내 문의 리스트 영역 */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <span className="text-sm font-bold text-gray-600">총 <span className="text-emerald-600">{inquiries.length}</span>건의 문의내역</span>
          </div>

          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-16 text-center">
                <div className="animate-spin text-4xl mb-4 inline-block text-emerald-500">⏳</div>
                <p className="text-gray-500 font-bold">문의 내역을 불러오는 중입니다...</p>
              </div>
            ) : inquiries.length > 0 ? (
              inquiries.map((inq) => (
                <div key={inq.id} className="group">
                  <button 
                    onClick={() => setOpenId(openId === inq.id ? null : inq.id)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors flex justify-between items-center"
                  >
                    <div className="flex gap-4 items-center flex-1">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md whitespace-nowrap ${getCsTypeColor(inq.csType)}`}>
                        {getCsTypeLabel(inq.csType)}
                      </span>
                      <div className="flex-1 truncate">
                        <span className="text-lg font-bold text-gray-800">{inq.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-sm text-gray-400 font-medium">{inq.date}</span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-500 uppercase">
                        {inq.status}
                      </span>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 bg-gray-50 ${openId === inq.id ? 'max-h-[500px]' : 'max-h-0'}`}>
                    <div className="p-6 pl-14 border-t border-gray-100">
                      <span className="text-xl font-black text-gray-300 mb-2 block">Q.</span>
                      <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{inq.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-gray-400 font-medium">등록된 문의 내역이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 1:1 문의하기 플로팅 버튼 */}
        <div className="fixed bottom-10 right-10 z-40">
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-full font-black shadow-2xl shadow-emerald-200 hover:-translate-y-1 hover:bg-emerald-700 transition-all text-lg group"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform">💬</span>
            1:1 문의하기
          </button>
        </div>
      </main>

      {/* 📝 문의 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-black text-gray-900">1:1 문의하기</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">서비스 이용에 대해 궁금한 점을 남겨주세요.</p>
              </div>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 text-2xl transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">문의 유형 <span className="text-red-500">*</span></label>
                <select 
                  name="csType"
                  value={formData.csType}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  <option value="">문의 유형을 선택해주세요</option>
                  <option value="PAY">결제 관련 문의</option>
                  <option value="SERVICE">서비스 이용 문의</option>
                  <option value="ACCOUNT">계정 정보 문의</option>
                  <option value="BUG">시스템 오류/버그 신고</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">문의 제목 <span className="text-red-500">*</span></label>
                <input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  type="text" 
                  placeholder="문의하실 내용의 핵심을 간략히 적어주세요" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">문의 내용 <span className="text-red-500">*</span></label>
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="상세한 문의 내용을 적어주시면 더 정확하고 빠른 답변이 가능합니다." 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-[2] py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
                    isSubmitting ? 'bg-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
                  }`}
                >
                  {isSubmitting ? '접수 중...' : '문의 접수하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InquiryPage;