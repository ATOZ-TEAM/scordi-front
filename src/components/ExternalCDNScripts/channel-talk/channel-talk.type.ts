declare global {
    interface Window {
        ChannelIO?: IChannelIO;
        ChannelIOInitialized?: boolean;
    }
}

export interface IChannelIO {
    c?: (...args: any) => void;
    q?: [methodName: string, ...args: any[]][];
    (...args: any): void;
}

export interface BootOption {
    appearance?: string;
    customLauncherSelector?: string;
    hideChannelButtonOnBoot?: boolean;
    hidePopup?: boolean;
    language?: string;
    memberHash?: string;
    memberId?: string;
    mobileMessengerMode?: string;
    pluginKey: string;
    profile?: Profile;
    trackDefaultEvent?: boolean;
    trackUtmSource?: boolean;
    unsubscribe?: boolean;
    unsubscribeEmail?: boolean;
    unsubscribeTexting?: boolean;
    zIndex?: number;
}

export interface Callback {
    (error: Error | null, user: CallbackUser | null): void;
}

export interface CallbackUser {
    alert: number;
    avatarUrl: string;
    id: string;
    language: string;
    memberId: string;
    name?: string;
    profile?: Profile | null;
    tags?: string[] | null;
    unsubscribeEmail: boolean;
    unsubscribeTexting: boolean;
}

export interface UpdateUserInfo {
    language?: string;
    profile?: Profile | null;
    profileOnce?: Profile;
    tags?: string[] | null;
    unsubscribeEmail?: boolean;
    unsubscribeTexting?: boolean;
}

export interface Profile {
    [key: string]: string | number | boolean | null;
}

export interface FollowUpProfile {
    name?: string | null;
    mobileNumber?: string | null;
    email?: string | null;
}

export interface EventProperty {
    [key: string]: string | number | boolean | null;
}

export type Appearance = 'light' | 'dark' | 'system' | null;
