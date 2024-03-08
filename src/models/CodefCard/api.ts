import {api} from '^api/api';
import {paginatedDtoOf} from '^types/utils/response-of';
import {CodefCardDto} from '^models/CodefCard/type/CodefCard.dto';
import {FindAllCardQueryDto} from '^models/CodefCard/type/find-all.card.query.dto';
import {FindAllCardHistoryQueryDto} from '^models/CodefCard/type/find-all.card-history.query.dto';
import {ClassConstructor} from 'class-transformer';
import {FindAllSubscriptionByCardQueryDto} from '^models/CodefCard/type/find-all.card-subscription.query.dto';
import {SubscriptionDto} from '^models/Subscription/types';

/** [연동] Connect CODEF Cards API */
export const codefCardApi = {
    /** 코드에프 카드 조회 (보유카드 조회) */
    index<Dto = CodefCardDto, Query = FindAllCardQueryDto>(
        orgId: number,
        accountId: number,
        params: Query = {} as any,
    ) {
        const url = `/connect/organizations/${orgId}/codef/accounts/${accountId}/cards`;
        return api.get(url, {params}).then(paginatedDtoOf<Dto>(CodefCardDto as ClassConstructor<Dto>));
    },

    /** 코드에프 결제내역 조회 (카드 등록 및 연동) */
    histories(orgId: number, codefCardId: number, params: FindAllCardHistoryQueryDto = {}) {
        const url = `/connect/organizations/${orgId}/codef/cards/${codefCardId}/histories`;
        return api.get(url, {params}); //.then(paginatedDtoOf(CodefCardDto));
    },

    /** 연결된 구독 조회 */
    subscriptions(orgId: number, accountId: number, params?: FindAllSubscriptionByCardQueryDto) {
        const url = `/connect/organizations/${orgId}/codef/accounts/${accountId}/subscriptions`;
        return api.get(url, {params}).then(paginatedDtoOf(SubscriptionDto));
    },
    //
    // /** 승인내역 */
    // approval() {
    //     const url = `/v1/kr/card/b/account/approval-list`;
    //     return this.requestProduct(url, {});
    // },
    //
    // /** 청구내역 */
    // billing() {
    //     const url = `/v1/kr/card/b/account/billing-list`;
    //     return this.requestProduct(url, {});
    // },
    //
    // /** 매입내역 */
    // purchase() {
    //     const url = `v1/kr/card/b/account/purchase-details`;
    //     return this.requestProduct(url, {});
    // },
};
