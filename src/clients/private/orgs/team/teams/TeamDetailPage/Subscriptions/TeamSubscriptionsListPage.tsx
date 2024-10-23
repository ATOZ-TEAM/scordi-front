import React, {memo, useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa6';
import {useRecoilValue} from 'recoil';
import {teamIdParamState} from '^atoms/common';
import {useCurrentTeam} from '^models/Team/hook';
import {ListPageSearchInput} from '^clients/private/_layouts/_shared/ListPageSearchInput';
import {useSubscriptionsInTeamShowPage} from '^models/Subscription/hook';
import {TeamSubscriptionCard} from './TeamSubscriptionCard';
import {LoadableBox} from '^components/util/loading';
import {debounce} from 'lodash';
import {useRouter} from 'next/router';
import {FindAllSubscriptionsQuery} from '^models/Subscription/types';

export const TeamSubscriptionsListPage = memo(function TeamSubscriptionsListPage() {
    const router = useRouter();
    const teamId = useRecoilValue(teamIdParamState);
    const {team, reload} = useCurrentTeam();
    const {search, result, isLoading, clearCache} = useSubscriptionsInTeamShowPage();

    const loadData = (params: FindAllSubscriptionsQuery = {}) => {
        return search({
            relations: ['product', 'teamMembers'],
            where: {
                // @ts-ignore
                teamMemberSubscriptions: {teamMember: {teamMemberships: {teamId}}},
            },
            itemsPerPage: 0,
            ...params,
        });
    };

    const onSearch = debounce((keyword?: string) => {
        return loadData({keyword});
    }, 500);

    useEffect(() => {
        if (!teamId || isNaN(teamId)) return;
        loadData();
    }, [teamId]);

    useEffect(() => {
        return () => clearCache();
    }, [router.isReady]);

    return (
        <>
            <div className={'flex items-center justify-between pb-4'}>
                <div>
                    이용중인 구독 수 <span className={'text-scordi-500'}>{team?.subscriptionCount}</span>
                </div>
                <div className={'flex space-x-4'}>
                    <ListPageSearchInput onSearch={onSearch} placeholder={'검색어를 입력해주세요'} />
                </div>
            </div>

            <LoadableBox isLoading={isLoading} loadingType={2} noPadding spinnerPos="center">
                <div className="w-full">
                    <ul className="grid grid-cols-3 gap-x-2 gap-y-3">
                        {result.items.map((item) => (
                            <TeamSubscriptionCard item={item} key={item.id} />
                        ))}
                    </ul>
                </div>
            </LoadableBox>
        </>
    );
});
