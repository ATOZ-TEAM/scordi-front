import {atom} from 'recoil';

export const invitedOrgIdAtom = atom<number>({
    key: 'invitedOrgId',
    default: 0,
});

export const isCopiedAtom = atom<boolean>({
    key: 'isCopiedAtom',
    default: false,
});
