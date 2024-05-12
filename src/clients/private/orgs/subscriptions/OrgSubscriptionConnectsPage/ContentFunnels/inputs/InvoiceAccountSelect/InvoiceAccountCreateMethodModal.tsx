import React, {memo} from 'react';
import {SlideUpModal} from '^components/modals/_shared/SlideUpModal';
import {FcDataBackup, FcDataRecovery} from 'react-icons/fc';
import {CardCreateMethodOption} from '^clients/private/orgs/subscriptions/OrgSubscriptionConnectsPage/ContentFunnels/inputs/PaymentMethod/CardCreateMethodModal';

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

    return (
        <SlideUpModal open={isOpened} onClose={onClose} size="md">
            <h3 className="font-bold text-xl">어떤 방법으로 추가할까요?</h3>

            <div className="py-4 flex flex-col gap-3">
                <CardCreateMethodOption
                    Icon={FcDataBackup}
                    title="자동으로 연동하기"
                    desc="지메일 로그인으로 간단하게 추가해요"
                    onClick={() => {
                        const btn = document.querySelector('[data-component="GoogleLoginBtn"]') as HTMLElement | null;
                        btn?.click();
                        onClose();
                        const select = document.querySelector('#invoiceAccountSelect') as HTMLElement | null;
                        select?.click();
                        onSelect(InvoiceAccountCreateMethod.Auto);
                    }}
                />
                <CardCreateMethodOption
                    Icon={FcDataRecovery}
                    title="직접 입력하기"
                    desc="수신 계정을 수기로 입력해요"
                    onClick={() => {
                        onClose();
                        onSelect(InvoiceAccountCreateMethod.Manual);
                    }}
                />
            </div>
        </SlideUpModal>
    );
});
InvoiceAccountCreateMethodModal.displayName = 'InvoiceAccountCreateMethodModal';
