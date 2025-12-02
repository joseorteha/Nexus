import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccess, TipoUsuario } from '@/lib/permissions';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/auth/login', '/auth/register', '/', '/auth/register/empresa'];
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  // Si no hay sesión y la ruta no es pública, redirigir a login
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Si hay sesión, verificar onboarding y permisos
  if (session) {
    const { data: userData } = await supabase
      .from('usuarios')
      .select('onboarding_completed, tipo_usuario')
      .eq('id', session.user.id)
      .single();

    // Si no completó onboarding y no está en la página de onboarding, redirigir
    if (
      !userData?.onboarding_completed && 
      !req.nextUrl.pathname.startsWith('/auth/onboarding') &&
      !req.nextUrl.pathname.startsWith('/auth/login') &&
      !req.nextUrl.pathname.startsWith('/auth/register')
    ) {
      const redirectUrl = new URL('/auth/onboarding', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Si ya completó onboarding y está en la página de onboarding, redirigir al dashboard
    if (
      userData?.onboarding_completed && 
      req.nextUrl.pathname.startsWith('/auth/onboarding')
    ) {
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // 🔐 VERIFICAR PERMISOS PARA RUTAS DEL DASHBOARD
    if (
      userData?.onboarding_completed && 
      req.nextUrl.pathname.startsWith('/dashboard') &&
      req.nextUrl.pathname !== '/dashboard' // Permitir dashboard home
    ) {
      const userType = userData.tipo_usuario as TipoUsuario;
      const currentPath = req.nextUrl.pathname;

      // Verificar si tiene permiso para acceder a esta ruta
      if (!canAccess(userType, currentPath)) {
        console.warn(`[MIDDLEWARE] Acceso denegado: ${userType} intentó acceder a ${currentPath}`);
        const redirectUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};



