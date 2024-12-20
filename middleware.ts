import {withAuth} from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import {NextFetchEvent, NextRequest, NextResponse} from 'next/server';

console.log("isPublicPage1");
const locales = ['en', 'th'];
const publicPages = ['/', '/login', '/logout', '/not-auth', '/dashboard-period', '/dashboard-daily', '/map-total', '/setting-personal' ,'/control-group' , '/control-individual' ];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'th'
});
 
const authMiddleware = withAuth(
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


export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
  console.log("isPublicPage2");
  console.log(isPublicPage);
  console.log(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    console.log(555)
    return (authMiddleware as any)(req);
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  //matcher: ['/((?!api|_next|.*\\..*).*)']
  matcher: [ '/' , '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest|icon/*|img/*).*)' ]
};