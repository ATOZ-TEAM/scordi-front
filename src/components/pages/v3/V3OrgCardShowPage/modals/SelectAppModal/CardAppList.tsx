import React, {Dispatch, memo, useEffect, useState} from 'react';
import Select from 'react-select';
import {getProducts} from '^api/product.api';
import {cardIdParamState, useRouterIdParamState} from '^atoms/common';
import {ProductDto} from '^types/product.type';
import {ProductOption} from '^components/pages/v3/share/modals/AccountListModal/form/SelectProduct/ProductOption.type';
import {CardAppItem} from './CardAppItem';

interface CardAppListProps {
    selectedApps: ProductDto[];
    setSelectedApps: Dispatch<React.SetStateAction<ProductDto[]>>;
}

export const CardAppList = memo((props: CardAppListProps) => {
    const {selectedApps, setSelectedApps} = props;
    const cardId = useRouterIdParamState('orgId', cardIdParamState);

    const [allAppList, setAllAppList] = useState<ProductDto[]>([]);

    useEffect(() => {
        if (!cardId) return;
        getProducts().then((res) => setAllAppList(res.data.items));
    }, []);

    const selectApp = (e: ProductOption) => {
        const selectedAppId = e.value;

        const selectedApp = allAppList.find((app) => {
            return app.id === selectedAppId;
        });

        if (!selectedApp) return;
        setSelectedApps([...selectedApps, selectedApp]);
    };

    return (
        <div>
            <Select
                options={allAppList.map((list) => {
                    return {
                        value: list.id,
                        label: list.nameEn,
                    };
                })}
                onChange={(e) => e && selectApp(e)}
                className="select-underline input-underline"
                placeholder="전체"
            />
            <span></span>
            <ul>
                {selectedApps.map((app, i) => (
                    <CardAppItem key={i} app={app} setSelectedApps={setSelectedApps} />
                ))}
            </ul>
        </div>
    );
});
