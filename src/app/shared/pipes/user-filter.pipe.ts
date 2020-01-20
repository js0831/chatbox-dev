import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userFilter',
    pure: false
})
export class UserFilterPipe implements PipeTransform {
    transform(users: any[], key): any {
        return key
            ? users.filter(u => {
                const fullname = `${u.firstname} ${u.lastname}`.toLowerCase();
                const keyLowered = key.toLowerCase();
                return fullname.indexOf(keyLowered) !== -1;
            }) : users;
    }
}
