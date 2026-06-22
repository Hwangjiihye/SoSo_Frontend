import maxios from './axiosConfig.js';

/**
 * [소상공인 전용] 메인 대시보드 지표 및 그래프 정보 조회 (실제 DB 기반)
 * @param {number} storeSeq 매장 고유 번호
 * @param {number|string} userSeq 소상공인 유저 고유 번호
 */
export const fetchBusinessDashboard = async (storeSeq, userSeq) => {
    const resp = await maxios.get('/api/business/dashboard', {
        params: { storeSeq, userSeq }
    });
    return resp.data;
};
