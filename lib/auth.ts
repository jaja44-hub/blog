// NextAuth configuration for future integration
// Currently not used - token-based authentication is active
// This will be re-enabled when NextAuth integration is needed
// import NextAuthOptions from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';

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

// NextAuth configuration will be added here when needed
// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         // Database integration will be added in subsequent tasks
//       },
//     }),
//   ],
//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60,
//   },
//   pages: {
//     signIn: '/admin/login',
//     error: '/admin/login',
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as UserRole;
//       }
//       return session;
//     },
//   },
// };

// Type declarations for future NextAuth integration
// declare module 'next-auth' {
//   interface User {
//     id: string;
//     role: UserRole;
//   }
//   interface Session {
//     user: {
//       id: string;
//       email: string;
//       name?: string | null;
//       role: UserRole;
//     };
//   }
// }
// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string;
//     role: UserRole;
//   }
// }