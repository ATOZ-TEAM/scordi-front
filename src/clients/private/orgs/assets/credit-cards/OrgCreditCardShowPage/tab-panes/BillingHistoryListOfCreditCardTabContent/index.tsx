import React, {memo, useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import Tippy from '@tippyjs/react';
import {orgIdParamState} from '^atoms/common';
import {useBillingHistoryListOfCreditCard} from '^models/BillingHistory/hook';
import {ListTable, ListTableContainer} from '^clients/private/_components/table/ListTable';
import {useCurrentCreditCard} from '../../atom';
import {BillingHistoryTableControl} from './BillingHistoryTableControl';
import {BillingHistoryTableHeaderOfCreditCard} from './BillingHistoryTableHeaderOfCreditCard';
import {BillingHistoryRowOfCreditCard} from './BillingHistoryRowOfCreditCard';
import {EmptyTable} from '^clients/private/_components/table/EmptyTable';

export const BillingHistoryListOfCreditCardTabContent = memo(function BillingHistoryListOfCreditCardTabContent() {
    const orgId = useRecoilValue(orgIdParamState);
    const {currentCreditCard} = useCurrentCreditCard();
    const {isLoading, isEmptyResult, isNotLoaded, search, result, reload, movePage, changePageSize, orderBy} =
        useBillingHistoryListOfCreditCard();

    const onReady = () => {
        if (!currentCreditCard) return;
        search({
            relations: ['subscription'],
            where: {
                creditCardId: currentCreditCard.id,
                organizationId: orgId,
            },
            order: {issuedAt: 'DESC'},
        });
    };

    useEffect(() => {
        onReady();
    }, [currentCreditCard]);

    if (!currentCreditCard) return <></>;

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
                    <EmptyTable message="결제된 내역이 없어요." />
                ) : (
                    <ListTable
                        items={result.items}
                        isLoading={isLoading}
                        Header={() => <BillingHistoryTableHeaderOfCreditCard orderBy={orderBy} />}
                        Row={({item}) => <BillingHistoryRowOfCreditCard item={item} onSaved={() => reload()} />}
                    />
                )}
            </ListTableContainer>
        </section>
    );
});
