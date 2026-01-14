import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // console.log("Request recieved for registering a user");
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email & Password Are Required",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: `A user with email: ${email} already exists.`,
        },
        { status: 400 }
      );
    }

    await User.create({ email, password });

    return NextResponse.json(
      { message: "User registered Successfully" },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error during registering user", error);
    return NextResponse.json(
      { error: "Failed to register a user" },
      { status: 500 }
    );
  }
}
