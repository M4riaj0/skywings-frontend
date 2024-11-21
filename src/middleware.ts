import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Request to", request.nextUrl);
//   if (request.nextUrl.pathname.includes("/home/")) {
//     const token = request.cookies.get("token");
//     // console.log(token)
//     if (!token || token.value == '') {
//       // return NextResponse.rewrite(new URL('/', request.url))
//       return NextResponse.redirect('http://localhost:3000/auth/login')
//     }
//     // const tokenPayload = JSON.parse(atob(token.value.split('.')[1]));
//     // const userRole = tokenPayload.role;
//     // console.log("User role:", userRole);
//     // if (request.nextUrl.pathname.includes('/home/admins/')) {
//     //   if (userRole != 'ROOT') {
//     //     return NextResponse.redirect('http://localhost:3000/')
//     //   }
//     // }
//     return NextResponse.next();
//   }
  return NextResponse.next();
}

export const config = {
  matcher: '/home/:path*',
}