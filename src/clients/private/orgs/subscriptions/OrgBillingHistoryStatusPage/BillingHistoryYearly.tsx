import React, {forwardRef, memo, useImperativeHandle} from 'react';
import {BillingHistoriesYearlySumBySubscriptionDto} from '^models/BillingHistory/type';
import {IsFreeTierTagUI} from '^models/Subscription/components/IsFreeTierTagUI';
import {useBillingHistoryStatus} from '^hooks/useBillingHistoryStatus';
import {FaQuestion} from 'react-icons/fa6';
import {Avatar} from '^components/Avatar';
import {EmptyTable} from '^clients/private/_components/table/EmptyTable';
import {CardContainerTableLayout} from '^clients/private/_components/table/ListTable';
import {CurrencyToggle} from '^tasting/CurrencyToggle';
import {useRecoilState} from 'recoil';
import {displayCurrencyAtom} from '^tasting/pageAtoms';
import * as XLSX from 'xlsx';

interface BillingHistoryYearlyProps {
    history: BillingHistoriesYearlySumBySubscriptionDto[];
}

export const BillingHistoryYearly = memo(
    forwardRef((props: BillingHistoryYearlyProps, ref) => {
        const {history} = props;
        const {years} = useBillingHistoryStatus();
        const reversedYears = [...years].reverse();
        const [displayCurrency] = useRecoilState(displayCurrencyAtom);

        const exchangeRate = 1350; // TODO: 나중에 환율 API로 변경

        const getAverageCost = (yearly: BillingHistoriesYearlySumBySubscriptionDto) => {
            const total = yearly.items.reduce((sum, item) => {
                const adjustedAmount =
                    displayCurrency === 'KRW' && item.code !== 'KRW' ? item.amount * exchangeRate : item.amount;
                return sum + adjustedAmount;
            }, 0);

            return total / yearly.items.length;
        };

        const getAverageCostToKRW = (yearly: BillingHistoriesYearlySumBySubscriptionDto) => {
            const total = yearly.items.reduce((sum, item) => {
                const adjustedAmount = item.code !== 'KRW' ? item.amount * exchangeRate : item.amount;
                return sum + adjustedAmount;
            }, 0);

            return total / yearly.items.length;
        };

        const sortedHistory = [...history].sort((a, b) => {
            const avgCostA = getAverageCostToKRW(a);
            const avgCostB = getAverageCostToKRW(b);
            return avgCostB - avgCostA;
        });

        const renderYearlyColumns = (items: BillingHistoriesYearlySumBySubscriptionDto['items'], years: number[]) => {
            return years.map((year, idx) => {
                const currentYearData = items.find((item) => item.issuedYear === year);
                const previousYearData = items.find((item) => item.issuedYear === years[idx - 1]);

                let colorClass = '';
                let currentAmount = 0;

                if (currentYearData) {
                    currentAmount =
                        displayCurrency === 'KRW' && currentYearData.code !== 'KRW'
                            ? currentYearData.amount * exchangeRate
                            : currentYearData.amount;
                }

                if (currentYearData && previousYearData) {
                    const previousAmount =
                        displayCurrency === 'KRW' && previousYearData.code !== 'KRW'
                            ? previousYearData.amount * exchangeRate
                            : previousYearData.amount;

                    colorClass =
                        currentAmount > previousAmount
                            ? 'text-red-500 bg-red-50'
                            : currentAmount < previousAmount
                            ? 'text-blue-500 bg-blue-50'
                            : '';
                }

                return (
                    <td key={idx} className={`text-right ${colorClass}`}>
                        {currentYearData
                            ? `${displayCurrency === 'KRW' ? '₩' : currentYearData.symbol} ${displayCost(
                                  currentAmount,
                                  currentYearData.code,
                              )}`
                            : 'N/A'}
                    </td>
                );
            });
        };

        const displayCost = (amount: number, code?: string) => {
            if (displayCurrency === 'KRW' || code === 'KRW') {
                return Number(amount.toFixed(0)).toLocaleString();
            } else {
                return Number(amount.toFixed(2)).toLocaleString();
            }
        };

        const handleDownloadExcel = () => {
            const createFormattedData = (currencyMode: 'KRW' | 'Original') => {
                return sortedHistory.map((yearly) => {
                    const row = {
                        서비스명: yearly.subscription.product.name(),
                        유무료: yearly.subscription.isFreeTier ? '무료' : '유료',
                        통화: currencyMode === 'KRW' ? 'KRW' : yearly.subscription.currentBillingAmount?.code || 'KRW',
                        평균지출액:
                            currencyMode === 'KRW'
                                ? getAverageCostToKRW(yearly).toLocaleString()
                                : getAverageCost(yearly).toLocaleString(),
                    };
                    yearly.items.forEach((item) => {
                        const adjustedAmount =
                            currencyMode === 'KRW' && item.code !== 'KRW' ? item.amount * exchangeRate : item.amount;
                        // @ts-ignore
                        row[`${item.issuedYear}년`] = adjustedAmount.toLocaleString();
                    });
                    return row;
                });
            };

            const worksheetKRW = XLSX.utils.json_to_sheet(createFormattedData('KRW'));
            const worksheetOriginal = XLSX.utils.json_to_sheet(createFormattedData('Original'));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheetKRW, '원화 기준');
            XLSX.utils.book_append_sheet(workbook, worksheetOriginal, '결제 통화 기준');

            const fileName = `결제현황_다운로드.xlsx`;

            XLSX.writeFile(workbook, fileName);
        };

        // useImperativeHandle로 상위 컴포넌트에 함수를 노출
        useImperativeHandle(ref, () => ({
            downloadExcel: handleDownloadExcel,
        }));

        return (
            <CardContainerTableLayout>
                <div className={'flex justify-start pb-2'}>
                    <CurrencyToggle leftText={''} rightText={'원화로 보기'} className={'font-medium'} />
                </div>
                <div className="bg-white border border-gray-300 overflow-hidden shadow rounded-lg">
                    <div className="overflow-x-auto w-full">
                        <table className="table w-full text-sm">
                            <thead className={'bg-slate-100'}>
                                <tr className="bg-slate-100">
                                    <th className="sticky left-0 !bg-slate-100 z-10">서비스명</th>
                                    <th className="text-right">유/무료</th>
                                    <th className="text-right">평균지출액</th>
                                    {reversedYears.map((year) => (
                                        <th key={year} className="text-right">
                                            {year}년
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan={reversedYears.length + 3} className="text-center py-8">
                                            <EmptyTable message="데이터가 없습니다." />
                                        </td>
                                    </tr>
                                ) : (
                                    sortedHistory.map((item, idx) => (
                                        <tr key={idx} className="group">
                                            <td className="sticky left-0 bg-white z-10 flex space-x-2 font-medium">
                                                <Avatar
                                                    className="w-6 h-6"
                                                    src={item.subscription.product.image}
                                                    alt={item.subscription.product.name()}
                                                    draggable={false}
                                                    loading="lazy"
                                                >
                                                    <FaQuestion
                                                        size={24}
                                                        className="text-gray-300 h-full w-full p-[6px]"
                                                    />
                                                </Avatar>
                                                <span>{item.subscription.product.name()}</span>
                                            </td>
                                            <td className="text-right">
                                                <IsFreeTierTagUI value={item.subscription.isFreeTier} />
                                            </td>
                                            <td className="text-right font-medium">
                                                {displayCurrency === 'KRW'
                                                    ? '₩'
                                                    : item.subscription.currentBillingAmount?.symbol}{' '}
                                                {getAverageCost(item).toLocaleString()}
                                            </td>
                                            {renderYearlyColumns(item.items, reversedYears)}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContainerTableLayout>
        );
    }),
);
