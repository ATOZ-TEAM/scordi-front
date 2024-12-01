import {memo, useState} from 'react';
import {Avatar} from '^components/Avatar';
import {CardTableTR} from '^admin/share';
import {MembershipDto} from '^models/Membership/types';
import {AdminUserPageRoute} from '^pages/admin/users/[id]';
import {MoreDropdown} from '^clients/private/_components/MoreDropdown';
import {ChangeOrgModal} from './ChangeOrgModal';
import {hh_mm, yyyy_mm_dd} from '^utils/dateTime';

interface UserItemProps {
    membership: MembershipDto;
    borderBottom?: boolean;
    reload?: () => any;
}

export const UserItem = memo((props: UserItemProps) => {
    const {membership, reload} = props;

    const user = membership.user;
    const detailPath = membership.userId ? AdminUserPageRoute.path(membership.userId) : '';
    const [isOpened, setIsOpened] = useState(false);

    return (
        <>
            <CardTableTR gridClass="grid-cols-6">
                {/* 멤버십 id */}
                <div>{membership.id}</div>

                {/* 회원 */}
                <div>
                    {user ? (
                        <div className="flex gap-2 items-center">
                            <Avatar src={user.profileImgUrl} className="w-6 h-6" />
                            <p className="text-left whitespace-nowrap">
                                <span className="text-xs text-gray-500 mr-1">(#{user.id})</span>
                                <span className="">{user.name}</span>
                            </p>
                        </div>
                    ) : (
                        <div className="text-14 text-gray-400">
                            {membership.invitedEmail ? (
                                <div>초대 수락 대기중</div>
                            ) : (
                                <div className="text-red-500" onClick={() => console.log(membership)}>
                                    알 수 없음
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 권한 */}
                <div>{membership.level}</div>

                {/* 조직 가입 승인상태 */}
                <div>{membership.approvalStatus}</div>

                {/* 가입일시 */}
                <div>
                    <div className="text-12 flex items-center gap-1.5">
                        <span>{yyyy_mm_dd(membership.createdAt, '. ')}</span>
                        <span>{hh_mm(membership.createdAt)}</span>
                    </div>
                </div>

                {/* actions */}
                <div className="flex gap-2 items-center">
                    <MoreDropdown
                        Trigger={() => (
                            <button className="btn btn-sm btn-scordi no-animation btn-animation">더보기</button>
                        )}
                    >
                        {({hide}) => {
                            return (
                                <MoreDropdown.Content>
                                    <li>
                                        <MoreDropdown.ItemButton href={detailPath} className="hover:bg-scordi-50">
                                            보기
                                        </MoreDropdown.ItemButton>
                                    </li>
                                    <li>
                                        <MoreDropdown.ItemButton>수정</MoreDropdown.ItemButton>
                                    </li>
                                    <li>
                                        <MoreDropdown.ItemButton>삭제</MoreDropdown.ItemButton>
                                    </li>
                                    <li>
                                        <MoreDropdown.ItemButton
                                            onClick={() => {
                                                hide();
                                                setIsOpened(true);
                                            }}
                                        >
                                            조직 변경
                                        </MoreDropdown.ItemButton>
                                    </li>
                                </MoreDropdown.Content>
                            );
                        }}
                    </MoreDropdown>
                </div>
            </CardTableTR>
            {membership && (
                <ChangeOrgModal
                    membership={membership}
                    isOpened={isOpened}
                    onClose={() => {
                        setIsOpened(false);
                        reload && reload();
                    }}
                />
            )}
        </>
    );
});
