import React, {memo, useEffect} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {InvoiceAccountListPanel, invoiceAccountsAtom} from './InvoiceAccountListPanel';
import {InvoiceAppListPanel, selectedInvoiceAccountAtom} from './InvoiceAppListPanel';
import {currentOrgAtom} from '^atoms/organizations.atom';
import {useTranslation} from 'next-i18next';
import {getInvoiceAccounts} from '^api/invoiceAccount.api';
import {newInvoiceAccountModal} from '../NewInvoiceAccountModal/atom';
import {useModal} from '^v3/share/modals/useModal';

export const InvoiceAccountAddingButton = memo(() => {
    const [invoiceAccounts, setInvoiceAccounts] = useRecoilState(invoiceAccountsAtom);
    const {open: newInvoiceAccountModalOpen} = useModal(newInvoiceAccountModal);
    const currentOrg = useRecoilValue(currentOrgAtom);
    const setSelectedInvoiceAccount = useSetRecoilState(selectedInvoiceAccountAtom);
    const {t} = useTranslation('org-home');

    useEffect(() => {
        if (!currentOrg) return;
        getInvoiceAccounts(currentOrg.id, {page: 1, itemsPerPage: 100}).then((res) => {
            setInvoiceAccounts(res.data.items);
        });
    }, [currentOrg]);

    const isEmpty = invoiceAccounts.length === 0;

    return (
        <div
            className="dropdown dropdown-bottom dropdown-end"
            onBlur={(e) => {
                if (!e.relatedTarget) setSelectedInvoiceAccount(null);
            }}
        >
            <button
                className="btn btn-lg btn-scordi-500 shadow gap-2 normal-case"
                onClick={isEmpty ? () => newInvoiceAccountModalOpen() : undefined}
            >
                <span>{t('newInvoiceAccount')}</span>
                <span>📩</span>
            </button>

            {!isEmpty && (
                <div
                    className="swap absolute bottom-0"
                    // onClick={(e) => {
                    //     console.log(e);
                    //     e.stopPropagation();
                    //     e.preventDefault();
                    // }}
                >
                    {/*<input type="checkbox" />*/}
                    <InvoiceAccountListPanel />
                    <InvoiceAppListPanel />
                </div>
            )}
        </div>
    );
});
