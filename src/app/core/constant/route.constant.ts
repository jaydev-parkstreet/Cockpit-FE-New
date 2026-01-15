export const AppRoutes = {
    AUTHENTICATION: {
        LOGIN: 'login',
        LOGOUT: 'logout',
        GET_PROFILE_INFO: 'get-profile',
        CHECK_TOKEN: 'check-token'
    },
    COMMON: {
        NOTES: 'notes',
        MULTIPLE_NOTES_API: 'store-multiple-notes',
        NOTES_CHANGE_PERMISSION: 'notes/change-permission',
        ATTACHMENTS: 'files',
        ATTACHMENTS_PERMISSION: 'files/change-permission',
        SIDEBAR_MENU: 'cockpit-sidebar-menu',
        AUDIT_TRAIL: 'audit-trail/list',
        MULTIPLE_FILES_API: 'store-multiple-files'
    },
    HOUSE_CASH_CREDITS: {
        PERMISSION: 'house-cash-credit/permissions',
        DROPDOWN: 'house-cash-credit/filters',
        SUMMARY: 'house-cash-credit/summary',
        SUMMARY_COUNT: 'house-cash-credit/summary-count',
        EXPORT: 'house-cash-credit/export-excel'
    }
};