import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent implements OnInit {

  reactions = [
    {emoji: '🤦‍♂️'},
    {emoji: '💩'},
    // {emoji: '🖕'},
    // {emoji: '🤘'},
    // {emoji: '😭'},
    // {emoji: '😤'},
    // {emoji: '😱'},
    // {emoji: '👏'},
    // {emoji: '😍'},
    // {emoji: '😄'},
    // {emoji: '👎'},
    // {emoji: '👍'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
