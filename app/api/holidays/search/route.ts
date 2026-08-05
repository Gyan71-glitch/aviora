import { NextResponse } from "next/server";
import { mockHolidayPackages } from "@/lib/mock-data/holidays";

const SMT_DB_CONFIG = {
  server: "115.124.106.157",
  database: "SRI_Extranet",
  user: "travelpo",
  password: "tlh3a*0w$w9LLucM",
  port: 1433,
  options: { trustServerCertificate: true, encrypt: false },
  connectionTimeout: 10000,
  requestTimeout: 15000,
};

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
}

function normalizeSMTPackage(pkg: any, index: number) {
  const days = pkg.Days || 3;
  const nights = Math.max(1, days - 1);
  const rawPrice = pkg.Twin || pkg.SGL || pkg.MinimumDeposit || 12500;
  const pricePerPerson = Math.round(rawPrice > 100 ? rawPrice : 12500);

  return {
    id: `smt-pkg-${pkg.PackageId}`,
    title: pkg.PackageName?.trim() || "SMT Holiday Package",
    destination: pkg.PackageName?.includes("Uttrakhand")
      ? "Uttarakhand"
      : pkg.PackageName?.includes("Himachal")
      ? "Himachal Pradesh"
      : pkg.PackageName?.includes("Shimla")
      ? "Shimla"
      : pkg.PackageName?.includes("Haridwar") || pkg.PackageName?.includes("Mussoorie")
      ? "Mussoorie & Rishikesh"
      : "India",
    country: "India",
    duration: `${nights}N/${days}D`,
    nights,
    image:
      index % 3 === 0
        ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
        : index % 3 === 1
        ? "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80"
        : "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&q=80",
    galleryImages: [],
    pricePerPerson,
    originalPrice: Math.round(pricePerPerson * 1.2),
    currency: "INR",
    rating: 4.6 + (index % 4) * 0.1,
    reviewCount: 150 + index * 25,
    category: "domestic",
    inclusions: [
      "Accommodation in Selected Hotels",
      "Daily Breakfast & Dinner",
      "All Transfers & Sightseeing",
      "GST & Local Taxes",
    ],
    highlights: [stripHtml(pkg.ShortDesc)].filter(Boolean),
    featured: index < 4,
    smtPackageId: pkg.PackageId,
    smtToken: null,
    source: "smt_db",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = (searchParams.get("destination") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const maxPrice = Number(searchParams.get("maxPrice")) || 250000;
  const sortBy = searchParams.get("sortBy") || "popularity";

  let packages: any[] = [];
  let source = "mock";

  try {
    const sql = (await import("mssql")).default;
    let pool: any;
    try {
      pool = await sql.connect(SMT_DB_CONFIG as any);
    } catch {
      pool = await sql.connect(SMT_DB_CONFIG as any);
    }

    const filterClause = destination
      ? `AND (LOWER(p.PackageName) LIKE '%${destination.replace(/'/g, "")}%' OR LOWER(p.ShortDesc) LIKE '%${destination.replace(/'/g, "")}%')`
      : "";

    const pkgResult = await pool.request().query(`
      SELECT DISTINCT
        p.PackageId, p.PackageName, p.PackageCode, p.Days, p.ShortDesc,
        MAX(c.Twin) as Twin, MAX(c.SGL) as SGL, MAX(c.MinimumDeposit) as MinimumDeposit
      FROM tbl_Pkg_Package_Header p
      LEFT JOIN tbl_Pkg_Package_Costing c ON p.PackageId = c.PackageId
      WHERE p.Status = 1
        ${filterClause}
      GROUP BY p.PackageId, p.PackageName, p.PackageCode, p.Days, p.ShortDesc
      ORDER BY p.PackageId
    `);

    if (pkgResult.recordset.length > 0) {
      packages = pkgResult.recordset.map((pkg: any, idx: number) =>
        normalizeSMTPackage(pkg, idx)
      );
      source = "smt_db";
    }

    await pool.close();
  } catch (err: any) {
    console.error("[HolidaysSearch] SMT DB error:", err.message);
  }

  // ── Apply strict destination & category filters ──────────────────────────
  packages = packages.filter((pkg) => {
    if (
      destination &&
      !pkg.destination.toLowerCase().includes(destination) &&
      !pkg.country.toLowerCase().includes(destination) &&
      !pkg.title.toLowerCase().includes(destination)
    ) {
      return false;
    }
    if (category && pkg.category !== category) return false;
    if (pkg.pricePerPerson > maxPrice) return false;
    return true;
  });

  // Sort
  if (sortBy === "price_asc") {
    packages.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
  } else if (sortBy === "price_desc") {
    packages.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
  } else if (sortBy === "rating") {
    packages.sort((a, b) => b.rating - a.rating);
  }

  return NextResponse.json({
    success: true,
    total: packages.length,
    packages,
    source,
  });
}
