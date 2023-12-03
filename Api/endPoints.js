
//User Routes

/* 
    create user - [post]
    get users - [get]
    get user by id -> user/:id - [get]
    update user by id -> user/:id - [put]
    endpoint
*/ 
export const USER = 'user';
// user login
export const LOGIN = 'login';

// social media login
export const SOCIAL_LOGIN = 'social';

//forget password
export const FORGET_PASSWORD = 'forgot-password'

//confirm password 
export const CONFIRM_ACCOUNT = 'confirm-account'

//reset password 
export const RESET_PASSWORD = 'reset-password'


//Challenge Routes -------

/* 
    create challenge - [post]
    get challenge - [get]
    get challenge by id -> challenge/:id - [get]
    update challenge by id -> challenge/:id - [put]
    delete challenge by id -> challenge/:id - [delete]
    endpoint
*/ 
export const CHALLENGE = 'challenge';


//Trophy Routes -------

/* 
    create trophy - [post]
    get trophy - [get]
    get trophy by id -> trophy/:id - [get]
    update trophy by id -> trophy/:id - [put]
    delete trophy by id -> trophy/:id - [delete]
    endpoint
*/ 
export const TROPHY = 'trophy';


//Comments Routes -------

/* 
    create comment - [post]
    get comment - [get]
    get comment by id -> comment/:id - [get]
    update comment by id -> comment/:id - [put]
    delete comment by id -> comment/:id - [delete]
    endpoint
*/ 
export const COMMENT = 'comment';

//files Routes -------

export const UPLOAD_VIDEO = 'video/upload';
export const UPLOAD_IMAGE = 'uploadProfileImage';
export const ALL_CHALLENGES = 'challenge';