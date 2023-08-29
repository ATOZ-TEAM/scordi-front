import React, {memo, useCallback, useEffect, useState} from 'react';
import {ContentTable} from '^layouts/ContentLayout';
import {ProductDto, ProductConnectMethod} from '^types/product.type';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {subscriptionsState} from '^atoms/subscriptions.atom';
import {useProductSearch} from '^hooks/useProducts';
import {OrgProtoDetailPageRoute} from '^pages/orgs/[id]/prototypes/[protoId]';
import {orgIdParamState, useRouterIdParamState} from '^atoms/common';
import {useRouter} from 'next/router';
import {currentUserAtom} from '^atoms/currentUser.atom';
import {GoPlug} from '^components/react-icons';
import {editingProtoTargetState} from '^components/pages/OrgAppIndexPage/modals/PrototypeEditModal';
import {deleteProduct} from '^api/product.api';
import {errorNotify} from '^utils/toast-notify';
import {toast} from 'react-toastify';
import {connectProductModalState, currentPrototypeState} from '^atoms/connectProducts.atom';
import {OutLink} from '^components/OutLink';

export const SearchResultTable = memo(() => {
    const {results: prototypes, mutation} = useProductSearch();
    const {isAdmin} = useRecoilValue(currentUserAtom) || {};

    useEffect(() => {
        mutation();
    }, []);

    const thStyle = {width: '10%', minWidth: '100px'};

    return (
        <ContentTable
            thead={
                <tr>
                    <th className="w-[20%]">App</th>
                    <th>summary</th>
                    <th>home page url</th>
                    <th style={thStyle}>status</th>
                    <th style={thStyle}>
                        {isAdmin && (
                            <a href="#proto-create-modal" className="btn btn-xs capitalize btn-active btn-secondary">
                                new
                            </a>
                        )}
                    </th>
                </tr>
            }
        >
            {(prototypes || []).map((proto, i) => (
                <PrototypeItem
                    key={i}
                    proto={proto}
                    isAdmin={!!isAdmin}
                    onRemove={(proto) => {
                        if (!confirm('Are you sure?')) return;

                        deleteProduct(proto.id)
                            .then(() => toast(`[${proto.name}] Successfully removed`))
                            .then(() => mutation())
                            .catch(errorNotify);
                    }}
                />
            ))}
        </ContentTable>
    );
});

interface PrototypeItemProps {
    proto: ProductDto;
    isAdmin: boolean;
    onRemove: (proto: ProductDto) => void;
}

const PrototypeItem = memo((props: PrototypeItemProps) => {
    const {proto, isAdmin, onRemove} = props;
    const isConnectModalOpen = useSetRecoilState(connectProductModalState);
    const currentPrototype = useSetRecoilState(currentPrototypeState);
    const router = useRouter();
    const orgId = useRouterIdParamState('id', orgIdParamState);
    const apps = useRecoilValue(subscriptionsState);
    const setEditingProtoTarget = useSetRecoilState(editingProtoTargetState);
    const [isLive, setIsLive] = useState(false);
    const app = apps.find((app) => app.productId === proto.id);

    useEffect(() => {
        setIsLive(proto.connectMethod !== ProductConnectMethod.PREPARE);
    }, [proto]);

    const clickConnectBtn = (proto: ProductDto) => {
        isConnectModalOpen(true);
        currentPrototype(proto);
    };

    return (
        <tr>
            {/* App */}
            <td className="cursor-pointer" onClick={() => router.push(OrgProtoDetailPageRoute.path(orgId, proto.id))}>
                <div className="flex items-center">
                    <img src={proto.image} alt="" width={24} className="mr-4" />
                    <span className="leading-[1.2]" style={{whiteSpace: 'break-spaces'}}>
                        {proto.name}
                    </span>
                </div>
            </td>
            {/* tagline */}
            <td>{proto.tagline}</td>
            {/* home page url */}
            <td>
                <OutLink href={proto.homepageUrl} />
            </td>
            {/* status */}
            <td>
                <button
                    className="btn2 btn-sm flex-nowrap gap-1 btn-primary"
                    style={{flexWrap: 'nowrap'}}
                    onClick={() => clickConnectBtn(proto)}
                >
                    <GoPlug size={16} />
                    <span>connect</span>
                </button>
            </td>
            <td>
                {isAdmin && (
                    <div className="flex space-x-2">
                        <a
                            className="btn2 btn-sm"
                            href="#proto-edit-modal"
                            onClick={() => setEditingProtoTarget(proto)}
                        >
                            edit
                        </a>
                        {!isLive && (
                            <a
                                className="btn2 btn-sm"
                                // href="#proto-edit-modal"
                                onClick={() => onRemove(proto)}
                            >
                                remove
                            </a>
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
});
