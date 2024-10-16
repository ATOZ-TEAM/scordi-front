import React, {memo} from 'react';
import {useRecoilValue} from 'recoil';
import {FaExchangeAlt, FaRegEnvelope, FaRegTrashAlt, FaSignOutAlt} from 'react-icons/fa';
import {currentTeamMemberState, TeamMemberDto, useTeamMember} from '^models/TeamMember';
import {currentUserAtom} from '^models/User/atom';
import {Dropdown} from '^v3/share/Dropdown';
import {MoreDropdownListItem} from '^v3/share/table/columns/SelectColumn/OptionItem/MoreDropdown/ListItem';
import {StatusButton} from './StatusButton';
import {ApprovalStatus, MembershipLevel} from '^models/Membership/types';
import {FaRotateRight} from 'react-icons/fa6';
import {membershipApi} from '^models/Membership/api';
import {plainToast, useToast} from '^hooks/useToast';
import {InviteListItem} from '^v3/V3OrgTeam/V3OrgTeamMembersPage/TeamMemberTableSection/TaemMemberTable/TeamMemberTableRow/TeamMemberStatusDropdown/InviteListItem';
import {ResendInviteItem} from '^v3/V3OrgTeam/V3OrgTeamMembersPage/TeamMemberTableSection/TaemMemberTable/TeamMemberTableRow/TeamMemberStatusDropdown/ResendInviteItem';
import {DeleteMemberItem} from '^v3/V3OrgTeam/V3OrgTeamMembersPage/TeamMemberTableSection/TaemMemberTable/TeamMemberTableRow/TeamMemberStatusDropdown/DeleteMemberItem';

interface TeamMemberStatusDropdownProps {
    teamMember: TeamMemberDto;
    reload: () => any;
}

const changeLevel = (id: number, level: MembershipLevel) => {
    return membershipApi
        .update(id, {level})
        .then(() => plainToast.success('권한을 변경했어요'))
        .catch((err) => plainToast.error(err.response.data.message));
};

export const TeamMemberStatusDropdown = memo((props: TeamMemberStatusDropdownProps) => {
    const currentUser = useRecoilValue(currentUserAtom);
    const {toast} = useToast();
    const {reload, teamMember} = props;

    if (!teamMember || !currentUser) return <></>;

    const memberships = currentUser.memberships || [];
    const {membership} = teamMember;
    const isMe = !!memberships.find((m) => m.id === membership?.id);
    const currentUserMembership = currentUser.memberships?.find((m) => m.organizationId === teamMember.organizationId);
    if (!currentUserMembership) return <>!</>;

    return (
        <Dropdown
            placement="bottom-end"
            Trigger={() => <StatusButton teamMember={teamMember} />}
            Content={({hide}) => {
                const hideAndReload = async () => {
                    hide();
                    await reload();
                };

                return (
                    <ul className="p-2 text-sm shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
                        {/* 1. 초대를 보내지 않았고 **멤버레코드만 존재**하는 상태 : 초대버튼 노출 */}
                        {!membership && <InviteListItem teamMember={teamMember} onFinish={hideAndReload} />}

                        {/* 2. 초대를 보냈으나 **워크스페이스 조인을 기다리는 중**인 멤버 : 재발송 버튼 노출 */}
                        {membership && membership.approvalStatus === ApprovalStatus.PENDING && (
                            <ResendInviteItem teamMember={teamMember} onFinish={hideAndReload} />
                        )}

                        {/* 3. 초대를 보내어 **워크스페이스에 조인을 완료**한 멤버 일때 */}
                        {/* - 만약 현재 로그인한 유저가 관리자 권한을 가지고 있다면 : 레벨 수정 버튼 노출 */}
                        {/* change role */}
                        {membership &&
                            membership.approvalStatus === ApprovalStatus.APPROVED &&
                            currentUserMembership.level === MembershipLevel.OWNER && (
                                <>
                                    {membership.level === MembershipLevel.OWNER && (
                                        <MoreDropdownListItem
                                            onClick={() =>
                                                membership &&
                                                changeLevel(membership.id, MembershipLevel.MEMBER).then(hideAndReload)
                                            }
                                        >
                                            <div className="flex items-center gap-3 w-full py-1">
                                                <FaExchangeAlt size={12} />
                                                <p>구성원 역할로 변경하기</p>
                                            </div>
                                        </MoreDropdownListItem>
                                    )}
                                    {membership.level === MembershipLevel.MEMBER && (
                                        <MoreDropdownListItem
                                            onClick={() =>
                                                membership &&
                                                changeLevel(membership.id, MembershipLevel.OWNER).then(hideAndReload)
                                            }
                                        >
                                            <div className="flex items-center gap-3 w-full py-1">
                                                <FaExchangeAlt size={12} />
                                                <p>관리자 역할로 변경하기</p>
                                            </div>
                                        </MoreDropdownListItem>
                                    )}
                                </>
                            )}
                        <hr />

                        {(!membership || membership.approvalStatus === ApprovalStatus.PENDING) && (
                            <DeleteMemberItem reload={reload} teamMember={teamMember} />
                        )}
                        {membership && membership.approvalStatus === ApprovalStatus.APPROVED && (
                            <MoreDropdownListItem onClick={() => toast.info('준비중입니다.')}>
                                <div className="flex items-center gap-3 w-full text-red-500 py-1">
                                    <FaSignOutAlt size={12} />
                                    <p>워크스페이스에서 내보내기</p>
                                </div>
                            </MoreDropdownListItem>
                        )}
                    </ul>
                );
            }}
        />
    );
});
TeamMemberStatusDropdown.displayName = 'TeamMemberStatusDropdown';
