import {IoClose} from '@react-icons/all-files/io5/IoClose';
import {useRecoilValue} from 'recoil';

import {MembershipLevel} from '^models/Membership/types';
import {currentOrgAtom} from '^models/Organization/atom';
import {UserDto} from '^models/User/types';

import {AnimatedModal} from '^components/modals/_shared/AnimatedModal';

interface EditUserProfileModalProps {
    currentUser: UserDto;
    membershipLevel: MembershipLevel;
    isOpened: boolean;
    onClose: () => void;
}

/**
 TODO
 - modal-box 대신 tailwind로 스타일링
 */

export const EditUserProfileModal = (props: EditUserProfileModalProps) => {
    const {currentUser, membershipLevel, isOpened, onClose} = props;
    const {profileImgUrl, name, email, phone} = currentUser;

    const currentOrg = useRecoilValue(currentOrgAtom);

    console.log(profileImgUrl, name, email, phone, membershipLevel); // 삭제 예정

    if (!currentOrg) return <></>;

    return (
        <AnimatedModal open={isOpened} onClose={onClose}>
            <div className="w-[48rem] bg-white px-6 py-4 sm:px-12 sm:py-10 rounded-2xl flex flex-col gap-5 sm:gap-10">
                <div className="w-full flex justify-between items-center">
                    <h3 className="font-bold text-18">내 계정</h3>
                    <button>
                        <IoClose size={26} />
                    </button>
                </div>

                <article className="w-full flex flex-col sm:flex-row">
                    <div className="w-[128px] h-[128px]">아바타</div>
                    <div className="grow">
                        <div>
                            <h4 className="font-bold text-18 mb-1">{name}</h4>
                            <p className="text-gray-700 capitalize mb-6">
                                {membershipLevel.toLowerCase()} @{currentOrg?.name}
                            </p>
                            <div className="mb-6 flex flex-col gap-2 text-14 text-gray-900">
                                <p className="flex items-center gap-4">
                                    <span className="w-32">휴대전화 번호</span>
                                    <span>{phone}</span>
                                </p>
                                <p className="flex items-center gap-4">
                                    <span className="w-32">이메일</span>
                                    <span>{email}</span>
                                </p>
                            </div>
                            <p>
                                <button className="cursor-not-allowed text-gray-300 mb-6">비밀번호 변경하기</button>
                            </p>
                        </div>

                        <div className="h-[1.5px] w-full bg-stroke-gray mb-6"></div>

                        <div className="flex flex-col gap-4">
                            <div className="w-full">
                                <h4 className="font-semibold">알림</h4>
                                <div className="flex flex-col gap-3">
                                    <div className="rounded-2xl border border-stroke-gary p-4 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-14 font-medium">Email</span>
                                            <button>스위치</button>
                                        </div>
                                        <p className="text-12 text-gray-400">
                                            mia@01republic.io으로 scordi 관련 알림 메일이 발송됩니다.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-stroke-gary p-4 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-14 font-medium">SMS</span>
                                            <button>스위치</button>
                                        </div>
                                        <p className="text-12 text-gray-400">
                                            010-8770-1941으로 scordi 관련 알림 SMS가 발송됩니다.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <h4 className="font-semibold">혜택 및 이벤트 알림</h4>
                                <div className="rounded-2xl border border-stroke-gary p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-14 font-medium">마케팅 정보 수신 동의</span>
                                        <button>스위치</button>
                                    </div>
                                    <p className="text-12 text-gray-400">scordi의 혜택·정보를 받아 볼 수 있습니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </AnimatedModal>
    );
};
