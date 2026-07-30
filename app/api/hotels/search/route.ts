import { NextResponse } from "next/server";
import { mockHotels } from "@/lib/mock-data/hotels";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination")?.toLowerCase() || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 200000;
  const starRating = searchParams.getAll("stars").map(Number);
  const sortBy = searchParams.get("sortBy") || "popularity";

  let filteredHotels = mockHotels.filter((hotel) => {
    // Destination filter
    if (
      destination &&
      !hotel.city.toLowerCase().includes(destination) &&
      !hotel.name.toLowerCase().includes(destination) &&
      !hotel.country.toLowerCase().includes(destination)
    ) {
      return false;
    }

    // Price filter
    if (hotel.pricePerNight < minPrice || hotel.pricePerNight > maxPrice) {
      return false;
    }

    // Star rating filter
    if (starRating.length > 0 && !starRating.includes(hotel.stars)) {
      return false;
    }

    return true;
  });

  // Sorting
  if (sortBy === "price_asc") {
    filteredHotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (sortBy === "price_desc") {
    filteredHotels.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (sortBy === "rating") {
    filteredHotels.sort((a, b) => b.rating - a.rating);
  }

  return NextResponse.json({
    success: true,
    total: filteredHotels.length,
    hotels: filteredHotels,
  });
}
