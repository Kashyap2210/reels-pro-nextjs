"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // always import this from next/navigation
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Your password does not match.");
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = res.json();
      if (!res.ok) {
        console.log("Error during registering user", error);
        setError("Registration failed");
      }

      router.push("/login");
    } catch (error) {}
  };

  return (
    <div>
      <input type="text" placeholder="Type here" className="input" />
    </div>
  );
}

export default Register;
