import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventInterface } from 'src/app/v2/shared/interfaces/event.interface';
import { EmojiInterface } from './emoji.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  private e: Subject<EventInterface<EmojiInterface>>;
  private subscriptions: any = {};
  private cachedData: EmojiInterface[];

  constructor(
    private http: HttpClient
  ) {
    if (!this.e) {
      this.e = new Subject<{
        action: 'init'
      }>();
    }
  }

  load() {
    if (this.cachedData) {
      return of(this.cachedData);
    }

    return this.http.get('./assets/json/emoji.json', {
      headers: {
        assets: 'true'
      }
    }).pipe(
      map((res: EmojiInterface[]) => {
        this.cachedData = res;
        return res;
      })
    );
  }

  selectEmoji(field: string, emoji: EmojiInterface) {
    this.e.next({
      action: `${field}_SELECT_EMOJI`,
      data: emoji
    });
  }

  newValue(currentValue: string, emojiCode: string, caret: {
    start: number,
    end: number
  }) {
    const start = currentValue.slice(0, caret.start);
    const end  = currentValue.slice(caret.end);
    return `${start}${emojiCode}${end}`;
  }

  onEmojiSelect(field: string, callback: any) {
    if (this.subscriptions[field]) {
      this.subscriptions[field].unsubscribe();
    }

    this.subscriptions[field] = this.e.subscribe( x => {
        if (callback && x.action === `${field}_SELECT_EMOJI`) {
          callback(x.data);
        }
    });
  }
}
