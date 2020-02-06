import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import * as actions from './notification.action';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';


@Injectable()
export class NotificationEffects {

    constructor(
        private action$: Actions,
        private notifacationSV: NotificationService
    ) { }

    @Effect() loadList: Observable<Action> = this.action$.pipe(
        ofType(actions.NOTIFICATION_LIST_LOAD),
        switchMap( (action: actions.NotificationListLoad) => {
            return this.notifacationSV.getList(action.payload).http().pipe(
              map( res => {
                return new actions.NotificationListLoadFinish(res);
              })
            );
        })
    );
}
