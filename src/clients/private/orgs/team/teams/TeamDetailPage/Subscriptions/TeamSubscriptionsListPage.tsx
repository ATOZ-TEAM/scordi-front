import React, {memo, useEffect} from 'react';
import {TeamDetailLayout} from '^clients/private/orgs/team/teams/TeamDetailPage/TeamDetailLayout';
import {ListPageSearchInput} from '^clients/private/_layouts/_shared/ListPageSearchInput';
import {useRecoilValue} from 'recoil';
import {orgIdParamState, teamIdParamState} from '^atoms/common';
import {ListTable, ListTableContainer} from '^clients/private/_components/table/ListTable';
import {SubscriptionTableRow} from '^clients/private/orgs/team/teams/TeamDetailPage/Subscriptions/TeamSubscriptionTableRow';

import {useSubscriptionsInTeamMemberShowPage, useSubscriptionsV2} from '^models/Subscription/hook';
import {SubscriptionTableHeader} from '^clients/private/orgs/team/teams/TeamDetailPage/Subscriptions/TeamSubscriptionTableHeader';
import {useTeamsSubscriptionForDetailPage} from '^models/Team/hook';
import {EmptyTable} from '^clients/private/_components/table/EmptyTable';

import {FaPlus} from 'react-icons/fa6';
import {TbListSearch} from 'react-icons/tb';
import {LinkTo} from '^components/util/LinkTo';
import {OrgSubscriptionSelectPageRoute} from '^pages/orgs/[id]/subscriptions/select';

export const TeamSubscriptionsListPage = memo(function TeamSubscriptionsListPage() {
    const orgId = useRecoilValue(orgIdParamState);
    const teamId = useRecoilValue(teamIdParamState);
    const {search, result, isLoading, orderBy, reload, movePage, changePageSize} = useTeamsSubscriptionForDetailPage();

    const onSearch = (keyword?: string) => {
        search({keyword, relations: ['teamMember', 'teamMember.teams', 'subscription']});
    };

    const AddSubscriptionButton = () => (
        <LinkTo
            href={OrgSubscriptionSelectPageRoute.path(orgId)}
            className="btn btn-scordi gap-2 h-[44px]"
            loadingOnBtn
        >
            <FaPlus />
            <span>구독 연결</span>
        </LinkTo>
    );

    useEffect(() => {
        !!teamId && search({where: {}, relations: ['teamMember', 'teamMember.teams', 'subscription']});
    }, [teamId]);

    return (
        <TeamDetailLayout>
            <div className={'flex items-center justify-between pb-4'}>
                <div>
                    전체 <span className={'text-scordi-500'}>{result.pagination.totalItemCount}</span>
                </div>
                <div className={'flex space-x-4'}>
                    <ListPageSearchInput onSearch={onSearch} placeholder={'검색어를 입력해주세요'} />
                </div>
            </div>
            {result.items.length > 0 ? (
                <ListTableContainer
                    pagination={result.pagination}
                    movePage={movePage}
                    changePageSize={changePageSize}
                    unit="개"
                    hideTopPaginator={true}
                >
                    <ListTable
                        items={result.items}
                        isLoading={isLoading}
                        Header={() => <SubscriptionTableHeader orderBy={orderBy} />}
                        Row={({item}) => <SubscriptionTableRow subscription={item.subscription} reload={reload} />}
                    />
                </ListTableContainer>
            ) : (
                <EmptyTable
                    icon={<TbListSearch size={32} />}
                    message="연결된 구독이 없어요."
                    Buttons={() => <AddSubscriptionButton />}
                />
            )}
        </TeamDetailLayout>
    );
});
