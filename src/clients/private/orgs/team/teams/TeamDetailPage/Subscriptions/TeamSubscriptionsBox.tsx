import React, {memo} from 'react';
import {FaQuestion} from 'react-icons/fa6';
import {WithChildren} from '^types/global.type';
import {TeamMemberSubscriptionDto, TeamMemberSubscriptionOriginData} from '^models/TeamMember';
import {Avatar} from '^components/Avatar';
import {TeamMemberAvatar} from '^v3/share/TeamMemberAvatar';

interface TeamSubscriptionsBoxProps extends WithChildren {
    result: TeamMemberSubscriptionOriginData;
    reload: () => any;
}
export const TeamSubscriptionsBox = memo((props: TeamSubscriptionsBoxProps) => {
    const {result, reload} = props;

    console.log(result);

    return (
        <div className="w-full">
            <ul className="grid grid-cols-2 gap-4">
                {result.items.map((item: TeamMemberSubscriptionDto) => (
                    <li key={item.subscriptionId} className="w-full border bg-white rounded-lg">
                        <div className="flex items-center justify-between p-2">
                            <div className="flex gap-2">
                                <Avatar
                                    className="w-7 h-7"
                                    src={item.subscription.product.image}
                                    alt={item.subscription.product.name()}
                                    draggable={false}
                                    loading="lazy"
                                >
                                    <FaQuestion size={24} className="text-gray-300 h-full w-full p-[6px]" />
                                </Avatar>

                                <span>{item.subscription.product.name()}</span>
                            </div>
                            <TeamMemberAvatar teamMember={item.teamMember} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
});
TeamSubscriptionsBox.displayName = 'TeamSubscriptionsBox';
