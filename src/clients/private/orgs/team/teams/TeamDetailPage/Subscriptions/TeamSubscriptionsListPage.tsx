import React, {memo, useEffect, useState} from 'react';
import {ListPageSearchInput} from '^clients/private/_layouts/_shared/ListPageSearchInput';
import {useRecoilValue} from 'recoil';
import {teamIdParamState} from '^atoms/common';
import {ListTable, ListTableContainer} from '^clients/private/_components/table/ListTable';
import {SubscriptionTableRow} from '^clients/private/orgs/team/teams/TeamDetailPage/Subscriptions/TeamSubscriptionTableRow';
import {SubscriptionTableHeader} from '^clients/private/orgs/team/teams/TeamDetailPage/Subscriptions/TeamSubscriptionTableHeader';
import {useTeamsSubscriptionForDetailPage} from '^models/Team/hook';
import {EmptyTable} from '^clients/private/_components/table/EmptyTable';

export const TeamSubscriptionsListPage = memo(function TeamSubscriptionsListPage() {
    const teamId = useRecoilValue(teamIdParamState);
    const {search, result, isLoading, isNotLoaded, isEmptyResult, orderBy, reload, movePage, changePageSize} =
        useTeamsSubscriptionForDetailPage();
    const [isOpened, setIsOpened] = useState(false);

    const onSearch = (keyword?: string) => {
        search({keyword, relations: ['teamMember', 'teamMember.teams', 'subscription']});
    };

    useEffect(() => {
        !!teamId && search({where: {}, relations: ['teamMember', 'teamMember.teams', 'subscription']});
    }, [teamId]);

    return (
        <>
            <div className={'flex items-center justify-between pb-4'}>
                <div>
                    전체 <span className={'text-scordi-500'}>{result.pagination.totalItemCount}</span>
                </div>
                <div className={'flex space-x-4'}>
                    <ListPageSearchInput onSearch={onSearch} placeholder={'검색어를 입력해주세요'} />
                </div>
            </div>
            <ListTableContainer
                pagination={result.pagination}
                movePage={movePage}
                changePageSize={changePageSize}
                unit="개"
                hideTopPaginator={true}
                // Empty State Props
                isNotLoaded={isNotLoaded}
                isLoading={isLoading}
                isEmptyResult={isEmptyResult}
                emptyMessage="연결된 구독이 없어요."
                emptyButtonText="새 구독 연결"
                emptyButtonOnClick={() => setIsOpened(true)}
            >
                <ListTable
                    items={result.items}
                    isLoading={isLoading}
                    Header={() => <SubscriptionTableHeader orderBy={orderBy} />}
                    Row={({item}) => <SubscriptionTableRow subscription={item.subscription} reload={reload} />}
                />
            </ListTableContainer>
        </>
    );
});
