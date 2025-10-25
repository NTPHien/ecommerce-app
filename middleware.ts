import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Các trang yêu cầu đăng nhập
    const protectedRoutes = ['/products/manage'];
    
    if (!session && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}