import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-giphy',
  templateUrl: './giphy.component.html',
  styleUrls: ['./giphy.component.scss']
})
export class GiphyComponent implements OnInit {

  @Output() onselect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onclose: EventEmitter<any> = new EventEmitter<any>();

  searchKey = '';
  searchTimer: any;
  loading = false;
  gifs = [];

  apiKey = '1qS9Bv3tBBzmr3uQr3GpGG32yLQ83Bzf';
  limit = 10;
  offset = 0;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getGifs();
  }

  more() {
    this.offset += this.limit;
    this.getGifs();
  }

  getGifs() {
    this.loading = true;
    const type = this.searchKey.trim().length > 0 ? `search?q=${this.searchKey}&` : 'trending?';
    const url = `https://api.giphy.com/v1/gifs/${type}api_key=${this.apiKey}&limit=${this.limit}&offset=${this.offset}`;
    this.http.get(url, {
      headers: {
        external: 'true',
        loading: 'background'
      }
    }).subscribe( (x: any) => {
      const results = x.data.map( g => {
        return {
          preview: g.images.preview_gif.url,
          original: g.images.original.url
        };
      });
      this.gifs = [
        ...this.gifs,
        ...results
      ];
      this.loading = false;
    });
  }

  iSearch() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout( x => {
      this.offset = 0;
      this.gifs = [];
      this.getGifs();
    }, 1000);
  }

  close() {
    this.onclose.emit();
  }

  select(g) {
    this.onselect.emit(g);
  }
}
