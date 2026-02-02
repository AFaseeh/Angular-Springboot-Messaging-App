import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './service/auth.service';

export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const user = authService.getUserLoginInfo();

  console.log("using this user in auth: " + JSON.stringify(user));
  if (user && user.username && user.password)
  {
    const authString = btoa(`${user!.username}:${user!.password}`);

    const authReq = req.clone(
      {
        setHeaders: {
          Authorization: `Basic ${authString}`
        }
      }
    )

    console.log("did infact auth");
    return next(authReq);
  }
  return next(req);
};
