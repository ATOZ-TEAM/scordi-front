import {PagedResourceAtoms, usePagedResource} from '^hooks/usePagedResource';
import {CodefCardDto} from './type/CodefCard.dto';
import {FindAllCardAdminQueryDto, FindAllCardQueryDto} from './type/find-all.card.query.dto';
import {codefCardAdminApi, codefCardApi} from '^models/CodefCard/api';
import {
    codefCardsAdminAtom,
    codefCardsAtom,
    codefCardsOfCreditCardShowAtom,
    connectedCodefCardsAtom,
    newCodefCardsAtom,
    subscriptionsForAccountAtom,
    subscriptionsForCardAtom,
} from '^models/CodefCard/atom';
import {SubscriptionDto} from '^models/Subscription/types';
import {FindAllSubscriptionByCardQueryDto} from '^models/CodefCard/type/find-all.card-subscription.query.dto';
import {RecoilState, useRecoilValue} from 'recoil';
import {codefAccountApi} from '^models/CodefAccount/api';

export const useCodefCards = (mergeMode = false) => useCodefCardsV3(codefCardsAtom, mergeMode);

/** 카드 상세 페이지에서, 연결된 코드에프 카드를 불러올때 사용 */
export const useCodefCardsOfCreditCardShow = () => useCodefCardsV3(codefCardsOfCreditCardShowAtom);

const useCodefCardsV3 = (atoms: PagedResourceAtoms<CodefCardDto, FindAllCardQueryDto>, mergeMode = false) => {
    return usePagedResource(atoms, {
        useOrgId: true,
        endpoint: (params, orgId) => codefCardApi.index(orgId, params),
        getId: 'id',
        mergeMode,
    });
};

/***
 * ADMIN
 */

export const useAdminCodefCards = () => useCodefCardsAdmin(codefCardsAdminAtom);

const useCodefCardsAdmin = (atoms: PagedResourceAtoms<CodefCardDto, FindAllCardAdminQueryDto>, mergeMode = false) => {
    return usePagedResource(atoms, {
        useOrgId: false,
        endpoint: (params) => codefCardAdminApi.index(params),
        // @ts-ignore
        getId: 'id',
        mergeMode,
    });
};

/***
 * Of Account
 * ====================
 */

/** 구독 불러오기 (연동페이지) 에서, 연결된 카드사의 카드 리스트를 보여줄 때 사용 */
export const useNewCodefCards = (codefAccountIdAtom: RecoilState<number>) =>
    useCodefCardsOfAccount(codefAccountIdAtom, newCodefCardsAtom);
export const useConnectedCodefCards = (codefAccountIdAtom: RecoilState<number>) =>
    useCodefCardsOfAccount(codefAccountIdAtom, connectedCodefCardsAtom);

const useCodefCardsOfAccount = <DTO = CodefCardDto, QUERY = FindAllCardQueryDto>(
    codefAccountIdAtom: RecoilState<number>,
    atoms: PagedResourceAtoms<DTO, QUERY>,
    mergeMode = false,
) => {
    const codefAccountId = useRecoilValue(codefAccountIdAtom);
    return usePagedResource(atoms, {
        useOrgId: true,
        endpoint: (params, orgId) => codefAccountApi.findCards(orgId, codefAccountId, params),
        // @ts-ignore
        getId: 'id',
        mergeMode,
    });
};

export const useSubscriptionsForCodefAccount = (codefAccountIdAtom: RecoilState<number>) => {
    return useSubscriptionsOfCodefAccount(codefAccountIdAtom, subscriptionsForAccountAtom);
};

export const useSubscriptionsForCard = (codefAccountIdAtom: RecoilState<number>) => {
    return useSubscriptionsOfCodefAccount(codefAccountIdAtom, subscriptionsForCardAtom);
};

const useSubscriptionsOfCodefAccount = (
    codefAccountIdAtom: RecoilState<number>,
    atoms: PagedResourceAtoms<SubscriptionDto, FindAllSubscriptionByCardQueryDto>,
    mergeMode = false,
) => {
    const codefAccountId = useRecoilValue(codefAccountIdAtom);
    return usePagedResource(atoms, {
        useOrgId: true,
        endpoint: (params, orgId) => codefAccountApi.findSubscriptions(orgId, codefAccountId, params),
        // @ts-ignore
        getId: 'id',
        mergeMode,
    });
};
