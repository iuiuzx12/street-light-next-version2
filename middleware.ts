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
import { cookies } from 'next/headers';
import {NextFetchEvent, NextRequest, NextResponse} from 'next/server';
//import useSWR, { Middleware, SWRHook } from 'swr'

console.log("isPublicPage");
const locales = ['en', 'th'];
const publicPages = ['/', '/login', '/logout', '/not-auth', '/dashboard-period', '/dashboard-daily', '/map-total' ];


 
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'th'
});
 
const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    console.log("onSuccess")
    
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({token}) => token != null
    },
    pages: {
      signIn: '/not-auth',
    },
    secret : 'your-256-bit-secret'
  }
);

// const swrMiddleware: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {
//   // ...
//   return useSWRNext(key, fetcher, config)
// }


export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  var token = cookies().get("token");
  
  // const responseUser = await fetch("http://localhost:8012/StreetLight/getDataUser", {
  //   method: "POST",
  //   headers: {
  //     Authorization: "Bearer " + token?.value,
  //   },
  // });

  // if(responseUser.status === 200){
  //   var DataUser = await responseUser.json().finally();
    
  //   switch (DataUser.userRoleId) {
  //     case '1':
  //         console.log("AAAAAA")
  //         break;
  //     case '2' :
  //         var USER_RULE = "Admin";
  //     default:
  //         break;
  //   }
  // }

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
  matcher: [ '/' , '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|icon/*|img/*).*)' ]
};