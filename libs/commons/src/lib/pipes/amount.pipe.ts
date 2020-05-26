import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amount',
  pure: true
})
export class AmountPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(amount: number): string {
    if (!amount) {
      return '';
    }
    return this.decimalPipe.transform(amount, '.2-2');
  }
}
