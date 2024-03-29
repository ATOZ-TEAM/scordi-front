import {memo} from 'react';
import {WithChildren} from '^types/global.type';
import {SubscriptionDto} from 'src/models/Subscription/types';
import {OutLink} from '^components/OutLink';
import {BsArrowRightShort, BiCreditCard, MdOutlineEmail} from '^components/react-icons';
import {IoWarningOutline} from 'react-icons/io5';

interface PaymentInfoProps {
    subscription: SubscriptionDto;
}

export const PaymentInfo = memo((props: PaymentInfoProps & WithChildren) => {
    const {subscription, children} = props;

    const {product} = subscription;

    const {workspace, billingEmail} = subscription;
    const {slug} = workspace || {};
    const paymentInfoUrl = eval(`\`${product.billingInfoPageUrlScheme}\``) as string;
    const updatePaymentMethodUrl = eval(`\`${product.updatePayMethodUrlScheme}\``) as string;
    const open = (url: string) => (url ? window.open(url, '_blank') : alert('This service linkage is not ready :('));

    return (
        <>
            <div className="stat-figure">
                <BiCreditCard size={36} />
            </div>
            <div className="stat-title mb-2">
                <OutLink
                    href={paymentInfoUrl}
                    icon={
                        <span className="text-gray-900">
                            <BsArrowRightShort size={18} />
                        </span>
                    }
                >
                    <span className="text-gray-900">Payment information</span>
                </OutLink>
            </div>

            <div className="stat-desc">
                <p className="flex items-center gap-2">
                    <MdOutlineEmail size={18} />
                    <span>{billingEmail || 'Email not set'}</span>
                </p>
            </div>

            <div className="stat-actions">
                <button
                    className="btn btn-xs gap-2 capitalize btn-error items-center text-white"
                    onClick={() => open(updatePaymentMethodUrl)}
                >
                    <IoWarningOutline size={14} strokeWidth="2" />
                    <span>Update payment method</span>
                </button>
            </div>
        </>
    );
});
