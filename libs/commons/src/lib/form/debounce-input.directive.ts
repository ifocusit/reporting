import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: 'input[libDebounce]'
})
export class DebounceInputDirective implements OnDestroy {
  @Input() debounceTime = 100;
  @Output() debounceEvent = new EventEmitter();

  private inputs = new Subject();
  private subscription: Subscription;

  constructor() {
    this.subscription = this.inputs.pipe(debounceTime(this.debounceTime)).subscribe(e => this.debounceEvent.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('blur', ['$event'])
  @HostListener('focusout', ['$event'])
  onEvent(event: FocusEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.inputs.next(event);
  }
}
