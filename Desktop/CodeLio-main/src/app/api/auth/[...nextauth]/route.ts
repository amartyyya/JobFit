import NextAuth from "next-auth/next";
import { authOptions } from "./options";

// Initialize NextAuth with the provided authOptions
const handler = NextAuth(authOptions);

// Export handler for both GET and POST requests
export { handler as GET, handler as POST };
