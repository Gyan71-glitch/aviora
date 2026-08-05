import { HolidayPackage } from "../types";

export const mockHolidayPackages: HolidayPackage[] = [
  {
    id: "pkg-001",
    title: "5-Day Maldives Overwater Villa Escape",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&q=80",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1000&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&q=80",
    ],
    destination: "Maldives",
    country: "Maldives",
    durationNights: 4,
    durationDays: 5,
    category: "romantic",
    rating: 4.9,
    reviewCount: 840,
    pricePerPerson: 115000,
    originalPrice: 145000,
    currency: "INR",
    featured: true,
    inclusions: [
      "Return Flights Included",
      "5-Star Overwater Villa",
      "Speedboat Transfers",
      "Breakfast & Dinner",
      "Sunset Cruise",
    ],
    exclusions: [
      "Personal expenses & tipping",
      "Scuba diving certification fees",
      "Travel Insurance",
    ],
    highlights: [
      "Stay in a private water villa with direct ocean access",
      "Guided coral reef snorkeling with marine biologists",
      "Romantic 3-course beachfront candlelit dinner",
      "Complimentary couple's 60-minute Balinese spa treatment",
    ],
    description:
      "Indulge in pure tropical paradise with an all-inclusive stay at a 5-star luxury resort in the Maldives. Features private water villas with plunge pools, fine dining, crystal-clear turquoise lagoons, and seamless airport transfers.",
    hotelInfo: {
      name: "Ritz-Carlton Maldives, Fari Islands",
      stars: 5,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&q=80",
      roomType: "Ocean Overwater Pool Villa",
    },
    flightInfo: {
      airline: "IndiGo / Air India Direct",
      logo: "https://pics.avs.io/80/80/6E.png",
      route: "BOM/DEL → Male (MLE) Direct",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Male & Luxury Speedboat Transfer to Resort",
        description:
          "Arrive at Velana International Airport in Male. Meet our airport representative and enjoy a scenic 45-minute luxury speedboat transfer to the resort island. Check into your Overwater Villa and enjoy sunset cocktails.",
        meals: "Welcome Drinks & Gourmet Dinner",
        activity: "Resort orientation & Sunset beach walk",
      },
      {
        day: 2,
        title: "House Reef Snorkeling & Floating Breakfast Experience",
        description:
          "Wake up to a floating breakfast served directly in your villa's private pool. Join the resident marine biologist for a guided snorkeling safari across the vibrant coral house reef.",
        meals: "Floating Breakfast & Dinner",
        activity: "Guided Coral Reef Snorkeling",
      },
      {
        day: 3,
        title: "Island Wellness, Spa & Romantic Beachside Dinner",
        description:
          "Spend your morning relaxing at the overwater spa with a complimentary 60-minute Balinese massage. As night falls, savor a private 3-course candlelit seafood dinner on the white sand beach.",
        meals: "Breakfast & Candlelit Seafood Dinner",
        activity: "60-Min Balinese Massage & Private Beach Dining",
      },
      {
        day: 4,
        title: "Dolphin Sunset Cruise & Lagoon Watersports",
        description:
          "Enjoy paddleboarding or kayaking in the lagoon during the day. In the late afternoon, board a traditional Maldivian Dhoni for a sunset cruise to spot wild spinner dolphins.",
        meals: "Breakfast & Buffet Dinner",
        activity: "Sunset Dolphin Watching Cruise",
      },
      {
        day: 5,
        title: "Leisure Morning & Departure to Male",
        description:
          "Savor your final tropical breakfast overlooking the ocean. Enjoy free time for last-minute swimming or photos before taking your speedboat transfer back to Male Airport for your flight home.",
        meals: "Breakfast",
        activity: "Check-out & Airport Speedboat Transfer",
      },
    ],
  },
  {
    id: "pkg-002",
    title: "6-Day Dubai Luxury & Desert Safari Special",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000&q=80",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1000&q=80",
      "https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=1000&q=80",
    ],
    destination: "Dubai",
    country: "UAE",
    durationNights: 5,
    durationDays: 6,
    category: "luxury",
    rating: 4.8,
    reviewCount: 1420,
    pricePerPerson: 85000,
    originalPrice: 105000,
    currency: "INR",
    featured: true,
    inclusions: [
      "Return Flights Included",
      "5-Star JW Marriott Stay",
      "Burj Khalifa 124th Floor",
      "VIP Desert Safari & BBQ",
      "Dubai Marina Dhow Dinner",
    ],
    exclusions: ["Tourism Dirham Fee (payable at hotel)", "Personal shopping"],
    highlights: [
      "Fast-track access to Burj Khalifa Observation Deck",
      "Red dune 4x4 dune bashing with VIP desert camp dinner & live show",
      "Dubai Marina luxury yacht dinner cruise",
      "Full-day guided city tour including Museum of the Future",
    ],
    description:
      "Experience the pinnacle of Arabian hospitality. Includes stay at JW Marriott Marquis Dubai, Burj Khalifa tickets, VIP Desert Safari with 4x4 dune bashing, and a luxury marina yacht cruise.",
    hotelInfo: {
      name: "JW Marriott Marquis Hotel Dubai",
      stars: 5,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&q=80",
      roomType: "Deluxe Executive Skyline Room",
    },
    flightInfo: {
      airline: "Emirates / Air India",
      logo: "https://pics.avs.io/80/80/EK.png",
      route: "BOM/DEL → Dubai (DXB) Non-Stop",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Dubai & Marina Dhow Cruise Dinner",
        description:
          "Arrive at Dubai International Airport (DXB). Private transfer to JW Marriott Marquis. In the evening, enjoy an international buffet dinner aboard a traditional Dhow cruise gliding past Dubai Marina skyscrapers.",
        meals: "Dinner",
        activity: "Marina Dhow Cruise",
      },
      {
        day: 2,
        title: "Dubai City Tour & Burj Khalifa At The Top",
        description:
          "Explore Old & New Dubai including the Gold Souk, Palm Jumeirah, and Museum of the Future photo stop. Conclude with fast-track entry to Burj Khalifa's 124th floor observation deck.",
        meals: "Breakfast",
        activity: "City Tour & Burj Khalifa Deck",
      },
      {
        day: 3,
        title: "VIP Red Dune Desert Safari & BBQ Camp Show",
        description:
          "Leisure morning. At 3:00 PM, embark on an exhilarating 4x4 Land Cruiser dune bashing adventure across the red dunes, followed by camel riding, henna painting, and a VIP BBQ buffet with Tanoura & Belly Dance shows.",
        meals: "Breakfast & Desert BBQ Dinner",
        activity: "4x4 Desert Safari & VIP Camp Show",
      },
      {
        day: 4,
        title: "Abu Dhabi Day Trip & Sheikh Zayed Grand Mosque",
        description:
          "Full-day guided tour to UAE's capital Abu Dhabi. Visit the breathtaking Sheikh Zayed Grand Mosque, Emirates Palace, and Ferrari World Abu Dhabi.",
        meals: "Breakfast & Lunch",
        activity: "Grand Mosque Tour & Ferrari World Stop",
      },
      {
        day: 5,
        title: "Shopping at Dubai Mall & Fountain Show",
        description:
          "Free day for luxury shopping at Dubai Mall. Watch the famous Dubai Fountain music show in the evening.",
        meals: "Breakfast",
        activity: "Shopping & Fountain Spectacle",
      },
      {
        day: 6,
        title: "Departure from Dubai",
        description:
          "Check out from hotel and enjoy private chauffeur transfer to Dubai Airport for your return flight.",
        meals: "Breakfast",
        activity: "Airport Chauffeur Transfer",
      },
    ],
  },
  {
    id: "pkg-003",
    title: "4-Day Goa Beach Resort Getaway",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&q=80",
    ],
    destination: "Goa",
    country: "India",
    durationNights: 3,
    durationDays: 4,
    category: "family",
    rating: 4.7,
    reviewCount: 650,
    pricePerPerson: 32000,
    originalPrice: 42000,
    currency: "INR",
    inclusions: [
      "Return Flights Included",
      "5-Star Beach Resort Stay",
      "Mandovi River Cruise",
      "Daily Breakfast & Dinner",
      "Airport Transfers",
    ],
    exclusions: ["Personal water sports fees", "Alcoholic beverages"],
    highlights: [
      "Stay at Taj Fort Aguada Resort on Sinquerim Beach",
      "Sunset Mandovi River Cruise with live Goan folk music",
      "Guided tour of Old Goa Churches & Spice Plantation with traditional lunch",
    ],
    description:
      "Relax on golden sands and explore Portuguese heritage. Includes 5-star beachfront accommodation, sunset Mandovi River Cruise, South Goa heritage tour, and all airport transfers.",
    hotelInfo: {
      name: "Taj Fort Aguada Resort & Spa, Goa",
      stars: 5,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&q=80",
      roomType: "Superior Sea View Room",
    },
    flightInfo: {
      airline: "IndiGo / Vistara",
      logo: "https://pics.avs.io/80/80/6E.png",
      route: "BOM/DEL → Goa (GOI/GOX) Non-Stop",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Goa & Evening Mandovi Cruise",
        description:
          "Arrive at Goa Airport. Transfer to Taj Fort Aguada. In the evening, enjoy a 1-hour sunset cruise along the Mandovi River with Goan cultural dance performances.",
        meals: "Dinner",
        activity: "Mandovi Sunset Cruise",
      },
      {
        day: 2,
        title: "North Goa Beaches & Fort Aguada",
        description:
          "Explore Fort Aguada Lighthouse, Baga Beach, Calangute Beach, and Anjuna Beach. Enjoy water sports or beachfront shacks.",
        meals: "Breakfast & Dinner",
        activity: "North Goa Tour & Beach Hop",
      },
      {
        day: 3,
        title: "Old Goa Heritage & Tropical Spice Plantation",
        description:
          "Visit UNESCO Heritage Basilica of Bom Jesus & Se Cathedral. Proceed to a tropical spice plantation for a traditional Goan buffet lunch served on banana leaves.",
        meals: "Breakfast, Spice Plantation Lunch & Dinner",
        activity: "Heritage Churches & Spice Farm Tour",
      },
      {
        day: 4,
        title: "Leisure & Departure",
        description:
          "Morning at leisure on Sinquerim Beach before private transfer to Goa Airport.",
        meals: "Breakfast",
        activity: "Airport Transfer",
      },
    ],
  },
  {
    id: "pkg-004",
    title: "5-Day Bali Tropical Wellness Retreat",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=80",
    ],
    destination: "Bali",
    country: "Indonesia",
    durationNights: 4,
    durationDays: 5,
    category: "adventure",
    rating: 4.9,
    reviewCount: 920,
    pricePerPerson: 58000,
    originalPrice: 75000,
    currency: "INR",
    inclusions: [
      "Return Flights Included",
      "Private Pool Villa in Ubud",
      "Daily Yoga & Spa",
      "Uluwatu Sunset Temple Tour",
      "Floating Breakfast",
    ],
    exclusions: ["Indonesian visa on arrival ($35)", "Personal shopping"],
    highlights: [
      "Private pool villa nestled in Ubud jungle rainforest",
      "Daily sunrise yoga classes & 90-minute holistic spa treatments",
      "Uluwatu Cliffside Temple tour with Kecak Fire Dance",
    ],
    description:
      "Rejuvenate your soul amidst lush Ubud rice terraces and pristine Seminyak beaches. Package includes private pool villa stay, daily yoga, spa treatments, and Kecak fire dance shows.",
    hotelInfo: {
      name: "COMO Uma Ubud Resort",
      stars: 5,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=80",
      roomType: "Ubud Private Pool Villa",
    },
    flightInfo: {
      airline: "Singapore Airlines / Malaysia Airlines",
      logo: "https://pics.avs.io/80/80/SQ.png",
      route: "BOM/DEL → Denpasar (DPS)",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bali & Check-in to Ubud Villa",
        description:
          "Arrive at Ngurah Rai Airport (DPS). Transfer to your private pool villa in Ubud. Enjoy a welcome floral bath and organic dinner.",
        meals: "Dinner",
        activity: "Villa Check-in & Flower Bath",
      },
      {
        day: 2,
        title: "Ubud Rice Terraces, Bali Swing & Monkey Forest",
        description:
          "Visit Tegallalang Rice Terraces, take iconic photos on the famous jungle swing, and explore the sacred Monkey Forest Sanctuary.",
        meals: "Floating Breakfast & Dinner",
        activity: "Ubud Highlights & Jungle Swing",
      },
      {
        day: 3,
        title: "Holistic Spa Day & Uluwatu Sunset Kecak Dance",
        description:
          "Enjoy a 90-minute deep tissue Balinese spa treatment. In the late afternoon, drive to Uluwatu Temple perched on a 70-meter cliff for the spectacular Kecak Fire Dance at sunset.",
        meals: "Breakfast & Seafood Dinner",
        activity: "Spa Treatment & Kecak Dance Show",
      },
      {
        day: 4,
        title: "Seminyak Beach & Beach Club Chill",
        description:
          "Day trip to Seminyak. Relax at Potato Head Beach Club with reserved daybed and ocean views.",
        meals: "Breakfast",
        activity: "Beach Club Experience",
      },
      {
        day: 5,
        title: "Departure from Bali",
        description:
          "Leisure morning for shopping in Ubud market before airport transfer.",
        meals: "Breakfast",
        activity: "Airport Transfer",
      },
    ],
  },
  {
    id: "pkg-005",
    title: "7-Day Grand European Jewels & Swiss Alps",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1000&q=80",
    ],
    destination: "Zurich & Paris",
    country: "Switzerland & France",
    durationNights: 6,
    durationDays: 7,
    category: "luxury",
    rating: 4.95,
    reviewCount: 410,
    pricePerPerson: 185000,
    originalPrice: 220000,
    currency: "INR",
    inclusions: [
      "Return Flights Included",
      "4-Star Luxury City Hotels",
      "Jungfraujoch Top of Europe Train",
      "Schengen Visa Assistance",
      "Paris Eiffel Tower Direct Ticket",
    ],
    exclusions: ["Schengen Visa Fee", "City Tourist Taxes"],
    highlights: [
      "Cogwheel train journey to Jungfraujoch — Top of Europe (3,454m)",
      "Scenic TGV high-speed train from Zurich to Paris in First Class",
      "Direct entry ticket to Eiffel Tower 2nd Floor & Seine River Cruise",
    ],
    description:
      "Journey through snow-capped Swiss peaks and romantic Parisian boulevards. Features Jungfraujoch excursion, high-speed TGV train ride, Eiffel Tower access, and Seine River cruises.",
    hotelInfo: {
      name: "The Dolder Grand Zurich & Hotel du Collectionneur Paris",
      stars: 5,
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1000&q=80",
      roomType: "Deluxe Alpine & City View Rooms",
    },
    flightInfo: {
      airline: "SWISS / Air France",
      logo: "https://pics.avs.io/80/80/LX.png",
      route: "BOM/DEL → Zurich (ZRH) / Paris (CDG) → BOM/DEL",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Zurich",
        description:
          "Arrive at Zurich Airport. Transfer to hotel. Evening walk around Lake Zurich and Bahnhofstrasse shopping street.",
        meals: "Dinner",
        activity: "Lake Zurich Walk",
      },
      {
        day: 2,
        title: "Jungfraujoch — Top of Europe Excursion",
        description:
          "Full-day excursion to Jungfraujoch glacier peak at 3,454 meters. Visit the Ice Palace and Sphinx Observatory.",
        meals: "Breakfast & Alpine Lunch",
        activity: "Jungfraujoch Cogwheel Train Excursion",
      },
      {
        day: 3,
        title: "Lucerne Lake & Chapel Bridge Tour",
        description:
          "Day trip to scenic Lucerne. Cruise Lake Lucerne and walk across the historic wooden Chapel Bridge.",
        meals: "Breakfast",
        activity: "Lucerne City & Lake Cruise",
      },
      {
        day: 4,
        title: "TGV High-Speed Train to Paris",
        description:
          "Board the 1st Class TGV train from Zurich to Paris (3.5 hours). Check into Paris hotel and enjoy an illuminated night tour of the Champs-Élysées.",
        meals: "Breakfast & Dinner",
        activity: "1st Class TGV Train to Paris",
      },
      {
        day: 5,
        title: "Eiffel Tower & Louvre Museum Highlights",
        description:
          "Visit Eiffel Tower with 2nd floor access, followed by guided tour of Mona Lisa at the Louvre Museum.",
        meals: "Breakfast",
        activity: "Eiffel Tower & Louvre Museum",
      },
      {
        day: 6,
        title: "Seine River Cruise & Galeries Lafayette",
        description:
          "Enjoy a 1-hour Seine River cruise past Notre Dame. Afternoon shopping at Galeries Lafayette.",
        meals: "Breakfast & Farewell Dinner",
        activity: "Seine Cruise & Luxury Shopping",
      },
      {
        day: 7,
        title: "Departure from Paris",
        description: "Private transfer to Paris CDG Airport for return flight.",
        meals: "Breakfast",
        activity: "Airport Transfer",
      },
    ],
  },
  {
    id: "pkg-006",
    title: "5-Day Singapore Highlights & Sentosa Island Fun",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1000&q=80",
    ],
    destination: "Singapore",
    country: "Singapore",
    durationNights: 4,
    durationDays: 5,
    category: "family",
    rating: 4.8,
    reviewCount: 780,
    pricePerPerson: 65000,
    originalPrice: 80000,
    currency: "INR",
    inclusions: [
      "Return Flights Included",
      "Marina Bay Sands Hotel Access",
      "Universal Studios VIP Pass",
      "Gardens by the Bay Light Show",
      "Night Safari Ticket",
    ],
    exclusions: ["Singapore e-Visa fee", "Personal expenses"],
    highlights: [
      "Universal Studios Singapore full day pass with Express rides",
      "Gardens by the Bay Cloud Forest & Flower Dome entry",
      "Night Safari tram ride through wildlife habitats",
    ],
    description:
      "The ultimate family getaway to Singapore. Includes entry to Universal Studios, Gardens by the Bay, Night Safari tram rides, and stay in prime city centre hotels.",
    hotelInfo: {
      name: "Carlton Hotel Singapore / Marina Bay Sands",
      stars: 5,
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1000&q=80",
      roomType: "Executive Marina View Room",
    },
    flightInfo: {
      airline: "Singapore Airlines / Air India",
      logo: "https://pics.avs.io/80/80/SQ.png",
      route: "BOM/DEL/BLR → Singapore (SIN) Non-Stop",
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Singapore & Night Safari",
        description:
          "Arrive at Jewel Changi Airport. Transfer to hotel. In the evening, visit the world's first Night Safari for a nocturnal wildlife tram ride.",
        meals: "Dinner",
        activity: "Night Safari Wildlife Tram",
      },
      {
        day: 2,
        title: "Universal Studios Singapore at Sentosa",
        description:
          "Full day at Universal Studios Singapore on Sentosa Island. Enjoy thrill rides like Battlestar Galactica and Transformers.",
        meals: "Breakfast",
        activity: "Universal Studios Sentosa",
      },
      {
        day: 3,
        title: "Gardens by the Bay & Marina Bay Sands Deck",
        description:
          "Explore Cloud Forest dome and Supertree Grove. Watch the spectacular Garden Rhapsody light show in the evening.",
        meals: "Breakfast",
        activity: "Gardens by the Bay & SkyPark",
      },
      {
        day: 4,
        title: "Singapore Flyer & Merlion Park Shopping",
        description:
          "Ride the giant Singapore Flyer wheel, visit Merlion Park, and shop at Orchard Road.",
        meals: "Breakfast",
        activity: "Singapore Flyer & Orchard Road",
      },
      {
        day: 5,
        title: "Jewel Changi Canopy Park & Departure",
        description:
          "Explore Jewel Changi Rain Vortex waterfall before taking your flight home.",
        meals: "Breakfast",
        activity: "Jewel Changi Tour & Departure",
      },
    ],
  },
];
