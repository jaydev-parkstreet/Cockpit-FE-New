import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputDropdownService {

  showDropdown: { [key: string]: boolean } = {};

  constructor(private http: HttpClient) { }

  /**
   * Function to get dropdown option array.
   * @param apiUrl
   * @param key
   * @param searchText
   */
  getOption(apiUrl: string, searchText: string, method?: string): Observable<any> {
    const request = {
      keyword: searchText,
    };
    return this.http.post<any>(apiUrl, request);
  }
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
    showCheckAll= true,
    showUncheckAll= true,
    selectionLimit = 0,
    selectionRequired = true) {
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


  getDropdownSettings() {
    return {
      dynamicTitle: true,
      scrollable: false,
      scrollableHeight: '300px',
      overflow: 'auto',
      closeOnBlur: true,
      displayProp: 'label',
      enableSearch: false,
      showCheckAll: true,
      showUncheckAll: true,
      clearSearchOnClose: false,
      selectionLimit: 0,
      selectionRequired: false,
      showEnableSearchButton: false,
      closeOnSelect: false,
      buttonClasses: 'btn btn-default',
      closeOnDeselect: false,
      groupBy: undefined,
      checkBoxes: false,
      groupByTextProvider: null,
      smartButtonMaxItems: 0,
      // smartButtonTextConverter: angular.noop,
      styleActive: false,
      selectedToTop: false,
      keyboardControls: false,
      template: '{{getPropertyForObject(option, settings.displayProp)}}',
      searchField: '$',
      showAllSelectedText: false,
      buttonIcon: 'fas fa-chevron-down',
    };
  }
  getTexts() {
    return {
      checkAll: 'Check All',
      uncheckAll: 'Uncheck All',
      selectAll: 'Select All',
      unselectAll: 'Unselect All',
      selectionCount: 'Selected',
      selectionOf: '/',
      searchPlaceholder: 'Search...',
      buttonDefaultText: 'Select',
      dynamicButtonTextSuffix: 'Selected',
      disableSearch: 'Disable search',
      enableSearch: 'Enable search',
      selectGroup: 'Select all:',
      allSelectedText: 'All',
      loaderText: 'Fetching Record...',
      noResultText: 'No result found'
    };
  }

  getAllExternalEvents() {
    return {
      onItemSelect: () => { },
      onItemDeselect: () => { },
      onSelectAll: () => { },
      onDeselectAll: () => { },
      onInitDone: () => { },
      onMaxSelectionReached: () => { },
      onSelectionChanged: () => { },
      onClose: () => { },
    };
  }
  createFilterObj(
    id: string,
    key,
    label,
    placeholder,
    name,
    require: boolean = false,
    serverSearch = false,
    apiUrl = null,
    apiKey = null,
    divClass = 'col-xs-3',
    enableSearch = true,
    showCheckAll= false,
    showUncheckAll= false,
    validationClass: string = '',
    disabled: boolean = false 
  ) {
    return {
      id: id, 
      key: key,
      label: label,
      name:name,
      required: require,
      type: 'multiselect-search',
      divClass,
      validationClass,
      disabled: disabled,
      setting: this.getDropdownConfig(placeholder, serverSearch, apiUrl, apiKey, false, 300, false, false, '', enableSearch, false ,showCheckAll, showUncheckAll)
    };
  }

}

