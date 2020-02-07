import { Pipe, PipeTransform } from '@angular/core';
import { EmojiInterface } from './emoji.interface';

@Pipe({
    name: 'emojiFilter',
    pure: false
})
export class EmojiFilterPipe implements PipeTransform {
    transform(list: EmojiInterface[], key): any {
        return key
            ? list.filter(u => {
                const compare = `${u.name}`.toLowerCase();
                const keyLowered = key.toLowerCase();
                return compare.indexOf(keyLowered) !== -1;
            }) : list;
    }
}
