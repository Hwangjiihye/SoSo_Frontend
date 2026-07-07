import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// 1. return 값이 jsx인 함수는 use를 붙이지 않는다.
// 2. jsx를 return 하지 않으면서 내부적으로 useState, useEffect 같은 (내장 hook함수-use가 붙어있는 기능들)
// 코드를 사용한다면 마찬가지로 use를 붙여준다.

const useAuthStore = create(
    persist(
        (set, get) => ({
            // --- 메모리 보관 상태 (보안 민감) ---
            token: null, 
            isAuthLoaded: false, // 앱 진입 시 초기 재발급 완료 여부

            // --- 로컬 스토리지 보관 상태 (UI용 정보) ---
            user_seq: null,
            user_type: null,
            user_nickname: null,
            bizname: null,
            selectedStoreSeq: null,

            // --- 액션(Actions) ---
            setToken: (newToken) => {
                set({ token: newToken });
            },

            login: (result) => {
                set({
                    token: result.token,
                    user_seq: result.user_seq,
                    user_type: result.user_type,
                    user_nickname: result.user_nickname,
                    bizname: result.bizname,
                    selectedStoreSeq: result.selectedStoreSeq
                });
            },

            /**
             * 🔄 매장 전환 함수
             */
            setSelectedStore: (storeSeq, companyName) => {
                set({ 
                    selectedStoreSeq: storeSeq,
                    bizname: companyName
                });
            },

            logout: async () => {
                // 1. 프론트엔드 상태 및 스토리지를 즉각(동기적으로) 초기화
                // axios interceptor 등에서 페이지를 강제 이동(location.href)시킬 경우
                // JS 실행 컨텍스트가 종료되어 finally 블록이 실행되지 않는 문제 방지
                localStorage.removeItem("storeSeq");
                localStorage.removeItem("storeName");
                
                // 완전히 날려버리기 위해 스토리지 직접 삭제 시도
                localStorage.removeItem("soso-auth-storage");
                
                set({
                    token: null,
                    user_seq: null,
                    user_type: null,
                    user_nickname: null,
                    bizname: null,
                    selectedStoreSeq: null,
                });

                // 2. 백엔드 세션 삭제 요청 (실패하더라도 이미 프론트는 로그아웃 상태)
                try {
                    const { logoutApi } = await import('../apis/loginApi');
                    await logoutApi(); 
                } catch (error) {
                    console.error("서버 로그아웃 처리 중 에러 (무시가능):", error);
                }
            },

            /**
             * 🚀 초기 재발급 (Silent Refresh on Load)
             * 앱(App.jsx)이 마운트될 때 한 번 호출하여 쿠키로 AccessToken 재발급 시도
             */
            silentRefresh: async () => {
                try {
                    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:80';
                    const response = await axios.post(
                        `${baseURL}/auth/reissue`,
                        {},
                        { withCredentials: true }
                    );
                    const result = response.data;
                    
                    // 재발급 성공 시 상태 업데이트 
                    // (재발급 API가 token만 준다면 localStorage에서 복구된 user_seq 등을 그대로 유지)
                    set({
                        token: result.token,
                        user_seq: result.user_seq || get().user_seq, 
                        user_type: result.user_type || get().user_type,
                        user_nickname: result.user_nickname || get().user_nickname,
                        isAuthLoaded: true
                    });
                    
                    return true;
                } catch (error) {
                    // 리프레시 토큰이 없거나 만료된 상태면 조용히 넘어감 (비로그인 상태)
                    set({ isAuthLoaded: true, token: null });
                    return false;
                }
            }
        }),
        {
            name: 'soso-auth-storage', // 로컬 스토리지에 저장될 키 이름
            // 💡 partialize: 저장소에 저장할 상태만 필터링
            partialize: (state) => ({
                user_seq: state.user_seq,
                user_type: state.user_type,
                user_nickname: state.user_nickname,
                selectedStoreSeq: state.selectedStoreSeq,
                bizname: state.bizname
            }),
        }
    )
);

export default useAuthStore;