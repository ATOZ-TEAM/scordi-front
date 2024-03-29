import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {pathRoute, pathReplace} from '^types/pageRoute.type';
import {v3CommonRequires} from '^types/utils/18n.type';
import {buildUrl} from '^utils/get-query-params';

export const GoogleCallbackPageRoute = pathRoute({
    pathname: '/callback/google',
    path: () => pathReplace(GoogleCallbackPageRoute.pathname, {}),
});

export const getStaticProps = async ({locale}: any) => ({
    props: {
        // Will be passed to the page component as props
        ...(await serverSideTranslations(locale, [
            ...v3CommonRequires, // 여기에 이 페이지에서 사용할 locale 파일을 추가하세요.
        ])),
    },
});

/**
 *
 */
export default function GoogleCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;

        const {state, ...query} = router.query;
        const redirectUri = state as string | undefined;

        // console.log('query', query);
        if (redirectUri) router.replace(buildUrl(redirectUri, query));
    }, [router.isReady]);

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 m-auto flex items-center justify-center">
            <div>
                <div className="loadingio-spinner-spinner-cb6o2gc2by">
                    <div className="ldio-pcdc4ae6leg">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>

                <p className="text-center">Loading ...</p>
            </div>
        </div>
    );
}
