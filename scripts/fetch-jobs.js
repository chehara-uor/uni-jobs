import 'dotenv/config';
import fs from "node:fs/promises";
import path from "node:path";

const WP_URL = process.env.WP_BASE;
if (!WP_URL) {
  console.error("Missing env var: WP_BASE");
  process.exit(1);
}

const outFile = path.resolve("src/data/jobs.json");

async function fetchAll() {
  let all = [];
  let page = 1;
  let perPage = 100;

  while (true) {
    const res = await fetch(`${WP_URL}/wp-json/remoteasia/v2/jobs?per_page=${perPage}&page=${page}`);
    if (!res.ok) {
      if (res.status === 400 || res.status === 404) break; // no more pages
      throw new Error(`WP error ${res.status}`);
    }
    const data = await res.json();
    if (data.length === 0) break;

    // Map posts data ( for my purpose )
    all = all.concat(
      data.map(p => ({
        id: p.id,
        title:
        typeof p.title === "string" ? p.title : (p.title?.rendered ?? ""),
        company: p.company || p.meta?.company || "Uni Today",
        image_url: p.image_url,
        slug: p.slug,
        date: p.job_expires ?? "",
        level: p.job_level ?? p.meta?.job_level ?? "",
        type: p.job_listing_type ?? p.meta?.job_listing_type ?? "",
        experience: p.job_experience ?? p.meta?.job_experience ?? "",
      }))
    );

    if (data.length < perPage) break;
    page++;
  }
  return all;
}

const posts = await fetchAll();
await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, JSON.stringify(posts, null, 2), "utf-8");
console.log(`Wrote ${posts.length} jobs → ${outFile}`);
