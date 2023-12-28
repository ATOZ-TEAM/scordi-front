import React, {memo, useEffect, useMemo, useState} from 'react';
import {ProductDto} from '^models/Product/type';
import {UseFormReturn} from 'react-hook-form';
import {Option} from '^components/util/react-select/Option';
import AsyncSelect from 'react-select/async';
import {FormatOptionLabelMeta} from 'react-select';
import {ProductOption} from '^v3/share/modals/AccountListModal/form/SelectProduct/ProductOption.type';
import {ProductOptionMenu} from '^v3/share/modals/AccountListModal/form/SelectProduct/ProductOptionMenu';
import {ProductSelectedValue} from '^v3/share/modals/AccountListModal/form/SelectProduct/ProductSelectedValue';
import {CreateSubscriptionRequestDto} from '^models/Subscription/types';
import {productApi} from '^models/Product/api';
import {ProductManager} from '^models/Product/manager';

interface SelectProductProps {
    // form: UseFormReturn<CreateSubscriptionRequestDto, any>;
    defaultValue?: number;
    onChange: (product: ProductDto) => any;
    labelText?: string;
    labelHidden?: boolean;
}

function toOption(product: ProductDto): ProductOption {
    const label = product.name();
    const value = product.id;
    return {label, value};
}

export const SelectProduct = memo((props: SelectProductProps) => {
    const {defaultValue, onChange, labelText, labelHidden = false} = props;
    const [productId, setProductId] = useState<number | undefined>(defaultValue);
    const [Product, setProductManager] = useState<ProductManager>(ProductManager.init());
    const product = useMemo(() => {
        if (!Product || !productId) return;
        return Product.findById(productId);
    }, [Product, productId]);

    useEffect(() => {
        productApi.index({isLive: true, order: {id: 'DESC'}}).then((res) => {
            setProductManager(ProductManager.init(res.data.items));
        });
    }, []);

    useEffect(() => {
        product && onChange(product);
    }, [product]);

    // if (!Product) return <div className="w-full min-h-[70px] bg-slate-200 opacity-40" />;

    const search = async (inputValue: string): Promise<Option[]> => {
        const value = (inputValue || '').toLowerCase();
        const products = await productApi.index({name: inputValue, isLive: true}).then((res) => {
            setProductManager(ProductManager.init(res.data.items));
            return res.data.items;
        });
        const filtered = products.filter((product) => {
            if (product.nameEn.toLowerCase().includes(value)) return true;
            if (product.nameKo.toLowerCase().includes(value)) return true;
            if (product.searchText.toLowerCase().includes(value)) return true;
            if (product.companyName.toLowerCase().includes(value)) return true;

            return false;
        });

        return filtered.map(toOption);
    };

    const ProductOptionLabel = (data: ProductOption, formatOptionLabel: FormatOptionLabelMeta<ProductOption>) => {
        const optionProductId = data.value;
        const optionProduct = Product.findById(optionProductId);

        if (formatOptionLabel.context === 'menu') {
            return <ProductOptionMenu product={optionProduct} data={data} formatOptionLabel={formatOptionLabel} />;
        } else {
            return <ProductSelectedValue product={optionProduct} data={data} formatOptionLabel={formatOptionLabel} />;
        }
    };

    return (
        <>
            <div className="w-full">
                <div className="w-full">
                    {!labelHidden && <div className="col-span-1 mb-2">{labelText || '서비스'}</div>}
                    <div className="col-span-2">
                        <AsyncSelect
                            value={product ? toOption(product) : null}
                            loadOptions={search}
                            defaultOptions={Product.all().map(toOption)}
                            className="select-underline input-underline"
                            placeholder="서비스를 선택해주세요"
                            onChange={(newValue, actionMeta) => {
                                switch (actionMeta.action) {
                                    case 'select-option':
                                        return newValue ? setProductId(newValue.value) : null;
                                }
                            }}
                            formatOptionLabel={ProductOptionLabel}
                        />
                        <span></span>
                    </div>
                </div>
            </div>
        </>
    );
});
