export interface UserBookingItem {
  id: string;
  orderId: string;
  type: "flight" | "hotel" | "holiday" | "tour" | "transfer";
  title: string;
  subtitle: string;
  image: string;
  reference: string;
  travelDate: string;
  totalAmount: number;
  currency: string;
  status: "confirmed" | "completed" | "cancelled";
  location: string;
  details: string;
}

export const mockUserBookings: UserBookingItem[] = [
  {
    id: "ub-001",
    orderId: "ord_smt_984210",
    type: "flight",
    title: "Mumbai (BOM) → Dubai (DXB)",
    subtitle: "Emirates Airline • Flight EK 507",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    reference: "SMT9842X",
    travelDate: "15 Oct 2026",
    totalAmount: 18500,
    currency: "INR",
    status: "confirmed",
    location: "BOM - DXB",
    details: "First Class • 1 Passenger • 2 Checked Bags",
  },
  {
    id: "ub-002",
    orderId: "ord_smt_pkg-002",
    type: "holiday",
    title: "6-Day Dubai Luxury & Desert Safari Special",
    subtitle: "MTTPL All-Inclusive Package",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    reference: "SMT-PKG-552",
    travelDate: "15 Oct - 20 Oct 2026",
    totalAmount: 170000,
    currency: "INR",
    status: "confirmed",
    location: "Dubai, UAE",
    details: "2 Guests • 5-Star JW Marriott • VIP Desert Safari",
  },
  {
    id: "ub-003",
    orderId: "ord_tour_tour-001",
    type: "tour",
    title: "Dubai Red Dune Safari 4x4 & VIP BBQ",
    subtitle: "Sightseeing Experience Pass",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    reference: "SMT-TOUR-984",
    travelDate: "16 Oct 2026",
    totalAmount: 9000,
    currency: "INR",
    status: "confirmed",
    location: "Lahbab Red Dunes, Dubai",
    details: "2 Adult VIP Passes • Pickup included",
  },
  {
    id: "ub-004",
    orderId: "ord_transfer_tr-001",
    type: "transfer",
    title: "Mercedes-Benz S-Class Luxury Chauffeur",
    subtitle: "VIP Airport Transfer Service",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
    reference: "SMT-RIDE-774",
    travelDate: "15 Oct 2026, 14:30",
    totalAmount: 6800,
    currency: "INR",
    status: "confirmed",
    location: "DXB Airport → Downtown Dubai",
    details: "3 Passengers • 3 Suitcases • Meet & Greet",
  },
  {
    id: "ub-005",
    orderId: "ord_smt_pkg-001",
    type: "holiday",
    title: "5-Day Maldives Overwater Villa Escape",
    subtitle: "Ritz-Carlton Maldives Stay",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    reference: "SMT-PKG-102",
    travelDate: "12 May 2026",
    totalAmount: 230000,
    currency: "INR",
    status: "completed",
    location: "Maldives",
    details: "2 Guests • Overwater Pool Villa",
  },
];
