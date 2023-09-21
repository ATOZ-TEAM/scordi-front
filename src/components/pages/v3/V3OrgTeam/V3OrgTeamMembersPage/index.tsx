import React, {memo} from 'react';
import {V3MainLayout} from '^v3/layouts/V3MainLayout';
import {useRecoilValue} from 'recoil';
import {currentOrgAtom} from '^atoms/organizations.atom';
import {useTranslation} from 'next-i18next';
import {useOnResize2} from '^components/util/onResize2';
import {V3MainLayoutMobile} from '^v3/layouts/V3MainLayout.mobile';
import {TeamMembersPanel} from '^v3/V3OrgTeam/V3OrgTeamMembersPage/mobile/TeamMembersPanel';

export const V3OrgTeamMembersPage = memo(() => {
    const currentOrg = useRecoilValue(currentOrgAtom);
    const {t} = useTranslation('org-home');
    const {isDesktop} = useOnResize2();

    if (isDesktop) {
        return (
            <V3MainLayout>
                <div>
                    <p>V3OrgTeamsPage</p>
                </div>
            </V3MainLayout>
        );
    } else {
        return (
            <V3MainLayoutMobile title={currentOrg?.name} activeTabIndex={4} modals={[]}>
                <TeamMembersPanel></TeamMembersPanel>
            </V3MainLayoutMobile>
        );
    }
});