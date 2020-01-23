import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginationInterface } from '../../interfaces/pagination.interface';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() options: PaginationInterface;
  @Output() pageChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  paginate(todo: number) {
    const currentPage = this.options.page;

    if (
      (currentPage === 0 && todo === -1) ||
      (this.isDisableNext() && todo === 1)
    ) { return; }

    this.options.page = currentPage + todo;
    this.pageChanged.emit(this.options.page);
  }

  isDisableNext() {
    if (!this.options) {
      return true;
    }
    const maxPage = Math.ceil(this.options.total / this.options.limit) - 1;
    return maxPage === this.options.page;
  }
}
