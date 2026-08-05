import { CruiseOption } from "../types";

export const mockCruises: CruiseOption[] = [
  {
    id: "crs-001",
    cruiseLine: "Cordelia Cruises India",
    shipName: "Empress of the Seas",
    departurePort: "Mumbai Port",
    itinerary: "Mumbai → High Seas → Goa → Mumbai",
    nights: 3,
    image: "https://images.unsplash.com/photo-1548574505-5e2386903f87?w=1000&q=80",
    pricePerPerson: 28500,
    rating: 4.8,
    diningIncluded: true,
    featured: true,
  },
  {
    id: "crs-002",
    cruiseLine: "Royal Caribbean International",
    shipName: "Spectrum of the Seas",
    departurePort: "Singapore Marina Bay",
    itinerary: "Singapore → Penang (Malaysia) → Phuket (Thailand) → Singapore",
    nights: 4,
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1000&q=80",
    pricePerPerson: 54000,
    rating: 4.95,
    diningIncluded: true,
    featured: true,
  },
];
