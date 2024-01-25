import React, {memo} from 'react';
import {NextButtonUI} from '^v3/share/NextButtonUI';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
    createInviteTeamMemberAtom,
    emailInputValueAtom,
    isLoadingAtom,
    isOpenInviteOrgMemberModalAtom,
    isOpenLoadingModalAtom,
} from '^v3/share/modals/NewTeamMemberModal/InviteMemberModal/atom';
import {useToast} from '^hooks/useToast';
import {debounce} from 'lodash';
import {currentOrgAtom} from '^models/Organization/atom';
import {inviteMembershipApi} from '^models/Membership/api';
import {useAlert} from '^hooks/useAlert';
import {useModal} from '^v3/share/modals';
import {Invitation} from '^models/Membership/types';

interface CTAButtonProps {
    onSubmit?: () => void;
}
export const CTAButton = memo((props: CTAButtonProps) => {
    const formData = useRecoilValue(createInviteTeamMemberAtom);
    const currentOrg = useRecoilValue(currentOrgAtom);
    const email = useRecoilValue(emailInputValueAtom);
    const {close: closeInviteOrgModal} = useModal({isShowAtom: isOpenInviteOrgMemberModalAtom});
    const [isLoading, setIsLoading] = useRecoilState(isLoadingAtom);
    const {open: openLoadingModal, close: closeLoadingModal} = useModal({isShowAtom: isOpenLoadingModalAtom});
    const {alert} = useAlert();
    const {toast} = useToast();

    const {onSubmit: _onSubmit} = props;

    const invitedEmails = formData?.invitations?.map((invitation) => {
        return invitation.email;
    });
    const isActive = !!invitedEmails?.length || (email.includes('.') && email.includes('@'));

    const onClose = () => {
        setIsLoading(false);
        closeInviteOrgModal();
        closeLoadingModal();
        _onSubmit && _onSubmit();
    };

    const confirmData = () => {
        if (isActive) return;

        if (isLoading) return toast.error('초대중입니다. 잠시만 기다려주세요');
        if (!isLoading) return toast.error('이메일을 입력해주세요');
    };

    const onSubmit = debounce(async () => {
        if (!currentOrg || isLoading) return;

        setIsLoading(true);
        openLoadingModal();

        const invitations: Invitation[] = email
            ? invitedEmails
                ? [...formData.invitations, {email}] // invitations가 있고 email 있는 경우
                : [{email}] // email만 있는 경우
            : formData.invitations; // email이 없는 경우

        const req = inviteMembershipApi.create({
            organizationId: currentOrg.id,
            invitations: invitations,
        });

        req.then(() => {
            alert.success({title: '초대가 완료되었습니다.'}).then(() => onClose());
        });
        req.catch(() => {
            toast.error('이메일을 다시 확인해주세요');
            onClose();
        });
    }, 500);

    return (
        <span className="w-full" onClick={() => !isActive && confirmData()}>
            <NextButtonUI isActive={isActive} onClick={() => onSubmit()}>
                워크스페이스 멤버 초대하기
            </NextButtonUI>
        </span>
    );
});
