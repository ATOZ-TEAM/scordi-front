import React, {memo} from 'react';
import {useRouter} from 'next/router';
import {useRecoilValue} from 'recoil';
import {useForm} from 'react-hook-form';
import {V3OrgTeamMembersPageRoute} from '^pages/v3/orgs/[orgId]/teams/members';
import {orgIdParamState} from '^atoms/common';
import {UpdateTeamMemberDto, currentTeamMemberState} from '^models/TeamMember';
import {V3ModalLikeLayoutMobile} from '^v3/layouts/V3ModalLikeLayout.mobile';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {TeamMemberShowBody} from '^v3/V3OrgTeam/modals/TeamMemberShowModal';
import {EditButton} from '^v3/V3OrgTeam/modals/TeamMemberShowModal/EditButton';
import {DeleteButton} from '^v3/V3OrgTeam/modals/TeamMemberShowModal/DeleteButton';

export const V3OrgTeamMemberShowPage = memo(() => {
    const router = useRouter();
    const orgId = useRecoilValue(orgIdParamState);
    const form = useForm<UpdateTeamMemberDto>();
    const currentMember = useRecoilValue(currentTeamMemberState);

    return (
        <V3ModalLikeLayoutMobile
            topRightButtons={[EditButton, DeleteButton]}
            backBtnOnClick={() => router.push(V3OrgTeamMembersPageRoute.path(orgId))}
        >
            <MobileSection.List className="h-full">
                <TeamMemberShowBody form={form} />
            </MobileSection.List>
        </V3ModalLikeLayoutMobile>
    );
});
