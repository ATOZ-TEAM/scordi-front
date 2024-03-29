import React, {memo} from 'react';
import {useRouter} from 'next/router';
import {useCreateFlow} from '^models/Product/hook';
import {useForm} from 'react-hook-form';
import {MobileSection} from '^components/v2/MobileSection';
import {yyyy_mm_dd} from '^utils/dateTime';
import {MobileBottomNav} from '^components/v2/MobileBottomNav';
import {OrgAppIndexPageRoute} from '^pages/orgs/[id]/apps';
import {errorNotify} from '^utils/toast-notify';
import {NewAppCreatedPageRoute} from '^pages/orgs/[id]/apps/new/created';
import {CTAButton} from '^components/v2/ui/buttons/CTAButton';
import {billingHistoryApi} from '^models/BillingHistory/api';
import {CreateBillingHistoryStandAloneRequestDto as CreateDto} from '^models/BillingHistory/type';

type CreateAppFormProps = {};

export const CreateAppForm = memo((props: CreateAppFormProps) => {
    const {} = props;
    const router = useRouter();
    const organizationId = Number(router.query.id) || null;
    const {product: proto, paymentPlan: plan, billingCycle: cycle} = useCreateFlow();
    const form = useForm<CreateDto>();

    const pageLoaded = !!organizationId && !!proto && !!plan && !!cycle;
    if (!pageLoaded) return <></>;

    const onSubmit = (body: CreateDto) => {
        billingHistoryApi
            .create(body)
            .then(({data}) => {
                const {subscription} = data;
                router.push(NewAppCreatedPageRoute.path(organizationId, subscription!.id));
            })
            .catch(errorNotify);
    };

    return (
        <form className="py-5" onSubmit={form.handleSubmit(onSubmit)}>
            <input type="hidden" defaultValue={cycle.id} {...form.register('billingCycleId')} />

            <MobileSection className="mb-5">
                <div className="form-control">
                    <div className="bs-row mx-0">
                        <div className="bs-col-7 px-0">
                            <input
                                type="date"
                                className="input input-bordered w-full"
                                autoComplete="off"
                                required
                                defaultValue={yyyy_mm_dd(new Date())}
                                {...form.register('paidAt')}
                            />
                        </div>
                    </div>
                </div>
            </MobileSection>

            {/*<MobileSection className="mb-5">*/}
            {/*    <div className="form-control">*/}
            {/*        <div className="bs-row mx-0">*/}
            {/*            <div className="bs-col-5 px-0">*/}
            {/*                <input*/}
            {/*                    id="lastPaidAmount"*/}
            {/*                    types="number"*/}
            {/*                    step="0.01"*/}
            {/*                    placeholder="0.01"*/}
            {/*                    className="input input-bordered w-full"*/}
            {/*                    autoComplete="off"*/}
            {/*                    required*/}
            {/*                    {...form.register('paidAmount')}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div className="bs-col px-2 flex items-center">*/}
            {/*                <label htmlFor="lastPaidAmount" className="label">*/}
            {/*                    <span className="label-text">달러</span>*/}
            {/*                </label>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</MobileSection>*/}

            <MobileBottomNav>
                <CTAButton type="submit" text="완료" />
            </MobileBottomNav>
        </form>
    );
});
