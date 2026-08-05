export interface AgentProfile {
  agencyId: string;
  agencyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin: string;
  iataCode?: string;
  tier: "Gold Partner" | "Platinum Partner" | "Standard Agent";
  city: string;
  state: string;
  walletBalance: number;
  creditLimit: number;
  creditUsed: number;
  commissionRate: number; // e.g. 5%
  joinedDate: string;
}

export interface AgentBooking {
  bookingId: string;
  pnr: string;
  serviceType: "Flight" | "Hotel" | "Package" | "Transfer";
  passengerName: string;
  destination: string;
  bookingDate: string;
  travelDate: string;
  netFare: number;
  grossFare: number;
  agentMarkup: number;
  commissionEarned: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  paymentMethod: "Wallet" | "Credit Line" | "NetBanking";
}

export interface LedgerTransaction {
  id: string;
  date: string;
  description: string;
  referenceId: string;
  type: "Credit" | "Debit";
  amount: number;
  balanceAfter: number;
  category: "Deposit Top-Up" | "Booking Payment" | "Refund Credit" | "Commission Payout" | "TDS Deduction";
}

export interface MarkupRule {
  id: string;
  service: "Flight" | "Hotel" | "Package" | "Transfer";
  provider: string;
  type: "Percentage" | "Flat";
  value: number;
  appliedOn: "Net Fare" | "Base Fare";
  active: boolean;
}

export const mockAgentProfile: AgentProfile = {
  agencyId: "MTTPL-AGT-88219",
  agencyName: "Skyline Global Travels Pvt Ltd",
  contactPerson: "Rajesh Kumar",
  email: "rajesh@skylinetravels.in",
  phone: "+91 98765 43210",
  gstin: "07AAAAA0000A1Z5",
  iataCode: "14309852",
  tier: "Platinum Partner",
  city: "New Delhi",
  state: "Delhi",
  walletBalance: 245850,
  creditLimit: 500000,
  creditUsed: 128500,
  commissionRate: 6.5,
  joinedDate: "2023-04-15",
};

export const mockAgentBookings: AgentBooking[] = [
  {
    bookingId: "AGT-BK-9021",
    pnr: "S7XK92",
    serviceType: "Flight",
    passengerName: "Amit Sharma & 1 Other",
    destination: "Delhi to Dubai (DXB)",
    bookingDate: "2026-08-02",
    travelDate: "2026-08-15",
    netFare: 42500,
    grossFare: 48900,
    agentMarkup: 3500,
    commissionEarned: 2900,
    status: "Confirmed",
    paymentMethod: "Wallet",
  },
  {
    bookingId: "AGT-BK-9018",
    pnr: "HTL-8821",
    serviceType: "Hotel",
    passengerName: "Dr. Vikram Sethi",
    destination: "Burj Al Arab Jumeirah, Dubai",
    bookingDate: "2026-08-01",
    travelDate: "2026-08-20",
    netFare: 85000,
    grossFare: 98000,
    agentMarkup: 7500,
    commissionEarned: 5500,
    status: "Confirmed",
    paymentMethod: "Credit Line",
  },
  {
    bookingId: "AGT-BK-9014",
    pnr: "PKG-4412",
    serviceType: "Package",
    passengerName: "Priya Malhotra (Family of 4)",
    destination: "Singapore & Bali 7D/6N",
    bookingDate: "2026-07-28",
    travelDate: "2026-09-01",
    netFare: 185000,
    grossFare: 215000,
    agentMarkup: 18000,
    commissionEarned: 12000,
    status: "Confirmed",
    paymentMethod: "Wallet",
  },
  {
    bookingId: "AGT-BK-8995",
    pnr: "TRF-1029",
    serviceType: "Transfer",
    passengerName: "Sanjay Gupta",
    destination: "Airport VIP Transfer (SUV)",
    bookingDate: "2026-07-25",
    travelDate: "2026-08-10",
    netFare: 3800,
    grossFare: 4500,
    agentMarkup: 450,
    commissionEarned: 250,
    status: "Confirmed",
    paymentMethod: "Wallet",
  },
];

export const mockLedgerTransactions: LedgerTransaction[] = [
  {
    id: "TXN-77192",
    date: "2026-08-02 14:32",
    description: "Flight Booking S7XK92 - Delhi to Dubai",
    referenceId: "AGT-BK-9021",
    type: "Debit",
    amount: 42500,
    balanceAfter: 245850,
    category: "Booking Payment",
  },
  {
    id: "TXN-77180",
    date: "2026-08-01 11:15",
    description: "Instant Wallet Deposit via Razorpay UPI",
    referenceId: "PAY-992102",
    type: "Credit",
    amount: 100000,
    balanceAfter: 288350,
    category: "Deposit Top-Up",
  },
  {
    id: "TXN-77164",
    date: "2026-07-28 16:45",
    description: "Package Booking PKG-4412 - Singapore & Bali",
    referenceId: "AGT-BK-9014",
    type: "Debit",
    amount: 185000,
    balanceAfter: 188350,
    category: "Booking Payment",
  },
  {
    id: "TXN-77150",
    date: "2026-07-25 10:00",
    description: "Monthly Commission Incentive Payout",
    referenceId: "COMM-JULY-26",
    type: "Credit",
    amount: 34500,
    balanceAfter: 373350,
    category: "Commission Payout",
  },
];

export const mockMarkupRules: MarkupRule[] = [
  {
    id: "MK-01",
    service: "Flight",
    provider: "All Airlines (Air India, Emirates, IndiGo)",
    type: "Percentage",
    value: 5.0,
    appliedOn: "Net Fare",
    active: true,
  },
  {
    id: "MK-02",
    service: "Hotel",
    provider: "International 4-Star & 5-Star Hotels",
    type: "Percentage",
    value: 8.5,
    appliedOn: "Net Fare",
    active: true,
  },
  {
    id: "MK-03",
    service: "Package",
    provider: "Custom Holiday Packages",
    type: "Flat",
    value: 3500,
    appliedOn: "Net Fare",
    active: true,
  },
  {
    id: "MK-04",
    service: "Transfer",
    provider: "VIP & SUV Airport Transfers",
    type: "Flat",
    value: 500,
    appliedOn: "Net Fare",
    active: true,
  },
];
