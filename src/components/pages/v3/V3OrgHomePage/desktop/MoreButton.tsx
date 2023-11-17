import React, {memo} from 'react';
import {LinkTo, LinkToProps} from '^components/util/LinkTo';
import {HiOutlineChevronRight} from 'react-icons/hi';

interface MoreButtonProps extends LinkToProps {
    //
}

export const MoreButton = memo((props: MoreButtonProps) => {
    const {href, text = '더보기'} = props;
    return (
        <LinkTo
            href={href}
            className="flex items-center gap-1 text-16 font-semibold text-gray-500 hover:text-gray-900 transition-all"
        >
            <span>{text}</span>
            <HiOutlineChevronRight size={14} />
        </LinkTo>
    );
});
MoreButton.displayName = 'MoreButton';
