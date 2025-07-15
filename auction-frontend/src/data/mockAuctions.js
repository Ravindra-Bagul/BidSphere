
// Mock data for auctions
const auctions = [
  {
    id: 1,
    title: "Vintage 1960s Record Player",
    description: "A beautifully preserved vintage record player from the 1960s. Perfect condition and produces warm, rich sound. Includes original components and has been professionally serviced.",
    imageUrl: "https://source.unsplash.com/random/800x600/?record-player",
    additionalImages: [
      "https://source.unsplash.com/random/800x600/?vinyl",
      "https://source.unsplash.com/random/800x600/?turntable",
      "https://source.unsplash.com/random/800x600/?speaker"
    ],
    currentPrice: 250,
    bids: 12,
    endTime: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    auctionType: "timed",
    isLive: false,
    sellerId: "seller123",
    sellerName: "VintageFinds",
    category: "Electronics",
    condition: "Good",
    location: "New York, NY",
    featured: true,
    watchCount: 28
  },
  {
    id: 2,
    title: "Antique Wooden Writing Desk",
    description: "Handcrafted oak writing desk from the early 1900s. Features intricate carvings and multiple drawers for storage. The desk has been carefully restored while preserving its original character.",
    imageUrl: "https://source.unsplash.com/random/800x600/?desk",
    additionalImages: [
      "https://source.unsplash.com/random/800x600/?drawer",
      "https://source.unsplash.com/random/800x600/?wood-furniture"
    ],
    currentPrice: 450,
    bids: 8,
    endTime: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    auctionType: "timed",
    isLive: false,
    sellerId: "seller456",
    sellerName: "HeritageCollectibles",
    category: "Furniture",
    condition: "Restored",
    location: "Boston, MA",
    featured: true,
    watchCount: 14
  },
  {
    id: 3,
    title: "Original Oil Painting - Mountain Landscape",
    description: "Original oil painting depicting a dramatic mountain landscape at sunset. Signed by the artist and professionally framed. Vibrant colors and excellent attention to detail.",
    imageUrl: "https://source.unsplash.com/random/800x600/?painting-landscape",
    additionalImages: [
      "https://source.unsplash.com/random/800x600/?frame",
      "https://source.unsplash.com/random/800x600/?signature"
    ],
    currentPrice: 320,
    bids: 15,
    endTime: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    auctionType: "timed",
    isLive: false,
    sellerId: "seller789",
    sellerName: "ArtisticVisions",
    category: "Art",
    condition: "Excellent",
    location: "San Francisco, CA",
    featured: false,
    watchCount: 32
  },
  {
    id: 4,
    title: "Collectible Comic Book Bundle",
    description: "Collection of 25 rare comic books from the 1980s and 1990s. Includes several first appearances and limited editions. All comics are in protective sleeves and in very good to mint condition.",
    imageUrl: "https://source.unsplash.com/random/800x600/?comic",
    currentPrice: 180,
    bids: 21,
    endTime: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
    auctionType: "timed",
    isLive: false,
    sellerId: "seller123",
    sellerName: "VintageFinds",
    category: "Collectibles",
    condition: "Very Good",
    location: "Chicago, IL",
    featured: false,
    watchCount: 45
  },
  {
    id: 5,
    title: "Luxury Designer Handbag",
    description: "Authentic designer handbag in pristine condition. Includes dust bag, authentication card, and original receipt. Classic style that never goes out of fashion.",
    imageUrl: "https://source.unsplash.com/random/800x600/?handbag",
    currentPrice: 780,
    bids: 9,
    endTime: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    auctionType: "timed",
    isLive: false,
    sellerId: "seller456",
    sellerName: "LuxuryResale",
    category: "Fashion",
    condition: "Like New",
    location: "Miami, FL",
    featured: true,
    watchCount: 27
  },
  {
    id: 6,
    title: "Professional DSLR Camera with Lenses",
    description: "Complete professional photography kit including camera body, multiple lenses, tripod, and carrying case. Everything you need for high-quality photography.",
    imageUrl: "https://source.unsplash.com/random/800x600/?camera",
    currentPrice: 1200,
    bids: 18,
    endTime: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    auctionType: "timed",
    isLive: false,
    sellerId: "seller789",
    sellerName: "TechTreasures",
    category: "Electronics",
    condition: "Good",
    location: "Austin, TX",
    featured: false,
    watchCount: 39
  },
  {
    id: 7,
    title: "Live Auction: Rare Coin Collection",
    description: "Extensive collection of rare and historical coins spanning multiple countries and eras. Each coin has been authenticated and comes with detailed documentation of its origin and history.",
    imageUrl: "https://source.unsplash.com/random/800x600/?coins",
    currentPrice: 2500,
    bids: 0,
    endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    auctionType: "live",
    isLive: true,
    sellerId: "seller123",
    sellerName: "RareTreasures",
    category: "Collectibles",
    condition: "Varies",
    location: "Philadelphia, PA",
    featured: true,
    watchCount: 76
  },
  {
    id: 8,
    title: "Live Auction: Sports Memorabilia Package",
    description: "Collection of signed sports memorabilia from basketball legends. Includes signed jerseys, photos, and basketballs. All items come with certificates of authenticity.",
    imageUrl: "https://source.unsplash.com/random/800x600/?basketball",
    currentPrice: 850,
    bids: 0,
    endTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    auctionType: "live",
    isLive: true,
    sellerId: "seller456",
    sellerName: "SportsCollector",
    category: "Sports & Memorabilia",
    condition: "Excellent",
    location: "Los Angeles, CA",
    featured: true,
    watchCount: 54
  },
  {
    id: 9,
    title: "Upcoming Live Auction: Fine Jewelry Collection",
    description: "Stunning collection of fine jewelry including diamond rings, gold necklaces, and pearl earrings. All pieces have been appraised and come with valuation certificates.",
    imageUrl: "https://source.unsplash.com/random/800x600/?jewelry",
    currentPrice: 5000,
    bids: 0,
    endTime: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    auctionType: "live",
    isLive: false,
    sellerId: "seller789",
    sellerName: "LuxuryAuctions",
    category: "Jewelry & Watches",
    condition: "Excellent",
    location: "New York, NY",
    featured: false,
    watchCount: 88
  },
  {
    id: 10,
    title: "Upcoming Live Auction: Classic Car",
    description: "Fully restored classic car in pristine condition. Low mileage and meticulously maintained. Comes with complete service history and documentation.",
    imageUrl: "https://source.unsplash.com/random/800x600/?classic-car",
    currentPrice: 35000,
    bids: 0,
    endTime: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    auctionType: "live",
    isLive: false,
    sellerId: "seller123",
    sellerName: "VintageAutos",
    category: "Vehicles",
    condition: "Restored",
    location: "Nashville, TN",
    featured: true,
    watchCount: 112
  }
];

// Filter functions for different auction types
export const getAllAuctions = () => auctions;

export const getFeaturedAuctions = () => auctions.filter(auction => auction.featured);

export const getLiveAuctions = () => auctions.filter(auction => auction.auctionType === 'live' && auction.isLive);

export const getEndingSoonAuctions = () => {
  // Get timed auctions ending within the next 24 hours
  const oneDayFromNow = new Date(Date.now() + 86400000).toISOString();
  return auctions
    .filter(auction => auction.auctionType === 'timed' && auction.endTime <= oneDayFromNow)
    .sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
};

export const getAuctionById = (id) => {
  const auction = auctions.find(auction => auction.id === id);
  if (!auction) {
    throw new Error(`Auction with id ${id} not found`);
  }
  return auction;
};

// Mock exports for different auction categories
export const featuredAuctions = getFeaturedAuctions();
export const liveAuctions = getLiveAuctions();
export const endingSoonAuctions = getEndingSoonAuctions();
