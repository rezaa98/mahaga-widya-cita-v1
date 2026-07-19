const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL || "postgresql://postgres.ahjpvkzpyxfhbuhwbfqb:!SampaiDengan10@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres" });
client.connect().then(() => {
  return client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
}).then(res => {
  const tables = res.rows.map(r => r.table_name);
  console.log("Has journals:", tables.includes('journals'));
  console.log("Has featuredImage in articles:", tables.includes('articles'));
  return client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'articles';");
}).then(res => {
  console.log("Article columns:", res.rows.map(r => r.column_name).join(', '));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
