import {api} from './api';
import {SendPhoneAuthMessageDto} from '^types/user.type';

export const postPhoneAuthSession = (data: SendPhoneAuthMessageDto) => {
    return api.post<boolean>('/users/auth/phone-auth-session', data);
};

export const patchPhoneAuthSession = (data: SendPhoneAuthMessageDto) => {
    return api.patch<boolean>('/users/auth/phone-auth-session', data);
};
