import {useTranslation} from 'next-i18next';
import React from 'react';

interface GoogleComplianceDisclosureTagProps {
    feature: 'gmail' | 'admin';
}

export const GoogleComplianceDisclosureTag = (props?: GoogleComplianceDisclosureTagProps) => {
    const feature = props?.feature ?? 'gmail';
    const {t} = useTranslation('google-compliance');
    const assureTextKey = `assure.${feature}`;

    const GooglePolicyLink =
        'https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes';

    return (
        <p className="pb-4 pt-12 sm:pt-0 font-extralight font-sans text-xs">
            {t('description1')}
            <a className="text-xs btn-link" href={GooglePolicyLink}>
                {t('policy')}
            </a>
            {t('description2')}
            <br />
            <br />
            {/*<b>{t(assureTextKey)}</b>*/}
        </p>
    );
};
