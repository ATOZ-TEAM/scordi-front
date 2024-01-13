import {useState} from 'react';
import {RecoilState, useRecoilState, useRecoilValue} from 'recoil';
import {useAlert} from '^hooks/useAlert';
import {useToast} from '^hooks/useToast';
import {orgIdParamState} from '^atoms/common';
import {ApprovalStatus} from '^models/Membership/types';
import {membershipApi} from '^models/Membership/api';
import {teamMemberApi} from '../api';
import {FindAllTeamMemberQueryDto, TeamMemberDto, UpdateTeamMemberDto} from '../type';
import {
    teamMemberLoadingState,
    currentTeamMemberState,
    teamMemberListInSubscriptionShowModalAtom,
    teamMemberListAtom,
    teamMemberListInDashboardAtom,
} from '../atom';
import {useTeamMembersV3} from '^models/TeamMember';

export * from './useSendInviteEmail';
export * from './useTeamMemberV3';

export const useTeamMembers = () => {
    const orgId = useRecoilValue(orgIdParamState);
    const methods = useTeamMembersV3(teamMemberListAtom);
    const isExist = !!methods.result.pagination.totalItemCount;
    const createByName = (name: string) => {
        return teamMemberApi.create(orgId, {name}).then((res) => res.data);
    };

    return {...methods, isExist, createByName};
};

// 대시보드 / 멤버 목록
export const useTeamMembersInDashboard = () => useTeamMembersV3(teamMemberListInDashboardAtom);

// 구독상세모달 / 이용중인 멤버 목록
export const useTeamMembersInSubscriptionShowModal = () => useTeamMembersV3(teamMemberListInSubscriptionShowModalAtom);

// 멤버 수정 / 삭제 기능
export function useTeamMember(atom: RecoilState<TeamMemberDto | null>) {
    const [teamMember, setTeamMember] = useRecoilState(atom);
    const [isLoading, setIsLoading] = useRecoilState(teamMemberLoadingState);
    const {alert} = useAlert();
    const {toast} = useToast();

    const loadTeamMember = (organizationId: number, id: number) => {
        setIsLoading(true);
        const request = teamMemberApi.show(organizationId, id);
        request.then((res) => setTeamMember(res.data));
        request.finally(() => setIsLoading(false));
    };

    const updateMember = async (data: UpdateTeamMemberDto) => {
        if (!teamMember) {
            toast.error('알 수 없는 멤버');
            return;
        }

        const {organizationId, id} = teamMember;

        setIsLoading(true);
        const res = teamMemberApi.update(organizationId, id, data);
        res.then(() => toast.success('변경되었습니다.')).then(() => loadTeamMember(organizationId, id));
        res.finally(() => setIsLoading(false));
        return res;
    };

    const deleteMember = async (onConfirm?: () => void) => {
        if (!teamMember) {
            toast.error('알 수 없는 멤버');
            return;
        }

        const {organizationId, id} = teamMember;

        return alert.destroy({
            title: '멤버를 정말 삭제할까요?',
            showSuccessAlertOnFinal: false,
            onConfirm: async () => {
                setIsLoading(true);
                // membership 상태가 PENDING이면 team member와 membership 모두 삭제
                if (teamMember.membership?.approvalStatus === ApprovalStatus.PENDING) {
                    await membershipApi.destroy(teamMember.membershipId || 0);
                }
                const res = teamMemberApi.destroy(organizationId, id);

                res.then(() => toast.success('삭제했습니다.')).then(() => {
                    onConfirm && onConfirm();
                    setTeamMember(null);
                });
                res.finally(() => setIsLoading(false));
                return res;
            },
        });
    };

    return {teamMember, setTeamMember, isLoading, loadTeamMember, updateMember, deleteMember};
}

export const useCurrentTeamMember = () => {
    const [currentTeamMember, setCurrentTeamMember] = useRecoilState(currentTeamMemberState);
    const [isLoading, setIsLoading] = useRecoilState(teamMemberLoadingState);

    const loadCurrentTeamMember = (organizationId: number, id: number) => {
        setIsLoading(true);
        const request = teamMemberApi.show(organizationId, id);
        request.then((res) => setCurrentTeamMember(res.data));
        request.finally(() => setIsLoading(false));
    };

    return {currentTeamMember, loadCurrentTeamMember, setCurrentTeamMember, isLoading};
};
