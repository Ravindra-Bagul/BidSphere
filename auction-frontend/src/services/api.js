import axios from 'axios';

const API_BASE_URL = 'https://bidsphere-production.up.railway.app/';

const handleError = (error) => {
    if (error.response) {
        throw error.response.data;
    }
    throw new Error('Network error');
};

// Add authenticated axios instance
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
    // Auth/User endpoints
    registerUser: (userData) => axios.post(`${API_BASE_URL}/users/register`, userData).catch(handleError),
    loginUser: (credentials) => axios.post(`${API_BASE_URL}/users/login`, credentials).catch(handleError),
    getUserById: (id) => axios.get(`${API_BASE_URL}/users/${id}`).catch(handleError),

    // Auction endpoints
    createAuction: (formData) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return axios.post(`${API_BASE_URL}/auctions`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userInfo?.token}`
            }
        }).catch(error => {
            console.error('API Error:', error.response || error);
            throw error;
        });
    },
    getAllAuctions: () => axios.get(`${API_BASE_URL}/auctions`).catch(handleError),
    getActiveAuctions: () => axios.get(`${API_BASE_URL}/auctions/active`).catch(handleError),
    getAuctionById: (id) => axios.get(`${API_BASE_URL}/auctions/${id}`).catch(handleError),
    getSellerAuctions: (sellerId) => {
        const axiosInstance = getAuthenticatedAxios();
        return axiosInstance.get(`/auctions/seller/${sellerId}`)
            .catch(handleError);
    },
    updateAuction: async (id, auctionData) => {
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
    getEndedAuctions: () => {
        return axios.get(`${API_BASE_URL}/auctions/ended`);
    },

    // Bid endpoints
    placeBid: (bidData) => axios.post(`${API_BASE_URL}/bids`, bidData).catch(handleError),
    getAuctionBids: (auctionId) => axios.get(`${API_BASE_URL}/bids/auction/${auctionId}`).catch(handleError),
    getBidderBids: (bidderId) => {
        console.log("Fetching bids for bidder:", bidderId); // Debug log
        return axios.get(`${API_BASE_URL}/bids/bidder/${bidderId}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
            }
        }).catch(handleError);
    },
    getHighestBid: (auctionId) => axios.get(`${API_BASE_URL}/bids/auction/${auctionId}/highest`).catch(handleError),

    // Payment endpoints
    updatePaymentStatus: (bidId, paymentData) => 
        axios.post(`${API_BASE_URL}/payments/update/${bidId}`, paymentData).catch(handleError),
    
    getPaymentStatus: (bidId) => 
        axios.get(`${API_BASE_URL}/payments/status/${bidId}`).catch(handleError),

    createPaymentOrder: async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        try {
            const response = await axios.post(`${API_BASE_URL}/payments/create-order`, data, {
                headers: {
                    'Authorization': `Bearer ${userInfo?.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Payment order creation failed:', error);
            throw error;
        }
    },

    verifyPayment: async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        try {
            const response = await axios.post(`${API_BASE_URL}/payments/verify`, data, {
                headers: {
                    'Authorization': `Bearer ${userInfo?.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Payment verification failed:', error);
            throw error;
        }
    },

    // Stats endpoints
    getBidderStats: async (bidderId) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return axios.get(`${API_BASE_URL}/users/bidder/${bidderId}/stats`, {
            headers: {
                'Authorization': `Bearer ${userInfo?.token}`
            }
        });
    },
    getSellerStats: async (sellerId) => {
        const response = await axios.get(`${API_BASE_URL}/users/seller/${sellerId}/stats`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
            }
        });
        return response.data;
    }
};

export default api;
