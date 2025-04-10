export interface AttachmentModal {
    modalTitle: string;
    showDismissIcon: boolean;
    noDataMessage: string;
    emptyDataIcon: string;
    entityIds: string[];
    attachmentPermission: Permission[];
    cancelAction: ModalAction;
    saveAction: ModalAction;
    filtersList: FiltersList;
    multiple: boolean;
    showFileType: boolean;
    fileTypeDropdown: FileType[];
    showPrivacyIcon: boolean;
    attachmentDetails: AttachmentDetails;
}

export interface Permission {
    id: number;
    name: string;
}

export interface ModalAction {
    label: string;
}

export interface FileType {
    id: number;
    name: string;
}

export interface AttachmentDetails {
    hasErrors: boolean;
    data: AttachmentData[];
}

export interface AttachmentData {
    first_name: string;
    last_name: string;
    picture_filename: string;
    username: string;
    email: string;
    isInternalUser: number;
    created_at: string;
    upload_id: number;
    display_name: string;
    saved_name: string;
    entity_kind: number;
    permission_id: number;
    downloadable: number;
    entity_id: string;
    has_delete_permission: number;
    entity_kind_name: string;
    label_image_type: string | null;
    width: number | null;
    height: number | null;
    url: string;
    file_url: string;
    filesize: string;
    filetype: string;
}

export interface FiltersList {
    [key: string]: FilterOption[] | number;
}

export interface FilterOption {
    id: string | number | null;
    name: string | number | null;
    class_id?: number;
}