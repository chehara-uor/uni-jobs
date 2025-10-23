export const prerender = false;
import type { APIRoute } from "astro";
import axios from "axios";

export const POST: APIRoute = async ({ request }) => {
  const API_URL = "https://unijobs.my.id/wp-json/wp/v2/job-listings";
  const jobData = await request.json();
  const username = import.meta.env.WP_A_USER;
  const appPassword = import.meta.env.WP_APP_A_PASSWORD;
  const token = btoa(`${username}:${appPassword}`);

    try {
        await axios.post(
        API_URL,
        jobData,
        {
            headers: {
                Authorization: `Basic ${token}`,
                "Content-Type": "application/json",
            },
        });
        return new Response(JSON.stringify({ message: "Job created successfully" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error creating job:", error);
        return new Response(JSON.stringify({ error: "Error creating job" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        });
    }

}