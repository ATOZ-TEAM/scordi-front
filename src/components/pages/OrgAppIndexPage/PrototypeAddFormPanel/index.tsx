import {ForwardedRef, forwardRef, HTMLInputTypeAttribute, InputHTMLAttributes, memo, useCallback} from 'react';
import {ContentPanel} from '^layouts/ContentLayout';
import {useForm} from 'react-hook-form';
import {ApplyToAddDto, CreateApplicationPrototypeRequestDto} from '^types/applicationPrototype.type';
import {Input} from 'postcss';
import {createApplicationPrototype} from '^api/applicationPrototype.api';
import {FormControlInput} from '^layouts/ContentLayout/FormControlInput';

export const PrototypeAddFormPanel = memo(() => {
    const applyForm = useForm<ApplyToAddDto>();
    const createForm = useForm<CreateApplicationPrototypeRequestDto>();

    const onCreateFormSubmit = useCallback((data: CreateApplicationPrototypeRequestDto) => {
        console.log(data);
        // createApplicationPrototype(data).then((res) => {
        //     res.data;
        // });
    }, []);

    return (
        <ContentPanel title={'직접추가'}>
            <form onSubmit={createForm.handleSubmit(onCreateFormSubmit)}>
                <FormControlInput
                    type="text"
                    labelTop="App Name"
                    placeholder="ex. Github"
                    {...createForm.register('name')}
                    required
                />
                <FormControlInput
                    type="text"
                    labelTop="Tagline"
                    placeholder="ex. Github"
                    {...createForm.register('tagline')}
                />
                <FormControlInput
                    type="url"
                    labelTop="Website URL"
                    placeholder="ex. https://www.github.com"
                    {...createForm.register('homepageUrl')}
                />
                <FormControlInput
                    type="url"
                    labelTop="Logo image"
                    placeholder="ex. https://www.github.com/favicon.ico"
                    {...createForm.register('image')}
                />
                <FormControlInput
                    type="url"
                    labelTop="Pricing URL"
                    placeholder="ex. https://www.github.com"
                    {...createForm.register('pricingPageUrl')}
                />
                <div className="pt-4">
                    <button className="btn btn-primary">save</button>
                </div>
            </form>
        </ContentPanel>
    );
});