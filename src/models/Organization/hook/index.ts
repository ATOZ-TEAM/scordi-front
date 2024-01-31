import {useEffect} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {useRouter} from 'next/router';
import {useAlert} from '^hooks/useAlert';
import {getToken} from '^api/api';
import {FindAllQueryDto} from '^types/utils/findAll.query.dto';
import {currentOrgAtom, getCurrentOrgQueryAtom, getOrgQuery} from '^models/Organization/atom';
import {organizationApi} from '^models/Organization/api';
import {OrganizationDto} from '^models/Organization/type';
import {UserLoginPageRoute} from '^pages/users/login';

export const useOrganization = () => useRecoilValue(getOrgQuery);

// side effect 발생으로 페이지 컴포넌트에서만 사용하기
export function useCurrentOrg(id: number) {
    const router = useRouter();
    const [currentOrg, setCurrentOrg] = useRecoilState(currentOrgAtom);
    const [query, setQuery] = useRecoilState(getCurrentOrgQueryAtom);
    const {alert} = useAlert();

    const search = (params: FindAllQueryDto<OrganizationDto>, force?: boolean) => {
        setQuery((oldQuery) => {
            if (!force && JSON.stringify(oldQuery) === JSON.stringify(params)) return oldQuery;

            const req = organizationApi.show(id, params);
            req.then((res) => setCurrentOrg(res.data));
            req.catch((e) => {
                if (e.response.status == 401)
                    return alert.error('조직을 찾을 수 없습니다', '올바른 접근인지 확인해주세요');
            });

            return params;
        });
    };

    const reload = () => search(query, true);

    useEffect(() => {
        if (!id || isNaN(id)) return;
        if (currentOrg && currentOrg.id === id) return;

        const loginToken = getToken();
        if (!loginToken) {
            alert.error('로그인이 필요합니다!', '로그인 페이지로 이동할까요?').then((result) => {
                if (result.isConfirmed) {
                    router.push(UserLoginPageRoute.path());
                } else {
                    router.back();
                }
            });
            return;
        }

        search({
            relations: ['lastGoogleSyncHistory', 'lastGoogleSyncHistory.googleTokenData', 'invoiceAccounts'],
        });
    }, [id, currentOrg]);

    return {currentOrg, setCurrentOrg, search, reload};
}
