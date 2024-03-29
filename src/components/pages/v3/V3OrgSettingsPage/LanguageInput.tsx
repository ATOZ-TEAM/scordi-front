import React, {memo, useCallback} from 'react';
import {SelectDropdown, SelectOptionProps} from '^v3/share/Select';
import {FormControl} from '^v3/V3OrgSettingsPage/InputText';
import {useCurrentUser} from '^models/User/hook';
import {locales} from '^utils/locale-helper';
import {userApi} from '^models/User/api/session';

export const LanguageInput = memo(() => {
    const {currentUser} = useCurrentUser(null, {
        orgIdParam: 'orgId',
    });

    const onChange = useCallback(
        (opt: SelectOptionProps) => {
            const selectedLocale = locales.find((loc) => loc.code === opt.value)!;
            console.log(selectedLocale);

            userApi.registration.update({locale: selectedLocale.code});
        },
        [locales],
    );

    if (!currentUser) return <></>;

    return (
        <FormControl label="언어 설정">
            <SelectDropdown
                placeholder="언어를 선택해주세요."
                options={locales.map((locale) => ({
                    value: locale.code,
                    text: locale.text,
                    selected: currentUser.locale === locale.code,
                }))}
                onChange={onChange}
            />
        </FormControl>
    );
});
