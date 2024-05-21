import { createUser } from "@/actions/usersActions";
import { createCompanySchema } from "@/lib/form-schema";
import { checkIfCompanyExists } from "@/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, email, name, password, city, country } =
      createCompanySchema.parse(body);
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
    const { message, status } = await createUser();
    return NextResponse.json({ message }, { status });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
