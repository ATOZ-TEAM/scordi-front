import {memo, useEffect, useState} from 'react';
import {ProductDto, FindAllProductQuery} from '^types/product.type';
import {Paginated} from '^types/utils/paginated.dto';
import {AdminListPageLayout} from '^components/pages/admin/layouts/ListPageLayout';
import {CardTablePanel} from '^components/pages/admin/share/panels/CardTablePanel';
import {productApi} from '^api/product.api';
import {AdminNewPrototypePageRoute} from '^pages/admin/prototypes/new';
import {DefaultColumn} from '^components/pages/admin/prototypes/AdminPrototypeListPage/columns/DefaultColumn';
import {ImageColumn} from '^components/pages/admin/prototypes/AdminPrototypeListPage/columns/ImageColumn';
import {MobileItem} from '^components/pages/admin/prototypes/AdminPrototypeListPage/columns/MobileItem';
import {ActionColumn} from '^components/pages/admin/prototypes/AdminPrototypeListPage/columns/ActionColumn';

export const AdminPrototypeListPage = memo(() => {
    const [listPage, setListPage] = useState<Paginated<ProductDto>>({
        items: [],
        pagination: {
            totalItemCount: 0,
            currentItemCount: 0,
            totalPage: 0,
            currentPage: 0,
            itemsPerPage: 0,
        },
    });

    const fetchData = (params: FindAllProductQuery) => {
        params.order = {id: 'DESC'};
        productApi.index(params).then((res) => setListPage(res.data));
    };

    useEffect(() => {
        fetchData({});
    }, []);

    return (
        <AdminListPageLayout
            title="앱 목록"
            breadcrumbs={[
                {text: '앱 관리'},
                {text: '앱 목록'},
                //
            ]}
            createPageRoute={AdminNewPrototypePageRoute.path()}
            //
        >
            <div className="container pt-10 px-2 sm:px-8">
                <div className="w-full">
                    <CardTablePanel
                        gridClass="grid-cols-1 lg:grid-cols-8"
                        entries={listPage.items}
                        columns={[
                            // XS
                            {
                                th: '',
                                className: 'block lg:hidden',
                                render: (prototype) => <MobileItem prototype={prototype} fetchData={fetchData} />,
                            },

                            // LG
                            {
                                th: '',
                                className: 'hidden lg:block',
                                render: (prototype) => <ImageColumn prototype={prototype} />,
                            },
                            {
                                th: 'name',
                                className: 'hidden lg:block',
                                render: (prototype) => <DefaultColumn value={prototype.name} />,
                            },
                            {
                                th: 'category',
                                className: 'hidden lg:block',
                                render: (prototype) => (
                                    <DefaultColumn
                                        value={prototype.tags ? prototype.tags.map((tag) => tag.name).join(', ') : ''}
                                    />
                                ),
                            },
                            {
                                th: 'summary',
                                className: 'hidden lg:block',
                                render: (prototype) => <DefaultColumn value={prototype.tagline} />,
                            },
                            {
                                th: 'homepage',
                                className: 'hidden lg:block',
                                render: (prototype) => <DefaultColumn value={prototype.homepageUrl} />,
                            },
                            {
                                th: '',
                                className: 'hidden lg:block',
                                render: (prototype) => <ActionColumn prototype={prototype} fetchData={fetchData} />,
                            },
                        ]}
                        pagination={listPage.pagination}
                        pageMove={(page) => fetchData({page})}
                    />
                </div>
            </div>
        </AdminListPageLayout>
    );
});
