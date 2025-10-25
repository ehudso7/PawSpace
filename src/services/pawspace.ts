import axios from "axios";
import { PostPayload } from "../types/media";

const apiBaseUrl = process.env.PAWSPACE_API_URL ?? "";

const client = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
});

export async function postVideoToPawSpace(payload: PostPayload): Promise<{ id: string }> {
  const response = await client.post("/api/posts", payload);
  return response.data as { id: string };
}