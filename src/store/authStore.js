
import { create } from 'zustand';

// 로그인, 로그아웃 기능
const authStore = create(set => ({
    token: sessionStorage.getItem("token") || null,
    loginId: sessionStorage.getItem("loginId") || null,
    user_type: sessionStorage.getItem("user_type") || null,
    // 세션 스토리지에서 객체 형태의 데이터를 가져올 때는 JSON.parse 사용
    member: JSON.parse(sessionStorage.getItem("member")) || null,

    login: (result) => {
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("loginId", result.id);
        sessionStorage.setItem("user_type", result.user_type);
        // 객체 데이터를 세션 스토리지에 저장할 때는 JSON.stringify 사용
        sessionStorage.setItem("member", JSON.stringify(result.member));

        set({
            token: result.token,
            loginId: result.id,
            user_type: result.user_type,
            member: result.member,
        });
    },
    logout: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("loginId");
        sessionStorage.removeItem("user_type");
        sessionStorage.removeItem("member");

        set({
            token: null,
            loginId: null,
            user_type: null,
            member: null,
        });
    }
}));

export default authStore;