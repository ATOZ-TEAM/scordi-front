import React, {memo} from 'react';
import {useCurrentTeam} from '^models/Team/hook';
import {BsCreditCardFill, BsPeopleFill, BsUiChecksGrid} from 'react-icons/bs';
import {MdRefresh} from 'react-icons/md';
import {FaReceipt} from 'react-icons/fa6';
import {TabName} from './OrgTeamDetailPageTabContent';
import {TeamStatCard} from './TeamStatCard';
import {useUnmount} from '^hooks/useUnmount';

interface TeamStatCardListProps {
    changeCurrentTab?: (tabName: TabName) => any;
}

export const TeamStatCardList = memo((props: TeamStatCardListProps) => {
    const {changeCurrentTab} = props;
    const {team, reloadWithUpdateCounters, isLoading} = useCurrentTeam();

    useUnmount(() => {
        reloadWithUpdateCounters();
    }, []);

    return (
        <div className="bg-slate-100 rounded-lg p-2 shadow-lg">
            <div className="flex items-center justify-between mb-3">
                <p className="text-12 text-gray-400">이 팀에 연결된 항목</p>

                <MdRefresh
                    className={`text-12 text-gray-400 hover:text-black transition cursor-pointer ${
                        isLoading ? 'animate-spin' : ''
                    }`}
                    onClick={reloadWithUpdateCounters}
                />
            </div>

            <div className="grid grid-cols-2 gap-1">
                <TeamStatCard
                    Icon={() => <BsPeopleFill fontSize={15} className="text-yellow-600" />}
                    title="멤버"
                    count={team ? team.teamMemberCount : 0}
                    className={`text-gray-500 ${isLoading ? 'animate-pulse' : ''}`}
                    onClick={() => changeCurrentTab && changeCurrentTab(TabName.members)}
                    isLoading={isLoading}
                />
                <TeamStatCard
                    Icon={() => <BsUiChecksGrid fontSize={13} className="text-scordi-500" />}
                    title="구독"
                    count={team ? team.subscriptionCount : 0}
                    className={`text-gray-500 ${isLoading ? 'animate-pulse' : ''}`}
                    onClick={() => changeCurrentTab && changeCurrentTab(TabName.subscriptions)}
                    isLoading={isLoading}
                />
                <TeamStatCard
                    Icon={() => <BsCreditCardFill fontSize={14} className="text-green-600" />}
                    title="결제수단"
                    count={team ? team.creditCardCount : 0}
                    className={`text-gray-500 ${isLoading ? 'animate-pulse' : ''}`}
                    onClick={() => changeCurrentTab && changeCurrentTab(TabName.payments)}
                    isLoading={isLoading}
                />
                <TeamStatCard
                    Icon={() => <FaReceipt fontSize={14} className="text-blue-600" />}
                    title="청구서"
                    count={team ? team.invoiceAccountCount : 0}
                    className={`text-gray-500 ${isLoading ? 'animate-pulse' : ''}`}
                    onClick={() => changeCurrentTab && changeCurrentTab(TabName.invoices)}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
});
