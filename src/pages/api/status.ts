export const prerender = false;
import type { APIRoute } from 'astro';

const API_URL = 'https://api.airtable.com/v0/appbMeEb43JwYvPie/Application/';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json() as { id?: string };
    console.log(id);
    if (!id || typeof id !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid id' }), { status: 400 });
    }

    const API = import.meta.env.API_TOKEN;
    if (!API) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration: API_TOKEN missing' }), { status: 500 });
    }

    const upstream = await fetch(`${API_URL}${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${API}` }
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      return new Response(JSON.stringify({ error: 'Airtable request failed', detail }), { status: 502 });
    }

    const data = await upstream.json();

    return new Response(
      JSON.stringify({
        id: data.id,
        name: data.fields?.candidate_name ?? null,
        jobTitle: data.fields?.job_title ?? null,
        applyDate: data.createdTime ?? null,
        status: data.fields?.['Application Status'] ?? null
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }
};
