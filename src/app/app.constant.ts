
const AppConstant = {
    LOGIN: {
        PAGE_TITLE: 'Sign In',
        PAGE_SUBTITLE: 'Log in to access your account.',
        BUTTON_LABEL: 'Log In',
        LINKEDIN_BUTTON_LABEL: 'Log in with',
        NOTES: 'By clicking Log in, you agree to the Park Street Terms of use, Privacy Policy and Cookie Policy.',
        REQUIRED_FIELDS: 'Please enter required fields',
        REQUIRED_EMAIL: 'Please enter your email or username',
        REQUIRED_PASSWORD: 'Please enter your password',
        PAGE_SUBTITLE_FOR_AGREEMENTS: 'View and manage your agreements with your account at Park Street'
    },

    PRODUCT:{
        PAGE_TITLE: 'PRODUCT DETAILS' ,
        SUBMIT_BUTTON: 'Save',
        CANCEL_BUTTON: 'Cancel',
        SYNC_STATUS: {
            1: 'Synced',
            2: 'Syncing',
            3: 'Sync',
            4: 'Sync'
        }
    },

    ENTITY_PERMISSIONS : {
        PUBLIC_EVERYONE_ID: 1,
        PRIVATE_ONLY_PS_USER_ID: 2,
        PRIVATE_ONLY_ME: 3
    },

    ADDRESS_KEYS : {
        billing_address: ['billing_address_one', 'billing_address_two', 'billing_city', 'billing_state', 'billing_zip_code'],
        shipping_address: ['shipping_address_one', 'shipping_address_two', 'shipping_city', 'shipping_state', 'shipping_zip_code'],
        license_address: ['license_address_1', 'license_address_2', 'city', 'state', 'zip_code']
    }
};

export default AppConstant;
