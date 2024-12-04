import {useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {useRouter} from 'next/router';
import {useAlert} from '^hooks/useAlert';
import {getToken} from '^api/api';
import {FindAllQueryDto} from '^types/utils/findAll.query.dto';
import {currentOrgAtom, currentOrgIsLoadingAtom, getCurrentOrgQueryAtom, getOrgQuery} from '^models/Organization/atom';
import {organizationApi} from '^models/Organization/api';
import {OrganizationDto} from '^models/Organization/type';
import {UserLoginPageRoute} from '^pages/users/login';

export const useOrganization = () => useRecoilValue(getOrgQuery);

// side effect 발생으로 페이지 컴포넌트에서만 사용하기
export function useCurrentOrg(id: number) {
    const router = useRouter();
    const [currentOrg, setCurrentOrg] = useRecoilState(currentOrgAtom);
    const [isLoading, setIsLoading] = useRecoilState(currentOrgIsLoadingAtom);
    const [query, setQuery] = useRecoilState(getCurrentOrgQueryAtom);
    const {alert} = useAlert();

    const search = (orgId: number, params: FindAllQueryDto<OrganizationDto>, force?: boolean) => {
        new Promise((resolve, reject) => {
            setIsLoading(true);
            setQuery((oldQuery) => {
                const newQuery = {...params, id: orgId};
                if (!force && JSON.stringify(oldQuery) === JSON.stringify(newQuery)) {
                    resolve(undefined);
                    return oldQuery;
                }

                organizationApi
                    .show(orgId, params)
                    .then((res) => {
                        setCurrentOrg(res.data);
                        resolve(res);
                    })
                    .catch((e) => {
                        router.replace('/404').then(() => {
                            console.warn(e.response.data.message);
                            console.warn(e);
                        });
                    });

                return newQuery;
            });
        }).finally(() => setIsLoading(false));
    };

    const reload = () => search(id, query, true);

    const checkLogin = () => {
        const loginToken = getToken();
        if (!loginToken) {
            alert.error('로그인이 필요합니다!', '로그인 페이지로 이동할까요?').then((result) => {
                result.isConfirmed ? router.push(UserLoginPageRoute.path()) : router.back();
            });
            return false;
        }
        return !!loginToken;
    };

    useEffect(() => {
        if (!id || isNaN(id)) return;

        const signedIn = checkLogin();
        if (!signedIn) return;

        search(id, {
            relations: [
                'lastGoogleSyncHistory',
                'lastGoogleSyncHistory.googleTokenData',
                'invoiceAccounts',
                'scordiSubscriptions',
            ],
        });
    }, [id]);

    return {currentOrg, setCurrentOrg, search, reload, isLoading};
}

export const useCurrentOrg2 = () => {
    const currentOrg = useRecoilValue(currentOrgAtom);

    return {currentOrg};
};
