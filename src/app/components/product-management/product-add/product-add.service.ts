import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductAddService {

  constructor() { }

  getCrudFieldConfig (crudFiltersList) {
    return [{
      key: 'entity',
      label: 'Entity',
      type: 'dropdown',
      colClass: 'col-xs-12',
      filters: {
          entity: []
      },
      options: crudFiltersList.entity || [],
      isRequired: true,
      isDisabled: false,
      //inputSetting: this.commonService.getSingleSelectDropdownV2Config('Select Entity', true)
    }, ];
  }
}
