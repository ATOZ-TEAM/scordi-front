import React, {memo, useEffect, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {FaPlus} from 'react-icons/fa6';
import {useUnmount} from '^hooks/useUnmount';
import {ListPageSearchInput} from '^clients/private/_layouts/_shared/ListPageSearchInput';
import {ListTable, ListTableContainer} from '^clients/private/_components/table/ListTable';
import {teamIdParamState} from '^atoms/common';
import {TeamMembersTableRow} from '^clients/private/orgs/team/teams/OrgTeamDetailPage/Members/TeamMembersTableRow';
import {TeamMembersTableHeader} from '^clients/private/orgs/team/teams/OrgTeamDetailPage/Members/TeamMembersTableHeader';
import {useTeamMembershipListInTeamDetail} from '^models/TeamMembership/hook';
import {AddMemberModal} from '^clients/private/orgs/team/teams/OrgTeamDetailPage/Members/AddMemberModal';
import {OrgTeamDetailPageTabContentCommonProps} from '../OrgTeamDetailPageTabContent';

export const TeamMembersListPage = memo(function (props: OrgTeamDetailPageTabContentCommonProps) {
    const {reload: reloadParent} = props;
    const teamId = useRecoilValue(teamIdParamState);
    const {search, result, isNotLoaded, isEmptyResult, isLoading, movePage, changePageSize, reload, orderBy, reset} =
        useTeamMembershipListInTeamDetail();
    const [isOpened, setIsOpened] = useState(false);

    const onSearch = (keyword?: string) => {
        search({
            relations: ['teamMember', 'teamMember.membership'],
            where: {teamId},
            keyword,
        });
    };

    useEffect(() => {
        if (!teamId || isNaN(teamId)) return;
        onSearch();
    }, [teamId]);

    useUnmount(() => reset());

    const {totalItemCount} = result.pagination;

    return (
        <>
            <div className={'flex items-center justify-between pb-4'}>
                <div>
                    전체 <span className={'text-scordi-500'}>{totalItemCount.toLocaleString()}</span>
                </div>
                <div className={'flex space-x-4'}>
                    <ListPageSearchInput onSearch={onSearch} placeholder={'검색어를 입력해주세요'} />
                    <button
                        className="btn btn-square btn-scordi animate-none btn-animation"
                        onClick={() => setIsOpened(true)}
                    >
                        <FaPlus fontSize={20} />
                    </button>
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
                emptyMessage="조회된 구성원이 없어요."
                emptyButtonText="구성원 연결"
                emptyButtonOnClick={() => setIsOpened(true)}
            >
                <ListTable
                    items={result.items}
                    isLoading={isLoading}
                    Header={() => <TeamMembersTableHeader orderBy={orderBy} />}
                    Row={({item}) => (
                        <TeamMembersTableRow
                            teamMember={item.teamMember}
                            reload={() => {
                                reload();
                                reloadParent();
                            }}
                        />
                    )}
                />
            </ListTableContainer>

            {/* 연결 추가 모달 */}
            <AddMemberModal
                isOpened={isOpened}
                onClose={() => {
                    reload();
                    reloadParent();
                    setIsOpened(false);
                }}
            />
        </>
    );
});
