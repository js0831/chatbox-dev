import { retry, map, catchError, finalize, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { AuthService } from 'src/app/pages/login/auth.service';
import { Router } from '@angular/router';
import { JkWaitService } from 'jk-wait';
import { JkAlertService } from 'jk-alert';
import { UserService } from 'src/app/landing/user.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  public loading: JkWaitService;
  public jkAlert: JkAlertService;
  public userService: UserService;

  constructor(
    private injector: Injector,
    private route: Router
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable< HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    const loadingType = req.headers.get('loading') || 'default';
    this.loading = this.loading || this.injector.get(JkWaitService);
    this.jkAlert = this.jkAlert || this.injector.get(JkAlertService);
    this.userService = this.userService || this.injector.get(UserService);

    if (loadingType !== 'background') {
      this.loading.start();
    }

    const token = this.userService.currentUser.token || '';
    const withTokenRequest = req.clone({
      setHeaders: {
        Authorization : `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      url: `${environment.apiURL}${req.url}`
    });

    return next.handle(withTokenRequest).pipe(
      // retry(1),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.jkAlert.error('Session Expired');
          this.userService.logout();
          this.route.navigate(['']);
        } else {
          this.jkAlert.error(error.message);
        }
        return throwError(error);
      }),
      finalize(() => {
          this.loading.end();
      }),
      tap((event: HttpEvent<any>) => {
        // console.log(event);
        // if (event instanceof HttpResponse) {
        //   const camelCaseObject = event.body;
        //   const modEvent = event.clone({ body: camelCaseObject });
        //   return modEvent;
        // }
        if (event instanceof HttpResponse) {
          if (event.body.statusCode === '406' || event.body.statusCode === '405') {
            // this.authService.logout().then( x => {
            //   this.route.navigate(['login']);
            // });
          }
        }
        return event;
      })
    );
  }
}
