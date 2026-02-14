import axios from "axios";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET}`,
    "Content-Type": "application/json",
  },
});

// // ─────────────────────────────────────────────
// // CREATE PLAN
// export async function createPaystackPlan({
//   name,
//   amount,
//   interval,
//   currency = "NGN",
// }: {
//   name: string;
//   amount: number; // in kobo
//   interval: "daily" | "weekly" | "monthly" | "annually";
//   currency?: string;
// }) {
//   const res = await paystack.post("/plan", {
//     name,
//     amount,
//     interval,
//     currency,
//   });
//   return res.data.data;
// }

// ─────────────────────────────────────────────
// INITIALIZE TRANSACTION (with optional plan)
export async function initializeTransaction({
  email,
  amount,
  plan,
  callback_url,
  metadata,
}: {
  email: string;
  amount: number; // in kobo
  callback_url: string;
  plan?: string; // paystack_plan_code (PLN_xxx)
  metadata?: Record<string, any>;
}) {
  const body: any = {
    email,
    amount,
    callback_url,
    ...(plan && { plan }),
    ...(metadata && { metadata }),
  };

  const res = await paystack.post("/transaction/initialize", body);
  return res.data.data; // authorization_url, reference, access_code
}


export async function verifyTransaction(reference: string) {
  const res = await paystack.get(`/transaction/verify/${reference}`);
  return res.data.data;
}


export async function createSubscription({
  customer,
  plan,
  authorization,
}: {
  customer: string; // CUS_xxx
  plan: string; // PLN_xxx
  authorization: string; // AUTH_xxx
}) {
  const res = await paystack.post("/subscription", {
    customer,
    plan,
    authorization,
  });
  return res.data.data;
}


export async function cancelSubscription(subscription_code: string) {
  const res = await paystack.post("/subscription/disable", {
    code: subscription_code,
    token: "AUTH_6t28n98ljq",
  });
  return res.data;
}


export async function fetchPlan(plan_code: string) {
  const res = await paystack.get(`/plan/${plan_code}`);
  return res.data.data;
}


export async function fetchCustomer(customer_code: string) {
  const res = await paystack.get(`/customer/${customer_code}`);
  return res.data.data;
}
