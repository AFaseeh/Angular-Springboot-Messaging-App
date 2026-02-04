import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Token } from '@angular/compiler';

export const jwtAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const user = authService.getUserAuthInfo();

  console.log("using this user in auth: " + JSON.stringify(user));
  if (user && user.username && user.token)
  {
    const authReq = req.clone(
      {
        setHeaders: {
          Authorization: `Bearer ${user!.token}`
        }
      }
    )

    console.log("did infact auth");
    return next(authReq);
  }
  return next(req);
};
