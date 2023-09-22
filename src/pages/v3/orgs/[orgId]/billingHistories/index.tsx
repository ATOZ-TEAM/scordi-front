import React from 'react';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {pathRoute, pathReplace} from '^types/pageRoute.type';
import {v3CommonRequires} from '^types/utils/18n.type';
import {V3OrgBillingHistoriesPage as Page} from '^v3/V3OrgBillingHistoriesPage';

export const V3OrgBillingHistoriesPageRoute = pathRoute({
    pathname: '/v3/orgs/[orgId]/billingHistories',
    path: (orgId: number) =>
        pathReplace(V3OrgBillingHistoriesPageRoute.pathname, {
            orgId,
        }),
});

export const getStaticPaths = async () => ({
    paths: [{params: {orgId: '1'}}],
    fallback: true,
});

export const getStaticProps = async ({locale}: any) => ({
    props: {
        // Will be passed to the page component as props
        ...(await serverSideTranslations(locale, [
            ...v3CommonRequires, // 여기에 이 페이지에서 사용할 locale 파일을 추가하세요.'org-home'
        ])),
    },
});

export default function V3OrgBillingHistoriesPage() {
    return <Page />;
}
