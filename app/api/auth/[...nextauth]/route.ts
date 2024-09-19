import NextAuth from 'next-auth';
import auth from '../../../auth';

const handler = NextAuth(auth);
console.log("NextAuth");
export {handler as GET, handler as POST};