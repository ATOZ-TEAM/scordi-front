import React, {memo, useEffect, useState} from 'react';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {ReactNodeLike} from 'prop-types';
import {WithChildren} from '^types/global.type';
import {useRecoilValue} from 'recoil';
import {displayCurrencyAtom} from '^components/pages/LandingPages/TastingPage/pageAtoms';
import {changePriceCurrency, getCurrencySymbol, getCurrencyUnit} from '^api/tasting.api/gmail/agent/parse-email-price';
import {BiCaretLeft, BiCaretRight} from 'react-icons/bi';
import {focusedMonthAtom, useFocusedMonth} from '^v3/V3OrgHomePage/feature/useFocusedMonth';
import {firstDayOfMonth, lastDayOfMonth} from '^utils/dateTime';
import {useModal} from '^v3/share/modals/useModal';
import {billingHistoriesPayModal} from '^v3/V3OrgBillingHistoriesPage/modals/BillingHistoriesPageModal';
import {useBillingHistoriesV3, useBillingSchedulesV3} from '^hooks/useBillingHistories';
import {orgIdParamState} from '^atoms/common';
import {BillingHistoryManager} from '^models/BillingHistory';
import {currencyFormat} from '^utils/number';
import {BillingSchedule} from '^models/BillingSchedule';

export const SummaryHeaderPanel = memo(() => {
    const orgId = useRecoilValue(orgIdParamState);
    const displayCurrency = useRecoilValue(displayCurrencyAtom);
    const symbol = getCurrencySymbol(displayCurrency);
    const unit = getCurrencyUnit(displayCurrency);
    const {open: billingHistoriesPageModalOpen} = useModal(billingHistoriesPayModal);
    const focusedMonth = useRecoilValue(focusedMonthAtom);
    const {result: pagedHistories, search: loadHistories} = useBillingHistoriesV3();
    const {result: pagedSchedules, search: loadSchedules} = useBillingSchedulesV3();

    useEffect(() => {
        if (!orgId || !focusedMonth) return;

        const startDate = firstDayOfMonth(focusedMonth);
        const endDate = lastDayOfMonth(focusedMonth);
        const query = {
            where: {organizationId: orgId},
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };

        loadHistories({...query, order: {issuedAt: 'ASC'}, itemsPerPage: 0});
        loadSchedules({...query, order: {billingDate: 'ASC'}, itemsPerPage: 0});
    }, [orgId, focusedMonth]);

    const monthlyPaidAmount = BillingHistoryManager.init(pagedHistories.items).paid().getTotalPrice(displayCurrency);
    const monthlyWillPayAmount = BillingSchedule.init(pagedSchedules.items).getTotalPrice();
    const monthlyTotalAmount = monthlyPaidAmount.amount + monthlyWillPayAmount;

    return (
        <MobileSection.Item>
            <MobileSection.Padding>
                <div className="w-full h-[40px]" />
                <CurrentMonthHandler />

                <div className="flex justify-between items-center mb-6">
                    <p className="text-3xl font-bold">
                        <small className="mr-1">{symbol}</small>
                        <span>{currencyFormat(monthlyTotalAmount, '')}</span>
                    </p>

                    <button className="btn btn-sm btn-scordi" onClick={billingHistoriesPageModalOpen}>
                        내역
                    </button>
                </div>

                <ul className="py-0">
                    <MobileInfoListItem
                        label="오늘까지 결제된 금액"
                        value={currencyFormat(monthlyPaidAmount.amount, unit)}
                    />
                    <MobileInfoListItem label="남은 결제 금액" value={`0원`} />
                </ul>
            </MobileSection.Padding>
        </MobileSection.Item>
    );
});

const CurrentMonthHandler = memo(() => {
    const {focusedMonth, prevMonth, nextMonth, prevAvailable, nextAvailable} = useFocusedMonth({
        cached: false,
        maxDate: lastDayOfMonth(),
        maxUnavailableMsg: '이번 달 까지만 조회할 수 있어요',
    });

    return (
        <div className="flex mb-4">
            <div className="flex items-center justify-between cursor-pointer">
                <span className={`pr-2 -ml-1.5 ${!prevAvailable() && 'text-slate-300'}`} onClick={prevMonth}>
                    <BiCaretLeft size={20} />
                </span>
                <span className="text-[16px] font-semibold">{focusedMonth ? focusedMonth.getMonth() + 1 : '?'}월</span>
                <span className={`pl-2 ${!nextAvailable() && 'text-slate-300'}`} onClick={nextMonth}>
                    <BiCaretRight size={20} />
                </span>
            </div>
        </div>
    );
});

export const MobileInfoListItem = memo(
    (props: {label: ReactNodeLike; value?: ReactNodeLike; className?: string} & WithChildren) => {
        const {label, value, children, className = ''} = props;

        return (
            <li className={`flex justify-between items-center text-sm min-h-[40px] ${className}`}>
                <div className="">{label}</div>
                {children ? (
                    <div className="max-w-[70%] text-right">{children}</div>
                ) : (
                    <div className="font-light">{value}</div>
                )}
            </li>
        );
    },
);
