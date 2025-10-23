export const prerender = false;
import type { APIRoute } from "astro";
import axios from "axios";

export const POST: APIRoute = async ({ request }) => {
    const WP_BASE = import.meta.env.WP_BASE ?? 'https://unijobs.my.id/';
    const body = await request.json();
    const username = import.meta.env.WP_USER;
    const appPassword = import.meta.env.WP_APP_PASSWORD;
    const token = btoa(`${username}:${appPassword}`);
    try {
    const response = await axios.post(
      `${WP_BASE}/wp-json/wp/v2/resumes/`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      }
    );

    return new Response(
      JSON.stringify({
        id: response.data.id,
        date: response.data.date,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const message =
      err.response?.data?.message ||
      err.message ||
      "Unknown error communicating with WordPress";

    return new Response(
      JSON.stringify({ error: message }),
      { status }
    );
  }
};