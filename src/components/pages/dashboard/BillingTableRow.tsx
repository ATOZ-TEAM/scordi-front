import { Badge } from '^components/Badge';
import { GrowthText } from '^components/GrowthText';
import { useRouter } from 'next/router';
import { ApplicationDto, ConnectStatus, t_ConnectStatus } from '^types/application.type';
import { useEffect } from 'react';
import { PaymentCycle, t_BillingCycleTerm } from '^types/applicationBillingCycle.type';

interface BillingTableRowProps {
  app: ApplicationDto;
}

export const BillingTableRow = (props: BillingTableRowProps) => {
  const { app } = props;
  const router = useRouter();
  const organizationId = Number(router.query.id);
  const { prototype, paymentPlan, billingCycle } = app;

  const onEditBtnClick = () => {

  };

  useEffect(() => {
    console.log(1, app);
  }, []);

  return (
    <tr>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={prototype.image} alt={`${prototype.name} logo`} />
            </div>
          </div>
          <div>
            <div className="font-bold">{prototype.name}</div>
          </div>
        </div>
      </td>
      <td>{paymentPlan.name}</td>
      <td>
        <Badge paymentCycle={t_BillingCycleTerm(billingCycle.term, true) as PaymentCycle} />
      </td>
      <td>
        15일 남음
        <br />
        <span className="text-sm text-gray-500">6월 23일 결제예정</span>
      </td>
      <td>
        {(10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}명
      </td>
      <td>
        {/* 결제 완료시 */}
        {/* <p>{(156000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    원</p> */}

        {/* 결제 전 */}
        <p className="text-gray-500">
          {(156000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          원 (결제전)
        </p>
      </td>
      <td>
        <GrowthText number={15} />
        <span className="text-sm text-gray-500">
          {(156000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </span>
      </td>
      <td>{t_ConnectStatus(app.connectStatus)}</td>
      <th>
        <button className="btn btn-ghost btn-xs" onClick={onEditBtnClick}>Edit</button>
      </th>
    </tr>
  )
}
