import React, {memo} from 'react';
import {V3MainLayout, V3MainLayoutContainer} from '^v3/layouts/V3MainLayout';
import {useRecoilValue} from 'recoil';
import {currentOrgAtom} from '^models/Organization/atom';
import {useTranslation} from 'next-i18next';
import {useOnResize2} from '^components/util/onResize2';
import {V3MainLayoutMobile} from '^v3/layouts/V3MainLayout.mobile';
import {TeamMembersPanel} from '^v3/V3OrgTeam/V3OrgTeamMembersPage/mobile/TeamMembersPanel';
import {NewTeamMemberModal} from '^components/pages/v3/V3OrgTeam/V3OrgTeamMembersPage/modals/NewTeamMemberModal';
import {BottomTabIndex} from '^v3/share/BottomNavMobile';
import {InviteOrgMemberModal} from './modals/InviteMemberModal';
import {LNBIndex} from '^v3/share/LeftNavBar';
import {MembersTableSection} from '^v3/V3OrgSettingsMembersPage/MembersTableSection';
import {AddMemberButton, ButtonTypes} from '^v3/V3OrgTeam/V3OrgTeamMembersPage/AddMemberButton';
import {TeamMemberShowModal} from '^v3/V3OrgTeam/V3OrgTeamMemberShowPage/desktop/modals/TeamMemberShowModal';

export const V3OrgTeamMembersPage = memo(() => {
    const currentOrg = useRecoilValue(currentOrgAtom);
    const {t} = useTranslation('org-home');
    const {isDesktop} = useOnResize2();

    if (isDesktop) {
        return (
            <V3MainLayout
                activeTabIndex={LNBIndex.Members}
                modals={[NewTeamMemberModal, InviteOrgMemberModal, TeamMemberShowModal]}
            >
                <V3MainLayoutContainer>
                    <section className="mb-6">
                        <div className="flex justify-between mb-5">
                            <h1>멤버 관리</h1>

                            <AddMemberButton text="멤버 등록" type={ButtonTypes.ScordiBtn} />
                        </div>
                        <MembersTableSection />
                    </section>
                </V3MainLayoutContainer>
            </V3MainLayout>
        );
    } else {
        return (
            <V3MainLayoutMobile
                title="멤버 목록"
                activeTabIndex={BottomTabIndex.MEMBERS}
                modals={[NewTeamMemberModal, InviteOrgMemberModal]}
            >
                <TeamMembersPanel />
            </V3MainLayoutMobile>
        );
    }
});
