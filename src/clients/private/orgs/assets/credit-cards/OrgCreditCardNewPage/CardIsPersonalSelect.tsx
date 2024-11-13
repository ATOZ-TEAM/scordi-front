import React, {memo} from 'react';
import {FormControl} from '^clients/private/_components/inputs/FormControl';
import {UnderlineDropdownSelect} from '^clients/private/_components/inputs/UnderlineDropdownSelect';
import {IsPersonalTag} from '^models/CreditCard/components';
import {CardAttrSelectPropsType} from './CardAttrSelectProps.type';

export const CardIsPersonalSelect = memo((props: CardAttrSelectPropsType<boolean>) => {
    const {defaultValue, onChange, isLoading = false} = props;

    return (
        <FormControl label="구분">
            <UnderlineDropdownSelect
                name="isPersonal"
                defaultValue={defaultValue ?? undefined}
                options={[true, false]}
                toComponent={(isPersonal: boolean) => <IsPersonalTag value={isPersonal} />}
                onChange={onChange}
                className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            />
        </FormControl>
    );
});
CardIsPersonalSelect.displayName = 'CardIsPersonalSelect';
