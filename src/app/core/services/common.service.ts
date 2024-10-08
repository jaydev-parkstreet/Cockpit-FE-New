import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getDropdownConfig(
    placeholder,
    serverSearch = false,
    apiUrl = null,
    apiKey = null,
    bootstrapModal = false,
    scrollableHeight = 300,
    dropup = true,
    hideOverflow = false,
    hideOverflowClass = '',
    enableSearch = true,
    checkBoxes = true,
    selectionLimit = 0,
    selectionRequired = false) {
    return {
      serverSearch: serverSearch,
      enableSearch: enableSearch,
      dynamicTitle: true,
      showSelectAll: true,
      keyboardControls: true,
      displayProp: 'name',
      searchField: 'name',
      scrollable: true,
      clearSearchOnClose: true,
      closeOnDeselect: false,
      idProperty: 'id',
      checkBoxes: checkBoxes,
      hideOverflow,
      hideOverflowClass,
      bootstrapModal,
      dropup,
      scrollableHeight,
      translationTexts: { buttonDefaultText: placeholder, searchPlaceholder: 'Search', noResultText: 'No results found' },
      apiUrl,
      apiKey,
      selectionLimit,
      selectionRequired,
      closeOnSelect: (selectionLimit === 1),
      smartButtonTextProvider: function (selectedModel) {
        if (selectedModel.length > 1) {
          return selectedModel[0].name + ', +' + (selectedModel.length - 1);
        } else {
          return selectedModel[0].name;
        }
      }
    };
  }

  createFilterObj(
    key,
    label,
    placeholder,
    serverSearch = false,
    apiUrl = null,
    apiKey = null,
    divClass = 'col-xs-3',
    enableSearch = true) {
    return {
      key: key,
      label: label,
      type: 'multiselect-search',
      divClass,
      setting: this.getDropdownConfig(placeholder, serverSearch, apiUrl, apiKey, false, 300, false, false, '', enableSearch)
    };
  }

  getCheckboxConfig(checkbox) {
    if (checkbox) {
      return `<span class="custom-checkbox"><label class="checkbox-container">
                                <input type="checkbox" class="checkbox_gir_row" checked>
                                <span class="checkmark"></span>
                            </label></span>`;
    } else {
      return `<span class="custom-checkbox"><label class="checkbox-container">
                                <input type="checkbox" class="checkbox_gir_row">
                                <span class="checkmark"></span>
                            </label></span>`;
    }
  }
}
