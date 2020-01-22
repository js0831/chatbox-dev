import { Component, OnInit } from '@angular/core';
import { FriendsTabInterface } from './friends-tab.interface';

@Component({
  selector: 'app-friends-tab',
  templateUrl: './friends-tab.component.html',
  styleUrls: ['./friends-tab.component.scss']
})
export class FriendsTabComponent implements OnInit {

  tabs: FriendsTabInterface[] = [
    {
      label: 'Friends',
      value: 'friends',
      count: 0
    },
    {
      label: 'Invites',
      value: 'invites',
      count: 0
    },
    {
      label: 'Friend Request',
      value: 'request',
      count: 0
    }
  ];
  activeTab: FriendsTabInterface;

  constructor() { }

  ngOnInit() {
    this.activeTab = this.tabs[0];
  }

  selectTab(t: FriendsTabInterface) {
    this.activeTab = t;
  }

}
