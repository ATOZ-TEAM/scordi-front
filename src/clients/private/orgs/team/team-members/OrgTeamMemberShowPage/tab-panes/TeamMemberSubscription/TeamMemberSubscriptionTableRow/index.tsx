import React, {memo} from 'react';
import {teamMemberApi, TeamMemberDto} from '^models/TeamMember';
import {SubscriptionDto} from '^models/Subscription/types';
import {SubscriptionProfile} from '^models/Subscription/components/SubscriptionProfile';
import {
    BillingCycleTypeColumn,
    IsFreeTierColumn,
    LatestPayAmount,
    MasterSelect,
    MemberCount,
    PayingType,
    PayMethodSelect,
} from '^v3/V3OrgAppsPage/SubscriptionListSection/SubscriptionTable/SubscriptionTr/columns';
import Tippy from '@tippyjs/react';
import {BsDashCircle} from 'react-icons/bs';
import {confirm2} from '^components/util/dialog';
import {subscriptionApi} from '^models/Subscription/api';
import {toast} from 'react-hot-toast';

interface TeamMemberSubscriptionTableRowProps {
    teamMember: TeamMemberDto;
    subscription: SubscriptionDto;
    reload: () => any;
}

export const TeamMemberSubscriptionTableRow = memo((props: TeamMemberSubscriptionTableRowProps) => {
    const {teamMember, subscription, reload} = props;

    const disconnect = async () => {
        const isConfirmed = await confirm2(
            '이 멤버와 연결을 해제할까요?',
            '구독이 삭제되는건 아니니 안심하세요',
            'warning',
        ).then((res) => res.isConfirmed);
        if (!isConfirmed) return;
        await teamMemberApi.subscriptions.disconnect(teamMember.id, subscription.id);
        toast.success('연결을 해제했어요');
        reload();
    };

    return (
        <tr>
            {/* 서비스 명 */}
            <td>
                <SubscriptionProfile subscription={subscription} />
            </td>

            {/* 유/무료 */}
            <td>
                <IsFreeTierColumn subscription={subscription} onChange={reload} />
            </td>

            {/* 상태 */}
            {/*<td className="">*/}
            {/*    <SubscriptionStatus subscription={subscription} reload} />*/}
            {/*</td>*/}

            {/* 결제주기 */}
            <td>
                <BillingCycleTypeColumn subscription={subscription} onChange={reload} />
            </td>

            {/* 과금방식: (TestBank: 연, 고정, 사용량, 크레딧, 1인당) */}
            <td className="">
                <PayingType subscription={subscription} onChange={reload} />
            </td>

            {/* 결제수단 */}
            <td className="pl-3 py-0">
                <PayMethodSelect subscription={subscription} onChange={reload} />
            </td>

            {/* 사용인원 */}
            <td className="text-center">
                <MemberCount subscription={subscription} />
            </td>

            {/* 최신 결제금액 */}
            <td className="text-right">
                <LatestPayAmount subscription={subscription} />
            </td>

            {/* 다음 결제일 */}
            {/*<td className="text-right">*/}
            {/*    <NextPaymentDate nextPayDate={nextPayDate} />*/}
            {/*</td>*/}

            {/* 담당자 */}
            <td className="py-0 pl-5 w-40">
                <MasterSelect subscription={subscription} onChange={reload} />
            </td>

            {/* Actions */}
            <td>
                <div className="flex items-center justify-center">
                    <Tippy className="!text-12" content="안써요">
                        <button
                            className="relative text-red-300 hover:text-red-500 transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                disconnect();
                            }}
                        >
                            <BsDashCircle className="" size={24} strokeWidth={0.3} />
                        </button>
                    </Tippy>
                </div>
            </td>
        </tr>
    );
});
TeamMemberSubscriptionTableRow.displayName = 'TeamMemberSubscriptionTableRow';
