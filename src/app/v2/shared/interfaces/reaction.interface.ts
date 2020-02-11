import { ReactionsType } from '../enums/reaction.enum';
import { UserInterface } from './user.interface';

export interface ReactionInterface {
  _id?: string;
  by?: UserInterface;
  reaction: ReactionsType;
  emoji?: string;
}
