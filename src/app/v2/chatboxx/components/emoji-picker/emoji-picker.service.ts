import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {


  constructor(
    private http: HttpClient
  ) { }

  load() {
    return this.http.get('./assets/json/emoji.json', {
      headers: {
        assets: 'true'
      }
    });
  }
}
