import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: 'input[debounced]'
})
export class DebounceInputDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 1000;
  @Output() debounceEvent = new EventEmitter();

  private inputs = new Subject();
  private subscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.subscription = this.inputs.pipe(debounceTime(this.debounceTime)).subscribe(e => this.debounceEvent.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('blur', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.inputs.next(event);
  }
}
