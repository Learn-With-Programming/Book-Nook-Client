import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ message: "unauthorized access" }, { status: 401 });
  }

  if (!process.env.JWT_SECRET) {
    return Response.json(
      { message: "JWT_SECRET is not configured on the server." },
      { status: 500 },
    );
  }

  const token = jwt.sign(
    { email: session.user.email, name: session.user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return Response.json({ token });
}
