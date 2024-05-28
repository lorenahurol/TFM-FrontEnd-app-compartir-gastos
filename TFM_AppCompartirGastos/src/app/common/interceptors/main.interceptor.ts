import { HttpInterceptorFn } from '@angular/common/http';

export const mainInterceptor: HttpInterceptorFn = (req, next) => {

  /**
   * Intercepts HTTP requests to add an Authorization header with a token from localStorage.

   */
  const token = localStorage.getItem('login_token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
  }
  return next(req);
};
