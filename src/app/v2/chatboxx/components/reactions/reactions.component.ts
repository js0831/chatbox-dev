import { Component, OnInit, Input } from '@angular/core';
import { ReactionInterface } from 'src/app/v2/shared/interfaces/reaction.interface';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { ReactionService } from 'src/app/v2/shared/services/reaction.service';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent implements OnInit {

  @Input() reactions: ReactionInterface[] = [];
  availableReactions: ReactionInterface[] = this.reactionSV.reactions;

  constructor(
    private sessionSV: SessionService,
    private reactionSV: ReactionService
  ) { }

  ngOnInit() {
    // this.availableReactions.filter( x => {
    //   return x.reaction
    // });

    if ( this.reactions && this.reactions.length > 0) {
      this.reactions.map( r => {
        r.emoji = this.availableReactions.filter( e => {
          return e.reaction === r.reaction;
        })[0].emoji;
        return r;
      });
    }
  }

  isYou(id: string) {
    return this.sessionSV.data.user._id === id;
  }

}
