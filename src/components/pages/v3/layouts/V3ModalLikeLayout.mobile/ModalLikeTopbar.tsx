import React, {memo} from 'react';
import {FiArrowLeft} from 'react-icons/fi';
import {ReactComponentLike, ReactNodeLike} from 'prop-types';

interface ModalLikeTopbarProps {
    backBtnOnClick: () => any;
    title?: ReactNodeLike;
    topbarPosition?: 'fixed' | 'sticky';
    rightButtons?: ReactComponentLike[];
}

export const ModalLikeTopbar = memo((props: ModalLikeTopbarProps) => {
    const {title, backBtnOnClick, topbarPosition = 'fixed', rightButtons = []} = props;
    const mappedButtons = rightButtons.length ? (
        rightButtons.map((RightButton, i) => {
            return (
                <div key={i}>
                    <RightButton /> {i === rightButtons.length - 1 ? <span /> : <span>&nbsp;/&nbsp;</span>}
                </div>
            );
        })
    ) : (
        <br />
    );

    return (
        <>
            <div
                data-component="ModalLikeTopbar"
                className={`flex container-fluid items-center justify-between ${
                    topbarPosition === 'fixed' ? 'fixed w-full' : 'sticky'
                } top-0 h-[50px] min-h-[50px] bg-white z-10`}
            >
                <div className="text-sm h-full flex items-center">
                    <div
                        data-component="CloseModalButton"
                        className="px-5 h-full flex items-center cursor-pointer"
                        onClick={backBtnOnClick}
                    >
                        <FiArrowLeft size={24} strokeWidth={2.5} />
                    </div>
                </div>
                <div className="h-full flex-1 flex items-center font-semibold text-16">{title}</div>
                <div className="text-sm px-6 h-full flex items-center">{mappedButtons}</div>
            </div>
            {topbarPosition === 'fixed' && (
                <div data-component="ModalLikeTopbarBackdrop" className="w-full h-[50px] bg-white" />
            )}
        </>
    );
});
