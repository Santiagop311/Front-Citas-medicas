// src/middleware.ts
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  const token = context.cookies.get('token')?.value;

  if (pathname.startsWith('/api')) {
    return next();
  }

  if (!token && pathname !== '/login') {
    return context.redirect('/login');
  }

  if (token && pathname === '/login') {
    return context.redirect('/');
  }

  return next();
};
