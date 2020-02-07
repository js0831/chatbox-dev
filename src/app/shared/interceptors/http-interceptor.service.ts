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
import { SessionService } from 'src/app/v2/shared/services/session.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  public loading: JkWaitService;
  public jkAlert: JkAlertService;
  public sessionSV: SessionService;

  constructor(
    private injector: Injector,
    private route: Router
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable< HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    const loadingType = req.headers.get('loading') || 'default';
    const assetData = req.headers.get('assets') ? req.headers.get('assets') : 'false';

    this.loading = this.loading || this.injector.get(JkWaitService);
    this.jkAlert = this.jkAlert || this.injector.get(JkAlertService);
    this.sessionSV = this.sessionSV || this.injector.get(SessionService);

    if (loadingType !== 'background') {
      this.loading.start();
    }

    const token = this.sessionSV.data ? this.sessionSV.data.token : '';
    const finalurl = assetData === 'true' ? req.url : `${environment.apiURL}${req.url}`;
    const withTokenRequest = req.clone({
      setHeaders: {
        Authorization : `Bearer ${token}`,
        // 'Content-Type': 'application/json'
      },
      url: finalurl
    });

    return next.handle(withTokenRequest).pipe(
      // retry(1),
      catchError((error: HttpErrorResponse) => {
        this.showErrorMessage(error);
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
        if (event instanceof HttpResponse && event.body !== null) {
          if ( event.body.statusCode === '406' || event.body.statusCode === '405') {
            // this.authService.logout().then( x => {
            //   this.route.navigate(['login']);
            // });
          }
        }
        return event;
      })
    );
  }


  showErrorMessage(response: HttpErrorResponse) {
    switch (response.status) {
      case 403:
        this.jkAlert.error('Session Expired');
        this.sessionSV.logout();
        this.route.navigate(['v2']);
        break;
      case 400:
        const constraits = response.error.message[0].constraints;
        const keys = Object.keys(constraits);
        this.jkAlert.error(constraits[keys[0]]);
        break;
      default:
        this.jkAlert.error(response.message);
        break;
    }
  }
}
