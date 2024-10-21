import React, {memo} from 'react';
import {debounce} from 'lodash';
import {useTeamMembersInTeamMembersTable} from '^models/TeamMember';
import {ListPage} from '^clients/private/_components/rest-pages/ListPage';
import {ListTable, ListTableContainer} from '^clients/private/_components/table/ListTable';
import {AddTeamMemberJustButton} from './AddTeamMemberButton';
import {InviteStatusScopeHandler} from './InviteStatusScopeHandler';
import {TeamMemberTableHeader} from './TeamMemberTableHeader';
import {TeamMemberTableRow} from './TeamMemberTableRow';

export const OrgTeamMemberListPage = memo(function OrgTeamMemberListPage() {
    const {
        search,
        result,
        isLoading,
        isEmptyResult,
        isNotLoaded,
        query,
        searchAndUpdateCounter,
        movePage,
        changePageSize,
        reload,
        orderBy,
    } = useTeamMembersInTeamMembersTable();

    const onReady = () => {
        searchAndUpdateCounter({
            relations: ['teams'],
            order: {id: 'DESC'},
            updateCounterCacheColumn: 'subscriptionCount',
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

    return (
        <ListPage
            onReady={onReady}
            breadcrumb={['팀', {text: '구성원', active: true}]}
            titleText="구성원"
            Buttons={AddTeamMemberJustButton}
            ScopeHandler={InviteStatusScopeHandler}
            searchInputPlaceholder="이름, 팀, 연락처 검색"
            onSearch={onSearch}
        >
            <ListTableContainer
                pagination={result.pagination}
                movePage={movePage}
                changePageSize={changePageSize}
                unit="명"
                isNotLoaded={isNotLoaded}
                isLoading={isLoading}
                isEmptyResult={isEmptyResult}
                emptyMessage="조회된 구성원이 없어요."
                emptyButtonText="구성원 등록"
                EmptyButtons={AddTeamMemberJustButton}
            >
                <ListTable
                    items={result.items}
                    isLoading={isLoading}
                    Header={() => <TeamMemberTableHeader orderBy={orderBy} />}
                    Row={({item}) => <TeamMemberTableRow teamMember={item} reload={reload} />}
                />
            </ListTableContainer>
        </ListPage>
    );
});
