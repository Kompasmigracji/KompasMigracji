import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

function clean(s) {
  if (!s) return "";
  let r = s;
  while (r.length > 0 && r.charCodeAt(0) === 65279) r = r.slice(1);
  r = r.split(String.fromCharCode(13)).join("");
  return r.trim();
}

function getClientConfig() {
  const pghost = clean(process.env.PGHOST);
  if (pghost) {
    return {
      host: pghost,
      port: Number(clean(process.env.PGPORT)) || 5432,
      user: clean(process.env.PGUSER) || "postgres",
      password: clean(process.env.PGPASSWORD),
      database: clean(process.env.PGDATABASE) || "postgres",
      ssl: clean(process.env.PGSSL) === "false" ? false : { rejectUnauthorized: false },
    };
  }
  const postgresUrl = clean(process.env.POSTGRES_URL);
  if (postgresUrl) {
    try {
      const u = new URL(postgresUrl);
      return {
        host: u.hostname,
        port: parseInt(u.port) || 5432,
        user: decodeURIComponent(u.username),
        password: decodeURIComponent(u.password),
        database: (u.pathname || "/postgres").replace(/^\//, "") || "postgres",
        ssl: { rejectUnauthorized: false },
      };
    } catch {
      return { connectionString: postgresUrl, ssl: { rejectUnauthorized: false } };
    }
  }
  return { host: "localhost", port: 5432, user: "postgres", password: "", database: "postgres", ssl: false };
}

async function run() {
  const config = getClientConfig();
  const client = new pg.Client(config);
  await client.connect();
  
  try {
    // 1. Get all admins
    const res = await client.query("SELECT id, email, full_name, role FROM kompas_users WHERE role IN ('admin', 'moderator')");
    console.log(`Found ${res.rows.length} admins/moderators.`);
    
    for (const user of res.rows) {
      // 2. Check if they already have a profile
      const prof = await client.query("SELECT user_id FROM kompas_member_profiles WHERE user_id = $1", [user.id]);
      if (prof.rows.length > 0) {
        console.log(`User ${user.full_name} (${user.email}) is already in the trade union.`);
        continue;
      }
      
      // 3. Create profile
      const memberNo = "KM-" + String(user.id).padStart(5, "0");
      await client.query(
        "INSERT INTO kompas_member_profiles (user_id, member_no, category, city) VALUES ($1, $2, $3, $4)",
        [user.id, memberNo, "standard", null]
      );
      console.log(`Added ${user.full_name} (${user.email}) to the trade union as ${memberNo}.`);
    }
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
