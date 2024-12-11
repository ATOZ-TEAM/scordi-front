import React, {memo, useEffect, useRef, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {BillingCycleOptions} from '^models/Subscription/types/BillingCycleOptions';
import {
    BillingHistoriesMonthlySumBySubscriptionDto,
    BillingHistoriesYearlySumBySubscriptionDto,
    BillingHistoryDto,
} from '^models/BillingHistory/type';
import {billingHistoryApi} from '^models/BillingHistory/api';
import {ListPage} from '^clients/private/_components/rest-pages/ListPage';
import {MonthYearSwitch} from './MonthYearSwitch';
import {YearlyScopeHandler} from './YearlyScopeHandler';
import {BillingHistoryMonthly} from './BillingHistoryMonthly';
import {BillingHistoryYearly} from './BillingHistoryYearly';
import {useBillingHistoryStatus} from '^hooks/useBillingHistoryStatus';
import {LoadableBox} from '^components/util/loading';
import * as XLSX from 'xlsx';

export const OrgBillingHistoryStatusPage = memo(function OrgBillingHistoryStatusPage() {
    const monthlyRef = useRef(null);
    const yearlyRef = useRef(null);
    const orgId = useRecoilValue(orgIdParamState);
    const {years, focusYear, setFocusYear, getMetaData} = useBillingHistoryStatus();

    const [viewUnit, setViewUnit] = useState(BillingCycleOptions.Monthly);
    const [monthlyHistory, setMonthlyHistory] = useState<BillingHistoriesMonthlySumBySubscriptionDto[]>([]);
    const [filteredMonthlyHistory, setFilteredMonthlyHistory] = useState<BillingHistoriesMonthlySumBySubscriptionDto[]>(
        [],
    );
    const [yearlyHistory, setYearlyHistory] = useState<BillingHistoriesYearlySumBySubscriptionDto[]>([]);
    const [filteredYearlyHistory, setFilteredYearlyHistory] = useState<BillingHistoriesYearlySumBySubscriptionDto[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState(false);

    const fetchBillingData = async () => {
        setIsLoading(true);
        try {
            if (focusYear) {
                const monthlyResponse = await billingHistoryApi.statusApi.monthlySum(orgId, focusYear);

                setMonthlyHistory(monthlyResponse.data);
                setFilteredMonthlyHistory(monthlyResponse.data);
            } else {
                const yearlyResponse = await billingHistoryApi.statusApi.yearlySum(orgId);

                setYearlyHistory(yearlyResponse.data);
                setFilteredYearlyHistory(yearlyResponse.data);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (keyword = '') => {
        const filterByName = (
            item: BillingHistoriesMonthlySumBySubscriptionDto | BillingHistoriesYearlySumBySubscriptionDto,
        ) => item.subscription?.product.name().includes(keyword);

        setFilteredMonthlyHistory(monthlyHistory.filter(filterByName));
        setFilteredYearlyHistory(yearlyHistory.filter(filterByName));
    };

    const onDownloadMonthly = () => {
        if (monthlyRef.current) {
            // @ts-ignore
            monthlyRef.current.downloadExcel();
        }
    };

    const onDownloadYearly = () => {
        if (yearlyRef.current) {
            // @ts-ignore
            yearlyRef.current.downloadExcel();
        }
    };

    useEffect(() => {
        if (viewUnit === BillingCycleOptions.Yearly) setFocusYear(undefined);
    }, [viewUnit]);

    useEffect(() => {
        if (!orgId || isNaN(orgId)) return;
        fetchBillingData();
    }, [focusYear, orgId, years]);

    return (
        <ListPage
            onReady={getMetaData}
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
            onSearch={handleSearch}
            onDownload={viewUnit === BillingCycleOptions.Monthly ? onDownloadMonthly : onDownloadYearly}
        >
            <LoadableBox isLoading={isLoading} loadingType={2} spinnerPos="center" noPadding loadingClass="">
                {viewUnit === BillingCycleOptions.Monthly ? (
                    <BillingHistoryMonthly ref={monthlyRef} history={filteredMonthlyHistory} />
                ) : (
                    <BillingHistoryYearly ref={yearlyRef} history={filteredYearlyHistory} />
                )}
            </LoadableBox>
        </ListPage>
    );
});
