import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { userQueries, sessionQueries, auditQueries } from './db';

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

// NextAuth configuration
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

        const user = await userQueries.findByEmail(credentials.email);
        
        if (!user || !user.password_hash) {
          throw new Error('Invalid credentials');
        }

        if (user.status !== 'active') {
          throw new Error('Account is not active');
        }

        const isValid = await compare(credentials.password, user.password_hash);
        
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        // Update last active
        await userQueries.updateLastActive(user.id);

        // Log the login
        await auditQueries.log({
          actorId: user.id,
          action: 'login',
          objectType: 'user',
          objectId: user.id,
          metadata: { method: 'credentials' },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.display_name,
          role: user.role,
        };
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
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Handle session updates
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
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
  
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log sign in event
      if (user) {
        await auditQueries.log({
          actorId: user.id as string,
          action: 'sign_in',
          objectType: 'user',
          objectId: user.id as string,
          metadata: { provider: account?.provider },
        });
      }
    },
    
    async signOut({ token, session }) {
      // Log sign out event
      if (token?.id) {
        await auditQueries.log({
          actorId: token.id as string,
          action: 'sign_out',
          objectType: 'user',
          objectId: token.id as string,
        });
      }
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