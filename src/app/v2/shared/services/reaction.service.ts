import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../../chatboxx/store/app.state';
import { Store } from '@ngrx/store';
import { ReactionsType } from '../enums/reaction.enum';
import { ReactionInterface } from '../interfaces/reaction.interface';
import * as actions from '../../chatboxx/store/conversation/conversation.action';
import { UserInterface } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) { }

  get reactions(): ReactionInterface[] {
    return [
      {
        reaction: ReactionsType.TOUNGE,
        emoji: '😛',
      },
      {
        reaction: ReactionsType.THINKING,
        emoji: '🤔',
      },
      {
        reaction: ReactionsType.HAIZT,
        emoji: '🤦‍♂️'
      },
      {
        reaction: ReactionsType.SHIT,
        emoji: '💩'
      },
      {
        reaction: ReactionsType.FU,
        emoji: '🖕'
      },
      {
        reaction: ReactionsType.ROCK,
        emoji: '🤘'
      },
      {
        reaction: ReactionsType.CRYING,
        emoji: '😭'
      },
      {
        reaction: ReactionsType.ANGRY,
        emoji: '😤'
      },
      {
        reaction: ReactionsType.SHOCKED,
        emoji: '😱'
      },
      {
        reaction: ReactionsType.CLAP,
        emoji: '👏'
      },
      {
        reaction: ReactionsType.LOVE,
        emoji: '😍'
      },
      {
        reaction: ReactionsType.LAUGH,
        emoji: '😄'
      },
      {
        reaction: ReactionsType.DISAGREE,
        emoji: '👎'
      },
      {
        reaction: ReactionsType.AGREE,
        emoji: '👍'
      }
    ];
  }

  react(params: {
    messageId: string,
    reaction: ReactionInterface
  }) {
    return {
      http: () => {
        return this.http.post('conversation/react', {
          messageId: params.messageId,
          reaction: {
            by: params.reaction.by,
            reaction: params.reaction.reaction
          }
        });
      },
      action: () => {
        return this.store.dispatch(new actions.ConversationMessageReact(params));
      }
    };
  }

}
