import React, {memo} from 'react';
import {useRecoilValue} from 'recoil';
import {selectedInvoiceAccountAtom} from '^v3/V3OrgHomePage/InvoiceAccountAddingButton/InvoiceAppListPanel/index';
import {InvoiceAccountDto} from '^types/invoiceAccount.type';
import {useTranslation} from 'next-i18next';

interface RemoveAccountItemProps {
    onClick: (invoiceAccount: InvoiceAccountDto) => any;
}

export const RemoveAccountItem = memo((props: RemoveAccountItemProps) => {
    const {onClick} = props;
    const currentAccountItem = useRecoilValue(selectedInvoiceAccountAtom);
    const {t} = useTranslation('org-home');

    return (
        <li>
            <a
                className="items-center gap-4 px-6 bg-base-100 active:bg-scordi-light-100 text-sm text-red-500"
                onClick={() => currentAccountItem && onClick(currentAccountItem)}
            >
                {/*<BsEnvelopePlus className="w-7" />*/}
                <span className="">{t('invoiceAccountAddingModal.removeAccount')}</span>
            </a>
        </li>
    );
});
