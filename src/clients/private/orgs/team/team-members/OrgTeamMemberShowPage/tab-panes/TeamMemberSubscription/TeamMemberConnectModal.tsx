import React, {memo, useEffect, useState} from 'react';
import {BsPlusCircle} from 'react-icons/bs';
import {useSubscriptionSelectModal} from '^v3/V3OrgTeam/modals/TeamMemberShowModal/SubscriptionSelectModal';
import {currentTeamMemberState, teamMemberApi, TeamMemberDto, useTeamMember} from '^models/TeamMember';
import {useSubscriptionListOfCreditCard, useSubscriptionsInTeamMemberShowPage} from '^models/Subscription/hook';
import {SubscriptionSelectItem} from '^models/Subscription/components/SubscriptionSelectItem';
import {SlideUpSelectModal} from '^clients/private/_modals/SlideUpSelectModal';
import {subscriptionApi} from '^models/Subscription/api';
import {useCurrentTeamMember} from '^clients/private/orgs/team/team-members/OrgTeamMemberShowPage/atom';
import {useTeamsSubscriptionForDetailPage} from '^models/Team/hook';
import {SubscriptionDto} from '^models/Subscription/types';
import {Paginated} from '^types/utils/paginated.dto';

interface TeamMemberConnectModalProps {
    teamMemberId: number;
    isOpened: boolean;
    onClose: () => any;
    onCreate?: () => any;
}

export const TeamMemberConnectModal = memo((props: TeamMemberConnectModalProps) => {
    const {teamMemberId, isOpened, onClose, onCreate} = props;
    const [isAbleSubscribed, setIsAbleSubscribed] = useState<Paginated<SubscriptionDto>>({
        items: [],
        pagination: {
            totalItemCount: 0,
            currentItemCount: 0,
            totalPage: 0,
            currentPage: 0,
            itemsPerPage: 10,
        },
    });

    const connectableSubscriptions = async () => {
        teamMemberApi.subscriptions.connectable(teamMemberId).then((res) => {
            setIsAbleSubscribed(res.data);
        });
    };

    useEffect(() => {
        if (isOpened) connectableSubscriptions();
    }, [isOpened]);

    const onSubmitConnectSubscriptions = async (selectedIds: number[]) => {
        const request = selectedIds.map((subscriptionId) =>
            teamMemberApi.subscriptions.connect(teamMemberId, subscriptionId),
        );
        await Promise.allSettled(request);
    };

    return (
        <SlideUpSelectModal
            isOpened={isOpened}
            onClose={onClose}
            onCreate={onCreate}
            items={isAbleSubscribed.items}
            getId={(item) => item.id}
            Row={({item, onClick, isSelected}) => (
                <SubscriptionSelectItem subscription={item} onClick={onClick} isSelected={isSelected} />
            )}
            onSubmit={onSubmitConnectSubscriptions}
            titleCaption="새로운 구독 연결하기"
            title="어느 구독을 연결할까요?"
            ctaInactiveText="구독을 선택해주세요"
            ctaActiveText="%n개의 선택된 구독 연결하기"
        />
    );
});
