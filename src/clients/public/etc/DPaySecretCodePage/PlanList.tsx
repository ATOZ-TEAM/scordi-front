import {ScordiPlanDto} from '^models/_scordi/ScordiPlan/type';
import {UseFormReturn} from 'react-hook-form';
import {CreateScordiPaymentWithCustomerKeyRequestDto} from '^models/_scordi/ScordiPayment/type';
import React, {memo, useEffect, useState} from 'react';
import {PlanItem} from '^clients/public/etc/DPaySecretCodePage/PlanItem';

interface PlanListProps {
    plans: ScordiPlanDto[];
    form: UseFormReturn<CreateScordiPaymentWithCustomerKeyRequestDto, any>;
}

export const PlanList = memo((props: PlanListProps) => {
    const {plans, form} = props;
    const [selectedPlanId, setSelectedPlanId] = useState(NaN);

    useEffect(() => {
        if (plans && plans.length) setSelectedPlanId(plans[0].id);
    }, [plans]);

    const onClick = (plan: ScordiPlanDto) => {
        form.setValue('planId', plan.id);
        setSelectedPlanId(plan.id);
    };

    return (
        <div className="flex flex-col gap-2 items-stretch pt-8">
            {plans.map((plan, i) => (
                <PlanItem key={i} plan={plan} selected={plan.id == selectedPlanId} onClick={onClick} />
            ))}
        </div>
    );
});
