"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Header() {
  const { data: session } = useSession();

  const handleSignout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log("Error during signout", error);
    }
  };

  return (
    <div>
      <button onClick={handleSignout}>
        {session ? (
          <div>Welcome</div>
        ) : (
          <div>
            <Link href={"/login"}>Login</Link>
            <Link href={"/register"}>Register</Link>
          </div>
        )}
      </button>
    </div>
  );
}

export default Header;
