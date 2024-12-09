import React, {memo, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {IconType} from '@react-icons/all-files';
import {FcDataBackup, FcDataRecovery} from 'react-icons/fc';
import {toast} from 'react-hot-toast';
import {orgIdParamState} from '^atoms/common';
import {
    ListPageDropdown,
    ListPageDropdownButton,
    ListPageDropdownMenu,
    ListPageDropdownMenuItem,
} from '^clients/private/_layouts/_shared/ListPageMainDropdown';
import {swalHTML} from '^components/util/dialog';
import {GoogleGmailOAuthButton} from '^components/pages/UsersLogin/GoogleLoginBtn';
import {useGoogleLoginForInvoiceAccountSelect} from '^models/InvoiceAccount/hook';
import {InvoiceAccountCreateInManualSwalForm} from '^models/InvoiceAccount/components';
import {InvoiceAccountAutoCreateModal} from '^clients/private/_modals/invoice-accounts';

interface AddInvoiceAccountDropdownProps {
    reload: () => any;
}

export const AddInvoiceAccountDropdown = memo((props: AddInvoiceAccountDropdownProps) => {
    const orgId = useRecoilValue(orgIdParamState);
    const [isCreateAutoModalOpened, setCreateAutoModalOpened] = useState(false);
    const {setCode} = useGoogleLoginForInvoiceAccountSelect();
    const {reload} = props;

    return (
        <ListPageDropdown>
            <ListPageDropdownButton text="메일계정 추가" />

            <ListPageDropdownMenu>
                <GoogleGmailOAuthButton
                    onCode={(code) => {
                        setCode(code);
                        setCreateAutoModalOpened(true);
                    }}
                >
                    <CreateMethodOption
                        Icon={FcDataBackup}
                        title="자동으로 연동하기"
                        desc="지메일 로그인으로 간단하게 추가해요"
                    />
                </GoogleGmailOAuthButton>

                <CreateMethodOption
                    Icon={FcDataRecovery}
                    title="직접 입력하기"
                    desc="수신 계정을 수기로 입력해요"
                    onClick={() => {
                        swalHTML(<InvoiceAccountCreateInManualSwalForm orgId={orgId} onSave={() => reload()} />);
                    }}
                />
            </ListPageDropdownMenu>

            <InvoiceAccountAutoCreateModal
                isOpened={isCreateAutoModalOpened}
                onClose={() => setCreateAutoModalOpened(false)}
                onCreate={() => {
                    toast.success('계정을 저장했어요');
                    setCreateAutoModalOpened(false);
                    return reload();
                }}
                onRetry={() => setCreateAutoModalOpened(true)}
            />
        </ListPageDropdown>
    );
});

interface Props {
    Icon: IconType;
    title: string;
    desc: string;
    onClick?: () => any;
}

const CreateMethodOption = memo((props: Props) => {
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
