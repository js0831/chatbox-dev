import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventInterface } from 'src/app/v2/shared/interfaces/event.interface';
import { EmojiInterface } from './emoji.interface';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  private e: Subject<EventInterface<EmojiInterface>>;
  private subscriptions: any = {};

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
    return this.http.get('./assets/json/emoji.json', {
      headers: {
        assets: 'true'
      }
    });
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
