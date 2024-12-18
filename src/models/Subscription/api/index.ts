import {
    SubscriptionDto,
    CreateSubscriptionByInvoicesRequestDto,
    CreateSubscriptionRequestDto,
    FindAllSubscriptionsQuery,
    FindOneSubscriptionQueryDto,
    UpdateSubscriptionRequestDto,
    CreateSubscriptionRequestDto2,
} from 'src/models/Subscription/types';
import {api} from '^api/api';
import {Paginated} from '^types/utils/paginated.dto';
import {oneDtoOf, paginatedDtoOf} from '^types/utils/response-of';
import {downloadBlobFromAxios} from '^utils/Blob';

const NAMESPACE = 'subscriptions';

export const createSubscription = (dto: CreateSubscriptionRequestDto) => {
    return api.post<SubscriptionDto>(`/${NAMESPACE}`, dto).then(oneDtoOf(SubscriptionDto));
};

export const subscriptionApi = {
    index: (params?: FindAllSubscriptionsQuery) => {
        const url = `/${NAMESPACE}`;
        return api.get<Paginated<SubscriptionDto>>(url, {params}).then(paginatedDtoOf(SubscriptionDto));
    },

    // 구독 조회 - 결과 다운로드
    download: (params?: FindAllSubscriptionsQuery, filename?: string) => {
        const url = `/${NAMESPACE}/download/xlsx`;
        return api
            .get(url, {params, responseType: 'blob'})
            .then(downloadBlobFromAxios(`${filename || '구독 조회 - 결과 다운로드'}.xls`));
    },

    show: (id: number, params?: FindOneSubscriptionQueryDto) => {
        const url = `/${NAMESPACE}/${id}`;
        return api.get<SubscriptionDto>(url, {params}).then(oneDtoOf(SubscriptionDto));
    },

    create: (dto: CreateSubscriptionRequestDto) => {
        return api.post<SubscriptionDto>(`/${NAMESPACE}`, dto).then(oneDtoOf(SubscriptionDto));
    },

    create2: (workspaceId: number, productId: number, dto: CreateSubscriptionRequestDto2) => {
        return api
            .post<SubscriptionDto>(`/${NAMESPACE}`, {workspaceId, productId, dto})
            .then(oneDtoOf(SubscriptionDto));
    },

    update: (id: number, data: UpdateSubscriptionRequestDto) => {
        const url = `/subscriptions/${id}`;
        return api.patch<SubscriptionDto>(url, data).then(oneDtoOf(SubscriptionDto));
    },

    destroy: (id: number) => {
        const url = `/${NAMESPACE}/${id}`;
        return api.delete<Omit<SubscriptionDto, 'id'>>(url);
    },

    createByInvoice: (data: CreateSubscriptionByInvoicesRequestDto) => {
        const url = `/${NAMESPACE}/byInvoices`;
        return api.post<SubscriptionDto>(url, data).then(oneDtoOf(SubscriptionDto));
    },
};
