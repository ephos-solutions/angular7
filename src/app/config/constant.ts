/**
 * APi call base URL
 */
export const api_base_url  = 'http://www.cavelog.com:8080/cavelog/';

/**
 * Api call x-MessageId
 */
export const x_messageId  = '123456789';
export const crypto_key  = 'Cavelog@123456789';

export const errorCodes : { [type: string]: number } = {
    'NO_SECURITY_QUESTIONS': 1020,
    'ACCOUNT_NOT_FOUND': 1001,
    'USER_ACCOUNT_NOT_ACTIVATED': 1018,
    'USER_ACCOUNT_LOCKED': 1017,
    'LOGIN_FAILED':1022,
    'ACCOUNT_ACTIVATION_FAILED':1007,
    'ACCOUNT_ALREADY_ACTIVE': 1006,
};

export const popuperrorCodes  = [1006,1018,1020];

export const actions : { [type: string]: string } = {
    'RESET_CODE': 'RESET_CODE',
    'VALIDATE':'VALIDATE',
    'UPDATE_PWD':'UPDATE_PWD',
};

export const errorCodeMap : {[type:string]:string}={
        1025: 'username',
        1001: 'username',
        1026: 'username',
        1002: 'username',
        1027: 'firstname',
        1028: 'firstname',
        1029: 'lastname',
        1030: 'lastname',
        1033: 'password',
        1034: 'password',
        1035: 'confirm_password',
        1036: 'confirm_password',
        1031: 'telephone',
        1032: 'telephone',
        1007: 'activationCode',
    1009: 'securityQuestion1',
    1043: 'securityQuestion1',
    1044: 'securityAnswer1',
    1011: 'securityAnswer1',
    1053: 'securityQuestion2',
    1045: 'securityQuestion2',
    1046: 'securityAnswer2',
    1055: 'securityAnswer2',
    1054: 'securityQuestion3',
    1047: 'securityQuestion3',
    1048: 'securityAnswer3',
    1056: 'securityAnswer3',
};
