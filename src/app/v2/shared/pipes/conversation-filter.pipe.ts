import { Pipe, PipeTransform } from '@angular/core';
import { ConversationInterface } from '../interfaces/conversation.interface';
import { UserInterface } from '../interfaces/user.interface';

@Pipe({
    name: 'conversationFilter',
    pure: false
})
export class ConversationFilterPipe implements PipeTransform {
    transform(conversations: ConversationInterface[], key): any {
        return key
            ? conversations.filter((con: ConversationInterface) => {
                const u = con.members[0] as UserInterface;
                const fullname = `${u.firstname} ${u.lastname}`.toLowerCase();
                const keyLowered = key.toLowerCase();
                return fullname.indexOf(keyLowered) !== -1;
            }) : conversations;
    }
}
