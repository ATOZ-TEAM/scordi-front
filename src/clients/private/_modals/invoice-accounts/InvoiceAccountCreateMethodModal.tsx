import React, {memo} from 'react';
import {FcDataBackup, FcDataRecovery} from 'react-icons/fc';
import {FaChevronRight} from 'react-icons/fa6';
import {IconType} from '@react-icons/all-files';
import {SlideUpModal} from '^components/modals/_shared/SlideUpModal';
import {useGoogleLoginForInvoiceAccountSelect} from '^models/InvoiceAccount/hook';
import {GoogleGmailOAuthButton} from '^components/pages/UsersLogin/GoogleLoginBtn';

export enum InvoiceAccountCreateMethod {
    // (자동) 지메일 계정 연동
    Auto = 'AUTO',
    // (수동) 직접 입력
    Manual = 'MANUAL',
}

interface InvoiceAccountCreateMethodModalProps {
    isOpened: boolean;
    onClose: () => any;
    onSelect: (createMethod: InvoiceAccountCreateMethod) => any;
}

export const InvoiceAccountCreateMethodModal = memo((props: InvoiceAccountCreateMethodModalProps) => {
    const {isOpened, onClose, onSelect} = props;
    const {setCode: setGmailAuthCode, resetCode: resetGmailAuthCode} = useGoogleLoginForInvoiceAccountSelect();

    return (
        <SlideUpModal open={isOpened} onClose={onClose} size="md">
            <h3 className="font-bold text-xl">어떤 방법으로 추가할까요?</h3>

            <div className="py-4 flex flex-col gap-3">
                <GoogleGmailOAuthButton
                    onCode={(code) => {
                        setGmailAuthCode(code);
                        onSelect(InvoiceAccountCreateMethod.Auto);
                    }}
                >
                    <CreateMethodOption
                        Icon={FcDataBackup}
                        title="구성원 불러오기"
                        desc="구글워크스페이스 로그인으로 한 번에 불러와요."
                    />
                </GoogleGmailOAuthButton>
                <CreateMethodOption
                    Icon={FcDataRecovery}
                    title="직접 추가하기"
                    desc="구성원 정보를 입력한 뒤 추가해요."
                    onClick={() => {
                        onClose();
                        onSelect(InvoiceAccountCreateMethod.Manual);
                    }}
                />
            </div>
        </SlideUpModal>
    );
});

interface Props {
    Icon: IconType;
    title: string;
    desc: string;
    onClick?: () => any;
}

export const CreateMethodOption = (props: Props) => {
    const {Icon, title, desc, onClick} = props;

    return (
        <div
            className="flex items-center -mx-3 px-3 py-3 rounded-box cursor-pointer group hover:bg-scordi-50 transition-all"
            onClick={onClick}
        >
            <div className="">
                <Icon size={24} />
            </div>

            <div className="flex-auto px-3">
                <p className="text-14">{title}</p>
                <p className="text-12 text-gray-400">{desc}</p>
            </div>

            <div>
                <FaChevronRight className="text-gray-400 group-hover:text-black transition-all" />
            </div>
        </div>
    );
};
