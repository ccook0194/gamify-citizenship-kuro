'use client'

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (WrappedComponent: React.FC) => {
  return function AuthComponent(props: any) {
    const { authorized, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !authorized) {
        router.replace("/"); // Redirect to login if not authenticated
      }
    }, [authorized, loading, router]);

    if (loading) return <p>Loading...</p>;
    if (!authorized) return null; // Prevent flashing of protected content

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
