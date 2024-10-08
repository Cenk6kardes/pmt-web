import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getPropValue',
})
export class GetPropValuePipe implements PipeTransform {
  transform(list: any[], uniqueFieldName: string, uniqueFieldValue: number | string, propName = '', notFoundText = ''): string {
    const item = list.find(item => item[uniqueFieldName] === uniqueFieldValue);

    return item ? item[propName] : notFoundText;
  }
}