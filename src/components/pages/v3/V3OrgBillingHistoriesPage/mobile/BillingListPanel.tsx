import React, {memo} from 'react';
import {MobileSection} from '^v3/share/sections/MobileSection';
import {useBillingListV3} from '^hooks/useBillingList';
import {DayGroupedAnyList, DayGroupedList} from '^v3/share/BillingHistoryListView/DayGroupedList';
import {HistoryItem} from '^v3/share/BillingHistoryListView/HistoryItem';
import {BillingHistoryDto, BillingScheduleShallowDto} from '^types/billing.type';
import {plainToInstance} from 'class-transformer';
import {ScheduleItem} from '^v3/share/BillingHistoryListView/ScheduleItem';

class BillingListManager {
    groupedHistories: Record<string, BillingHistoryDto[]>;
    groupedSchedules: Record<string, BillingScheduleShallowDto[]>;

    get dateKeys() {
        const combined = [Object.keys(this.groupedHistories), Object.keys(this.groupedSchedules)].flat().sort();
        return Array.from(new Set(combined));
    }
}

export const BillingListPanel = memo(() => {
    const {groupedHistories, groupedSchedules} = useBillingListV3();
    const BillingList = plainToInstance(BillingListManager, {groupedHistories, groupedSchedules});

    return (
        <MobileSection.Item>
            <MobileSection.Padding>
                <div>Summary</div>

                <ul className="w-full text-left">
                    {BillingList.dateKeys.map((dateKey, i) => {
                        const histories = groupedHistories[dateKey] || [];
                        const schedules = groupedSchedules[dateKey] || [];

                        if (histories.length === 0 && schedules.length === 0) return <></>;

                        const list = [histories, schedules].flat().sort((a, b) => {
                            return a.sortKey.getTime() - b.sortKey.getTime();
                        });

                        return (
                            <DayGroupedAnyList key={i} date={new Date(dateKey)} showTitle={true}>
                                {list.map((item, j) => {
                                    return Object.hasOwn(item, 'id') ? (
                                        <HistoryItem key={j} entry={item as BillingHistoryDto} showTitle={true} />
                                    ) : (
                                        <ScheduleItem
                                            key={j}
                                            entry={item as BillingScheduleShallowDto}
                                            showTitle={true}
                                        />
                                    );
                                })}
                            </DayGroupedAnyList>
                        );
                    })}
                </ul>
            </MobileSection.Padding>
        </MobileSection.Item>
    );
});
