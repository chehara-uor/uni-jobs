// src/lib/wp.ts
const WP_BASE = import.meta.env.WP_BASE ?? 'https://unijobs.my.id/';
import type {JobData} from '@lib/types'
// export interface Post {
//   id: number;
//   slug: string;
//   title: { rendered: string };
//   location: { rendered: string };
//   // add other fields you use…
// }

async function wpFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${WP_BASE}${endpoint}`, options);
  if (!res.ok) {
    throw new Error(`WP API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// Fetch list of jobs
export async function fetchJobs(page = 1, perPage = 10) {
  return wpFetch<any[]>(
    `/wp-json/remoteasia/v2/jobs?per_page=${perPage}&page=${page}&_fields=title,slug,job_experience,job_listing_type,job_level,image_url,job_expires`
  );
}

export async function fetchCategories() {
  return wpFetch<any[]>(
    `/wp-json/remoteasia/v2/job-categories`
  );
}

export async function fetchJobsPages(perPage = 100): Promise<JobData[]> {
  const per = perPage;
  const first = await fetch(`${WP_BASE}/wp-json/remoteasia/v2/jobs?per_page=${per}`);
  if (!first.ok) throw new Error(`WP error ${first.status}`);
  const totalPages = Number(first.headers.get('X-WP-TotalPages')) || 1;
  const firstBatch = await first.json();
  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetch(`${WP_BASE}/wp-json/wp/v2/jobs?per_page=${per}&page=${i + 2}`).then(r => r.json())
    )
  );
  return [firstBatch, ...rest].flat();
}



//Later Use

// export async function fetchPostBySlug(slug: string): Promise<Post | null> {
//   const res = await fetch(`${WP_BASE}/wp-json/wp/v2/jobs?slug=${slug}`);
//   if (!res.ok) throw new Error(`WP error ${res.status}`);
//   const arr = await res.json();
//   return arr?.[0] ?? null;
// }

// export async function fetchAllJobsSlugs(): Promise<string[]> {
//   const perPage = 100;
//   const first = await fetch(`${WP_BASE}/wp-json/wp/v2/jobs?per_page=${perPage}&_fields=slug`);
//   if (!first.ok) throw new Error(`WP error ${first.status}`);
//   const totalPages = Number(first.headers.get('X-WP-TotalPages')) || 1;

//   const firstBatch = await first.json();
//   const rest = await Promise.all(
//     Array.from({ length: totalPages - 1 }, (_, i) =>
//       fetch(`${WP_BASE}/wp-json/wp/v2/jobs?per_page=${perPage}&page=${i + 2}&_fields=slug`).then(r => r.json())
//     )
//   );

//   return [firstBatch, ...rest].flat().map((p: { slug: string }) => p.slug);
// }


