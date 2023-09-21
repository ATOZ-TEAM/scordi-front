import React, {memo, useEffect} from 'react';
import {
    BillingHistoryDto,
    BillingHistoryStatus,
    BillingScheduleShallowDto,
    getBillingHistoryStatus,
} from '^types/billing.type';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {displayCurrencyAtom} from '^components/pages/LandingPages/TastingPage/pageAtoms';
import {hh_mm} from '^utils/dateTime';
import {BillingListPriceText, PriceText} from '^v3/share/BillingHistoryListView/PriceText';
import {useRouter} from 'next/router';
import {orgIdParamState} from '^atoms/common';
import {useBillingHistoryModal} from '^v3/V3OrgBillingHistoryShowPage/useBillingHistoryModal';

export const ScheduleItem = memo((props: {entry: BillingScheduleShallowDto; showTitle?: boolean}) => {
    const {entry: data, showTitle = false} = props;
    const router = useRouter();

    const status = data.getStatus();
    const showTitleByStatus = (() => {
        if (status === BillingHistoryStatus.Info) return true;
        if (status === BillingHistoryStatus.Unknown) return true;
        if (status === BillingHistoryStatus.PayFail) return true;
        return false;
    })();

    const onClick = () => console.log(data);

    return (
        <li
            data-component="EmailParsedTableRowMobile"
            className="flex gap-4 mb-4 px-0 cursor-pointer"
            onClick={onClick}
        >
            <div className="">
                <p className="text-[16px] font-semibold whitespace-nowrap">{data.serviceName}</p>
                <p className="leading-none">
                    <small className="text-xs text-gray-500">{hh_mm(data.sortKey)}</small>
                </p>
            </div>

            <div className="ml-auto flex flex-col items-end max-w-[70%]">
                <p className="text-[16px] text-right font-bold">
                    <BillingListPriceText amount={data.payAmount} status={status} />
                </p>
                {(showTitle || showTitleByStatus) && (
                    <p className="leading-none text-right font-light">
                        <small className="text-xs text-gray-500" style={{wordBreak: 'keep-all'}}>
                            {data.pageSubject}
                        </small>
                    </p>
                )}
            </div>
        </li>
    );
});
