import React, {memo, useEffect, useState} from 'react';
import {OrganizationDto} from '^types/organization.type';
import {useCurrentUser} from '^hooks/useCurrentUser';
import {getMemberships} from '^api/membership.api';
import {MembershipDto} from '^types/membership.type';
import {errorNotify} from '^utils/toast-notify';
import {AiOutlinePlus} from 'react-icons/ai';
import {OrgSearchRoute} from '^pages/orgs/search';
import {useRouter} from 'next/router';
import {OrgHomeRoute} from '^pages/orgs/[id]/home';

export const OrgBar = memo(() => {
    const router = useRouter();
    const {currentUserMembership} = useCurrentUser();
    const [myMemberships, setMyMemberships] = useState<MembershipDto[]>([]);

    useEffect(() => {
        if (!currentUserMembership) return;

        const userId = currentUserMembership.userId;
        getMemberships({where: {userId}, itemsPerPage: 100})
            .then((res) => setMyMemberships(res.data.items))
            .catch(errorNotify);
    }, [currentUserMembership]);

    return (
        <div className="flex flex-col space-y-4 py-4 px-2 bg-white border-r" style={{borderRightColor: '#e0e0e0'}}>
            {currentUserMembership &&
                myMemberships.map((membership, i) => (
                    <OrgItem
                        key={i}
                        org={membership.organization}
                        isCurrent={membership.id === currentUserMembership.id}
                    />
                ))}

            {/* 추가버튼 */}
            <button
                className="btn btn-square btn-ghost rounded w-7 h-7 min-h-7"
                style={{minHeight: '1.75rem'}}
                onClick={() => router.push(OrgSearchRoute.path())}
            >
                <AiOutlinePlus strokeWidth={50} />
            </button>
        </div>
    );
});

interface OrgItemProps {
    org: OrganizationDto;
    isCurrent: boolean;
}

const OrgItem = memo((props: OrgItemProps) => {
    const {org, isCurrent} = props;
    const router = useRouter();

    return (
        <div
            className={`org-bar-item cursor-pointer inline-flex ${isCurrent ? 'current' : ''}`}
            title={org.name}
            onClick={() => router.push(OrgHomeRoute.path(org.id))}
        >
            {org.image && (
                <div className="avatar">
                    <div className="w-7 border rounded">
                        <img src={org.image} />
                    </div>
                </div>
            )}

            {!org.image && (
                <div className="avatar placeholder inline-flex">
                    <div className="bg-neutral-focus text-neutral-content border rounded w-7">
                        <span className="font-bold text-sm">{`${org.name}`[0]}</span>
                    </div>
                </div>
            )}
        </div>
    );
});
