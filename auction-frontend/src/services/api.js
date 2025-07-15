import axios from 'axios';

// ✅ No trailing slash here
const API_BASE_URL = 'https://bidsphere-production.up.railway.app';

const handleError = (error) => {
    if (error.response) {
        throw error.response.data;
    }
    throw new Error('Network error');
};

const getAuthenticatedAxios = () => {
    const userInfo = localStorage.getItem('userInfo');
    const config = {
        baseURL: API_BASE_URL,
        headers: {}
    };

    if (userInfo) {
        const user = JSON.parse(userInfo);
        config.headers['Authorization'] = `Bearer ${user.token}`;
    }

    return axios.create(config);
};

const api = {
    registerUser: (userData) => axios.post(`${API_BASE_URL}/users/register`, userData).catch(handleError),
    loginUser: (credentials) => axios.post(`${API_BASE_URL}/users/login`, credentials).catch(handleError),
    getUserById: (id) => axios.get(`${API_BASE_URL}/users/${id}`).catch(handleError),
    createAuction: (formData) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return axios.post(`${API_BASE_URL}/auctions`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userInfo?.token}`
            }
        }).catch(handleError);
    },
    getAllAuctions: () => axios.get(`${API_BASE_URL}/auctions`).catch(handleError),
    getActiveAuctions: () => axios.get(`${API_BASE_URL}/auctions/active`).catch(handleError),
    getAuctionById: (id) => axios.get(`${API_BASE_URL}/auctions/${id}`).catch(handleError),
    getSellerAuctions: (sellerId) => getAuthenticatedAxios().get(`/auctions/seller/${sellerId}`).catch(handleError),
    updateAuction: (id, auctionData) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return axios.put(`${API_BASE_URL}/auctions/${id}`, auctionData, {
            headers: {
                'Authorization': `Bearer ${userInfo?.token}`
            }
        }).catch(handleError);
    },
    deleteAuction: (auctionId) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return axios.delete(`${API_BASE_URL}/auctions/${auctionId}`, {
            headers: {
                'Authorization': `Bearer ${userInfo?.token}`
            }
        }).catch(handleError);
    },
    getEndedAuctions: () => axios.get(`${API_BASE_URL}/auctions/ended`).catch(handleError),
    placeBid: (bidData) => axios.post(`${API_BASE_URL}/bids`, bidData).catch(handleError),
    getAuctionBids: (auctionId) => axios.get(`${API_BASE_URL}/bids/auction/${auctionId}`).catch(handleError),
    getBidderBids: (bidderId) => {
        return axios.get(`${API_BASE_URL}/bids/bidder/${bidderId}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
            }
        }).catch(handleError);
    },
    getHighestBid: (auctionId) => axios.get(`${API_BASE_URL}/bids/auction/${auctionId}/highest`).catch(handleError),
    updatePaymentStatus: (bidId, paymentData) => axios.post(`${API_BASE_URL}/payments/update/${bidId}`, paymentData).catch(handleError),
    getPaymentStatus: (bidId) => axios.get(`${API_BASE_URL}/payments/status/${bidId}`).catch(handleError),
    createPaymentOrder: async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await axios.post(`${API_BASE_URL}/payments/create-order`, data, {
            headers: {
                'Authorization': `Bearer ${userInfo?.token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },
    verifyPayment: async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await axios.post(`${API_BASE_URL}/payments/verify`, data, {
            headers: {
                'Authorization': `Bearer ${userInfo?.token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },
    getBidderStats: async (bidderId) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return axios.get(`${API_BASE_URL}/users/bidder/${bidderId}/stats`, {
            headers: {
                'Authorization': `Bearer ${userInfo?.token}`
            }
        });
    },
    getSellerStats: async (sellerId) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await axios.get(`${API_BASE_URL}/users/seller/${sellerId}/stats`, {
            headers: {
                'Authorization': `Bearer ${userInfo?.token}`
            }
        });
        return response.data;
    }
};

export default api;
