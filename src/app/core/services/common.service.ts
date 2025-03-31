import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from 'src/app/app.constant';
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
  * Function to get notes.
  * @createdDate 21-03-2025
  * @author PSI-Enhancement
  * @param number kind
  * @param number tool
  * @param string entity
  * @param number menuItemId
  */
  getNotes(kind, tool, entity, menuItemId, otherTool?) {
    let params = {
      kind,
      entity,
      tool,
      menu_item_id: menuItemId
    };

    if (!!otherTool) {
      params['other_tools'] = otherTool;
      delete params.kind;
    }
    return this.http.get(environment.apiUrl + AppRoutes.COMMON.NOTES, { params });
  }

  /**
   * Function to save a note
   * @createdDate 21-03-2025
   * @author PSI-Enhancement
   * @param string entityId
   * @param object model
   * @param object req
   */
  saveNote(entityId, modal, req) {
    if (modal.id) {
      req.entity_id = entityId[0];
      req.id = modal.id;
      return this.http.put(environment.apiUrl + AppRoutes.COMMON.NOTES, req);
    } else {
      req.entity_ids = entityId;
      return this.http.post(environment.apiUrl + AppRoutes.COMMON.MULTIPLE_NOTES_API, req);
    }
  }

  /**
 * Function to delete a note.
 * @createdDate 06-04-2018
 * @author Innovify
 * @param number id
 * @param number menuItemId
 */
  deleteNote(id, menuItemId) {
    return this.http.delete(environment.apiUrl + AppRoutes.COMMON.NOTES, { params: { id, menu_item_id: menuItemId } })
  }

    /**
     * Function to export excel
     * 
     * @author PSI-Enhancement
     * @param string fileUrl
     * @returns string Url
     */
    exportExcel(url, params, cb) {
        const _params = params;
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json, text/plain, /'
            }),
            responseType: 'blob' as 'json',
            observe: 'response' as 'body'
        };
        this.http.post(url, _params, httpOptions).subscribe({
            next: (response: any) => {
                const data: any = response.body;
                if (data.size > 0) {
                    const fileName = String(this.getFileNameFromHeader(
                        response.headers.get('content-disposition')
                    ));
                    saveAs(data, fileName || 'report.csv');
                    this.showToastV2Message(true, 'File Downloaded Successfully', 'fas fa-check-circle', 'success');
                } else {
                    this.showToastV2Message(true, 'No data found');
                }
                cb();
            },
            error: (error) => {
                this.showToastV2Message(true, "Failed to Export Data", 'fas fa-exclamation-circle');
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
    parseRequest (filters) {
        Object.entries(filters).forEach((value, key) => {
            if (value != undefined && value !== null) {
                if (value.constructor === Array && value.length > 0) {
                    value.map((obj: any, index) =>{
                        if (obj !== null && obj.id) {
                            value[index] = obj.id;
                        }
                    });
                } else {
                    filters[key] = value;
                }
            }
        });
        return filters;
    }

    /**
     * Function to Formate Boolean Fields
     * 
     * @param value 
     * @returns string
     * @author PSI-Enhancement
     */
    formateBooleanField(value) {
      if(value == null) return value;
      return value === 1 ? 'Yes' : 'No';
    }

    /**
     * Funtion get address key from the address key
     * @param addressKey 
     * @returns array of address keys
     * @author PSI-Enhancement
     */
    getAddressKeys(addressKey) {
      return AppConstant.ADDRESS_KEYS[addressKey] || [];
    }

    /**
     * Formats the address in the given object for each specified address key.
     * 
     * @param addressKeys - An array of keys representing the address fields to format.
     * @param obj - The object containing the address fields to format.
     * @returns The object with the formatted address fields.
     * 
     * @author PSI-Enhancement
     */
    renderFormatAddress(addressKeys, obj) {
      addressKeys.forEach(key => {
          obj[key] = this.renderFormatAddressByObj(key, obj);
      });
      return obj;
    }

    /**
     * Formats the address for the specified address key in the given result object.
     * 
     * @param addressKey
     * @param resultObj
     * @param list
     * @returns A string representing the formatted address.
     * @author PSI-Enhancement
     */
    renderFormatAddressByObj(addressKey, resultObj, list = null) {
      const keys = this.getAddressKeys(addressKey);
      return keys.map((key) => {
        if(resultObj[key] === null)  return '';
        if (['billing_state', 'shipping_state'].includes(key)) {
          const valueList = list ? this.getValuesByKey(list, resultObj[key]) : resultObj[key];
          return `, ${valueList}`;
        }
        return resultObj[key];
      }).join(' ').trim();
    }

    /**
     * Checks if the given object is empty (has no own properties).
     * 
     * @param obj
     * @returns
     * @author PSI-Enhancement
     */
    isEmptyObj(obj) {
      return Object.keys(obj).length === 0;
    }

}
