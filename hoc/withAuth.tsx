'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent: React.FC) => {
  return function AuthComponent(props: any) {
    const { authorized, loading } = useAuth();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (!loading) {
        if (!authorized) {
          router.replace('/');
        } else {
          setChecked(true);
        }
      }
    }, [authorized, loading, router]);

    if (loading || !checked) return <p>Loading...</p>;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
