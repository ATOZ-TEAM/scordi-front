import {memo, useEffect} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {subscriptionsState} from '^models/Subscription/atom';
import {SubscriptionTr} from './SubscriptionTr';
import {usePayingTypeTags} from '^models/Tag/hook';
import {SubscriptionDto} from '^models/Subscription/types';

interface SubscriptionTableProps {
    items: SubscriptionDto[];
}

export const SubscriptionTable = memo(function SubscriptionTable(props: SubscriptionTableProps) {
    const {items: subscriptions} = props;

    useEffect(() => {
        const dropdowns = document.querySelectorAll('.dropdown.fixed-dropdown');
        // const setDropdownPosition = (dropdown: Element) => () => {
        //     const rect = dropdown.getBoundingClientRect();
        //     const left = `--pos-l: ${rect.left}px;`;
        //     const top = `--pos-t: ${rect.bottom}px`;
        //     dropdown.setAttribute('style', [left, top].join(' '));
        // };
        //
        // dropdowns.forEach((dropdown) => {
        //     const listener = setDropdownPosition(dropdown);
        //     dropdown.addEventListener('focus', () => {
        //         window.addEventListener('scroll', listener);
        //     });
        //     dropdown.addEventListener('blur', () => {
        //         window.removeEventListener('scroll', listener);
        //     });
        // });
        const setDropdownPosition = () => {
            dropdowns.forEach((dropdown) => {
                const rect = dropdown.getBoundingClientRect();
                const left = `--pos-l: ${rect.left}px;`;
                const top = `--pos-t: ${rect.bottom}px`;
                dropdown.setAttribute('style', [left, top].join(' '));
            });
        };

        window.addEventListener('scroll', setDropdownPosition);
        return () => {
            window.removeEventListener('scroll', setDropdownPosition);
        };
    }, []);

    return (
        <div className="card bg-white shadow">
            <div className="overflow-x-auto overflow-y-hidden w-full">
                <table className="table w-full">
                    <thead className="top-[50px]">
                        <tr className="text-gray-500">
                            {/*<th className="bg-transparent"></th>*/}
                            <th className="bg-transparent">서비스</th>
                            <th className="bg-transparent text-center">상태</th>
                            <th className="bg-transparent">관리자 / 팀</th>
                            <th className="bg-transparent text-center">과금 방식</th>
                            {/* 태그들로 표시해 줄 것: 연, 고정, 사용량, 크레딧, 1인당 */}
                            <th className="bg-transparent text-right">사용인원</th>
                            <th className="bg-transparent text-right">최신 결제금액</th>
                            <th className="bg-transparent text-right">다음 결제일</th>
                            <th className="bg-transparent"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((subscription, i) => (
                            <SubscriptionTr subscription={subscription} key={i} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
