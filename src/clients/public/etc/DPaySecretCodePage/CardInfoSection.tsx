import React, {memo, useState} from 'react';
import {UseFormReturn} from 'react-hook-form';
import cn from 'classnames';
import {WithChildren} from '^types/global.type';
import {DPayRequestFormDto} from '^models/_scordi/ScordiPayment/type';
import {usePostDirectPay} from '^models/_scordi/ScordiPayment/hook';
import {FormCardNumber} from './FormCardNumber';
import {FormExpiryDate} from './FormExpiryDate';
import {FormBirthDay} from './FormBirthDay';
import {FormBusinessNumber} from './FormBusinessNumber';
import {FormCardPassword} from './FormCardPassword';
import {emailValid} from '^utils/input-helper';
import {CTAButton} from './CTAButton';

interface CardInfoSectionProps extends WithChildren {
    prevStep: () => void;
    form: UseFormReturn<DPayRequestFormDto, any>;
}

export const CardInfoSection = memo((props: CardInfoSectionProps) => {
    const {form, prevStep, children} = props;
    const {register, watch} = form;
    const {errors} = form.formState;
    const [isPersonal, setIsPersonal] = useState(true);
    const {isPending} = usePostDirectPay();

    const checkValid = (data: DPayRequestFormDto) => {
        if (!data.planId) return false;
        if ((data.customerName || '').length < 2) return false;
        if (!emailValid(data.customerEmail || '')) return false;
        if ((data.customerPhone || '').length < 10 || (data.customerPhone || '').length > 11) return false;
        if ((data.cardNumberFirst || '').length !== 4) return false;
        if ((data.cardNumberSecond || '').length !== 4) return false;
        if ((data.cardNumberThird || '').length !== 4) return false;
        if (![4, 5].includes((data.cardNumberFourth || '').length)) return false;
        if ((data.cardExpirationMonth || '').length !== 2) return false;
        if ((data.cardExpirationYear || '').length !== 2) return false;
        if ((data.cardPassword || '').length !== 2) return false;
        if (!data.agree) return false;
        if (![6, 10].includes((data.customerIdentityNumber || '').length)) return false;

        return true;
    };

    const isValid = checkValid(watch());

    return (
        <article className="p-8 flex flex-col sm:flex-row gap-8 sm:gap-16 h-full">
            <section className="w-full sm:w-1/3">{children}</section>

            <section className="w-full sm:w-2/3 h-full">
                <div className="flex flex-col h-full justify-between text-sm">
                    <section className="flex flex-col gap-5">
                        <article className="flex flex-col">
                            <div className="flex items-center gap-8 sm:gap-8">
                                <label key="개인카드" className="flex gap-1.5" onClick={() => setIsPersonal(true)}>
                                    <input
                                        type="radio"
                                        key="개인카드"
                                        className="mr-2 hidden"
                                        defaultChecked={isPersonal}
                                        name="isPersonal"
                                    />
                                    <div className="flex items-center justify-center w-6 h-6">
                                        <div
                                            className={cn('w-5 h-5 rounded-full flex items-center justify-center', {
                                                'bg-blue-600': isPersonal,
                                                'bg-white border-2 border-gray-200 ': !isPersonal,
                                            })}
                                        >
                                            <div
                                                className={cn('w-[10px] h-[10px]  rounded-full', {
                                                    'bg-white': isPersonal,
                                                    'bg-gray-200': !isPersonal,
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <p className="whitespace-normal w-full">개인카드</p>
                                </label>
                                <label key="법인카드" className="flex gap-1.5" onClick={() => setIsPersonal(false)}>
                                    <input
                                        type="radio"
                                        key="법인카드"
                                        className="mr-2 hidden"
                                        defaultChecked={!isPersonal}
                                        name="isPersonal"
                                    />
                                    <div className="flex items-center justify-center w-6 h-6">
                                        <div
                                            className={cn('w-5 h-5 rounded-full flex items-center justify-center', {
                                                'bg-blue-600 ': !isPersonal,
                                                'bg-white border-2 border-gray-200 ': isPersonal,
                                            })}
                                        >
                                            <div
                                                className={cn('w-[10px] h-[10px]  rounded-full', {
                                                    'bg-white': !isPersonal,
                                                    'bg-gray-200': isPersonal,
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <p className="whitespace-normal w-full">법인카드</p>
                                </label>
                            </div>
                            <div className="h-2 mb-4 sm:mt-1">
                                {!isPersonal && (
                                    <p className="text-gray-400">
                                        개인 명의의 법인 카드일 경우 개인 카드로 등록해주세요
                                    </p>
                                )}
                            </div>
                        </article>
                        <FormCardNumber form={form} />
                        <FormExpiryDate form={form} />
                        <FormCardPassword form={form} />
                        {isPersonal ? <FormBirthDay register={register} /> : <FormBusinessNumber register={register} />}
                    </section>
                    <div className="mt-10">
                        <label className="mb-6">
                            <input type="checkbox" {...register('agree', {required: true})} />
                            <span className="ml-2">[필수] 서비스 이용 약관, 개인정보 처리 동의</span>
                        </label>

                        {isPending ? (
                            <section className="mt-6">
                                <CTAButton text="결제 요청 중 ..." disabled />
                            </section>
                        ) : (
                            <section className="flex gap-2 mt-6">
                                <CTAButton text="이전" onClick={prevStep} />
                                <CTAButton text="결제하기" type="submit" disabled={!isValid} />
                            </section>
                        )}
                    </div>
                </div>
            </section>
        </article>
    );
});
