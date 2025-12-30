import Lob from "lob";

const apiKey = process.env.LOB_API_KEY;

if (!apiKey) {
  throw new Error("LOB_API_KEY is not set");
}

export const lob = new Lob({ apiKey });
