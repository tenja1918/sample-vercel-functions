import { VercelRequest, VercelResponse } from "../node_modules/@vercel/node";

export default function (req: VercelRequest, res: VercelResponse) {
  const { name = "World" } = req.query;
  res.send(`Hello ${name}`);
}
