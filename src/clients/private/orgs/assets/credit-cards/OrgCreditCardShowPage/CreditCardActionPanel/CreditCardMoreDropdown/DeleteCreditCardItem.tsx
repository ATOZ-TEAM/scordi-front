import {memo} from 'react';
import {MoreDropdownMenuItem} from '^clients/private/_components/rest-pages/ShowPage/MoreDropdown';
import {useCurrentCreditCard} from '^clients/private/orgs/assets/credit-cards/OrgCreditCardShowPage/atom';
import {creditCardApi} from '^models/CreditCard/api';
import {errorToast} from '^api/api';
import {useRouter} from 'next/router';
import {OrgCreditCardListPageRoute} from '^pages/orgs/[id]/creditCards';
import {toast} from 'react-hot-toast';
import {confirm2} from '^components/util/dialog';
import {useCreditCardListForListPage} from '^models/CreditCard/hook';

export const DeleteCreditCardItem = memo(function DeleteCreditCardButton() {
    const {currentCreditCard} = useCurrentCreditCard();
    const {search} = useCreditCardListForListPage();
    const router = useRouter();

    const onClick = async () => {
        if (!currentCreditCard) return;
        if (!(await confirmDestroy())) return;

        const card = currentCreditCard;
        destroyCreditCard(card.organizationId, card.id).then((res) => {
            if (!res) return;
            router.push(OrgCreditCardListPageRoute.path(card.organizationId)).then(() => {
                search(
                    {
                        where: {organizationId: card.organizationId},
                        order: {id: 'DESC'},
                    },
                    false,
                    true,
                );
            });
        });
    };

    if (!currentCreditCard) return <></>;

    return (
        <MoreDropdownMenuItem onClick={onClick} theme="danger">
            삭제하기
        </MoreDropdownMenuItem>
    );
});

function confirmDestroy() {
    return confirm2(
        '정말 삭제할까요?',
        '이 카드에 포함된 결제내역도 모두 삭제되며,\n이 작업은 복구할 수 없습니다.\n그래도 삭제할까요?',
        'warning',
    ).then((res) => res.isConfirmed);
}

async function destroyCreditCard(orgId: number, id: number) {
    return creditCardApi
        .destroy(orgId, id)
        .then((res) => {
            toast.success('삭제 성공');
            return res;
        })
        .catch(errorToast);
}
