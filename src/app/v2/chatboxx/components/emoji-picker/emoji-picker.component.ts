import { Component, OnInit } from '@angular/core';
import { EmojiService } from './emoji-picker.service';
import { EmojiInterface } from './emoji.interface';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss']
})
export class EmojiPickerComponent implements OnInit {
  key = '';
  emojis: EmojiInterface[];
  constructor(
    private service: EmojiService
  ) { }

  ngOnInit() {
    this.service.load().subscribe( (x: EmojiInterface[]) => {
      this.emojis = x;
    });
  }

}
