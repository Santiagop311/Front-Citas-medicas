// src/middleware.ts
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  const token = context.cookies.get('token')?.value;

  // Permitir rutas de autenticación sin token
  if (pathname.startsWith('/api')) {
    return next();
  }

  // Permitir acceso a /login sin token
  if (!token && pathname !== '/login') {
    return context.redirect('/login');
  }

  // Si ya hay token y va al login, redirige al inicio
  if (token && pathname === '/login') {
    return context.redirect('/');
  }

  return next();
};
