import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppRoutes from 'src/app/app.routes';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  toastV2 : any = {}
  toastV2Watcher : any = {}
  
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

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

  getSingleSelectDropdownConfig (placeholder, selectionRequired = false, enableSearch = false, bootstrap = false) {
    return this.getDropdownConfig(
        placeholder,
        false,
        null,
        null,
        bootstrap,
        300,
        false,
        false,
        '',
        enableSearch,
        false,
        1,
        selectionRequired
    );
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

  getValuesByKey(list: any[], id: any) {
    if (!Array.isArray(list)) {
      return null; 
    }
  
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        return list[i].name;
      }
    }
    return null; 
  }
  
   getKeyByValue (list, value) {
    if (!Array.isArray(list)) {
      return null;
    }
      for (let i = 0; i < list.length; i++) {
        if (list[i].name === value) {
          return list[i].id;
      }
    } 
    return null; 
  }


    showToastV2Message (show, message, icon = null, anyClass = '', time = 3000, actionRequired = false) {
        this.hideToastV2Message();
        this.toastV2.show = show;
        this.toastV2.message = message;
        this.toastV2.class = anyClass;
        this.toastV2.icon = icon;
        if (show && !actionRequired) {
            this.toastV2Watcher = setTimeout(() => {
                this.hideToastV2Message();
            }, time);
        }
    }

    hideToastV2Message () {
        if (this.toastV2Watcher) {
            clearTimeout(this.toastV2Watcher);
        }
        this.toastV2 = {
            show: false,
            message: '',
            class: ''
        };
    }

    /**
     * Removes an object from an array based on a specified key-value match.
     *
     * @param {Array<Object>} objectsArray - The array of objects to filter.
     * @param {string} elemKey - The key to check in each object.
     * @param {*} value - The value to compare against.
     * @returns {Array<Object>} A new array with the matching object(s) removed.
     */
    deleteObjectFromArray(objectsArray, elemKey, value) {
      return objectsArray?.filter(element => element[elemKey] !== value) || [];
    }

    /**
     * Formats a given date into the specified format.
     *
     * @param value - The date input (string, number, or Date).
     * @param format - The desired output format (default: 'MM/dd/yyyy').
     * @returns The formatted date string or '--' if the input is invalid.
     * @author PSI-Enhancement
     */
    dateFormat(value, format = 'MM/dd/yyyy') {
      if(!value || value === '0000-00-00 00:00:00') return '--';

      const date = new Date(value);
      if(isNaN(date.getTime())) return '--';

      return this.datePipe.transform(date, format) || '--';
    }

    /**
     * Function to replace file name.
     * 
     * @author PSI-Enhancement
     * @param string fileUrl
     * @returns string Url
     */
    urlEncode(fileUrl): any {
      let url = environment.apiUrl + decodeURIComponent(fileUrl);
      url = url.replace(new RegExp('#', 'g'), '%23');
      return url;
  }

    /**
     * Function to export excel
     * @author PSI-Enhancement
     * @param string fileUrl
     * @returns string Url
     */
    exportExcel(url, params, cb) {
        const _params = params;
        // _params.export = true;
        this.http.post(url, _params).subscribe((response: any) => {
            const data = response.data;
            if (data) {
                const csv = new Blob([data], {
                    type: 'application/force-download'
                });
                const fileName = String(this.getFileNameFromHeader(response.headers.get('content-disposition')));
                saveAs(csv, fileName || 'report.csv');
                cb();
            }
        });
    }

    /**
     * Function to get the file name from header
     * @author PSI-Enhancement
     */
    getFileNameFromHeader(header) {
        if (!header) return null;
        var result = header.split(';')[1].trim().split('=')[1];
        return result.replace(/"/g, '');
    }


    /**
     * Function to parse
     * @author PSI-Enhancement
     */
    // parseRequest(filters) {
    //     Object.entries(filters).forEach(function (value, key) {
    //       if (value) {
    //         if (value.constructor === Array && value.length > 0) {
    //           value.map(function (obj, index) {
    //             if (obj.id === 0) {
    //               value[index] = 0;
    //             } else if (obj.id) {
    //               value[index] = obj.id;
    //             }
    //           });
    //         } else {
    //           filters[key] = value;
    //         }
    //       }
    //     });
    //     return filters;
    //   }
    
}
