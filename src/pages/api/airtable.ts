export const prerender = false;
import type { APIRoute } from "astro";
import axios from "axios";

export const POST: APIRoute = async ({ request }) => {
  try {
    const airtablePayload = await request.json();
    const AIRTABLE_URL =
      import.meta.env.AIRTABLE_BASE ??
      "https://api.airtable.com/v0/appbMeEb43JwYvPie/Application";

    const response = await axios.post(AIRTABLE_URL, airtablePayload, {
      headers: {
        Authorization: `Bearer ${import.meta.env.API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return new Response(
      JSON.stringify({ id: response.data.records[0].id }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
};


