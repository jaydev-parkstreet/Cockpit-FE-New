const AppRoutes = {
    AUTHENTICATION: {
        LOGIN: 'login',
        SELECT_CLIENTS: 'select-clients',
        LINKEDIN_LOGIN: 'linkedin-login',
        SIGNUP: 'signup-create-new-user',
        LOGOUT: 'logout',
        VALIDATE_INVITATION_TOKEN: 'validate-invitation-token',
        GOOGLE_LOGIN: 'google-login',
        APPLE_LOGIN: 'apple-login',
        VERIFY_PASSWORD: 'verify-current-password',
        CHANGE_USER_EMAIL: 'change-user-email',
        RESEND_VERIFICATION_EMAIL: 'resend-verification-email',
        PASSWORD_VERIFICATION: 'auth/password_verification',
        GET_2FA_SETTINGS: 'auth/get_two_factor_authentication_settings',
        GET_TOKEN_DATA: 'get-token-data',
        UPDATE_2FA_STATUS: 'auth/update_two_factor_authentication_status',
        ADD_NEXT_2FA_REMINDER: 'auth/add_next_2FA_reminder',
        SEND_2FA_VERIFICATION_CODE: 'auth/send_2FA_verification_code',
        RESEND_2FA_VERIFICATION_CODE: 'auth/resend_2FA_verification_code',
        VERIFY_2FA_VERIFICATION_CODE: 'auth/verify_2FA_verification_code_for_login',
        VERIFY_2FA_VERIFICATION_CODE_USER: 'auth/verify_2FA_verification_code',
        GET_PROFILE_INFO: 'get-profile',
        GET_SUB_BRAND_PRODUCT_WITH_CLIENT_ID: 'product-tool/get-sub-brand-products-client'
    }
};

export default AppRoutes;