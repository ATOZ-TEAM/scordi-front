import React, {memo, ReactNode} from 'react';
import {ReactComponentLike} from 'prop-types';

interface EmptyTableProps {
    icon?: ReactNode;
    message: string;
    buttonText?: string;
    buttonAction?: () => void;
    Buttons?: ReactComponentLike;
}

export const EmptyTable = memo((props: EmptyTableProps) => {
    const {icon, message, buttonText, buttonAction, Buttons} = props;

    return (
        <div className={'text-center py-16'}>
            <p className={'text-2xl flex justify-center my-3'}>{icon}</p>
            <p className="mb-[2px]">{message}</p>

            {Buttons && (
                <div className={'py-4'}>
                    <Buttons />
                </div>
            )}

            {buttonText && buttonAction && (
                <button className={'mt-4 px-4 py-2 bg-scordi-500 text-white rounded-md'} onClick={buttonAction}>
                    {buttonText}
                </button>
            )}
        </div>
    );
});
