const AppRoutes = {
    AUTHENTICATION: {
        LOGIN: 'login',
        LOGOUT: 'logout',
        GET_PROFILE_INFO: 'get-profile',
    },
    PRODUCT_TOOL: {
        GET_SUB_BRAND_PRODUCT_WITH_CLIENT_ID: 'product-tool/get-sub-brand-products-client',
        SAVE_API: 'product-tool/save',
        PERMISSION: 'product-tool/permissions',
        DROPDOWN: 'product-tool/dropdown',
        SUMMARY: 'product-tool/summary',
        NS_SYNC: 'product-tool/ns-sync',
        NS_SYNC_STATUS: 'product-tool/ns-sync-status?id=',
        DETAILS: 'product-tool?product_id=',
        PRODUCT_APPROVE: 'product-tool/approve/product',
        PRODUCT_PRE_APPROVE: 'product-tool/pre-approve/product',
        PRODUCT_NEED_ACTION: 'product-tool/need-action-waiting-on-client/product',
        PRODUCT_ACTIVE_DEACTIVATE: 'product-tool/active-deactivate/product',
        EXCEL_EXPORT: 'product-tool/excel-export',
        PRODUCT_TOOL_GET_BRANDS: 'product-tool/get-brands-client',
    },
    COMMON: {
        NOTES: 'notes',
        NOTES_CHANGE_PERMISSION: 'notes/change-permission',
        ATTACHMENTS: 'files',
        ATTACHMENTS_PERMISSION: 'files/change-permission',
        SIDEBAR_MENU: 'cockpit-sidebar-menu'
    }
};

export default AppRoutes;
