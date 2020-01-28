import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ActionService } from 'src/app/v2/shared/services/action.service';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.scss']
})
export class SideComponent implements OnInit {

  private open = false;
  activeTabID = '';

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private action: ActionService

  ) { }

  ngOnInit() {
    this.action.listen.subscribe( x => {
      switch (x.action) {
        case 'MENU_SHOW':
          this.toggle();
          break;
        case 'TAB_SELECT':
          // NOTE: Fix error ExpressionChangedAfterItHasBeenCheckedError
          setTimeout( () => {
            this.activeTabID = x.data.id;
          });
          break;
        default:
          break;
      }
    });
  }

  toggle() {
    this.open = !this.open;

    if (this.open) {
      this.renderer.addClass(this.element.nativeElement, 'closed');
    } else {
      this.renderer.removeClass(this.element.nativeElement, 'closed');
    }
  }

}
