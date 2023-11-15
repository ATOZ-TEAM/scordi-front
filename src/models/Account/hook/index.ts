import {orgIdParamState, useRouterIdParamState} from '^atoms/common';
import {useRecoilState} from 'recoil';
import {getAccountsQueryAtom, accountsSearchResultAtom} from '^models/Account/atom';
import {FindAllAccountsQueryDto} from '^models/Account/types';
import {accountApi} from '^models/Account/api';
import {LoginDto} from '^types/crawler';
import CryptoJS from 'crypto-js';

export const useAccounts = () => {
    const orgId = useRouterIdParamState('orgId', orgIdParamState);
    const [result, setResult] = useRecoilState(accountsSearchResultAtom);
    const [query, setQuery] = useRecoilState(getAccountsQueryAtom);

    async function search(params: FindAllAccountsQueryDto, force = false) {
        if (!force && JSON.stringify(query) === JSON.stringify(params)) return;

        const data = await accountApi.index(orgId, params).then((res) => res.data);
        setResult(data);
        setQuery(params);
    }

    const movePage = (page: number) => search({...query, page});

    function fetchAllAccountsBy(where: FindAllAccountsQueryDto['where'], force = false) {
        return search({relations: ['product'], where, itemsPerPage: 0}, force);
    }

    return {query, result, search, movePage, fetchAllAccountsBy};
};

export const useAccountSign = () => {
    const CRAWLER_SIGN_SECRET = process.env.NEXT_PUBLIC_CRAWLER_SIGN_SECRET as string;

    const encryptLoginQuery = (loginQuery: LoginDto) => {
        const data = JSON.stringify(loginQuery);
        return CryptoJS.AES.encrypt(data, CRAWLER_SIGN_SECRET).toString();
    };

    const decryptSign = (sign: string) => {
        const bytes = CryptoJS.AES.decrypt(sign, CRAWLER_SIGN_SECRET);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };

    return {encrypt: encryptLoginQuery, decrypt: decryptSign};
};