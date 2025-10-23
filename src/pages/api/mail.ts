export const prerender = false;
import type { APIRoute } from "astro";
import axios from "axios";

export const POST: APIRoute = async ({ request }) => {
  const mailData = await request.json();
  const username = import.meta.env.WP_A_USER;
  const appPassword = import.meta.env.WP_APP_A_PASSWORD;
  const token = btoa(`${username}:${appPassword}`);
  try {
     await axios.post("https://unijobs.my.id/wp-json/remoteasia/v2/automate", mailData, {
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/json",
        },
      });

    return new Response("Email sent successfully", { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response("Failed to send email", { status: 500 });
  }
};