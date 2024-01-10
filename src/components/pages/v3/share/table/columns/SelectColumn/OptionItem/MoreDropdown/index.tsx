import {IoIosMore} from 'react-icons/io';
import {FaRegTrashAlt} from 'react-icons/fa';
import {FcCheckmark} from 'react-icons/fc';
import {WithChildren} from '^types/global.type';
import {Dropdown} from '^v3/share/Dropdown';
import {MoreDropdownListItem} from './ListItem';

interface MoreDropdownProps<T> extends WithChildren {
    isCurrent: boolean;
    option: T;
    destroyRequest?: (option: T) => false | Promise<boolean> | void;
    className?: string;
}

export const MoreDropdown = <T,>(props: MoreDropdownProps<T>) => {
    const {isCurrent, option, destroyRequest, children, className} = props;

    return (
        <Dropdown
            className={`pt-1 ${className}`}
            placement="bottom"
            Trigger={({visible}) => (
                <>
                    {/* isCurrent: 드롭다운이 열려있다면 비활성화하고, 닫혀있다면 hover 되지 않을 때 활성화 합니다. */}
                    <div className={visible ? 'hidden' : `group-hover:hidden`}>{isCurrent && <FcCheckmark />}</div>

                    {/* hover 되었을 때 활성화하고, 드롭다운이 열려있다면 활성화된 상태로 고정합니다. */}
                    <div className={visible ? 'flex' : 'hidden group-hover:flex'}>
                        <button className="btn btn-xs btn-square !border-none hover:bg-gray-200">
                            <IoIosMore size={16} />
                        </button>
                    </div>
                </>
            )}
        >
            <ul
                tabIndex={0}
                className="dropdown-portal-content focus menu p-2 border shadow-lg bg-base-100 rounded-md w-40 z-10"
            >
                {destroyRequest && (
                    <MoreDropdownListItem
                        onClick={() => {
                            return Promise.resolve(destroyRequest(option)).then((isSuccess) => {
                                // if (isSuccess) closeContent && closeContent();
                                return isSuccess;
                            });
                        }}
                    >
                        <div className="flex items-center gap-3 w-full">
                            <FaRegTrashAlt />
                            <p>삭제</p>
                        </div>
                    </MoreDropdownListItem>
                )}
                {children}
            </ul>
        </Dropdown>
    );
};
MoreDropdown.displayName = 'MoreDropdown';
