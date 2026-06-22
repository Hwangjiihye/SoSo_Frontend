import maxios from './axiosConfig.js';

// 발주 신청시, 내 재고 품목과 거래처 품목 대조
export const check = async (itemName) => {
    const resp = await maxios.get('/order/check', {
        params: {itemName}});
    return resp.data;
}

// 발주 신청시, 거래처 품목 리스트 확인
export const items = async (itemName) => {
    const resp = await maxios.get('/order/items', {
        params: {itemName}});
    return resp.data;
}

// 발주 신청 폼에 사업자 정보 불러오기
export const identityCheck = async () => {
    const resp = await maxios.get('/order/identity');
    return resp.data;
}

// 발주서 작성
export const orderForm = async (orderData) => {
    const resp = await maxios.post('/order/form', orderData);
    return resp.data;
}

// 발주서 목록으로 출력
export const orderList = async (keyword = '') => {
    const resp = await maxios.get('/order/list', {
        params : {
            keyword : keyword
        }
    });
    return resp.data;
}

// 발주서 상세 조회
export const getOrderDetail = async (orderSeq) => {
    const resp = await maxios.get(`/order/list/${orderSeq}`);
    return resp.data;
}

// 웹소켓 사용자 확인
export const webSocketMe = async () => {
    const resp = await maxios.get('/order/me');
    return resp.data;
}

/**
 * [거래처 전용] 본인에게 들어온 발주 목록 조회 (검색 및 필터 포함)
 */
export const fetchPartnerOrders = async (sellerSeq, keyword = '', status = '') => {
    const resp = await maxios.get('/api/partner/orders', {
        params: { 
            sellerSeq,
            keyword,
            status
        }
    });
    return resp.data;
}

/**
 * [거래처 전용] 특정 발주의 상세 품목 리스트 조회
 */
export const fetchPartnerOrderDetail = async (orderSeq) => {
    const resp = await maxios.get(`/api/partner/orders/${orderSeq}`);
    return resp.data;
}

/**
 * [거래처 전용] 발주 상태 업데이트 (실시간 웹소켓 알림 포함)
 */
export const updatePartnerOrderStatus = async (orderSeq, status) => {
    const resp = await maxios.put(`/api/partner/orders/${orderSeq}/status`, status, {
        headers: { 'Content-Type': 'text/plain' }
    });
    return resp.data;
}

/**
 * [거래처 전용] 대시보드 지표 및 그래프 정보 조회 (실제 DB 기반)
 */
export const fetchPartnerDashboard = async (sellerSeq) => {
    const resp = await maxios.get('/api/partner/orders/dashboard', {
        params: { sellerSeq }
    });
    return resp.data;
}

