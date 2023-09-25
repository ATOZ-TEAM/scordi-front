import React, {memo, useRef} from 'react';
import {BiChevronRight, BiCopy} from 'react-icons/bi';
import {FaKey} from 'react-icons/fa6';
import {AccountDto} from '^types/account.type';
import {toast} from 'react-toastify';
import CopyToClipboard from 'react-copy-to-clipboard';
import {useAccountEditModal} from './AccountEditModal/hook';

interface AccountItemProps {
    account: AccountDto;
}

export const AccountItem = memo((props: AccountItemProps) => {
    const {account} = props;
    const toastId = useRef<number | string>('');
    const accountEditModal = useAccountEditModal();

    const decrypted = account.decryptSign();

    const copyBtnClick = () => {
        if (!toast.isActive(toastId.current)) {
            toastId.current = toast.info('비밀번호를 복사했어요.', {
                toastId: 'copyBtnClick',
                position: 'bottom-center',
            });
        }
    };

    return (
        <li className="px-2 mb-2 relative" data-id={account.id}>
            <div onClick={() => accountEditModal.show(account)} className="btn-like gap-4 p-4 hover:bg-slate-200">
                <div className="hidden sm:block">
                    <div className="btn btn-square">
                        <FaKey />
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-[16px] font-[500] flex items-center">
                        <span>{decrypted.email}</span>
                        <BiChevronRight size={22} />
                    </p>
                    <p className="text-sm text-gray-500">
                        <span>
                            업데이트: {account.updatedAt.getMonth() + 1}월 {account.updatedAt.getDate()}일
                        </span>
                        {account.memo && (
                            <>
                                <span className="mx-2">|</span>
                                <span>{account.memo}</span>
                            </>
                        )}
                    </p>
                </div>
            </div>
            <div className="px-2 absolute top-0 bottom-0 right-0 flex items-stretch">
                <div className="flex gap-2 justify-around items-center btn-like-follow">
                    <div>
                        {/*<AvatarGroup*/}
                        {/*    size={6}*/}
                        {/*    spaceSize="-15px"*/}
                        {/*    urls={permittedMembers.map((member) => member.profileImageUrl)}*/}
                        {/*    onClick={() => console.log(permittedMembers)}*/}
                        {/*/>*/}
                    </div>

                    <CopyToClipboard text={decrypted.password} onCopy={() => copyBtnClick()}>
                        <button className="btn btn-square btn-ghost">
                            <BiCopy className="text-[22px]" />
                        </button>
                    </CopyToClipboard>
                </div>
            </div>
        </li>
    );
});
