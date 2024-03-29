import {orgIdParamState, useRouterIdParamState} from '^atoms/common';
import {V3OrgCardListPage} from '^components/pages/v3/V3OrgCardListPage';
import {pathReplace, pathRoute} from '^types/pageRoute.type';
import {v3CommonRequires} from '^types/utils/18n.type';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useEffect} from 'react';
import {useSetRecoilState} from 'recoil';
import {cardIdParamState} from '^models/CreditCard/atom';
import {useCurrentOrg} from '^models/Organization/hook';

export const V3OrgCardListPageRoute = pathRoute({
    pathname: '/v3/orgs/[orgId]/cards',
    path: (orgId: number) =>
        pathReplace(V3OrgCardListPageRoute.pathname, {
            orgId,
        }),
});

// export const getStaticPaths = async () => ({
//     paths: [{params: {orgId: '1'}}],
//     fallback: true,
// });
//
// export const getStaticProps = async ({locale}: any) => ({
//     props: {
//         // Will be passed to the page component as props
//         ...(await serverSideTranslations(locale, [
//             ...v3CommonRequires, // 여기에 이 페이지에서 사용할 locale 파일을 추가하세요.
//             'org-home',
//             'google-compliance',
//             'publicTasting',
//         ])),
//     },
// });

export default function Page() {
    const setCardId = useSetRecoilState(cardIdParamState);
    const orgId = useRouterIdParamState('orgId', orgIdParamState);
    useCurrentOrg(orgId);

    useEffect(() => {
        setCardId(null);
    }, [orgId]);

    if (!orgId) return <></>;

    return <V3OrgCardListPage />;
}
