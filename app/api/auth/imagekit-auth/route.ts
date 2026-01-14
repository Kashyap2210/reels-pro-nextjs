// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  // Your application logic to authenticate the user
  // For example, you can check if the user is logged in or has the necessary permissions
  // If the user is not authenticated, you can return an error response

  // console.log(
  //   "process.env.IMAGE_KIT_PRIVATE_KEY",
  //   process.env.IMAGE_KIT_PRIVATE_KEY
  // );
  // console.log(
  //   "process.env.IMAGE_KIT_PUBLIC_KEY",
  //   process.env.IMAGE_KIT_PUBLIC_KEY
  // );

  try {
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGE_KIT_PRIVATE_KEY as string, // Never expose this on client side
      publicKey: process.env.IMAGE_KIT_PUBLIC_KEY as string,
      // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
      // token: "random-token", // Optional, a unique token for  request
    });
    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.log("Error during the imagekit authentication", error);
    return NextResponse.json(
      { error: "Imagekit Auth Failed" },
      { status: 500 }
    );
  }
}
