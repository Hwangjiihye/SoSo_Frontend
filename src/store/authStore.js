import { create } from 'zustand';

// 1. return 값이 jsx인 함수는 use를 붙이지 않는다.
// 2. jsx를 return 하지 않으면서 내부적으로 useState, useEffect 같은 (내장 hook함수-use가 붙어있는 기능들)
// 코드를 사용한다면 마찬가지로 use를 붙여준다.


// 로그인, 로그아웃 기능
const authStore = create(set => ({
    token: sessionStorage.getItem("token") || null, // store에서 token값을 가져온다.
    user_seq: sessionStorage.getItem("user_seq") || null,
    user_type: sessionStorage.getItem("user_type") || null,
    user_nickname: sessionStorage.getItem("user_nickname") || null,
    bizname: sessionStorage.getItem("bizname") || null,

    login:(result) => {
    sessionStorage.setItem("token", result.token);
    sessionStorage.setItem("user_seq", result.user_seq);
    sessionStorage.setItem("user_type", result.user_type);
    sessionStorage.setItem("user_nickname", result.user_nickname);
    sessionStorage.setItem("bizname", result.bizname);

    set({
        token: result.token,
        user_seq: result.user_seq,
        user_type: result.user_type,
        user_nickname: result.user_nickname,
        bizname: result.bizname,
    });
    },
    logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_seq");
    sessionStorage.removeItem("user_type");
    sessionStorage.removeItem("user_nickname");
    sessionStorage.removeItem("bizname");

    set({
        token: null,
        user_seq: null,
        user_type: null,
        user_nickname: null,
        bizname: null,
    });
    }
}));

export default authStore;