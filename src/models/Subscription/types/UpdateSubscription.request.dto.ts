import {ConnectStatus} from './ConnectStatus';
import {CreateSubscriptionRequestDto} from './CreateSubscription.request.dto';
import {PartialType} from '^types/utils/partial-type';
import {OmitType} from '^types/utils/omit-type';

export class UpdateSubscriptionRequestDto extends PartialType(
    OmitType(CreateSubscriptionRequestDto, ['organizationId', 'productId']),
) {
    connectStatus?: ConnectStatus; // 연동상태
    isActive?: boolean; // 활성화 여부
}
