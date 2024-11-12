// export function middleware(request: Request) {
//   return NextResponse.next();
// }

import { auth } from './lib/auth';

export default auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
