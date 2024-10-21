import React, {memo, ReactNode} from 'react';
import {ReactComponentLike} from 'prop-types';
import {HiMiniInbox} from 'react-icons/hi2';
import {GiSadCrab} from 'react-icons/gi';

interface EmptyTableProps {
    Icon?: () => JSX.Element;
    message?: string;
    buttonText?: string;
    buttonAction?: () => void;
    Buttons?: ReactComponentLike;
}

export const EmptyTable = memo((props: EmptyTableProps) => {
    const {Icon = DefaultEmptyIcon, message = '조회된 결과가 없어요.', buttonText, buttonAction, Buttons} = props;

    return (
        <div className={'flex flex-col items-center justify-center py-16'}>
            <p className={'text-2xl text-slate-200 mb-4'}>{Icon && <Icon />}</p>
            <p className="text-16 font-semibold text-gray-400 mb-1.5">{message}</p>

            {Buttons && (
                <div className={'py-4'}>
                    <Buttons />
                </div>
            )}

            {buttonText && buttonAction && (
                <button className={'btn btn-scordi mt-4 !text-16'} onClick={buttonAction}>
                    {buttonText}
                </button>
            )}
        </div>
    );
});

const DefaultEmptyIcon = () => (
    <div className="relative">
        <HiMiniInbox className="text-slate-200" fontSize={48} />
    </div>
);
