import { EmailSubscription } from "@/types/emailSubscription";
import axios from "./ajax";

export async function getSubscriptionByUserId(): Promise<any> {
  return await axios.get("/wxread/subscription/getSubscriptionByUserId");
}

export async function saveSubscription(email: EmailSubscription): Promise<any> {
  return await axios.post("/wxread/subscription/save", email);
}
