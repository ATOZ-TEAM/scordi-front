import {memo} from 'react';
import {useSelectProducts} from '^models/Product/hook';
import {SelectedProductItem} from './SelectedProductItem';

export const SelectedProductSection = memo(function SelectedProductSection() {
    const {selectedProducts, unSelect, clearSelects} = useSelectProducts();

    if (selectedProducts.length === 0) return <></>;

    return (
        <div className="p-4 border-t min-h-[70px]">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-12 text-gray-500 font-medium">선택된 앱 ({selectedProducts.length})</h4>

                <div>
                    <span
                        className="text-11 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                        onClick={() => clearSelects()}
                    >
                        초기화
                    </span>
                </div>
            </div>

            <div className="mb-4">
                {selectedProducts.map((product, i) => (
                    <SelectedProductItem key={i} product={product} unSelect={unSelect} />
                ))}
            </div>

            <div className="sticky left-0 right-0 bottom-0 py-4 sm:p-0">
                <button className="btn btn-scordi btn-block">
                    {selectedProducts.length}개의 앱에 대한 구독 등록하기
                </button>
            </div>
        </div>
    );
});
