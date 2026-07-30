// Core Travel Types — production-ready structure for Amadeus/Hotel APIs

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
}

export interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  departure: {
    airport: Airport;
    time: string;
    terminal?: string;
  };
  arrival: {
    airport: Airport;
    time: string;
    terminal?: string;
  };
  duration: string;
  stops: number;
  stopCities?: string[];
  price: number;
  currency: string;
  cabin: "economy" | "premium_economy" | "business" | "first";
  seatsLeft?: number;
  baggage?: {
    cabin: string;
    checked: string;
  };
  amenities?: string[];
  refundable?: boolean;
}

export interface RoomOption {
  roomId: string;
  roomType: string;
  boardBasis: string; // e.g., "Breakfast Included", "Room Only"
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  maxOccupancy: number;
  cancellationPolicy: string;
  available: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  galleryImages?: string[];
  location: string;
  city: string;
  country: string;
  address?: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  stars: number;
  amenities: string[];
  tags: string[];
  featured?: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  rooms?: RoomOption[];
  description?: string;
}

export interface HotelSearchParams {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  stars?: number[];
  amenities?: string[];
  sortBy?: "price_asc" | "price_desc" | "rating" | "popularity";
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  image: string;
  startingPrice: number;
  currency: string;
  description: string;
  tags: string[];
  trending?: boolean;
  spanLarge?: boolean;
}

export interface Deal {
  id: string;
  type: "flight" | "hotel" | "package";
  category: "cheapest" | "weekend" | "international" | "luxury";
  title: string;
  destination: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  currency: string;
  validUntil: string;
  airline?: string;
}

export interface SearchParams {
  from?: string;
  to?: string;
  departure?: string;
  returnDate?: string;
  passengers?: number;
  tripType?: "one_way" | "round_trip" | "multi_city";
  cabin?: string;
}

export interface Booking {
  id: string;
  userId: string;
  type: "flight" | "hotel" | "train" | "bus";
  status: "confirmed" | "pending" | "cancelled" | "completed";
  reference: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  travelDate: string;
  passengerCount: number;
  route?: string;
  hotelName?: string;
}

export interface AdminStats {
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  avgTripValue: number;
  bookingsGrowth: number;
  revenueGrowth: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
