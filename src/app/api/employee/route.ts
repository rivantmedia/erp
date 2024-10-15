import { NextRequest } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const employee = await prisma.employee.create({
      data: data,
    });
    return Response.json(employee, { status: 201 });
  } catch (e: unknown | Prisma.PrismaClientKnownRequestError) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code == "P2002"
    ) {
      return Response.json(
        { message: "Employee already exist." },
        { status: 400 }
      );
    }
    console.log("Failed to create employee", e);
    return Response.json(
      { message: "Failed to create employee" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const employees = await prisma.employee.findMany();
    return Response.json(employees, { status: 200 });
  } catch (error) {
    console.log("Failed to get employees", error);
    return Response.json(
      { message: "Failed to get employees" },
      { status: 500 }
    );
  }
}
