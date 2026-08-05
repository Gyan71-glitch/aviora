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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Handle SMT DB packages (e.g. smt-pkg-2)
  if (id.startsWith("smt-pkg-")) {
    const packageId = parseInt(id.replace("smt-pkg-", ""));
    if (!isNaN(packageId)) {
      try {
        const sql = (await import("mssql")).default;
        let pool: any;
        try {
          pool = await sql.connect(SMT_DB_CONFIG as any);
        } catch {
          pool = await sql.connect(SMT_DB_CONFIG as any);
        }

        const res = await pool.request().query(`
          SELECT p.PackageId, p.PackageName, p.PackageCode, p.Days, p.ShortDesc, p.LongDesc,
                 c.Twin, c.SGL, c.MinimumDeposit
          FROM tbl_Pkg_Package_Header p
          LEFT JOIN tbl_Pkg_Package_Costing c ON p.PackageId = c.PackageId
          WHERE p.PackageId = ${packageId}
        `);

        await pool.close();

        if (res.recordset.length > 0) {
          const raw = res.recordset[0];
          const days = raw.Days || 3;
          const nights = Math.max(1, days - 1);
          const rawPrice = raw.Twin || raw.SGL || raw.MinimumDeposit || 12500;
          const pricePerPerson = Math.round(rawPrice > 100 ? rawPrice : 12500);

          const pkg = {
            id,
            title: raw.PackageName?.trim() || "SMT Holiday Package",
            destination: raw.PackageName?.includes("Uttrakhand")
              ? "Uttarakhand"
              : raw.PackageName?.includes("Himachal")
              ? "Himachal Pradesh"
              : raw.PackageName?.includes("Shimla")
              ? "Shimla"
              : "India",
            country: "India",
            duration: `${nights}N/${days}D`,
            nights,
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            galleryImages: [
              "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
              "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&q=80",
            ],
            pricePerPerson,
            originalPrice: Math.round(pricePerPerson * 1.2),
            currency: "INR",
            rating: 4.8,
            reviewCount: 240,
            category: "domestic",
            inclusions: [
              "Accommodation in Selected Hotels",
              "Daily Breakfast & Dinner",
              "All Sightseeing & Transfers",
              "GST & All Applicable Taxes",
            ],
            highlights: [stripHtml(raw.ShortDesc), stripHtml(raw.LongDesc)].filter(Boolean),
            description: stripHtml(raw.LongDesc) || stripHtml(raw.ShortDesc) || "SMT Curated Holiday Package",
            smtPackageId: raw.PackageId,
            source: "smt_db",
          };

          return NextResponse.json({ success: true, package: pkg });
        }
      } catch (err: any) {
        console.error("[HolidayDetail] SMT DB error:", err.message);
      }
    }
  }

  // Fallback to mock packages
  const pkg = mockHolidayPackages.find((p) => p.id === id);

  if (!pkg) {
    return NextResponse.json(
      { success: false, message: "Package not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    package: pkg,
  });
}
