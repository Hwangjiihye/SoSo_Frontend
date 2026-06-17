import { create } from 'zustand';

// 1. return 값이 jsx인 함수는 use를 붙이지 않는다.
// 2. jsx를 return 하지 않으면서 내부적으로 useState, useEffect 같은 (내장 hook함수-use가 붙어있는 기능들)
// 코드를 사용한다면 마찬가지로 use를 붙여준다.


// 로그인, 로그아웃 및 매장 전환 기능 관리
const authStore = create(set => ({
    token: sessionStorage.getItem("token") || null,
    user_seq: sessionStorage.getItem("user_seq") || null,
    user_type: sessionStorage.getItem("user_type") || null,
    user_nickname: sessionStorage.getItem("user_nickname") || null,
    bizname: sessionStorage.getItem("bizname") || null,
    
    // 🏪 [멀티 프로필] 현재 선택된 매장 번호 (기본값 null이면 백엔드에서 첫 번째 매장을 반환함)
    selectedStoreSeq: sessionStorage.getItem("selectedStoreSeq") || null,

    login:(result) => {
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("user_seq", result.user_seq);
        sessionStorage.setItem("user_type", result.user_type);
        sessionStorage.setItem("user_nickname", result.user_nickname);
        sessionStorage.setItem("bizname", result.bizname);
        sessionStorage.setItem("selectedStoreSeq",result.selectedStoreSeq);
        set({
            token: result.token,
            user_seq: result.user_seq,
            user_type: result.user_type,
            user_nickname: result.user_nickname,
            bizname: result.bizname,
            selectedStoreSeq:result.selectedStoreSeq
        });
    },

    /**
     * 🔄 매장 전환 함수
     * 프로필 스위처에서 매장을 클릭하면 이 함수를 호출하여 전역 상태를 업데이트합니다.
     */
    setSelectedStore: (storeSeq, companyName) => {
        if (storeSeq) {
            sessionStorage.setItem("selectedStoreSeq", storeSeq);
            sessionStorage.setItem("bizname", companyName); // 선택된 매장명으로 헤더 표시 변경
        } else {
            sessionStorage.removeItem("selectedStoreSeq");
        }
        
        set({ 
            selectedStoreSeq: storeSeq,
            bizname: companyName
        });
    },

    logout: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user_seq");
        sessionStorage.removeItem("user_type");
        sessionStorage.removeItem("user_nickname");
        sessionStorage.removeItem("bizname");
        sessionStorage.removeItem("selectedStoreSeq");

        set({
            token: null,
            user_seq: null,
            user_type: null,
            user_nickname: null,
            bizname: null,
            selectedStoreSeq: null,
        });
    }
}));

export default authStore;