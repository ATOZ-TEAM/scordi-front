import React, {memo} from 'react';
import {CodefBillingHistoryDto} from '^models/CodefBillingHistory/type';
import {CardTableTR} from '^admin/share';
import {hh_mm, yyyy_mm_dd, yyyy_mm_dd_hh_mm} from '^utils/dateTime';
import {CodefCardTagUI} from '^admin/factories/codef-parser-factories/form/share/CodefCardTagUI';
import {FaCheck} from 'react-icons/fa6';
import {CodefCardDto} from '^models/CodefCard/type/CodefCard.dto';

interface CodefBillingHistoryItemProps {
    codefBillingHistory: CodefBillingHistoryDto;
    onCardSelect: (codefCard?: CodefCardDto) => any;
}

export const CodefBillingHistoryItem = memo((props: CodefBillingHistoryItemProps) => {
    const {codefBillingHistory, onCardSelect} = props;

    const yyyymmdd = yyyy_mm_dd(codefBillingHistory.usedAt);
    const hhmmss = hh_mm(codefBillingHistory.usedAt);
    const memberStoreName = codefBillingHistory.resMemberStoreName;
    const finalPrice = (() => {
        const integerStr = parseInt(codefBillingHistory.resUsedAmount).toLocaleString();
        const sub = Math.round((parseFloat(codefBillingHistory.resUsedAmount) % 1) * 100).toString();
        return `${integerStr}.${sub}`;
    })();
    const currency = codefBillingHistory.resAccountCurrency;
    const status = codefBillingHistory.memo;

    return (
        <CardTableTR gridClass="grid-cols-12" className={`text-12 cursor-pointer group`}>
            {/* ID */}
            <div>
                <span className="badge badge-xs">#{codefBillingHistory.id}</span>
            </div>

            {/* 카드 */}
            <div className="flex items-center gap-1">
                <span
                    className="tooltip tooltip-primary"
                    data-tip={`등록일: ${yyyy_mm_dd_hh_mm(codefBillingHistory.createdAt)}`}
                >
                    {yyyymmdd}
                </span>
            </div>

            <div className="flex items-center">
                <span
                    className="tooltip tooltip-primary"
                    data-tip={`승인일시: ${codefBillingHistory.resUsedDate} ${codefBillingHistory.resUsedTime}`}
                >
                    {hhmmss}
                </span>
            </div>

            {/* 카드 */}
            <div className="flex items-center">
                <div>
                    <CodefCardTagUI codefCard={codefBillingHistory.codefCard} onClick={onCardSelect} />
                </div>
            </div>

            {/* 제목 */}
            <div className="col-span-3">
                <div className="w-full whitespace-nowrap overflow-scroll no-scrollbar">
                    <span>{memberStoreName}</span>
                </div>
            </div>

            {/* 금액 */}
            <div className="flex items-center justify-end">
                <span>{finalPrice}</span> <small>({currency})</small>
            </div>

            {/* 결제상태 */}
            <div>
                <span className="text-red-500 font-semibold whitespace-nowrap">{status}</span>
            </div>

            {/* 해외결제여부 */}
            {/*<div>{codefBillingHistory}</div>*/}

            {/* 스코디 연동 */}
            <div>{codefBillingHistory.billingHistoryId && <FaCheck className="text-success" size={14} />}</div>

            <div></div>
            <div></div>
        </CardTableTR>
    );
});
CodefBillingHistoryItem.displayName = 'CodefBillingHistoryItem';