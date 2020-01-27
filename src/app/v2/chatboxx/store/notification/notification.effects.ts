import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { ResponseInterface } from 'src/app/v2/shared/interfaces/reponse.interface';
import {
  NOTIFICATION_LIST_LOAD,
  NotificationListLoad,
  NotificationListLoadFinish,
} from './notification.action';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';


@Injectable()
export class NotificationEffects {

    constructor(
        private action$: Actions,
        private notifacationSV: NotificationService
    ) { }

    @Effect() loadList: Observable<Action> = this.action$.pipe(
        ofType(NOTIFICATION_LIST_LOAD),
        switchMap( (action: NotificationListLoad) => {
            return this.notifacationSV.getList(action.payload).pipe(
              map( res => {
                return new NotificationListLoadFinish(res);
              })
            );
        })
    );
}
