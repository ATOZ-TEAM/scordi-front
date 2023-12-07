import React, {memo} from 'react';
import {TeamMemberDto} from '^models/TeamMember/type';
import {Avatar} from '^components/Avatar';
import {useRecoilValue} from 'recoil';
import {useRouter} from 'next/router';
import {orgIdParamState} from '^atoms/common';
import {V3OrgTeamMemberShowPageRoute} from '^pages/v3/orgs/[orgId]/teams/members/[memberId]';

interface TeamMemberItemProps {
    item: TeamMemberDto;
}

export const TeamMemberItem = memo((props: TeamMemberItemProps) => {
    const orgId = useRecoilValue(orgIdParamState);
    const router = useRouter();

    const {item: teamMember} = props;
    if (!teamMember) return <></>;

    const {profileImgUrl} = teamMember.makeTeamMemberProfile();

    const onClick = () => {
        router.push(V3OrgTeamMemberShowPageRoute.path(orgId, teamMember.id));
    };

    return (
        <div
            className={`flex items-center gap-4 px-3 py-2.5 -mx-3 bg-base-100 text-gray-700  hover:bg-neutral cursor-pointer`}
            onClick={onClick}
        >
            <Avatar src={profileImgUrl} className="w-8 h-8 outline outline-offset-1 outline-slate-100" />

            <div>
                <p className="font-semibold flex gap-2 items-center text-base">
                    <span>{teamMember.name}</span>
                </p>
                <p className="block text-sm font-normal text-gray-400">{teamMember.email}</p>
            </div>
        </div>
    );
});
