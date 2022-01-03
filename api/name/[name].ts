import { VercelRequest, VercelResponse } from "@vercel/node";

export default function (req: VercelRequest, res: VercelResponse) {
//   const { name = "World" } = req.query;
const name = req.query.name;
  res.send(`my name of ${name}`);
}
