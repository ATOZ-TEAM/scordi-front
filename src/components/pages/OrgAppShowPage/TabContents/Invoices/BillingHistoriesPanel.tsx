import {memo, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useCurrentSubscription} from '^models/Subscription/hook';
import {errorNotify} from '^utils/toast-notify';
import {
    ContentPanel,
    ContentPanelBody,
    ContentPanelHeading,
    ContentPanelItem,
    ContentPanelList,
} from '^layouts/ContentLayout';
import {Paginator} from '^components/Paginator';
import {billingHistoryApi} from '^models/BillingHistory/api';
import {BillingHistoryDto} from '^models/BillingHistory/type';

export const BillingHistoriesPanel = memo(() => {
    const router = useRouter();
    const {currentSubscription: subscription} = useCurrentSubscription();
    const [histories, setHistories] = useState<BillingHistoryDto[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [currentItemCount, setCurrentItemCount] = useState<number>(1);
    const [totalItemCount, setTotalItemCount] = useState<number>(1);

    const scrollTop = () => {
        window.scroll({top: 0});
    };

    function fetchHistories(productId: number, page: number) {
        if (currentPage === page) return;

        billingHistoryApi
            .index({
                where: {subscriptionId: subscription?.id},
                order: {id: 'DESC'},
                page,
                itemsPerPage: 10,
            })
            .then((res) => {
                setHistories(res.data.items);
                setCurrentPage(res.data.pagination.currentPage);
                setTotalPage(res.data.pagination.totalPage);
                setCurrentItemCount(res.data.pagination.currentItemCount);
                setTotalItemCount(res.data.pagination.totalItemCount);
                scrollTop();
            })
            .catch(errorNotify);
    }

    useEffect(() => {
        if (!subscription) return;
        fetchHistories(subscription.id, 1);
    }, [subscription]);

    if (!subscription) return <></>;

    return (
        <div>
            <ContentPanel title={`Billing histories (${totalItemCount})`}>
                <ContentPanelList>
                    {histories.map((history, i) => (
                        <BillingHistoryItem key={i} history={history} />
                    ))}

                    <ContentPanelItem>
                        <Paginator
                            className="ml-auto"
                            currentPage={currentPage}
                            totalPage={totalPage}
                            onClick={(pageNum) => fetchHistories(subscription.id, pageNum)}
                        />
                    </ContentPanelItem>
                </ContentPanelList>
            </ContentPanel>
        </div>
    );
});

interface BillingHistoryItemProps {
    history: BillingHistoryDto;
}

const BillingHistoryItem = memo((props: BillingHistoryItemProps) => {
    const {history} = props;
    console.log(history);

    /**
     * TODO: 현재는 데이터만 펼쳐서 출력하고 있음. 아래 요소들을 포함하여 아이템 행을 적절한 UI 로 만들 것. (토스 앱 참고)
     * 1. logo
     * 2. Paid Time
     * 3. Price
     * 4. Success or Fail
     * 5. Invoice Link
     * 6. Tracked Time
     */
    return (
        <ContentPanelItem>
            <ul>
                {Object.entries(history).map(([k, v], i) => (
                    <li key={i}>
                        <span className="mr-2">{k}:</span>
                        <span>{typeof v === 'boolean' ? (v ? 'true' : 'false') : `${v}`}</span>
                    </li>
                ))}
            </ul>
        </ContentPanelItem>
    );
});
