import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppRoutes from 'src/app/app.routes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonBackendService {

    constructor(
      private http: HttpClient
    ) { }

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
     * Function to get Attachments
     * 
     * @param entity 
     * @param tool_id 
     * @returns {Observable} - An API response
     * @author PSI-Enhancement
     */
    getAttachments(entity: string, tool_id: string) {
      let params = new HttpParams()
        .set('entity', entity)
        .set('tool', tool_id);
      
      return this.http.
          get(`${environment.apiUrl}${AppRoutes.COMMON.ATTACHMENTS}`, { params });
    }

    /**
     * Function to delete Attachment
     * 
     * @param param 
     * @returns {Observable} - An API response
     * @author PSI-Enhancement
     */
    deleteUploadFile(param: any) {
      return this.http.delete(environment.apiRouteUrl + environment.version.v1 + AppRoutes.COMMON.ATTACHMENTS, {
          params: new HttpParams().set('id', param),
          headers: new HttpHeaders({
              'Content-Type': ''
          })
      });
    }

    /**
     * Function to update file permissions.
     * 
     * @author PSI-IV
     * @param number id
     * @param number permission_id
     */
    changeFilePermission (entity_upload_id, permission_id) { 
      const reqObj = {
        entity_upload_id,
        permission_id
      };

      return this.http
        .put(`${environment.apiUrl}${AppRoutes.COMMON.ATTACHMENTS_PERMISSION}`, reqObj);
    }

    /**
     * Function to get Audit Trail List
     * 
     * @param params 
     * @returns {Observable} - An API response
     */
    getAuditTrailData(params) {
      return this.http
        .get(`${environment.apiUrl}${AppRoutes.COMMON.AUDIT_TRAIL}`, { params });
    }
}
