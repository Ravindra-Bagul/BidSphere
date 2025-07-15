# 🎯 BidSphere – Online Auction System  
*Author: Ravindra Bagul*

BidSphere is a real-time online auction platform that allows users to participate in auctions as **Sellers** or **Bidders**, enabling secure, competitive bidding and integrated payment processing via Razorpay.

---

## 🧰 Tech Stack

| Frontend     | Backend       | Database | Payments  | Auth   |
|--------------|---------------|----------|-----------|--------|
| React.js     | Spring Boot   | MySQL    | Razorpay  | JWT    |

---

## 🔑 Core Features

### 👤 User Management
- Dual roles: Seller & Bidder
- Secure JWT authentication
- Profile & activity management

### 📦 Auction Management
- Create/edit/delete auctions (Sellers)
- Set start/end times
- Image upload (JPG/PNG, max 10MB)
- Countdown timers & statuses (Upcoming, Active, Ended)

### 💸 Bidding System
- Real-time bid updates (polling)
- Minimum increment enforcement
- Bid history & status (Leading/Outbid)

### 💳 Payment Integration
- Razorpay secure checkout
- Payment tracking & transaction history

### 📊 Dashboards
- **Seller**: Manage auctions, sales & stats  
- **Bidder**: Track bids, win history, make payments

---

## 🌐 API Endpoints (Sample)

```http
GET    /api/auctions           # All auctions  
GET    /api/auctions/active    # Active auctions  
POST   /api/auctions           # Create auction  
POST   /api/bids               # Place a bid  
POST   /api/users/register     # Register  
POST   /api/users/login        # Login

```


## 🗄 Database Schema (Overview)

- **Users**: `id`, `name`, `email`, `password`, `role`
- **Auctions**: `id`, `title`, `starting_price`, `current_price`, `start_time`, `end_time`, `image`, `seller_id`
- **Bids**: `id`, `auction_id`, `bidder_id`, `amount`, `timestamp`
- **Payments**: `id`, `bid_id`, `amount`, `status`, `payment_id`, `order_id` (Razorpay)

---

## 🔐 Security & Optimizations

- Password hashing using **BCrypt**
- Input and image format validation (type/size)
- Razorpay callback verification
- Real-time updates via **polling**
- Efficient DB queries and lazy-loaded React components

---

## 🧪 Testing

| Frontend             | Backend            |
|----------------------|--------------------|
| Jest + RTL           | JUnit + Mockito    |
| Component Testing    | Service Layer Tests|
| User Flow Testing    | REST API Testing   |

---

## 🚀 Future Enhancements

- Real-time **WebSocket** support for live bidding
- Multiple image upload per auction
- **Mobile app** version (React Native / Flutter)
- Auction **search & filters**
- **Admin dashboard** for moderation
- User **ratings, reviews**, and **analytics**

---

## ⚔️ Challenges & Solutions

| Challenge              | Solution                                 |
|------------------------|------------------------------------------|
| Real-time bidding      | Implemented polling updates              |
| Payment integration    | Razorpay API + webhook validation        |
| Secure image uploads   | Base64 encoding + type/size validation   |
| Bid race conditions    | DB-level transaction management          |

---

## ✅ Conclusion

BidSphere is a powerful, secure, and scalable online auction platform that brings together real-time bidding, payment processing, and user-friendly dashboards. It is production-ready and can easily grow with features like live updates, mobile access, and analytics.

---

> 🔖 **Developed with passion by [Ravindra Bagul](https://github.com/Ravindra-Bagul)**  
> 📫 Feel free to connect or contribute!




