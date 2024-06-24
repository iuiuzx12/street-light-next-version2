// import createMiddleware from 'next-intl/middleware';

// const middleware = createMiddleware({
//   // Add locales you want in the app
//   locales: ['en', 'th'],

//   // Default locale if no match
//   defaultLocale: 'en',
  
// });

// export default middleware;

// export const config = {
//   // Match only internationalized pathnames
//   //matcher: ['/', '/(en|th)/:page*'],
//   matcher: [
//     '/' , '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|icon/*).*)'
//   ]
// };

// import {withAuth} from 'next-auth/middleware';
// import createIntlMiddleware from 'next-intl/middleware';
// import {NextRequest} from 'next/server';
// import {  AuthRule } from './app/rules';
// import { useRouter } from 'next/navigation'
// import { authMiddleware } from "@clerk/nextjs/server";
 
// const locales = ['en', 'th'];
// const publicPages = ['/', '/login'];
 
// const intlMiddleware = createIntlMiddleware({
//   locales,
//   //localePrefix: 'as-needed',
//   defaultLocale: 'th'
// });
 
// const authMiddleware = withAuth(
//   // Note that this callback is only invoked if
//   // the `authorized` callback has returned `true`
//   // and not for pages listed in `pages`.
  
//   function onSuccess(req) {
//     console.log("DDDDDDDDD");
//     return intlMiddleware(req);
    
//   },
//   {
    
//     callbacks: {
//       authorized: ({token}) => token != null
//     },
//     pages: {
//       signIn: '/login'
//     }
//   }
// );
 
// export default function middleware(req: NextRequest) {
//   console.log(AuthRule[0].rule);
//   if(AuthRule[1].rule == "Admin"){
//     //return redirect('/th/login');
//     //const router = useRouter();
//     //router.push("/")
//     //return NextResponse.redirect(new URL('/login', request.url))
//   }
  
//   //const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
//   const isPublicPage = false;
 
//   if (isPublicPage) {
//     return intlMiddleware(req);
//   } else {
//     //return intlMiddleware(req);
//     return (authMiddleware as any)(req);
//   }
// }


 
// export const config = {
//   //matcher: ['/' , '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|icon/*).*)']
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };

//import { getToken } from "next-auth/jwt";
import {withAuth} from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';
console.log("isPublicPage");
const locales = ['en', 'th'];
const publicPages = ['/', '/login', '/dashboard-period'];
 
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'th'
});
 
const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({token}) => token != null
    },
    pages: {
      signIn: '/login',
    },
    secret : 'your-256-bit-secret'
  }
);

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
  console.log(isPublicPage);
  console.log(req.nextUrl.pathname);
  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  //matcher: ['/((?!api|_next|.*\\..*).*)']
  matcher: [ '/' , '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|icon/*).*)' ]
};