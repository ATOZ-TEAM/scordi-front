import {memo} from 'react';
import {IoIosLink} from 'react-icons/io';
import {LinkTo} from '^components/util/LinkTo';

interface ConnectMethodCardProps {
    logo: string;
    title: string;
    comment?: string | JSX.Element;
    disabled?: boolean;
    href?: string;
    onClick?: () => any;
    connected?: boolean;
    preventAnim?: boolean;
    className?: string;
}

export const ConnectMethodCard = memo((props: ConnectMethodCardProps) => {
    const {
        logo,
        title,
        comment,
        disabled = false,
        href,
        onClick,
        connected = false,
        preventAnim = false,
        className = '',
    } = props;

    return (
        <LinkTo href={href} className={`no-anim ${preventAnim ? '' : 'animate-soft-pulse'} ${className}`}>
            <div
                className={`card card-body p-6 bg-base-100 shadow-xl transition no-selectable ${
                    disabled ? 'cursor-not-allowed opacity-30' : 'hover:shadow-2xl cursor-pointer btn-animation'
                }`}
                onClick={onClick}
            >
                <div className="flex items-start justify-between">
                    <img src={logo} alt="" className="avatar w-[40px] h-[40px] mb-2" />

                    {connected && (
                        <code className="code flex gap-1 items-center px-2 py-0.5 bg-green-200 text-green-800 rounded-btn text-sm">
                            <IoIosLink /> 연동됨
                        </code>
                    )}
                </div>
                <p className="card-title text-16">{title}</p>
                {comment && <p className="text-gray-500 text-14">{comment}</p>}
            </div>
        </LinkTo>
    );
});
ConnectMethodCard.displayName = 'ConnectMethodCard';