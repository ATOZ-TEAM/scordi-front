import {CreateInvoiceAccountRequestDto, InvoiceAccountDto} from '^types/invoiceAccount.type';
import {FindAllQueryDto} from '^types/utils/findAll.query.dto';
import {api} from '^api/api';
import {Paginated} from '^types/utils/paginated.dto';

export const getInvoiceAccounts = (organizationId: number, params?: FindAllQueryDto<InvoiceAccountDto>) => {
    return api.get<Paginated<InvoiceAccountDto>>(`/organizations/${organizationId}/invoice_accounts`, {params});
};

export const draftInvoiceAccount = (data: CreateInvoiceAccountRequestDto) => {
    return api.post<InvoiceAccountDto>(`/organizations/0/invoice_accounts/draft`, data);
};

export const createInvoiceAccount = (organizationId: number, data: CreateInvoiceAccountRequestDto) => {
    return api.post<InvoiceAccountDto>(`/organizations/${organizationId}/invoice_accounts`, data);
};

export const deleteInvoiceAccount = (organizationId: number, id: number) => {
    return api.delete(`/organizations/${organizationId}/invoice_accounts/${id}`);
};