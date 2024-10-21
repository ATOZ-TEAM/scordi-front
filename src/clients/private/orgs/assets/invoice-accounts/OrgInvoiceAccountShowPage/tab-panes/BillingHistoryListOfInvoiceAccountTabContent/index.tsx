import {memo, useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {useBillingHistoryListOfInvoiceAccount} from '^models/BillingHistory/hook';
import {ListTable, ListTableContainer} from '^clients/private/_components/table/ListTable';
import {useCurrentInvoiceAccount} from '../../atom';
import {BillingHistoryTableControl} from './BillingHistoryTableControl';
import {BillingHistoryTableHeaderOfInvoiceAccount} from './BillingHistoryTableHeaderOfInvoiceAccount';
import {BillingHistoryRowOfInvoiceAccount} from './BillingHistoryRowOfInvoiceAccount';
import {EmptyTable} from '^clients/private/_components/table/EmptyTable';

export const BillingHistoryListOfInvoiceAccountTabContent = memo(function () {
    const orgId = useRecoilValue(orgIdParamState);
    const {currentInvoiceAccount} = useCurrentInvoiceAccount();
    const {isLoading, isEmptyResult, isNotLoaded, search, result, reload, movePage, changePageSize, orderBy} =
        useBillingHistoryListOfInvoiceAccount();

    const onReady = () => {
        if (!currentInvoiceAccount) return;
        const invoiceAccountId = currentInvoiceAccount.id;

        search({
            relations: ['subscription', 'invoiceApp.invoiceAccount'],
            where: {
                invoiceApp: {invoiceAccountId},
                organizationId: orgId,
            },
            order: {issuedAt: 'DESC'},
        });
    };

    useEffect(() => {
        onReady();
    }, [currentInvoiceAccount]);

    if (!currentInvoiceAccount) return <></>;

    const {totalItemCount} = result.pagination;

    return (
        <section className="py-4">
            <ListTableContainer
                pagination={result.pagination}
                movePage={movePage}
                changePageSize={changePageSize}
                hideTopPaginator
                hideBottomPaginator={totalItemCount === 0}
            >
                <BillingHistoryTableControl />
                {isEmptyResult ? (
                    <EmptyTable message="조회된 청구내역이 없어요." />
                ) : (
                    <ListTable
                        items={result.items}
                        isLoading={isLoading}
                        Header={() => <BillingHistoryTableHeaderOfInvoiceAccount orderBy={orderBy} mode={1} />}
                        Row={({item}) => <BillingHistoryRowOfInvoiceAccount item={item} mode={1} />}
                    />
                )}
            </ListTableContainer>
        </section>
    );
});
