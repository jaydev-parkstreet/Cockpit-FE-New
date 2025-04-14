export interface DropdownConfig {
    serverSearch: boolean,
    enableSearch: boolean,
    dynamicTitle: boolean,
    showSelectAll: boolean,
    keyboardControls: boolean,
    displayProp: string,
    searchField: string,
    scrollable: boolean,
    clearSearchOnClose: boolean,
    closeOnDeselect: boolean,
    idProperty: string,
    checkBoxes: boolean,
    hideOverflow: boolean,
    hideOverflowClass: string
    bootstrapModal: boolean,
    dropup: boolean,
    scrollableHeight: number,
    translationTexts: {
        buttonDefaultText: string,
        searchPlaceholder: string,
        noResultText: string
    },
    apiUrl: string | null,
    apiKey: string | null,
    selectionLimit: number,
    selectionRequired: boolean,
    closeOnSelect: boolean
}

export interface AttachmentPermission {
    id: number;
    name: string;
}