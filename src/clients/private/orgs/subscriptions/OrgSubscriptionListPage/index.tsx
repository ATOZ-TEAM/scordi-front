import React, {memo} from 'react';
import {useRecoilValue} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {ListPage} from '^clients/private/_components/rest-pages/ListPage';
import {ListTable, ListTableContainer} from '^clients/private/_components/table/ListTable';
import {useSubscriptionTableListAtom} from '^models/Subscription/hook';
import {SubscriptionTableHeader} from './SubscriptionTableHeader';
import {SubscriptionTableRow} from './SubscriptionTableRow';

export const OrgSubscriptionListPage = memo(function OrgSubscriptionListPage() {
    const orgId = useRecoilValue(orgIdParamState);
    const {search, result, isLoading, movePage, changePageSize, orderBy, reload} = useSubscriptionTableListAtom();

    const onReady = () => {
        search({
            where: {organizationId: orgId},
            relations: ['master', 'teamMembers', 'creditCard'],
            order: {currentBillingAmount: {dollarPrice: 'DESC'}, isFreeTier: 'ASC', id: 'DESC'},
        });
    };

    return (
        <ListPage
            onReady={onReady}
            breadcrumb={['구독', {text: '구독 리스트', active: true}]}
            titleText="구독 리스트"
            Buttons={undefined}
            ScopeHandler={undefined}
            searchInputPlaceholder="검색어를 입력해주세요"
            onSearch={console.log}
        >
            <ListTableContainer
                pagination={result.pagination}
                movePage={movePage}
                changePageSize={changePageSize}
                unit="개"
            >
                <ListTable
                    items={result.items}
                    isLoading={isLoading}
                    Header={() => <SubscriptionTableHeader orderBy={orderBy} />}
                    Row={({item}) => <SubscriptionTableRow subscription={item} reload={reload} />}
                />
            </ListTableContainer>
        </ListPage>
    );
});
