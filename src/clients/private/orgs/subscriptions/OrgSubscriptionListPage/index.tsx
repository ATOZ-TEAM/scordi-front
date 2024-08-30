import React, {memo} from 'react';
import {useRecoilValue} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {ListPage} from '^clients/private/_components/rest-pages/ListPage';
import {ListTable, ListTableContainer} from '^clients/private/_components/table/ListTable';
import {useSubscriptionTableListAtom} from '^models/Subscription/hook';
import {SubscriptionTableHeader} from './SubscriptionTableHeader';
import {SubscriptionTableRow} from './SubscriptionTableRow';
import {debounce} from 'lodash';
import {LinkTo} from '^components/util/LinkTo';
import {OrgSubscriptionSelectPageRoute} from '^pages/orgs/[id]/subscriptions/select';
import {FaPlus} from 'react-icons/fa6';
import {EmptyTable} from '^clients/private/_components/table/EmptyTable';
import {TbListSearch} from 'react-icons/tb';

export const OrgSubscriptionListPage = memo(function OrgSubscriptionListPage() {
    const orgId = useRecoilValue(orgIdParamState);
    const {search, result, query, isLoading, movePage, changePageSize, orderBy, reload} =
        useSubscriptionTableListAtom();

    const onReady = () => {
        search({
            where: {organizationId: orgId},
            relations: ['master', 'teamMembers', 'creditCard'],
            order: {currentBillingAmount: {dollarPrice: 'DESC'}, isFreeTier: 'ASC', id: 'DESC'},
        });
    };

    const onSearch = debounce((keyword?: string) => {
        return search({
            ...query,
            keyword: keyword || undefined,
            page: 1,
            itemsPerPage: 30,
        });
    }, 500);

    const AddSubscriptionButton = () => (
        <LinkTo
            href={OrgSubscriptionSelectPageRoute.path(orgId)}
            className="btn btn-scordi gap-2 h-[44px]"
            loadingOnBtn
        >
            <FaPlus />
            <span>구독 등록</span>
        </LinkTo>
    );

    return (
        <ListPage
            onReady={onReady}
            breadcrumb={['구독', {text: '구독 리스트', active: true}]}
            titleText="구독 리스트"
            Buttons={() => <AddSubscriptionButton />}
            ScopeHandler={undefined}
            onSearch={onSearch}
            searchInputPosition="start-of-buttons"
        >
            {result.pagination.totalItemCount > 0 ? (
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
            ) : (
                <EmptyTable
                    icon={<TbListSearch size={32} />}
                    message="등록된 구독이 없어요."
                    Buttons={() => <AddSubscriptionButton />}
                />
            )}
        </ListPage>
    );
});
