import React, {memo, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {patchMemberships} from '^api/membership.api';
import {useCurrentUser} from '^hooks/useCurrentUser';
import {ApprovalStatus, MembershipDto, MembershipLevel, UpdateMembershipRequestDto} from '^types/membership.type';
import {errorNotify} from '^utils/toast-notify';

interface MemberProps {
    memberShip: MembershipDto;
}

export const MemberListItem = memo((props: MemberProps) => {
    const {memberShip} = props;
    const {currentUserMembership} = useCurrentUser();
    const [isAcceptButtonActive, setIsAcceptButtonActive] = useState(false);

    useEffect(() => {
        if (currentUserMembership?.level === MembershipLevel.OWNER) {
            setIsAcceptButtonActive(memberShip.approvalStatus === ApprovalStatus.PENDING);
        }
    }, []);

    const acceptMember = (data: UpdateMembershipRequestDto, id: number) => {
        patchMemberships(data, id)
            .then(() => toast.success('Successfully approve'))
            .catch(errorNotify);
    };

    return (
        <div className="flex gap-4 items-center justify-center p-4 border-b border-b-[#dbd6e1]">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder inline-flex">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10">
                    <span className="text-xs">{memberShip.user.name[0]}</span>
                </div>
            </label>
            <div className={'flex-1 text-gray-800'}>{memberShip.user.name}</div>
            <div className={'flex-1 text-sm'}>{memberShip.user.email}</div>
            <div className={'flex-1 text-sm'}>{memberShip.level}</div>
            {/* {memberShip.approvalStatus === 'APPROVED' ? (
                <div className="p-5 badge font-bold bg-blue-100">using</div>
            ) : (
                <div className="p-5 badge font-bold">disabled</div>
            )} */}

            {isAcceptButtonActive && (
                <button
                    className="btn btn-sm btn-warning text-white"
                    onClick={() =>
                        acceptMember(
                            {level: memberShip.level, approvalStatus: memberShip.approvalStatus},
                            memberShip.organizationId,
                        )
                    }
                >
                    accept
                </button>
            )}

            {memberShip.approvalStatus === ApprovalStatus.APPROVED && (
                <button className="btn btn-sm btn-outline no-animation bg-white border-indigo-300 text-indigo-300 hover:bg-white hover:border-indigo-300 hover:text-indigo-300">
                    Using
                </button>
            )}
        </div>
    );
});
