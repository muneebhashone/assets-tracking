import { createUser } from "@/actions/usersActions";
import { createCompanySchema } from "@/lib/form-schema";
import { checkIfCompanyExists } from "@/utils";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { ROLE } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company_name, email, name, password, city, country } =
      createCompanySchema.parse(body);

    if (!company_name)
      return NextResponse.json(
        {
          message: "Company name is required",
        },
        { status: 400 },
      );

    const exist = await checkIfCompanyExists(name);
    if (exist) {
      return NextResponse.json(
        {
          message:
            "Company with the same name already exists. Choose a different name",
        },
        { status: 400 },
      );
    }
    const company = await db.company.create({
      data: {
        name: company_name,
        city: city as string,
        country: country as string,
        address: "",
        industry: "",
        users: {},
      },
    });

    const { status } = await createUser({
      company: String(company.id),
      email,
      name,
      password,
      role: ROLE.ADMIN,
      permissions: [
        "CREATE_SHIPMENT",
        "DELETE_SHIPMENT",
        "EDIT_SHIPMENT",
        "VIEW_SHIPMENT",
        "VIEW_USER",
        "CREATE_USER",
        "EDIT_USER",
        "DELETE_USER",
      ],
    });

    return NextResponse.json(
      { message: "Company created successfully" },
      { status },
    );
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
