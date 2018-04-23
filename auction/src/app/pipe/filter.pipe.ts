import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  // list is the input being filtered by pipe, filterField is the property of each item in the list. keyword is the user input.
  transform(list: any[], filterField: string, keyword: string): any {
    if (!filterField || !keyword) {
      return list;
    }
    return list.filter( item => {
      const fieldValue = item[filterField];
      return fieldValue.indexOf(keyword) >= 0;
    });
  }

}
