import React, {memo, useState} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {useRouter} from 'next/router';
import {FcDataBackup, FcDataRecovery} from 'react-icons/fc';
import {orgIdParamState} from '^atoms/common';
import {
    ListPageDropdown,
    ListPageDropdownButton,
    ListPageDropdownMenu,
    MethodOption,
} from '^clients/private/_layouts/_shared/ListPageMainDropdown';
import {OrgCreditCardNewPageRoute} from '^pages/orgs/[id]/creditCards/new';
import {CardAutoCreateModal} from '^clients/private/_modals/credit-cards';

interface AddCreditCardDropdownProps {
    reload: () => any;
}

export const AddCreditCardDropdown = memo((props: AddCreditCardDropdownProps) => {
    const {reload} = props;
    const router = useRouter();
    const orgId = useRecoilValue(orgIdParamState);
    const [isCardAutoCreateModalOpen, setIsCardAutoCreateModalOpen] = useState(false);

    return (
        <ListPageDropdown>
            <ListPageDropdownButton text="카드 추가하기" />

            <ListPageDropdownMenu>
                <MethodOption
                    Icon={FcDataBackup}
                    title="자동으로 연동하기"
                    desc="카드사 로그인으로 간단하게 추가해요"
                    onClick={() => setIsCardAutoCreateModalOpen(true)}
                />

                <MethodOption
                    Icon={FcDataRecovery}
                    title="직접 입력하기"
                    desc="사용 중인 카드를 수기로 입력해요"
                    onClick={() => router.push(OrgCreditCardNewPageRoute.path(orgId))}
                />
            </ListPageDropdownMenu>

            <CardAutoCreateModal
                isOpened={isCardAutoCreateModalOpen}
                onClose={() => setIsCardAutoCreateModalOpen(false)}
                onCreate={() => {
                    setIsCardAutoCreateModalOpen(false);
                    return reload();
                }}
            />
        </ListPageDropdown>
    );
});
