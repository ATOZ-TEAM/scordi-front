import React, {memo, useEffect, useState} from 'react';
import {TeamMemberDto} from '^models/TeamMember/type';
import {Avatar} from '^components/Avatar';
import {useRecoilValue} from 'recoil';
import {useRouter} from 'next/router';
import {orgIdParamState} from '^atoms/common';
import {V3OrgTeamMemberShowPageRoute} from '^pages/v3/orgs/[orgId]/teams/members/[memberId]';
import {useToast} from '^hooks/useToast';
import {approvalStatusOptions, OptionsType} from '^v3/V3OrgSettingsMembersPage/type';
import {ApprovalStatus} from '^models/Membership/type';
import {useOnResize2} from '^components/util/onResize2';

interface TeamMemberItemProps {
    item: TeamMemberDto;
}

export const TeamMemberItem = memo((props: TeamMemberItemProps) => {
    const {item: teamMember} = props;
    const orgId = useRecoilValue(orgIdParamState);
    const {profileImgUrl} = teamMember.makeTeamMemberProfile();
    const [badgeOption, setBadgeOption] = useState<OptionsType>();
    const router = useRouter();
    const {isDesktop} = useOnResize2();
    const {toast} = useToast();
    const isPending = badgeOption?.status === ApprovalStatus.PENDING;

    useEffect(() => {
        const defaultOption = approvalStatusOptions.find((option) => {
            return option.status === teamMember.membership?.approvalStatus;
        });

        setBadgeOption(defaultOption);
    }, []);

    const onClick = () => {
        if (isPending) {
            toast.error('초대중인 멤버입니다.');
            return;
        }
        router.push(V3OrgTeamMemberShowPageRoute.path(orgId, teamMember.id));
    };

    return (
        <div
            className={`flex items-center gap-4 px-3 py-2.5 -mx-3 bg-base-100 text-gray-700  hover:bg-neutral ${
                isPending ? 'opacity-50' : 'cursor-pointer'
            }`}
            onClick={onClick}
        >
            {/*<UserAvatar user={user} />*/}
            <Avatar src={profileImgUrl} className="w-8 h-8 outline outline-offset-1 outline-slate-100" />

            <div>
                <p className={`font-semibold flex gap-2 items-center ${!isDesktop && 'text-base'}`}>
                    <span>{teamMember.name}</span>
                    {isPending && (
                        <span className={`${badgeOption?.className} badge badge-sm`}>{badgeOption?.label}</span>
                    )}
                </p>
                <p className="block text-sm font-normal text-gray-400">{teamMember.email}</p>
            </div>
        </div>
    );
});
