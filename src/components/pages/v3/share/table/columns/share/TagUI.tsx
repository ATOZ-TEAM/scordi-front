import {memo} from 'react';
import {WithChildren} from '^types/global.type';

interface TagUIProps extends WithChildren {
    className?: string;
    onClick?: () => any;
}

export const TagUI = memo((props: TagUIProps) => {
    const {children, className = '', onClick} = props;

    return (
        <div className="inline-flex items-center mr-1.5">
            <div
                onClick={onClick}
                className={`${className} font-normal cursor-pointer flex items-center justify-center h-[20px] min-w-0 max-w-full rounded-[3px] px-[6px] m-0 overflow-hidden whitespace-nowrap`}
                style={{
                    fontSize: '12px',
                    lineHeight: '120%',
                    textOverflow: 'ellipsis',
                }}
            >
                {children}
            </div>
        </div>
    );
});
TagUI.displayName = 'TagUI';
