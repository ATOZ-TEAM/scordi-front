import React, {memo} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {orgIdParamState} from '^atoms/common';
import {ListPage} from '^clients/private/_components/rest-pages/ListPage';
import {useInvoiceAccounts} from '^models/InvoiceAccount/hook';
import {debounce} from 'lodash';
import {ListTable, ListTableContainer} from '^clients/private/_components/table/ListTable';
import {InvoiceAccountTableHeader} from './InvoiceAccountTableHeader';
import {InvoiceAccountTableRow} from './InvoiceAccountTableRow';
import {AddInvoiceAccountDropdown} from './AddInvoiceAccountDropdown';
import {InvoiceAccountAutoCreateModal} from '^clients/private/orgs/subscriptions/OrgSubscriptionConnectsPage/ContentFunnels/inputs/InvoiceAccountSelect/InvoiceAccountAutoCreateModal';
import {isInvoiceAccountAutoCreateModalAtom} from './atom';
import {toast} from 'react-hot-toast';

export const OrgInvoiceAccountListPage = memo(function OrgInvoiceAccountListPage() {
    const organizationId = useRecoilValue(orgIdParamState);
    const {
        search,
        reset,
        reload,
        result,
        isLoading,
        isNotLoaded,
        isEmptyResult,
        query,
        movePage,
        changePageSize,
        orderBy,
    } = useInvoiceAccounts();
    const [isCreateModalOpened, setCreateModalOpen] = useRecoilState(isInvoiceAccountAutoCreateModalAtom);

    const onReady = () => {
        search({
            where: {organizationId},
            relations: ['subscriptions', 'googleTokenData', 'holdingMember', 'teams'],
            order: {id: 'DESC'},
        });
    };

    const onSearch = debounce((keyword?: string) => {
        return search({
            ...query,
            keyword: keyword || undefined,
            page: 1,
            itemsPerPage: 30,
        });
    }, 500);

    return (
        <ListPage
            onReady={onReady}
            onUnmount={() => reset()}
            breadcrumb={['자산', {text: '청구서 수신 메일', active: true}]}
            titleText="청구서 수신 메일"
            Buttons={AddInvoiceAccountDropdown}
            ScopeHandler={undefined}
            searchInputPlaceholder="검색어를 입력해주세요"
            onSearch={onSearch}
        >
            <ListTableContainer
                pagination={result.pagination}
                movePage={movePage}
                changePageSize={changePageSize}
                unit="개"
                // Empty State Props
                isNotLoaded={isNotLoaded}
                isLoading={isLoading}
                isEmptyResult={isEmptyResult}
                emptyMessage="조회된 청구서 수신 메일이 없어요."
                EmptyButtons={AddInvoiceAccountDropdown}
            >
                <ListTable
                    items={result.items}
                    isLoading={isLoading}
                    Header={() => <InvoiceAccountTableHeader orderBy={orderBy} />}
                    Row={({item}) => <InvoiceAccountTableRow invoiceAccount={item} reload={reload} />}
                />
            </ListTableContainer>

            <InvoiceAccountAutoCreateModal
                isOpened={isCreateModalOpened}
                onClose={() => setCreateModalOpen(false)}
                onCreate={() => {
                    toast.success('계정을 저장했어요');
                    setCreateModalOpen(false);
                    return reload();
                }}
                onRetry={() => setCreateModalOpen(true)}
            />
        </ListPage>
    );
});
