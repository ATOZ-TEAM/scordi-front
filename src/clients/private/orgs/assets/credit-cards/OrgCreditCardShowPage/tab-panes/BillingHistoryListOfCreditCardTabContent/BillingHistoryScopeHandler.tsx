import React, {memo, useEffect, useState} from 'react';
import {ListPage} from '^clients/private/_components/rest-pages/ListPage';
import {useCurrentCreditCard} from '../../atom';
import {useBillingHistoryListOfCreditCard} from '^models/BillingHistory/hook';
import {FindAllBillingHistoriesQueryDto} from '^models/BillingHistory/type';

interface BillingHistoryScopeHandlerProps {
    //
}

export const BillingHistoryScopeHandler = memo((props: BillingHistoryScopeHandlerProps) => {
    const {} = props;
    const {currentCreditCard} = useCurrentCreditCard();
    const {search, query} = useBillingHistoryListOfCreditCard();
    const [selected, setSelected] = useState(0);

    const getBillingHistories = async (where: FindAllBillingHistoriesQueryDto['where']) => {
        if (!currentCreditCard) return;

        search({
            relations: ['subscription'],
            where: {
                creditCardId: currentCreditCard.id,
                organizationId: currentCreditCard.organizationId,
                ...where,
            },
            order: {issuedAt: 'DESC'},
        });
    };

    if (!currentCreditCard) return <></>;

    return (
        <div className="flex items-center gap-2">
            <ListPage.ScopeButton
                text="전체"
                active={selected === 0}
                onClick={() => {
                    setSelected(0);
                    getBillingHistories({});
                }}
            />
            <ListPage.ScopeButton
                text="결제됨"
                active={selected === 1}
                onClick={() => {
                    setSelected(1);
                    getBillingHistories({
                        // issuedAt: {op: 'not', val: 'NULL'},
                        paidAt: {op: 'not', val: 'NULL'},
                    });
                }}
            />
            {/*<ListPage.ScopeButton*/}
            {/*    text="예정"*/}
            {/*    active={selected === 2}*/}
            {/*    onClick={() => {*/}
            {/*        setSelected(2);*/}
            {/*        getBillingHistories({paidAt: 'NULL'});*/}
            {/*    }}*/}
            {/*/>*/}
            <ListPage.ScopeButton
                text="실패"
                active={selected === 3}
                onClick={() => {
                    setSelected(3);
                    getBillingHistories({
                        // issuedAt: {op: 'not', val: 'NULL'},
                        paidAt: 'NULL',
                    });
                }}
            />
        </div>
    );
});
BillingHistoryScopeHandler.displayName = 'BillingHistoryScopeHandler';
