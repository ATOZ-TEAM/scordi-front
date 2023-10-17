import {memo} from 'react';
import {OrganizationDto} from '^types/organization.type';
import {Avatar} from '^components/Avatar';
import {useRouter} from 'next/router';
import {AdminOrgPageRoute} from '^pages/admin/orgs/[id]';

interface OrgItemProps {
    org: OrganizationDto;
}

export const OrgItem = memo((props: OrgItemProps) => {
    const router = useRouter();
    const {org} = props;

    const gotoDetailPage = () => router.push(AdminOrgPageRoute.path(org.id));

    return (
        <div className="btn btn-lg btn-block no-animation !bg-neutral gap-2 items-center justify-between border rounded-lg normal-case">
            <div>
                <div className="flex gap-2 items-center">
                    <Avatar src={org.image} className="w-[32px]" />
                    <div className="text-left">
                        <p>
                            <span className="mr-1">{org.name}</span>
                            <span className="text-xs text-gray-500">(#{org.id})</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            {/*<span className="mr-1">{user.email}</span>*/}
                            {/*<span>/ {user.phone || '전화번호가 입력되지 않음'}</span>*/}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <div className="hidden sm:block"></div>

                <div>
                    <div className="hidden sm:flex gap-1.5 items-center justify-between">
                        <button className="btn btn-sm btn-info" onClick={gotoDetailPage}>
                            상세
                        </button>
                        <button className="btn btn-sm btn-warning">수정</button>
                        <button className="btn btn-sm btn-error">삭제</button>
                    </div>
                    <p className="sm:hidden relative -top-[1px]" onClick={gotoDetailPage}>{`>`}</p>
                </div>
            </div>
        </div>
    );
});
