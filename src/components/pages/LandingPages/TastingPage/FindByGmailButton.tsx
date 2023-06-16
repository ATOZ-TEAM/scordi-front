import React, {memo, useEffect, useState} from 'react';
import {getGoogleAccessTokenByCode, GmailAgent, googleAuthForGmail} from '^api/tasting.api';
import {useRouter} from 'next/router';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {
    gmailItemsAtom,
    gmailAccessTokenDataAtom,
    gmailProfileAtom,
    gmailItemsLoadedAtom,
    gmailItemsLoadingAtom,
} from './pageAtoms';
import {TastingPageRoute} from '^pages/tasting';
import {SummarySection} from './SummarySection';

interface FindByGmailButtonProps {
    // gmailAuthClient: OAuth2Client;
}

export const FindByGmailButton = memo((props: FindByGmailButtonProps) => {
    const {} = props;
    const router = useRouter();
    const [accessTokenData, setAccessTokenData] = useRecoilState(gmailAccessTokenDataAtom);
    const setGmailProfile = useSetRecoilState(gmailProfileAtom);
    const setGmailItems = useSetRecoilState(gmailItemsAtom);
    const [isLoading, setIsLoading] = useRecoilState(gmailItemsLoadingAtom);
    const [isLoaded, setIsLoaded] = useRecoilState(gmailItemsLoadedAtom);

    // 엑세스 토큰이 세팅되어 있지 않으면, 주소창에서 토큰값을 확인하여 세팅을 하고,
    // 엑세스 토큰이 이미 세팅되어 있는 상태면 생략한다.
    useEffect(() => {
        if (accessTokenData) return;

        const code = router.query.code as string | undefined;
        if (!code) return;

        getGoogleAccessTokenByCode(code).then(async (tokenData) => {
            if (!tokenData) return;
            setAccessTokenData(tokenData);
            await router.replace(TastingPageRoute.path());
        });
    }, [router.isReady]);

    // 엑세스 토큰이 아직 세팅되어 있지 않은 상태면 생략하고,
    // 엑세스 토큰이 세팅되어 있는 상태면 지메일을 호출한다.
    useEffect(() => {
        if (!accessTokenData) return;
        console.log('accessTokenData', accessTokenData);
        const gmailAgent = new GmailAgent(accessTokenData);
        gmailAgent.getProfile().then(setGmailProfile);
        setIsLoading(true);
        gmailAgent
            .getList()
            .then((items) => {
                return items;
            })
            .then(setGmailItems)
            .then(() => {
                setIsLoading(false);
                setIsLoaded(true);
            });
    }, [accessTokenData]);

    return (
        <div id="tasting-handler" className={`${isLoaded ? 'active' : ''}`}>
            <div id="tasting-handler--start-button">
                {/*<button*/}
                {/*    onClick={googleAuthForGmail}*/}
                {/*    className="btn btn-lg btn-outline shadow rounded-full font-medium normal-case mb-3 space-x-4 bg-white border-slate-200 text-slate-700 hover:bg-white hover:border-primary hover:text-slate-700 focus:bg-blue-50 active:bg-primary-100"*/}
                {/*>*/}
                {/*    <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-6 h-6" alt="" />*/}
                {/*    <span>Google 계정으로 시작하기</span>*/}
                {/*</button>*/}

                <button onClick={googleAuthForGmail} className="btn_google_signin_light w-[280px] h-[64px]"></button>
            </div>

            <SummarySection />
        </div>
    );
});
