import React, {memo} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {FcDataBackup, FcDataRecovery} from 'react-icons/fc';
import {IconType} from '@react-icons/all-files';
import {orgIdParamState} from '^atoms/common';
import {
    ListPageDropdown,
    ListPageDropdownButton,
    ListPageDropdownMenu,
    ListPageDropdownMenuItem,
} from '^clients/private/_layouts/_shared/ListPageMainDropdown';
import {isCardAutoCreateModalAtom} from './atom';
import {useRouter} from 'next/router';
import {OrgCreditCardNewPageRoute} from '^pages/orgs/[id]/creditCards/new';

export const AddCreditCardDropdown = memo(function AddCreditCardDropdown() {
    const router = useRouter();
    const orgId = useRecoilValue(orgIdParamState);
    const setIsCardAutoCreateModalOpen = useSetRecoilState(isCardAutoCreateModalAtom);

    return (
        <ListPageDropdown>
            <ListPageDropdownButton text="카드 등록" />

            <ListPageDropdownMenu>
                <CardCreateMethodOption
                    Icon={FcDataBackup}
                    title="자동으로 연동하기"
                    desc="카드사 로그인으로 간단하게 추가해요"
                    onClick={() => setIsCardAutoCreateModalOpen(true)}
                />

                <CardCreateMethodOption
                    Icon={FcDataRecovery}
                    title="직접 입력하기"
                    desc="사용 중인 카드를 수기로 입력해요"
                    onClick={() => router.push(OrgCreditCardNewPageRoute.path(orgId))}
                />
            </ListPageDropdownMenu>
        </ListPageDropdown>
    );
});

interface Props {
    Icon: IconType;
    title: string;
    desc: string;
    onClick: () => any;
}

const CardCreateMethodOption = memo((props: Props) => {
    const {Icon, title, desc, onClick} = props;

    return (
        <ListPageDropdownMenuItem plain>
            <div
                onClick={onClick}
                className="py-2 px-4 group-hover:text-scordi group-hover:bg-scordi-light-50 transition-all flex items-center gap-3 cursor-pointer"
            >
                <div>
                    <Icon fontSize={20} />
                </div>

                <div className="flex-auto">
                    <p className="text-13">{title}</p>
                    <p className="text-11 text-gray-400 group-hover:text-scordi-400 whitespace-nowrap">{desc}</p>
                </div>
            </div>
        </ListPageDropdownMenuItem>
    );
});
