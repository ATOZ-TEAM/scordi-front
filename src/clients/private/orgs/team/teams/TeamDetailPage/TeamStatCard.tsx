import {WithChildren} from '^types/global.type';
import {memo} from 'react';

interface TeamStatCardProps extends WithChildren {
    Icon: () => JSX.Element;
    title: string;
    count: number;
    className?: string;
    onClick?: () => any;
}

export const TeamStatCard = memo((props: TeamStatCardProps) => {
    const {count, title, Icon, className = '', onClick} = props;

    return (
        <div
            className={`rounded-lg text-sm bg-white py-2 px-3 cursor-pointer transition shadow-lg ${className}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-1.5 mb-2">
                <Icon />
                <p className="text-12">{title}</p>
            </div>

            <div className="flex items-end">
                <span className="text-32 font-medium text-black leading-none">
                    {count ? count.toLocaleString() : <span className="font-thin">-</span>}
                </span>
            </div>
        </div>
    );
});
