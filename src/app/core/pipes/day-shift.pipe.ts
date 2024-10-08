import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayShift',
})
export class DayShiftPipe implements PipeTransform {
  transform(date: Date | string, shiftBy = 0): Date {
    if (!date) return new Date();
    if (typeof date === 'string') date = new Date(date);

    const newDate = new Date(date.getTime()); // Create a copy to avoid modifying original
    newDate.setDate(newDate.getDate() + shiftBy);

    return newDate;
  }
}