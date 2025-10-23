export const prerender = false;
import type { APIRoute } from "astro";
import axios from "axios";

export const POST: APIRoute = async ({ request }) => {
  const API_URL = "https://unijobs.my.id/wp-json/wp/v2/users";
  const data = await request.json();
  const username = import.meta.env.WP_A_USER;
  const appPassword = import.meta.env.WP_APP_A_PASSWORD;
  const token = btoa(`${username}:${appPassword}`);
  try {
    const response = await axios
      .post(
        API_URL,
        data,
        {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          },
        }
    );
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response("Error registering user", { status: 500 });
  }
};