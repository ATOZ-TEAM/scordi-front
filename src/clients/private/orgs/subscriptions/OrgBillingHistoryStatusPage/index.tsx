import React, {memo, useEffect, useRef, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {BillingCycleOptions} from '^models/Subscription/types/BillingCycleOptions';
import {
    BillingHistoriesMonthlySumBySubscriptionDto,
    BillingHistoriesYearlySumBySubscriptionDto,
} from '^models/BillingHistory/type';
import {billingHistoryApi} from '^models/BillingHistory/api';
import {ListPage} from '^clients/private/_components/rest-pages/ListPage';
import {MonthYearSwitch} from './MonthYearSwitch';
import {YearlyScopeHandler} from './YearlyScopeHandler';
import {BillingHistoryMonthly} from './BillingHistoryMonthly';
import {BillingHistoryYearly} from './BillingHistoryYearly';
import {useBillingHistoryStatus} from '^hooks/useBillingHistoryStatus';

interface ViewModeRef {
    downloadExcel: () => any;
    search: (keyword?: string) => void;
}

export const OrgBillingHistoryStatusPage = memo(function OrgBillingHistoryStatusPage() {
    const monthlyRef = useRef<ViewModeRef>(null);
    const yearlyRef = useRef<ViewModeRef>(null);
    const {years, focusYear, setFocusYear} = useBillingHistoryStatus();
    const [viewUnit, setViewUnit] = useState(BillingCycleOptions.Monthly);

    useEffect(() => {
        if (viewUnit === BillingCycleOptions.Yearly) setFocusYear(undefined);
    }, [viewUnit]);

    return (
        <ListPage
            // onReady={getMetaData}
            breadcrumb={['구독', {text: '결제현황', active: true}]}
            titleText="결제현황"
            Buttons={() => (
                <MonthYearSwitch
                    defaultValue={viewUnit}
                    onChange={(value) => {
                        setViewUnit(value);
                        setFocusYear(value === BillingCycleOptions.Monthly ? years[0] : undefined);
                    }}
                />
            )}
            searchInputPosition="right-of-scopes"
            scopeWrapperClass="!items-start"
            searchInputPlaceholder="서비스명 검색"
            ScopeHandler={() =>
                viewUnit === BillingCycleOptions.Monthly ? (
                    focusYear && <YearlyScopeHandler years={years} value={focusYear} onChange={setFocusYear} />
                ) : (
                    <div />
                )
            }
            onSearch={(keyword) => {
                const ref = viewUnit === BillingCycleOptions.Monthly ? monthlyRef : yearlyRef;
                ref.current?.search(keyword);
            }}
            onDownload={() => {
                const ref = viewUnit === BillingCycleOptions.Monthly ? monthlyRef : yearlyRef;
                ref.current?.downloadExcel();
            }}
        >
            {viewUnit === BillingCycleOptions.Monthly && focusYear ? (
                <BillingHistoryMonthly ref={monthlyRef} focusYear={focusYear} />
            ) : (
                <BillingHistoryYearly ref={yearlyRef} years={years} />
            )}
        </ListPage>
    );
});
