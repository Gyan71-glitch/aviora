import { InsurancePlan } from "../types";

export const mockInsurancePlans: InsurancePlan[] = [
  {
    id: "ins-001",
    planName: "MTTPL International Travel Shield",
    provider: "ICICI Lombard / Bajaj Allianz",
    coverageAmount: 50000,
    medicalCoverage: "$50,000 Emergency Cashless Medical & Hospitalization",
    baggageCoverage: "$1,000 Baggage Loss & Delay Protection",
    tripCancellationCoverage: "Up to ₹1,00,000 Trip Cancellation Reimbursement",
    pricePerDay: 89,
    featured: true,
  },
  {
    id: "ins-002",
    planName: "Worldwide Executive Platinum Cover",
    provider: "Tata AIG / Care Health Insurance",
    coverageAmount: 250000,
    medicalCoverage: "$2,50,000 Cashless Emergency & Evacuation",
    baggageCoverage: "$2,500 Full Baggage Protection",
    tripCancellationCoverage: "Up to ₹2,50,000 Full Refund Coverage",
    pricePerDay: 179,
    featured: true,
  },
];
