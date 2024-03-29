import {BillingTableRow} from '^components/pages/dashboard/BillingTableRow';
import {useRouter} from 'next/router';
import {SubscriptionDto} from 'src/models/Subscription/types';

const tableLabel = ['제품', '요금제명', '주기', '다음 결제일', '이용자 수', '결제 비용', '전달 대비', '관리', '액션'];

interface BillingTableProps {
    subscriptions: SubscriptionDto[];
}

export const BillingTable = (props: BillingTableProps) => {
    const {subscriptions} = props;
    const router = useRouter();
    const organizationId = Number(router.query.id);

    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                {/* head */}
                <thead>
                    <tr>
                        {tableLabel.map((e, i) => (
                            <th className="text-gray-600" key={i}>
                                {e}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((subscription) => (
                        <BillingTableRow subscription={subscription} key={subscription.id} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
