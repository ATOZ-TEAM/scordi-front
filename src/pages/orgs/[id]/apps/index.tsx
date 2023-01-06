import React from 'react';
import {pathReplace, pathRoute} from '^types/pageRoute.type';
import {useRouter} from 'next/router';
import {getOrgMainLayout} from '^layouts/org/mainLayout';
import {AppSearchPageRoute} from '^pages/apps/search';
import {Icon} from '^components/Icon';
import {MobileBottomNav} from '^components/v2/MobileBottomNav';
import {TitleSection} from '^components/v2/TitleSection';
import {OrgHomeRoute} from '^pages/orgs/[id]/home';
import {ApplicationList} from '^components/pages/OrgAppIndexPage/ApplicationList';
import {OrgApplicationSelectPageRoute} from '^pages/orgs/[id]/apps/new/select';

export const OrgAppsIndexPageRoute = pathRoute({
    pathname: '/orgs/[id]/apps',
    path: (orgId: number) => pathReplace(OrgAppsIndexPageRoute.pathname, {id: orgId}),
});

export default function OrgAppsIndexPage() {
    const router = useRouter();
    const organizationId = Number(router.query.id);

    return (
        <>
            <TitleSection.TopPadding />
            <TitleSection.Simple>
                <TitleSection.Title text={`서비스`} />
                <TitleSection.Button text="달력보기" href={OrgHomeRoute.path(organizationId)} />
            </TitleSection.Simple>

            <ApplicationList />

            <MobileBottomNav>
                <MobileBottomNav.Item href={OrgApplicationSelectPageRoute.path(organizationId)} icon={<Icon.Plus />} />
            </MobileBottomNav>
        </>
    );
}

OrgAppsIndexPage.getLayout = getOrgMainLayout;
