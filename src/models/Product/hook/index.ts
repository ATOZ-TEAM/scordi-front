import {atom, RecoilState, useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {productIdParamsState} from '^atoms/common';
import {
    billingCycleForCreateFlowAtom,
    getProductQuery,
    getProductsQuery,
    paymentPlanForCreateFlowAtom,
} from '^models/Product/atom';
import {useCallback, useEffect, useState} from 'react';
import {ProductDto, FindAllProductQuery} from '^models/Product/type';
import {productApi} from '^models/Product/api';
import {errorNotify} from '^utils/toast-notify';
import {SubscriptionPaymentPlanDto} from '^models/Subscription/types/paymentPlanType';
import {useRouter} from 'next/router';
import {Paginated} from '^types/utils/paginated.dto';
import {
    buildPagedResource,
    cachePagedQuery,
    makeAppendPagedItemFn,
    makeExceptPagedItemFn,
    usePagedResource,
} from '^hooks/usePagedResource';

export const useProducts = () => {
    const result = useRecoilValue(getProductsQuery);
    return result || {items: undefined, pagination: {}};
};

export const productSearchResultsState = atom({
    key: 'productSearchResultsState',
    default: [] as ProductDto[],
});

export const productsPagedResultAtom = atom<Paginated<ProductDto>>({
    key: 'productsPagedResultAtom',
    default: {
        items: [],
        pagination: {
            totalItemCount: 0,
            currentItemCount: 0,
            totalPage: 1,
            currentPage: 1,
            itemsPerPage: 30,
        },
    },
});

export const searchProductsParams = atom<FindAllProductQuery>({
    key: 'products/searchParams',
    default: {},
});

export const useProductsV2 = () => {
    return useProductsV3(productsPagedResultAtom, searchProductsParams);
};

export const usePagedProducts_SelectProduct = buildPagedResource({
    key: 'usePagedProducts_SelectProduct',
    endpoint: productApi.index,
    buildQuery: (params) => ({...params}),
    getId: (dto) => dto.id,
    mergeMode: false,
});

// => 1세대
//
// export const useProductsV3 = (
//     resultAtom: RecoilState<Paginated<ProductDto>>,
//     queryAtom: RecoilState<FindAllProductQuery>,
//     mergeMode = false,
// ) => {
//     const defaultMergeMode = mergeMode;
//     const [result, setResult] = useRecoilState(resultAtom);
//     const [query, setQuery] = useRecoilState(queryAtom);
//
//     async function search(params: FindAllProductQuery, mergeMode = defaultMergeMode, force = false) {
//         const param = {isLive: params.isLive ?? true, ...params};
//         const request = () => productApi.index(param);
//         return cachePagedQuery(setResult, setQuery, param, request, mergeMode, force);
//     }
//
//     const reload = () => search({...query}, false, true);
//     const movePage = (page: number, append = false) => search({...query, page}, append);
//     const resetPage = () => search({...query, page: 1}, false, true);
//     const append = makeAppendPagedItemFn(setResult);
//     const except = makeExceptPagedItemFn(setResult, (it, item) => it.id !== item.id);
//
//     return {query, result, search, reload, movePage, resetPage, except};
// };

// => 2세대
//
export const useProductsV3 = (
    resultAtom: RecoilState<Paginated<ProductDto>>,
    queryAtom: RecoilState<FindAllProductQuery>,
    mergeMode = false,
) =>
    usePagedResource({
        resultAtom,
        queryAtom,
        endpoint: productApi.index,
        buildQuery: (params) => ({isLive: params.isLive ?? true, ...params}),
        mergeMode,
        getId: (dto) => dto.id,
    });

export const useProductSearch = () => {
    const [results, setResults] = useRecoilState(productSearchResultsState);
    const [query, setQuery] = useRecoilState(searchProductsParams);

    const searchProducts = useCallback((params: FindAllProductQuery) => {
        setQuery(params);
        productApi
            .index({
                isLive: params.isLive ?? true,
                itemsPerPage: 500,
                ...params,
            })
            .then((res) => setResults(res.data.items))
            .catch(errorNotify);
    }, []);

    const mutation = useCallback(() => searchProducts(query), [query]);

    const search = async (params: FindAllProductQuery) => {
        if (JSON.stringify(query) === JSON.stringify(params)) return results;

        const data = await productApi
            .index({
                itemsPerPage: 500,
                ...params,
            })
            .then((res) => res.data);

        setResults(data.items);
        setQuery(params);

        return data.items;
    };

    return {results, searchProducts, query, mutation, search};
};

// export const useProduct = () => useRecoilValue(getProductQuery);
export const useProduct = () => useRecoilState(getProductQuery);

// export const useProducts2 = (deps: any[]) => {
//     const [page, setPage] = useState<number>(0);
//     const [totalPage, setTotalPage] = useState<number>(0);
//     const [totalItemCount, setTotalItemCount] = useState<number>(0);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [list, setList] = useRecoilState(productsAtom);
//
//     const fetch = (params: FindAllProductQuery = {}) => {
//         params.where ||= {};
//         params.isLive ??= true;
//         setIsLoading(true);
//         getProducts(params)
//             .then(({data}) => {
//                 setPage(data.pagination.currentPage);
//                 setTotalPage(data.pagination.totalPage);
//                 setTotalItemCount(data.pagination.totalItemCount);
//                 setList(data.items);
//             })
//             .catch(errorNotify)
//             .finally(() => setIsLoading(false));
//     };
//
//     useEffect(() => {
//         fetch();
//     }, [...(deps ?? [])]);
//
//     return {
//         data: list,
//         fetch,
//         isLoading,
//         pagination: {
//             currentPage: page,
//             totalPage,
//             totalItemCount,
//         },
//     };
// };
//
// export const useProduct2 = (id: number | null, deps: any[]) => {
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [product, setProduct] = useRecoilState(productAtom);
//
//     const fetchApplicationProduct = (id: number) => {
//         setIsLoading(true);
//         getProduct(id)
//             .then(({data}) => {
//                 setProduct(data);
//             })
//             .catch(errorNotify)
//             .finally(() => setIsLoading(false));
//     };
//
//     useEffect(() => {
//         if (typeof id === 'number') fetchApplicationProduct(id);
//     }, [id, ...(deps ?? [])]);
//
//     return {product, setProduct, isLoading, fetchApplicationProduct};
// };

export const usePaymentPlanForCreateFlow = (proto: ProductDto | null | undefined, id: number) => {
    const [paymentPlan, setPaymentPlan] = useRecoilState(paymentPlanForCreateFlowAtom);

    useEffect(() => {
        if (!proto || isNaN(id)) return;
        const plan = proto.paymentPlans.find((plan) => plan.id === id);
        setPaymentPlan(plan || null);
    }, [proto, id]);

    return {paymentPlan, setPaymentPlan};
};

export const useBillingCycleForCreateFlow = (plan: SubscriptionPaymentPlanDto | null | undefined, id: number) => {
    const [billingCycle, setBillingCycle] = useRecoilState(billingCycleForCreateFlowAtom);

    useEffect(() => {
        if (!plan || isNaN(id)) return;
        const cycle = plan.billingCycles.find((plan) => plan.id === id);
        setBillingCycle(cycle || null);
    }, [plan, id]);

    return {billingCycle, setBillingCycle};
};

export const useCreateFlow = () => {
    const router = useRouter();
    const productId = Number(router.query.productId);
    const planId = Number(router.query.planId);
    const cycleId = Number(router.query.cycleId);
    const [product] = useProduct();
    const planHook = usePaymentPlanForCreateFlow(product, planId);
    const cycleHook = useBillingCycleForCreateFlow(planHook.paymentPlan, cycleId);
    const setProductIdParam = useSetRecoilState(productIdParamsState);

    useEffect(() => {
        setProductIdParam(productId);
    }, [productId]);

    return {
        productId,
        paymentPlanId: planId,
        billingCycleId: cycleId,
        product,
        ...planHook,
        ...cycleHook,
    };
};

export const useProductPostContent = () => {
    // SSR의 경우 localStorage에 접근하지 않음. url를 통해서 en을 추적해야 함.
    const locale = getLocale();

    const makeContent = (product: ProductDto) => {
        const [post] = product.posts;
        // const productName = locale === 'ko' ? product.nameKo : product.nameEn;
        const productName = `${product.nameKo}(${product.nameEn})`;

        const shortName = product.nameEn?.split(' ')?.[0] ?? 'untitled';

        const thumbnailUrl = post?.thumbnailUrl ?? product?.ogImageUrl ?? 'https://placehold.co/400x200';
        const logoImgUrl = product?.image || `https://placehold.co/200x200?text=${shortName}`;
        const homePageUrl = product?.homepageUrl ?? null;
        const title = productName ?? post?.title ?? 'untitled';
        const subTitle = product?.tagline ?? post?.seoDescription ?? 'unset';
        const tags = product?.tags ?? post.tags ?? [];
        const tagNames = tags.map((tag) => tag.name);

        return {thumbnailUrl, logoImgUrl, homePageUrl, title, subTitle, tagNames};
    };

    return {makeContent};
};

const getLocale = () => {
    if (typeof window === 'undefined') return 'ko';
    return localStorage.getItem('locale') ?? 'ko';
};
