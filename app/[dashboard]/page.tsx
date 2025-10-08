"use client";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect } from "react";

const Page = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    } else {
      window.location.href = "/dashboard/overview";
    }
  }, [user]);
  return <div>Home Page</div>;
};

export default Page;
