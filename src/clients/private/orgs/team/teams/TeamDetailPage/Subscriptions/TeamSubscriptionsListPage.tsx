import React, {memo, useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa6';
import {useRecoilValue} from 'recoil';
import {teamIdParamState} from '^atoms/common';
import {useTeamsSubscriptionForDetailPage} from '^models/Team/hook';
import {LinkTo} from '^components/util/LinkTo';
import {ListPageSearchInput} from '^clients/private/_layouts/_shared/ListPageSearchInput';
import {TeamSubscriptionsBox} from '^clients/private/orgs/team/teams/TeamDetailPage/Subscriptions/TeamSubscriptionsBox';

export const TeamSubscriptionsListPage = memo(function TeamSubscriptionsListPage() {
    const teamId = useRecoilValue(teamIdParamState);
    const {search, result, isLoading, isNotLoaded, isEmptyResult, orderBy, reload, movePage, changePageSize} =
        useTeamsSubscriptionForDetailPage();
    const [isAddSubscriptionModalOpened, setAddSubscriptionModalOpened] = useState(false);

    const onSearch = (keyword?: string) => {
        search({keyword, relations: ['teamMember', 'teamMember.teams', 'subscription']});
    };

    const items = result.items.map((item) => item.subscription);

    const AddSubscriptionButton = () => (
        <LinkTo onClick={() => setAddSubscriptionModalOpened(true)} className="btn btn-scordi gap-2" loadingOnBtn>
            <FaPlus />
            <span>첫 번째 구독 연결하기</span>
        </LinkTo>
    );

    useEffect(() => {
        !!teamId && search({where: {}, relations: ['teamMember', 'teamMember.teams', 'subscription']});
    }, [teamId]);

    return (
        <>
            <div className={'flex items-center justify-between pb-4'}>
                <div>
                    이용중인 구독 수 <span className={'text-scordi-500'}>{result.pagination.totalItemCount}</span>
                </div>
                <div className={'flex space-x-4'}>
                    <ListPageSearchInput onSearch={onSearch} placeholder={'검색어를 입력해주세요'} />
                </div>
            </div>
            <TeamSubscriptionsBox result={result} reload={reload} />
        </>
    );
});
