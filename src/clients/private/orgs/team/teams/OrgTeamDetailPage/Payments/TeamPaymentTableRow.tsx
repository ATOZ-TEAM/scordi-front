import React, {memo} from 'react';
import {toast} from 'react-hot-toast';
import {CreditCardDto, UpdateCreditCardDto} from '^models/CreditCard/type';
import {creditCardApi} from '^models/CreditCard/api';
import {CreditCardProfileOption2} from '^models/CreditCard/components';
import {TeamMemberSelectColumn} from '^models/TeamMember/components/TeamMemberSelectColumn';
import {OpenButtonColumn} from '^clients/private/_components/table/OpenButton';
import {OrgCreditCardShowPageRoute} from '^pages/orgs/[id]/creditCards/[creditCardId]';
import Tippy from '@tippyjs/react';
import {FiMinusCircle} from '^components/react-icons';
import {useRecoilValue} from 'recoil';
import {teamIdParamState} from '^atoms/common';
import {confirm2} from '^components/util/dialog';

interface TeamPaymentTableRowProps {
    creditCard?: CreditCardDto;
    reload?: () => any;
}

export const TeamPaymentTableRow = memo((props: TeamPaymentTableRowProps) => {
    const teamId = useRecoilValue(teamIdParamState);
    const {creditCard, reload} = props;

    if (!creditCard) return null;

    const update = async (dto: UpdateCreditCardDto) => {
        const {id, organizationId: orgId} = creditCard;
        return creditCardApi
            .update(orgId, id, dto)
            .then(() => toast.success('수정했습니다'))
            .catch(() => toast.error('문제가 발생했습니다'))
            .finally(() => reload && reload());
    };

    const showPagePath = OrgCreditCardShowPageRoute.path(creditCard.organizationId, creditCard.id);

    const hoverBgColor = 'group-hover:bg-scordi-light-50 transition-all';

    const onDelete = () => {
        confirm2(
            `결제수단 연결을 해제할까요?`,
            <span>
                이 작업은 취소할 수 없습니다.
                <br />
                <b>팀에서 제외</b>됩니다. <br />
                그래도 연결을 해제 하시겠어요?
            </span>,
            'warning',
        ).then((res) => {
            if (res.isConfirmed) {
                creditCardApi.teamsApi.destroy(creditCard.id, teamId).then(() => {
                    toast.success('삭제했습니다');
                    reload && reload();
                });
            }
        });
    };

    return (
        <tr className={`${hoverBgColor} group`}>
            {/* 카드 프로필 */}
            <td className={`${hoverBgColor}`}>
                <OpenButtonColumn href={showPagePath}>
                    <CreditCardProfileOption2 item={creditCard} />
                </OpenButtonColumn>
            </td>

            {/* 소지자 */}
            <td className={`${hoverBgColor}`}>
                <TeamMemberSelectColumn
                    defaultValue={creditCard.holdingMember || undefined}
                    onChange={async (holdingMember) => {
                        if (creditCard.holdingMemberId === holdingMember?.id) return;
                        return update({holdingMemberId: holdingMember?.id || null});
                    }}
                    optionListBoxTitle="소지자를 변경할까요?"
                    detachableOptionBoxTitle="현재 소지자"
                />
            </td>

            <td className={`${hoverBgColor}`}>
                <div className="flex items-center justify-end">
                    <Tippy content="팀에서 제외">
                        <div>
                            <FiMinusCircle
                                fontSize={24}
                                className="text-red-500 opacity-30 group-hover:opacity-100 transition-all cursor-pointer btn-animation"
                                onClick={onDelete}
                            />
                        </div>
                    </Tippy>
                </div>
            </td>
        </tr>
    );
});
TeamPaymentTableRow.displayName = 'TeamPaymentTableRow';
