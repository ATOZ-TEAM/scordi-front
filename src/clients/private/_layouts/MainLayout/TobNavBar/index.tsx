import {memo} from 'react';
import {BsCreditCardFill, BsPeopleFill, BsPersonLinesFill} from 'react-icons/bs';
import {FaReceipt} from 'react-icons/fa6';
import {useCurrentOrg2} from '^models/Organization/hook';
import {OrgMainPageRoute} from '^pages/orgs/[id]';
import {OrgAppIndexPageRoute} from '^pages/orgs/[id]/apps';
import {TopNavBarItem} from './TopNavBarItem';
import {TopNavBarDropdownItem} from './TopNavBarDropdownItem';
import {TopNavBarDropdownContent} from './TopNavBarDropdownContent';

interface TobNavBarProps {
    //
}

export const TobNavBar = memo((props: TobNavBarProps) => {
    const {} = props;
    const {currentOrg} = useCurrentOrg2();

    if (!currentOrg) return <></>;

    return (
        <div className="container-fluid h-[52px] flex items-stretch justify-center py-0 border-b bg-white-blurred">
            <TopNavBarItem name="홈" active={true} href={OrgMainPageRoute.path(currentOrg.id)} />
            <TopNavBarItem name="구독" active={false} href={OrgAppIndexPageRoute.path(currentOrg.id)} />
            <TopNavBarItem name="팀" active={false}>
                <TopNavBarDropdownContent>
                    <TopNavBarDropdownItem name="팀 목록" href="" Icon={BsPersonLinesFill} />
                    <TopNavBarDropdownItem name="구성원" href="" Icon={BsPeopleFill} />
                </TopNavBarDropdownContent>
            </TopNavBarItem>
            <TopNavBarItem name="자산" active={false}>
                <TopNavBarDropdownContent>
                    <TopNavBarDropdownItem name="결제수단" href="" Icon={BsCreditCardFill} />
                    <TopNavBarDropdownItem name="청구서수신메일" href="" Icon={FaReceipt} />
                </TopNavBarDropdownContent>
            </TopNavBarItem>
            <TopNavBarItem name="설정" active={false} />
        </div>
    );
});
TobNavBar.displayName = 'TobNavBar';