import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const employee = await prisma.employee.create({
      data: data,
    });
    return Response.json(employee, { status: 201 });
  } catch (e) {
    console.log("Failed to create employee", e);
    return Response.json(
      { message: "Failed to create employee" },
      { status: 500 }
    );
  }
}
