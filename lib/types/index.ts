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

export interface HolidayItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  activity?: string;
}

export interface HolidayPackage {
  id: string;
  title: string;
  image: string;
  gallery?: string[];
  destination: string;
  country: string;
  durationNights: number;
  durationDays: number;
  category: "romantic" | "family" | "luxury" | "adventure" | "heritage";
  rating: number;
  reviewCount: number;
  pricePerPerson: number;
  originalPrice?: number;
  currency: string;
  inclusions: string[]; // e.g. ["Flights Included", "5-Star Hotel", "Transfers", "Breakfast & Dinner", "City Tour"]
  exclusions?: string[];
  highlights: string[];
  description: string;
  featured?: boolean;
  hotelInfo?: {
    name: string;
    stars: number;
    image: string;
    roomType: string;
  };
  flightInfo?: {
    airline: string;
    logo: string;
    route: string;
  };
  itinerary?: HolidayItineraryDay[];
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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  membershipTier: "Platinum Member" | "Gold Member" | "Standard Member";
  phone?: string;
  savedTripsCount?: number;
  bookingsCount?: number;
}

export interface SightseeingTour {
  id: string;
  title: string;
  image: string;
  city: string;
  country: string;
  durationHours: number;
  rating: number;
  reviewCount: number;
  pricePerPerson: number;
  originalPrice?: number;
  currency: string;
  category: "safari" | "theme_park" | "city_tour" | "cruise" | "water_sports";
  inclusions: string[];
  description: string;
  featured?: boolean;
}

export interface TransferOption {
  id: string;
  vehicleName: string;
  vehicleType: "sedan" | "suv" | "minivan" | "luxury_limo";
  image: string;
  capacityPassengers: number;
  baggageCount: number;
  pickupLocation: string;
  dropoffLocation: string;
  price: number;
  currency: string;
  vehicleClass: string; // e.g. "Mercedes S-Class or similar"
  features: string[];
  cancellationPolicy: string;
  featured?: boolean;
}

export interface Villa {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  image: string;
  pricePerNight: number;
  bedrooms: number;
  maxGuests: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  featured?: boolean;
}

export interface TrainRoute {
  id: string;
  trainNumber: string;
  trainName: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn: string;
  prices: {
    SL?: number;
    "3A"?: number;
    "2A"?: number;
    "1A"?: number;
    CC?: number;
    EC?: number;
  };
}

export interface BusRoute {
  id: string;
  operatorName: string;
  busType: string; // e.g. "Volvo Multi-Axle AC Semi-Sleeper"
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  seatsAvailable: number;
}

export interface VisaOption {
  id: string;
  country: string;
  flag: string;
  visaType: string;
  processingTime: string;
  validity: string;
  price: number;
  entryType: string;
  documentsRequired: string[];
  featured?: boolean;
}

export interface CruiseOption {
  id: string;
  cruiseLine: string;
  shipName: string;
  departurePort: string;
  itinerary: string;
  nights: number;
  image: string;
  pricePerPerson: number;
  rating: number;
  diningIncluded: boolean;
  featured?: boolean;
}

export interface ForexCard {
  id: string;
  currencyCode: string;
  currencyName: string;
  flag: string;
  buyRate: number;
  sellRate: number;
  deliveryType: string;
}

export interface InsurancePlan {
  id: string;
  planName: string;
  provider: string;
  coverageAmount: number;
  medicalCoverage: string;
  baggageCoverage: string;
  tripCancellationCoverage: string;
  pricePerDay: number;
  featured?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
