import React, {memo} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {isInvoiceAccountAutoCreateModalAtom} from './atom';
import {
    ListPageDropdown,
    ListPageDropdownButton,
    ListPageDropdownMenu,
    ListPageDropdownMenuItem,
} from '^clients/private/_layouts/_shared/ListPageMainDropdown';
import {IconType} from '@react-icons/all-files';
import {FcDataBackup, FcDataRecovery} from 'react-icons/fc';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {googleOAuth} from '^config/environments';
import {GoogleLoginBtn} from '^components/pages/UsersLogin/GoogleLoginBtn';
import {useGoogleLoginForInvoiceAccountSelect, useInvoiceAccounts} from '^models/InvoiceAccount/hook';
import {swalHTML} from '^components/util/dialog';
import {InvoiceAccountCreateInManualSwalForm} from '^models/InvoiceAccount/components';

export const AddInvoiceAccountDropdown = memo(function AddInvoiceAccountDropdown() {
    const orgId = 398;
    const setIsAutoCreateModalOpen = useSetRecoilState(isInvoiceAccountAutoCreateModalAtom);
    const {setCode} = useGoogleLoginForInvoiceAccountSelect();
    const {reload} = useInvoiceAccounts();

    return (
        <ListPageDropdown>
            <ListPageDropdownButton text="메일계정 추가" />

            <ListPageDropdownMenu>
                <GoogleOAuthProvider clientId={googleOAuth.gmailClient.id}>
                    <GoogleLoginBtn
                        about="gmail"
                        onCode={(code) => {
                            setCode(code);
                            setIsAutoCreateModalOpen(true);
                        }}
                    >
                        <CreateMethodOption
                            Icon={FcDataBackup}
                            title="자동으로 연동하기"
                            desc="지메일 로그인으로 간단하게 추가해요"
                        />
                    </GoogleLoginBtn>
                </GoogleOAuthProvider>

                <CreateMethodOption
                    Icon={FcDataRecovery}
                    title="직접 입력하기"
                    desc="수신 계정을 수기로 입력해요"
                    onClick={() => {
                        swalHTML(<InvoiceAccountCreateInManualSwalForm orgId={orgId} onSave={() => reload()} />);
                    }}
                />
            </ListPageDropdownMenu>
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
