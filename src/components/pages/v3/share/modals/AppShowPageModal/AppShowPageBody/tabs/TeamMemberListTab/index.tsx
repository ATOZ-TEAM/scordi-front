import React, {memo, useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {useAppShowModal} from '^v3/share/modals/AppShowPageModal';
import {TeamMemberItem} from './TeamMemberItem';
import {LoadMoreButton} from './LoadMoreButton';
import {TeamMemberDto, useTeamMembersInSubscriptionShowModal} from '^models/TeamMember';
import {AddButton} from './AddButton';

interface TeamMemberListTabProps {
    onDelete?: () => any;
}

export const TeamMemberListTab = memo(function TeamMemberListTab(props: TeamMemberListTabProps) {
    const orgId = useRecoilValue(orgIdParamState);
    const {subjectId} = useAppShowModal();
    const TeamMembers = useTeamMembersInSubscriptionShowModal();

    const {onDelete: _onDelete} = props;

    useEffect(() => {
        if (!subjectId || isNaN(subjectId)) return;

        TeamMembers.search({
            where: {
                organizationId: orgId,
                // @ts-ignore
                subscriptions: {id: subjectId},
            },
        });
    }, [subjectId]);

    const onDelete = (teamMember: TeamMemberDto) => {
        TeamMembers.except(teamMember);
        _onDelete && _onDelete();
    };

    const {items, pagination} = TeamMembers.result;
    const {totalPage, currentPage, totalItemCount} = pagination;

    return (
        <MobileSection.Item className="border-b-0 grow">
            <MobileSection.Padding>
                <div className="sticky -mx-6 px-6 bg-white z-10" style={{top: 'calc(50px + 64px)'}}>
                    <div className="py-3 flex items-center justify-between">
                        <p className="text-xl font-semibold flex items-center">
                            <span className="mr-2">총</span>
                            <span className="font-bold text-scordi">{totalItemCount.toLocaleString()} 명</span>
                            <span>의 멤버가 써요</span>
                        </p>

                        <AddButton />
                    </div>

                    <hr />
                </div>

                <ul className="menu menu-compact lg:menu-normal bg-base-100 block no-scrollbar">
                    {subjectId &&
                        items.map((teamMember, i) => (
                            <TeamMemberItem
                                key={i}
                                subscriptionId={subjectId}
                                teamMember={teamMember}
                                onDelete={() => onDelete(teamMember)}
                            />
                        ))}
                </ul>

                {totalPage > currentPage ? (
                    <LoadMoreButton />
                ) : (
                    <div>
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                )}
            </MobileSection.Padding>
        </MobileSection.Item>
    );
});
