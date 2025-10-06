import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface AuthServerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default async function AuthServer({ children, fallback }: AuthServerProps) {
  const { userId } = await auth();
  
  if (!userId) {
    if (fallback) {
      return <>{fallback}</>;
    }
    redirect('/sign-in');
  }
  
  return <>{children}</>;
}
