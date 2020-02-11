import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReactionInterface } from 'src/app/v2/shared/interfaces/reaction.interface';
import { ReactionsType } from 'src/app/v2/shared/enums/reaction.enum';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { ReactionService } from 'src/app/v2/shared/services/reaction.service';

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.scss']
})
export class ReactComponent implements OnInit {

  @Output() onselect: EventEmitter<ReactionInterface> = new EventEmitter<ReactionInterface>();

  show = false;
  reactions: ReactionInterface[] = this.reactionService.reactions;

  constructor(
    private reactionService: ReactionService
  ) { }

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

  select(reaction: ReactionInterface) {
    this.onselect.emit(reaction);
  }
}
