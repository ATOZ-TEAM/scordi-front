import {api} from '^api/api';
import {oneDtoOf, paginatedDtoOf} from '^types/utils/response-of';
import {CodefCardDto} from '^models/CodefCard/type/CodefCard.dto';
import {FindAllCardAdminQueryDto, FindAllCardQueryDto} from '^models/CodefCard/type/find-all.card.query.dto';
import {FindAllCardHistoryQueryDto} from '^models/CodefCard/type/find-all.card-history.query.dto';
import {ClassConstructor} from 'class-transformer';
import {FindAllSubscriptionByCardQueryDto} from '^models/CodefCard/type/find-all.card-subscription.query.dto';
import {SubscriptionDto} from '^models/Subscription/types';

/** [연동] Connect CODEF Cards API */
export const codefCardApi = {
    /** 코드에프 카드 조회 */
    index(orgId: number, params: FindAllCardQueryDto = {}) {
        const url = `/connect/organizations/${orgId}/codef/cards`;
        return api.get(url, {params}).then(paginatedDtoOf(CodefCardDto));
    },

    show<Dto = CodefCardDto>(orgId: number, id: number) {
        const url = `/connect/organizations/${orgId}/codef/cards/${id}`;
        return api.get(url).then(oneDtoOf<Dto>(CodefCardDto as ClassConstructor<Dto>));
    },

    createCreditCard(orgId: number, id: number) {
        const url = `/connect/organizations/${orgId}/codef/cards/${id}/creditCard`;
        return api.post(url).then(oneDtoOf(CodefCardDto));
    },

    // 스코디 카드 연결
    connectCreditCard(orgId: number, id: number, creditCardId: number) {
        const url = `/connect/organizations/${orgId}/codef/cards/${id}/creditCard/${creditCardId}`;
        return api.patch(url).then(oneDtoOf(CodefCardDto));
    },

    /** 코드에프 결제내역 조회 (카드 등록 및 연동) */
    histories(orgId: number, codefCardId: number, params: FindAllCardHistoryQueryDto = {}) {
        const url = `/connect/organizations/${orgId}/codef/cards/${codefCardId}/histories`;
        return api.get(url, {params}); //.then(paginatedDtoOf(CodefCardDto));
    },
};

export const codefCardAdminApi = {
    index(params: FindAllCardAdminQueryDto) {
        const url = `/admin/codef-cards`;
        return api.get(url, {params}).then(paginatedDtoOf(CodefCardDto));
    },
};
