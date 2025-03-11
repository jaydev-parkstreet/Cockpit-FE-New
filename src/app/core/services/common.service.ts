import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppRoutes from 'src/app/app.routes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  toastV2 : any = {}
  toastV2Watcher : any = {}
  
  constructor(private http: HttpClient) { }

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
     * Fetches notes based on the provided parameters.
     *
     * @param {string} kind - The type/category of the notes.
     * @param {string} tool - The tool identifier related to the notes.
     * @param {string} entity - The entity associated with the notes.
     * @param {string} menuItemId - The menu item identifier for filtering notes.
     * @returns {Observable<any>} An observable containing the API response with notes.
     * @author PSI-Enhancement
     */
    getNotes(kind: string, tool: string, entity:string, menuItemId: string) {
      let params = new HttpParams()
        .set('kind', kind)
        .set('entity', entity)
        .set('tool', tool)
        .set('menu_item_id', menuItemId);

      return this.http.get(`${environment.apiUrl}${AppRoutes.COMMON.NOTES}`, { params });
    }

    /**
     * Updates the privacy permission of a note.
     *
     * @param {Object} reqObj - The request object containing `note_id` and `permission_id`.
     * @returns {Observable<any>} An observable containing the API response.
     * @author PSI-Enhancement
     */
    changeNotePrivacy(reqObj) {
      return this.http
          .put(`${environment.apiUrl}${AppRoutes.COMMON.NOTES_CHANGE_PERMISSION}`, reqObj);
    }

    /**
     * Function to delete a note.
     * 
     * @param number id
     * @param number menuItemId
     * @author PSI-Enhancement  
     */
    deleteNote(id, menuItemId) {
      return this.http.
          delete(environment.apiUrl + AppRoutes.COMMON.NOTES, { params: { id, menu_item_id: menuItemId } });
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

}
