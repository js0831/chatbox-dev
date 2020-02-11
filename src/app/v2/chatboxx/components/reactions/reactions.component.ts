import { Component, OnInit, Input } from '@angular/core';
import { ReactionInterface } from 'src/app/v2/shared/interfaces/reaction.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { ReactionService } from 'src/app/v2/shared/services/reaction.service';
import { ReactionsType } from 'src/app/v2/shared/enums/reaction.enum';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent implements OnInit {

  @Input() reactions: ReactionInterface[] = [];
  availableReactions: ReactionInterface[] = this.reactionSV.reactions;

  // NOTE: USE THIS TO HANDLE SAME REACTIONS
  reactionsFormatted: {
    reaction: ReactionInterface,
    count: number,
    reactors: UserInterface[]
  }[] = [];

  constructor(
    private sessionSV: SessionService,
    private reactionSV: ReactionService
  ) { }

  ngOnInit() {
    if ( this.reactions && this.reactions.length > 0) {
      this.reactions.map( r => {
        r.emoji = this.getEmoji(r.reaction);
        this.filterReactions(r);
        return r;
      });
    }
  }

  private filterReactions(reaction: ReactionInterface) {
    if (!this.reactionExist(reaction)) {
      this.reactionsFormatted.push({
        reaction,
        count: 1,
        reactors: [ reaction.by ]
      });
    } else {
      this.reactionsFormatted.map( x => {
        if (x.reaction.reaction === reaction.reaction) {
          x.count += 1;
          x.reactors.push(reaction.by);
        }
        return x;
      });
    }
  }

  private getEmoji(reaction: ReactionsType) {
    return this.availableReactions.filter( e => {
      return e.reaction === reaction;
    })[0].emoji;
  }

  private reactionExist(reaction: ReactionInterface) {
    return this.reactionsFormatted.filter( x => {
      return x.reaction.reaction === reaction.reaction;
    }).length > 0;
  }

  isYou(id: string) {
    return this.sessionSV.data.user._id === id;
  }

}
