import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Define role types
export type UserRole = 'owner' | 'administrator' | 'managing_editor' | 'editor' | 'author' | 'moderator' | 'analyst' | 'support' | 'reader';

// Permission hierarchy
const roleHierarchy: Record<UserRole, number> = {
  owner: 100,
  administrator: 90,
  managing_editor: 80,
  editor: 70,
  author: 60,
  moderator: 50,
  analyst: 40,
  support: 30,
  reader: 10,
};

// Check if user has required role level
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Simplified NextAuth configuration for gradual integration
// Database integration will be added in subsequent tasks
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Temporary: Check against environment variables for NextAuth integration testing
        // Database integration will be completed in Task 2.1
        try {
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;
          
          if (credentials.email === adminEmail && credentials.password === adminPassword) {
            return {
              id: 'admin',
              email: adminEmail,
              name: 'Admin User',
              role: 'owner' as UserRole,
            };
          }
          
          throw new Error('Invalid credentials');
        } catch (error) {
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    id: string;
    role: UserRole;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}