import {FindAllInvoiceAccountQueryDto, InvoiceAccountDto} from '^models/InvoiceAccount/type';

import {PagedResourceAtoms, usePagedResource} from '^hooks/usePagedResource';
import {invoiceAccountApi} from '../api';
import {invoiceAccountListAtom, invoiceAccountsInSelectModal, invoiceAccountsOfSubscription} from '../atom';

export const useInvoiceAccounts = () => useInvoiceAccountsV3(invoiceAccountListAtom);

// 구독상세모달에서, 해당 구독에 연결된 인보이스 계정 리스트를 보여줄 때 사용
export const useInvoiceAccountsOfSubscription = () => useInvoiceAccountsV3(invoiceAccountsOfSubscription);

// 인보이스계정 선택 모달에서, 선택할 수 있는 인보이스 계정 리스트를 보여줄 때 사용
export const useInvoiceAccountListInSelectModal = () => useInvoiceAccountsV3(invoiceAccountsInSelectModal);

const useInvoiceAccountsV3 = (
    atoms: PagedResourceAtoms<InvoiceAccountDto, FindAllInvoiceAccountQueryDto>,
    mergeMode = false,
) => {
    return usePagedResource(atoms, {
        useOrgId: true,
        endpoint: (params, orgId) => invoiceAccountApi.index(orgId, params),
        getId: 'id',
        mergeMode,
    });
};
