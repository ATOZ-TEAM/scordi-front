import React, {forwardRef, memo, useImperativeHandle} from 'react';
import {BillingHistoriesMonthlySumBySubscriptionDto} from '^models/BillingHistory/type';
import {IsFreeTierTagUI} from '^models/Subscription/components/IsFreeTierTagUI';
import {FaQuestion} from 'react-icons/fa6';
import {Avatar} from '^components/Avatar';
import {EmptyTable} from '^clients/private/_components/table/EmptyTable';
import {CardContainerTableLayout} from '^clients/private/_components/table/ListTable';
import {CurrencyToggle} from '^tasting/CurrencyToggle';
import {useRecoilState} from 'recoil';
import {displayCurrencyAtom} from '^tasting/pageAtoms';
import * as XLSX from 'xlsx';

interface BillingHistoryMonthlyProps {
    history: BillingHistoriesMonthlySumBySubscriptionDto[];
}

export const BillingHistoryMonthly = memo(
    forwardRef((props: BillingHistoryMonthlyProps, ref) => {
        const {history} = props;
        const [displayCurrency] = useRecoilState(displayCurrencyAtom);

        const exchangeRate = 1350; // TODO: 나중에 환율 API로 변경

        const getAverageCost = (monthly: BillingHistoriesMonthlySumBySubscriptionDto) => {
            return getMonthlyCosts(monthly) / monthly.items.length;
        };

        const getMonthlyCosts = (monthly: BillingHistoriesMonthlySumBySubscriptionDto) => {
            const total = monthly.items.reduce((sum, item) => {
                if (displayCurrency === 'KRW' && item.code !== 'KRW') {
                    return sum + item.amount * exchangeRate;
                } else {
                    return sum + item.amount;
                }
            }, 0);
            return total;
        };

        const getMonthlyCostsToKRW = (monthly: BillingHistoriesMonthlySumBySubscriptionDto) => {
            const total = monthly.items.reduce((sum, item) => {
                if (item.code !== 'KRW') {
                    return sum + item.amount * exchangeRate;
                } else {
                    return sum + item.amount;
                }
            }, 0);
            return total;
        };

        const getSpendingPercentage = (itemAmount: number): string => {
            const totalAmount = history.reduce((sum, monthly) => sum + getMonthlyCostsToKRW(monthly), 0);
            if (totalAmount === 0) return '0%';
            const percentage = (itemAmount / totalAmount) * 100;
            return `${percentage.toFixed(1)}%`;
        };

        const sortedHistory = [...history].sort((a, b) => {
            const percentageA = getSpendingPercentage(getMonthlyCostsToKRW(a)).replace('%', '');
            const percentageB = getSpendingPercentage(getMonthlyCostsToKRW(b)).replace('%', '');
            return parseFloat(percentageB) - parseFloat(percentageA);
        });

        const renderMonthlyColumns = (items: BillingHistoriesMonthlySumBySubscriptionDto['items']) => {
            return Array.from({length: 12}, (_, i) => i).map((idx) => {
                const item = items[idx] ?? {amount: 0, symbol: items[0].symbol};
                const previousItem = idx > 0 ? items[idx - 1] : item;
                const amount = item?.amount
                    ? displayCurrency === 'KRW' && item.code !== 'KRW'
                        ? item.amount * exchangeRate
                        : item.amount
                    : 0;
                const previousAmount = previousItem?.amount
                    ? displayCurrency === 'KRW' && previousItem.code !== 'KRW'
                        ? previousItem.amount * exchangeRate
                        : previousItem.amount
                    : 0;
                const isHigher = amount > previousAmount;
                const isLower = amount < previousAmount;

                return (
                    <td
                        key={idx}
                        className={`text-right font-light ${
                            isHigher ? 'text-red-500 bg-red-50' : isLower ? 'text-blue-500 bg-blue-50' : ''
                        }`}
                    >
                        {currencySymbol(item.symbol)} {displayCost(amount)}
                    </td>
                );
            });
        };

        const currencySymbol = (symbol?: string) => (displayCurrency === 'KRW' ? '₩' : symbol);

        const displayCost = (amount: number, code?: string) => {
            if (displayCurrency === 'KRW' || code === 'KRW') {
                return Number(amount.toFixed(0)).toLocaleString();
            } else {
                return Number(amount.toFixed(2)).toLocaleString();
            }
        };

        const handleDownloadExcel = () => {
            const createFormattedData = (currencyMode: 'KRW' | 'Original') => {
                return sortedHistory.map((monthly) => {
                    const row = {
                        서비스명: monthly.subscription.product.name(),
                        유무료: monthly.subscription.isFreeTier ? '무료' : '유료',
                        지출비중: getSpendingPercentage(getMonthlyCostsToKRW(monthly)),
                        통화: currencyMode === 'KRW' ? 'KRW' : monthly.subscription.currentBillingAmount?.code || 'KRW',
                        총지출액:
                            currencyMode === 'KRW'
                                ? getMonthlyCostsToKRW(monthly).toLocaleString()
                                : getMonthlyCosts(monthly).toLocaleString(),
                        평균지출액:
                            currencyMode === 'KRW'
                                ? getAverageCost(monthly).toLocaleString()
                                : getAverageCost(monthly).toLocaleString(),
                    };
                    monthly.items.forEach((item, index) => {
                        const amount =
                            currencyMode === 'KRW' && item.code !== 'KRW' ? item.amount * exchangeRate : item.amount;
                        // @ts-ignore
                        row[`${index + 1}월`] = amount.toLocaleString();
                    });
                    return row;
                });
            };

            const worksheetKRW = XLSX.utils.json_to_sheet(createFormattedData('KRW'));
            const worksheetOriginalCurrency = XLSX.utils.json_to_sheet(createFormattedData('Original'));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheetKRW, '원화 기준');
            XLSX.utils.book_append_sheet(workbook, worksheetOriginalCurrency, '결제 통화 기준');
            XLSX.writeFile(workbook, `결제현황_다운로드.xlsx`);
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
                    <div className="overflow-x-auto w-full hide-scrollbar">
                        <table className="table w-full text-sm">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className={'sticky left-0 !bg-slate-100 flex z-10 border-r-2'}>서비스명</th>
                                    <th className={'text-right'}>유/무료</th>
                                    <th className={'text-right'}>지출 비중</th>
                                    <th className={'text-right'}>총 지출액</th>
                                    <th className={'text-right'}>평균지출액</th>
                                    {Array.from({length: 12}, (_, i) => (
                                        <th key={i} className={'text-right'}>
                                            {i + 1}월
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan={16} className="text-center py-8">
                                            <EmptyTable message="데이터가 없습니다." />
                                        </td>
                                    </tr>
                                ) : (
                                    sortedHistory.map((monthly, idx) => {
                                        return (
                                            <tr key={idx} className={'group'}>
                                                <td
                                                    className={
                                                        'sticky left-0 bg-white z-10 flex space-x-2 font-medium w-52 border-r-2 shadow-lg'
                                                    }
                                                >
                                                    <Avatar
                                                        className="w-6 h-6"
                                                        src={monthly.subscription.product.image}
                                                        alt={monthly.subscription.product.name()}
                                                        draggable={false}
                                                        loading="lazy"
                                                    >
                                                        <FaQuestion
                                                            size={24}
                                                            className="text-gray-300 h-full w-full p-[6px]"
                                                        />
                                                    </Avatar>
                                                    <span>{monthly.subscription.product.name()}</span>
                                                </td>
                                                <td>
                                                    <IsFreeTierTagUI value={monthly.subscription.isFreeTier || false} />
                                                </td>
                                                <td className={'text-right font-medium'}>
                                                    {getSpendingPercentage(getMonthlyCostsToKRW(monthly))}
                                                </td>
                                                <td className={'text-right font-medium'}>
                                                    {currencySymbol(monthly.subscription.currentBillingAmount?.symbol)}{' '}
                                                    {displayCost(getMonthlyCosts(monthly))}
                                                </td>
                                                <td className={'text-right font-medium'}>
                                                    {currencySymbol(monthly.subscription.currentBillingAmount?.symbol)}{' '}
                                                    {displayCost(
                                                        getAverageCost(monthly),
                                                        monthly.subscription.currentBillingAmount?.code,
                                                    )}
                                                </td>
                                                {renderMonthlyColumns(monthly.items)}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContainerTableLayout>
        );
    }),
);
