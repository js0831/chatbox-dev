import { Pipe, PipeTransform } from '@angular/core';
import { ConversationInterface } from '../interfaces/conversation.interface';
import { UserInterface } from '../interfaces/user.interface';
import { ConversationType } from '../interfaces/conversation.type.enum';

@Pipe({
    name: 'conversationFilter',
    pure: false
})
export class ConversationFilterPipe implements PipeTransform {
    transform(conversations: ConversationInterface[], key): any {
        return key
            ? conversations.filter((con: ConversationInterface) => {
                const u = con.members[0] as UserInterface;

                const compare = ( con.type === ConversationType.PERSONAL ?
                `${u.firstname} ${u.lastname}` : con.name ).toLowerCase();

                const keyLowered = key.toLowerCase();
                return compare.indexOf(keyLowered) !== -1;
            }) : conversations;
    }
}
