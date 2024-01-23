import {ValueComponent} from '../type';
import {IoIosRemove} from 'react-icons/io';
import Tippy from '@tippyjs/react';

interface DetachableOptionItemProps<T> {
    option: T;
    ValueComponent: ValueComponent<T>;
    detachRequest: (option: T) => false | Promise<boolean>;
    className?: string;
}

export const DetachableOptionItem = <T,>(props: DetachableOptionItemProps<T>) => {
    const {option, ValueComponent, className = '', detachRequest} = props;

    return (
        <li className={`flex px-[4px] !cursor-default group`} data-focusable="true">
            <div
                className={`flex items-center justify-between rounded-[4px] bg-white text-inherit pt-[2px] px-[10px] pb-0 min-h-[28px] group-hover:bg-gray-300 group-hover:bg-opacity-30 active:bg-gray-200 ${className}`}
            >
                <div className="flex-1">
                    <ValueComponent value={option} />
                </div>

                <div className="flex items-center pt-[1px]">
                    <Tippy content="연결 해제">
                        <div
                            className="cursor-pointer hidden group-hover:inline-flex"
                            onClick={() => detachRequest(option)}
                        >
                            <button className="btn btn-xs btn-square shadow rounded-[4px] !bg-white border-gray-300">
                                <IoIosRemove size={20} className="text-gray-400" strokeWidth={10} />
                            </button>
                        </div>
                    </Tippy>
                </div>
            </div>
        </li>
    );
};
DetachableOptionItem.displayName = 'DetachableOptionItem';
