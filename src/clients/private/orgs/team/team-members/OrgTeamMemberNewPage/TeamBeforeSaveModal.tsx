import React, {memo, ReactNode} from 'react';
import {ModalProps} from '^components/modals/_shared/Modal.types';
import {SlideUpModal} from '^components/modals/_shared/SlideUpModal';
import {IconType} from '@react-icons/all-files';
import {FaChevronRight} from 'react-icons/fa6';
import {FcDataRecovery, FcInvite} from 'react-icons/fc';
import {CreateTeamMemberDto, teamMemberApi, TeamMemberDto} from '^models/TeamMember';
import {useRecoilValue} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/router';
import {OrgTeamMemberListPageRoute} from '^pages/orgs/[id]/teamMembers';
import {inviteMembershipApi} from '^models/Membership/api';
import {debounce} from 'lodash';
import {errorToast} from '^api/api';

interface BeforeSaveModalProps extends ModalProps {
    dto: CreateTeamMemberDto;
    setIsLoading: (value: boolean) => any;
}

export const TeamBeforeSaveModal = memo((props: BeforeSaveModalProps) => {
    const orgId = useRecoilValue(orgIdParamState);
    const router = useRouter();
    const {isOpened, onClose, dto, setIsLoading} = props;

    const redirect = () => router.push(OrgTeamMemberListPageRoute.path(orgId));
    const createMember = () => teamMemberApi.create(orgId, dto).then((res) => res.data);
    const inviteMember = (teamMember: TeamMemberDto) => {
        return inviteMembershipApi.create({
            organizationId: orgId,
            invitations: [{email: teamMember.email!, teamMemberId: teamMember.id}],
        });
    };

    const handleRequest = (request: () => Promise<any>) => {
        setIsLoading(true);
        onClose();
        request()
            .catch(errorToast)
            .finally(() => setIsLoading(false))
            .then(() => redirect());
    };

    return (
        <SlideUpModal open={isOpened} onClose={onClose} size="md">
            <h3 className="font-bold text-xl">구성원을 워크스페이스에 초대할까요?</h3>

            <div className="py-4 flex flex-col gap-3">
                <MethodOption
                    Icon={FcInvite}
                    title="초대하기"
                    desc="구성원 회사메일로 초대장을 전송해요."
                    onClick={() => {
                        handleRequest(() => {
                            return createMember()
                                .then(inviteMember)
                                .then(() => toast.success('구성원을 추가한 뒤 초대 메일을 보냈어요.'));
                        });
                    }}
                />
                <MethodOption
                    Icon={FcDataRecovery}
                    title="초대 없이 추가하기"
                    desc="[설정 > 멤버관리] 에서 나중에 초대할 수 있어요."
                    onClick={() => {
                        handleRequest(() => {
                            return createMember().then(() => toast.success('구성원을 추가했어요.'));
                        });
                    }}
                />
            </div>
        </SlideUpModal>
    );
});
TeamBeforeSaveModal.displayName = 'BeforeSaveModal';

interface Props {
    Icon: IconType;
    title: string;
    desc: ReactNode;
    onClick: () => any;
}

const MethodOption = memo((props: Props) => {
    const {Icon, title, desc, onClick} = props;

    return (
        <div
            className="flex items-center -mx-3 px-3 py-3 rounded-box cursor-pointer group hover:bg-scordi-50 transition-all"
            onClick={debounce(() => onClick(), 500)}
        >
            <div className="">
                <Icon size={24} />
            </div>

            <div className="flex-auto px-3">
                <p className="text-14">{title}</p>
                <p className="text-12 text-gray-400">{desc}</p>
            </div>

            <div>
                <FaChevronRight className="text-gray-400 group-hover:text-black transition-all" />
            </div>
        </div>
    );
});
