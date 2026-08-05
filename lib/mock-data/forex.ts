import { ForexCard } from "../types";

export const mockForexCards: ForexCard[] = [
  {
    id: "fx-001",
    currencyCode: "USD",
    currencyName: "US Dollar",
    flag: "🇺🇸",
    buyRate: 83.45,
    sellRate: 84.10,
    deliveryType: "Multi-Currency Forex Card & Cash Doorstep",
  },
  {
    id: "fx-002",
    currencyCode: "EUR",
    currencyName: "Euro",
    flag: "🇪🇺",
    buyRate: 90.20,
    sellRate: 91.10,
    deliveryType: "Multi-Currency Forex Card & Cash Doorstep",
  },
  {
    id: "fx-003",
    currencyCode: "AED",
    currencyName: "UAE Dirham",
    flag: "🇦🇪",
    buyRate: 22.70,
    sellRate: 23.05,
    deliveryType: "Zero Mark-Up Forex Card",
  },
  {
    id: "fx-004",
    currencyCode: "SGD",
    currencyName: "Singapore Dollar",
    flag: "🇸🇬",
    buyRate: 61.80,
    sellRate: 62.60,
    deliveryType: "Zero Mark-Up Forex Card",
  },
];
