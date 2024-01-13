import {memo} from 'react';
import {useTeamMembers} from '^models/TeamMember';
import {CreateTeamMemberModal} from '^v3/share/modals/NewTeamMemberModal/CreateTeamMemberModal/Modal';

/**
 * 멤버관리 화면에서의 팀 멤버 생성 모달
 */
export const TeamMemberCreateModal = memo(function TeamMemberCreateModal() {
    const list = useTeamMembers();

    return (
        <CreateTeamMemberModal
            onSubmit={() => {
                if (list.isExist) list.reload();
            }}
        />
    );
});