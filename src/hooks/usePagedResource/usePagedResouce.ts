import {RecoilState, useRecoilState, useRecoilValue} from 'recoil';
import {Paginated} from '^types/utils/paginated.dto';
import {AxiosResponse} from 'axios';
import {orgIdParamState} from '^atoms/common';
import {cachePagedQuery} from './cachePagedQuery';
import {makeAppendPagedItemFn} from './makeAppendPagedItemFn';
import {makeExceptPagedItemFn} from './makeExceptPagedItemFn';
import {useState} from 'react';

export interface UsePagedResourceOption<DTO, Query> {
    resultAtom: RecoilState<Paginated<DTO>>;
    queryAtom: RecoilState<Query>;
    endpoint: (params: Query) => Promise<AxiosResponse<Paginated<DTO>>>;
    buildQuery?: (params: Query) => Query;
    mergeMode?: boolean;
    getId: (dto: DTO) => any;
}

/**
 * usePagedResource
 * 매번 검색하는 훅을 일일이 만드는게 귀찮아서 만듦.
 * 반복해서 구현하는 스펙을 모아서 한 번에 구현.
 */
export function usePagedResource<DTO, Query>(option: UsePagedResourceOption<DTO, Query>) {
    const {resultAtom, queryAtom, endpoint, buildQuery = (q) => q, mergeMode: defaultMergeMode = false, getId} = option;

    const orgId = useRecoilValue(orgIdParamState);
    const [result, setResult] = useRecoilState(resultAtom);
    const [query, setQuery] = useRecoilState(queryAtom);
    const [isLoading, setIsLoading] = useState(false);

    async function search(params: Query, mergeMode = defaultMergeMode, force = false) {
        // if (!orgId || isNaN(orgId)) return;
        params = buildQuery(params);
        const request = () => {
            setIsLoading(true);
            return endpoint(params).finally(() => {
                setTimeout(() => setIsLoading(false), 200);
            });
        };
        return cachePagedQuery(setResult, setQuery, params, request, mergeMode, force);
    }

    const reload = () => search({...query}, false, true);
    const movePage = (page: number, append = false) => search({...query, page}, append);
    const resetPage = () => search({...query, page: 1}, false, true);
    const append = makeAppendPagedItemFn(setResult);
    const except = makeExceptPagedItemFn(setResult, (it, item) => getId(it) !== getId(item));
    // @ts-ignore
    const clearCache = () => setQuery({});

    return {query, result, search, reload, movePage, resetPage, except, isLoading, clearCache};
}
