import React, {memo} from 'react';
import {newTeamMemberModal} from '^v3/share/modals/NewTeamMemberModal/atom';
import {ModalTopbar, useModal} from '^v3/share/modals';
import {MobileSection} from '../../sections/MobileSection';
import {
    CreateTeamMemberModal,
    isOpenNewTeamMemberModalAtom,
} from 'src/components/pages/v3/share/modals/NewTeamMemberModal/CreateTeamMemberModal';
import {
    InviteOrgMemberModal,
    isOpenInviteOrgMemberModalAtom,
} from 'src/components/pages/v3/share/modals/NewTeamMemberModal/InviteMemberModal';
import {useToast} from '^hooks/useToast';
import {useRecoilValue} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {InviteButton, InviteStatus} from '^v3/share/modals/NewTeamMemberModal/InviteButton';
import {serviceHost} from '^config/environments';
import {ModalTitle} from '^v3/share/modals/ModalTitle';

interface NewTeamMemberModalProps {
    onReload?: () => any;
}

export const NewTeamMemberModal = memo((props: NewTeamMemberModalProps) => {
    const {Modal, close} = useModal(newTeamMemberModal);
    const {open: openCreateMemberModal} = useModal({isShowAtom: isOpenNewTeamMemberModalAtom});
    const {open: openInviteMemberModal} = useModal({isShowAtom: isOpenInviteOrgMemberModalAtom});
    const {toast} = useToast();
    const orgId = useRecoilValue(orgIdParamState);
    const {onReload} = props;

    const link = `${serviceHost}/v3/orgs/${orgId}/join?isCopied=true`;

    const onCopy = () => {
        navigator.clipboard.writeText(link).then(() => toast.success('클립보드에 복사했습니다.'));
    };

    return (
        <>
            <Modal wrapperClassName="modal-right" className="p-0 max-w-none sm:max-w-[32rem] flex flex-col">
                <ModalTopbar backBtnOnClick={close} topbarPosition="sticky" />
                <div className="flex flex-col gap-20 h-full">
                    <MobileSection.Padding>
                        <ModalTitle title="어떤 방법으로 초대할까요?" />
                    </MobileSection.Padding>
                    <MobileSection.Padding>
                        <div className="flex flex-col gap-4 sm:gap-2">
                            <InviteButton
                                onClick={() => openInviteMemberModal()}
                                title="구글 워크스페이스 이메일로 초대장 보내기"
                                desc="초대장을 이메일로 발송할 수 있습니다."
                                type={InviteStatus.Email}
                            />
                            <InviteButton
                                onClick={() => onCopy()}
                                title="초대 링크 복사하기"
                                desc="링크를 팀원들에게 공유하여 초대할 수 있습니다."
                                type={InviteStatus.Link}
                            />

                            <button onClick={() => openCreateMemberModal()} className="btn btn-block btn-md btn-link ">
                                그냥 직접 입력할래요
                            </button>
                        </div>
                    </MobileSection.Padding>
                </div>
            </Modal>
            <InviteOrgMemberModal onClose={onReload} />
            <CreateTeamMemberModal onCreate={onReload} />
        </>
    );
});
