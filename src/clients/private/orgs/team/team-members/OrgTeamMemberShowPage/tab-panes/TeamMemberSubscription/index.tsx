import React, {memo, useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa6';
import {useSubscriptionsInTeamMemberShowPage} from '^models/Subscription/hook';
import {ListTable, ListTableContainer} from '^clients/private/_components/table/ListTable';
import {useCurrentTeamMember} from '../../atom';
import {TeamMemberSubscriptionTableHeader} from './TeamMemberSubscriptionTableHeader';
import {TeamMemberSubscriptionTableRow} from './TeamMemberSubscriptionTableRow';
import {EmptyTable} from '^clients/private/_components/table/EmptyTable';
import {LinkTo} from '^components/util/LinkTo';
import {AddButton} from '^v3/V3OrgTeam/modals/TeamMemberShowModal/TeamMemberShowBody/tabs/SubscriptionListTab/AddButton';
import {TeamMemberConnectModal} from '^clients/private/orgs/team/team-members/OrgTeamMemberShowPage/tab-panes/TeamMemberSubscription/TeamMemberConnectModal';
import Tippy from '@tippyjs/react';
import {MdRefresh} from 'react-icons/md';

export const TeamMemberSubscription = memo(function TeamMemberSubscription() {
    const {currentTeamMember: teamMember} = useCurrentTeamMember();
    const {search, result, isLoading, movePage, changePageSize, reload, orderBy, isNotLoaded, isEmptyResult} =
        useSubscriptionsInTeamMemberShowPage();

    const [isConnectSubscription, setConnectSubscriptionModalOpened] = useState(false);

    const ConnectSubscriptionButton = () => (
        <LinkTo onClick={() => setConnectSubscriptionModalOpened(true)} className="btn btn-scordi gap-2" loadingOnBtn>
            <FaPlus />
            <span>구독 연결하기</span>
        </LinkTo>
    );

    if (!teamMember) return <></>;

    const onReady = () => {
        search({
            where: {
                organizationId: teamMember.organizationId,
                // @ts-ignore
                teamMembers: {id: teamMember.id},
            },
            order: {id: 'DESC'},
        });
    };

    const {totalItemCount} = result.pagination;

    return (
        <section className="py-8">
            <ListTableContainer
                pagination={result.pagination}
                movePage={movePage}
                changePageSize={changePageSize}
                hideTopPaginator
                // Empty State Props
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-18">
                            {totalItemCount ? (
                                <>
                                    <b className="text-scordi">{totalItemCount.toLocaleString()}개</b>
                                    <span>의 구독이 연결되어있어요</span>
                                </>
                            ) : (
                                <span className="text-gray-300 font-light">새로고침</span>
                            )}
                        </h3>

                        <Tippy className="!text-10" content="목록 새로고침">
                            <button
                                className={`btn btn-xs btn-circle ${isLoading ? 'animate-spin' : ''}`}
                                onClick={() => reload()}
                            >
                                <MdRefresh fontSize={14} />
                            </button>
                        </Tippy>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="btn btn-sm bg-white border-gray-300 hover:bg-white hover:border-gray-500 gap-2"
                            onClick={() => setConnectSubscriptionModalOpened(true)}
                        >
                            <FaPlus />
                            <span>구독 연결하기</span>
                        </button>
                    </div>
                </div>

                {isEmptyResult ? (
                    <EmptyTable message="연결된 구독이 없어요." Buttons={ConnectSubscriptionButton} />
                ) : (
                    <ListTable
                        onReady={onReady}
                        items={result.items}
                        isLoading={isLoading}
                        Header={() => <TeamMemberSubscriptionTableHeader orderBy={orderBy} />}
                        Row={({item}) => (
                            <TeamMemberSubscriptionTableRow
                                teamMember={teamMember}
                                subscription={item}
                                reload={reload}
                            />
                        )}
                    />
                )}
            </ListTableContainer>

            <TeamMemberConnectModal
                isOpened={isConnectSubscription}
                onClose={() => setConnectSubscriptionModalOpened(false)}
                onCreate={() => {
                    setConnectSubscriptionModalOpened(false);
                    reload();
                }}
                teamMemberId={teamMember.id}
            />
        </section>
    );
});
