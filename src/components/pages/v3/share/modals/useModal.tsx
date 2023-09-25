import {atom, RecoilState, useRecoilState} from 'recoil';
import React, {memo, useEffect} from 'react';
import {WithChildren} from '^types/global.type';
import {IoClose} from '@react-icons/all-files/io5/IoClose';

const openedModalsAtom = atom<{key: string}[]>({
    key: 'openedModalsAtom',
    default: [],
});

interface UseModalOption {
    isShowAtom: RecoilState<boolean>;
    allowBodyScroll?: boolean;
    popStateSyncKey?: string;
}

interface ModalProps extends WithChildren {
    className?: string;
    wrapperClassName?: string;
}

export const useModal = (option: UseModalOption) => {
    const {isShowAtom, allowBodyScroll = false, popStateSyncKey = ''} = option;
    const [isShow, setIsShow] = useRecoilState(isShowAtom);

    useEffect(() => {
        if (!allowBodyScroll) {
            const noScrollClass = 'modal-opened';
            isShow ? document.body.classList.add(noScrollClass) : document.body.classList.remove(noScrollClass);
        }
    }, [isShow]);

    const open = (callback?: (() => any) | any) => {
        if (popStateSyncKey) {
            const isModalOpened = window.history.state === popStateSyncKey;
            if (!isShow && !isModalOpened) {
                window.history.pushState(popStateSyncKey, '');
                console.log('open modal', popStateSyncKey);
                window.addEventListener('popstate', () => {
                    const isModalOpened = window.history.state === popStateSyncKey;
                    if (!isModalOpened) {
                        console.log('close modal', popStateSyncKey);
                        close(-1);
                    }
                });
            }
        }
        setIsShow(true);
        if (callback && typeof callback === 'function') callback();
    };

    const close = (callback?: (() => any) | any) => {
        if (popStateSyncKey) {
            if (!callback) {
                // 백버튼 UI 를 클릭한 경우
                history.back();
            } else {
                // onPopState() 로부터 호출된 경우
                setIsShow(false);
            }
        } else {
            setIsShow(false);
        }
        if (callback && typeof callback === 'function') callback();
    };

    const prevent = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
    };

    return {
        isShow,
        setIsShow,
        open,
        close,
        prevent,
        Modal: memo(({children, wrapperClassName = '', className = ''}: ModalProps) => (
            <div
                id={popStateSyncKey}
                className={`modal cursor-pointer ${wrapperClassName} ${isShow ? 'modal-open' : ''}`}
                onClick={close}
            >
                <div className={`modal-box cursor-default ${className}`} onClick={prevent}>
                    {children}
                </div>
            </div>
        )),
        CloseButton: memo(() => (
            <button
                data-component="CloseModalButton"
                onClick={close}
                className="btn btn-link p-0 text-gray-500 hover:text-gray-900"
            >
                <IoClose size={26} />
            </button>
        )),
    };
};
