import React from 'react';

interface OrgMainLayoutFooterProps {}

export function OrgMainLayoutFooter({}: OrgMainLayoutFooterProps) {
  return (
    <footer className="bs-row mx-0 px-6 py-4 items-center border-t border-t-[#dbd6e1] bg-neutral text-sm text-gray-500">
      <div className="bs-col px-0 flex justify-start gap-4">
        <a className={'text-xs'} href="#">
          이용약관
        </a>
        <a className={'text-xs'} href="#">
          개인정보 처리방침
        </a>
      </div>
      <div className="px-0 text-center font-bold text-lg text-black">
        Payplo
      </div>
      <div className="bs-col px-0 flex justify-end gap-4">
        {/*<a href="#">Service Status</a>*/}
        {/*<a href="#">API</a>*/}
        {/*<a href="#">Docs</a>*/}
        {/*<a href="#">Contribute</a>*/}
      </div>
    </footer>
  );
}
