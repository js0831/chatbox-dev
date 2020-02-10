import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter } from '@angular/core';
import { EmojiService } from './emoji-picker.service';
import { EmojiInterface } from './emoji.interface';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss']
})
export class EmojiPickerComponent implements OnInit {

  @Input() field: string;

  key = '';
  emojis: EmojiInterface[];
  show = false;
  animate = false;
  searchFieldFocus = false;

  constructor(
    private service: EmojiService
  ) { }

  ngOnInit() {
    this.service.load().subscribe( (x: EmojiInterface[]) => {
      this.emojis = x;
    });
  }

  toggleOnBlur() {
    setTimeout( () => {
      if (!this.searchFieldFocus) {
        setTimeout( () => {
          this.toggle();
        }, 250);
      }
    });
  }

  select(emoji: EmojiInterface) {
    this.service.selectEmoji(this.field, emoji);
  }

  searchFieldOnFocus() {
    this.searchFieldFocus = true;
  }

  searchFieldOnBlur() {
    setTimeout(() => {
      this.toggle();
    }, 250);
  }

  toggle() {
    if (!this.show) {
      this.show = true;
      setTimeout( x => {
        this.animate = true;
      }, 0);
    } else {
      this.animate = false;
      setTimeout( x => {
        this.show = false;
      }, 250);
    }
    this.searchFieldFocus = false;
  }
}
