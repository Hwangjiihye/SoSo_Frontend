
import { create } from 'zustand';

// 1. return 값이 jsx인 함수는 use를 붙이지 않는다.
// 2. jsx를 return 하지 않으면서 내부적으로 useState, useEffect 같은 (내장 hook함수-use가 붙어있는 기능들)
// 코드를 사용한다면 마찬가지로 use를 붙여준다.


// 로그인, 로그아웃 기능
const authStore = create(set => ({
    token: sessionStorage.getItem("token") || null, // store에서 token값을 가져온다.
    loginId: sessionStorage.getItem("loginId") || null,
    user_type: sessionStorage.getItem("user_type") || null,

    login:(result) => {
    sessionStorage.setItem("token", result.token);
    sessionStorage.setItem("loginId", result.id);
    sessionStorage.setItem("user_type", result.user_type);

    set({
        token: result.token,
        loginId: result.id,
        user_type: result.user_type,
    });
    },
    logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("loginId");
    sessionStorage.removeItem("user_type");

    set({
        token: null,
        loginId: null,
        user_type: null,
    });
    }
}));

export default authStore;