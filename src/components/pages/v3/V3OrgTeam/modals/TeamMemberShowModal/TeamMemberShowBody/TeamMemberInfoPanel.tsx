import React, {memo} from 'react';
import {useRecoilValue} from 'recoil';
import {getDate} from '^components/util/date';
import {yyyy_mm_dd_hh_mm} from '^utils/dateTime';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {MobileInfoList} from '^v3/share/MobileInfoList';
import {MobileInfoListItem} from '^v3/share/MobileInfoList/Item';
import {ApprovalStatus} from '^models/Membership/types';
import {currentTeamMemberState, useSendInviteEmail} from '^models/TeamMember';
import {TeamMemberAvatar} from '^v3/share/TeamMemberAvatar';
import {useAlert} from '^hooks/useAlert';
import {useTeamMemberShowModal} from '^v3/V3OrgTeam/modals/TeamMemberShowModal';
import {TeamTag} from '^models/Team/components/TeamTag';

/**
 * 첫 수정 시 완료 버튼을 두 번 클릭해야 submit 되는 현상이 있습니다.
 */
export const TeamMemberInfoPanel = memo(() => {
    const teamMember = useRecoilValue(currentTeamMemberState);
    const {alert} = useAlert();
    const {sendEmail} = useSendInviteEmail();
    const {hide} = useTeamMemberShowModal();

    if (!teamMember) return <></>;

    const approvalStatus = teamMember.membership?.approvalStatus;
    const {name, jobName, phone, email} = teamMember;

    const inviteContext = (() => {
        if (!email) return 'CANNOT_INVITE';
        if (teamMember.membership) return 'RESEND';
        return 'INVITE';
    })();

    const sendInviteEmail = () => {
        if (!teamMember.email) return;

        return sendEmail(teamMember.email).then(() => hide());
    };
    const onClick = () => {
        switch (inviteContext) {
            case 'CANNOT_INVITE':
                return;
            case 'RESEND':
                alert.error('이미 초대한 멤버입니다', '초대 메일을 다시 보낼까요?').then(() => sendInviteEmail());
                return;
            default:
                sendInviteEmail();
        }
    };

    return (
        <MobileSection.Item className="border-b-0">
            <MobileSection.Padding>
                <div className="flex justify-between mb-10">
                    <div className="flex-1">
                        <div className="flex">
                            {teamMember.team && <TeamTag id={teamMember.team.id} name={teamMember.team.name} />}
                        </div>
                        <h3 className="text-2xl font-bold w-full py-2">{name}</h3>
                        <p className="text-sm">
                            {email || <span className="italic text-gray-400">이메일을 넣어주세요</span>}
                        </p>
                    </div>
                    <div>
                        <TeamMemberAvatar teamMember={teamMember} className="w-16 h-16 text-[32px]" />
                    </div>
                </div>

                <MobileInfoList>
                    <MobileInfoListItem label="휴대폰" value={phone || <i>-</i>} />

                    {/*유저 가입 상태*/}
                    <MobileInfoListItem
                        label={
                            approvalStatus
                                ? approvalStatus === ApprovalStatus.PENDING
                                    ? '초대 발송일'
                                    : '가입일'
                                : '등록일'
                        }
                        value={
                            approvalStatus
                                ? approvalStatus === ApprovalStatus.PENDING
                                    ? getDate(teamMember.membership?.createdAt!)
                                    : getDate(teamMember.createdAt)
                                : yyyy_mm_dd_hh_mm(teamMember.createdAt)
                        }
                    />
                </MobileInfoList>

                <br />
                <br />

                <button
                    type="button"
                    disabled={!email}
                    className="btn btn-lg btn-block btn-scordi rounded-box !disabled:cursor-not-allowed disabled:border-indigo-100 disabled:bg-indigo-100 disabled:text-indigo-300"
                    onClick={onClick}
                >
                    {inviteContext === 'CANNOT_INVITE' && '초대하려면 이메일이 필요합니다'}
                    {inviteContext === 'INVITE' && '이 멤버 초대하기'}
                    {inviteContext === 'RESEND' && 'resend'}
                </button>
            </MobileSection.Padding>
        </MobileSection.Item>
    );
});
