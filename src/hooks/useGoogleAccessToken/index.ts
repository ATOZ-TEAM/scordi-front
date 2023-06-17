import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {atom, useRecoilState} from 'recoil';
import {getGoogleAccessTokenByCode, GoogleAccessTokenData} from '^api/tasting.api';

export const gmailAccessTokenDataAtom = atom<GoogleAccessTokenData | null>({
    key: 'gmailAccessTokenDataAtom',
    default: null,
});

export enum GmailAgentProgress {
    no_running = 'no_running',
    started = 'started',
    finished = 'finished',
}

export const gmailAgentProgressAtom = atom<GmailAgentProgress>({
    key: 'gmailAgentProgressAtom',
    default: GmailAgentProgress.no_running,
});

export const useGoogleAccessToken = () => {
    const [accessTokenData, setAccessTokenData] = useRecoilState(gmailAccessTokenDataAtom);
    return {accessTokenData};
};

export function useGoogleAccessTokenCallback(redirectPath: string, deps?: any[]) {
    const router = useRouter();
    const [accessTokenData, setAccessTokenData] = useRecoilState(gmailAccessTokenDataAtom);
    const [progress, setProgress] = useRecoilState(gmailAgentProgressAtom);

    useEffect(() => {
        if (!router.isReady) return;
        if (accessTokenData) return;

        const code = router.query.code as string | undefined;
        if (!code) return;

        setProgress(GmailAgentProgress.started);
        getGoogleAccessTokenByCode(code, redirectPath).then(async (tokenData) => {
            if (!tokenData) return;
            setAccessTokenData((old) => {
                if (!old) return tokenData;
                if (old.expireAt.getTime() <= new Date().getTime()) return tokenData;
                return old;
            });
            await router.replace(redirectPath);
        });
    }, [...(deps || []), router.isReady]);

    return {accessTokenData, progress};
}
