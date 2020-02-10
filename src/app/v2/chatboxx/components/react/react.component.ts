import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.scss']
})
export class ReactComponent implements OnInit {

  show = false;
  reactions = [
    {emoji: '🤦‍♂️'},
    {emoji: '💩'},
    {emoji: '🖕'},
    {emoji: '🤘'},
    {emoji: '😭'},
    {emoji: '😤'},
    {emoji: '😱'},
    {emoji: '👏'},
    {emoji: '😍'},
    {emoji: '😄'},
    {emoji: '👎'},
    {emoji: '👍'},
  ];

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.show = !this.show;
  }

  onblur() {
    setTimeout( x => {
      this.toggle();
    }, 250);
  }
}
