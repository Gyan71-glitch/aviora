const sql = require("mssql");
const crypto = require("crypto");

const config = {
  user: "travelpo",
  password: "tlh3a*0w$w9LLucM;",
  server: "115.124.106.157",
  database: "SRI_Master",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  port: 1433,
  connectionTimeout: 30000,
};

// AES Decryption matching SMT PasswordEncryptDecrypt.DecryptString
function decryptPassword(cipherText) {
  const keyStr = "E546C8DF278CD5931069B522E695D8F9";
  const key = Buffer.from(keyStr, "utf8");
  const iv = Buffer.alloc(16, 0); // Empty IV (16 zeros)

  try {
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(cipherText, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    return `[Decryption Failed: ${err.message}]`;
  }
}

async function run() {
  console.log("Connecting to SMT Database...");
  let pool;
  try {
    pool = await sql.connect(config);
    console.log("Connected successfully! Fetching user login details...");

    // Query active login credentials
    const result = await pool.request().query(`
      SELECT TOP 20 
        CompanyId, 
        LoginId, 
        password, 
        IsActive, 
        UserType 
      FROM tbl_UserLogin 
      WHERE IsActive = 1
    `);

    console.log("\n---------------- SMT LOGIN CREDENTIALS ----------------\n");
    result.recordset.forEach((row) => {
      const decrypted = decryptPassword(row.password);
      console.log(`Company: ${row.CompanyId}`);
      console.log(`Login ID: ${row.LoginId}`);
      console.log(`Password: ${decrypted}`);
      console.log(`User Type: ${row.UserType}`);
      console.log("------------------------------------------------------");
    });
  } catch (err) {
    console.error("Database query failed:", err.message);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

run();
