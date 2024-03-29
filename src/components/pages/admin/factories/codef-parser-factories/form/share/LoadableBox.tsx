import React, {memo} from 'react';
import {WithChildren} from '^types/global.type';
import {CgSpinner} from 'react-icons/cg';
import {Spinner} from '^admin/factories/codef-parser-factories/form/share/Spinner';

interface LoadableBoxProps {
    isLoading: boolean;
    noPadding?: boolean;
    loadingType?: number;
}

export const LoadableBox = memo((props: LoadableBoxProps & WithChildren) => {
    const {loadingType = 1, isLoading, noPadding = false, children} = props;

    if (loadingType === 2) {
        return (
            <div className="relative">
                <div className={`${noPadding ? '' : `pt-4`} ${isLoading ? 'opacity-30' : ''}`}>{children}</div>
                {isLoading && (
                    <div className="absolute top-0 left-0 right-0">
                        <Spinner size={30} />
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div>
                {isLoading ? (
                    <div className="pt-4">loading...</div>
                ) : (
                    <div className={noPadding ? '' : `pt-4`}>{children}</div>
                )}
            </div>
        );
    }
});
LoadableBox.displayName = 'LoadableBox';
