import axios from "./ajax";

export async function createOrder(order: any): Promise<any> {
  return await axios.post("/wxread/orders/create", order);
}
