import React, {memo, useEffect, useState} from 'react';
import {ContentPanel, ContentPanelInput, ContentPanelList} from '^layouts/ContentLayout';
import {TextInput} from '^components/TextInput';
import {ProfileImageFileInput} from '^components/ProfileImageFileInput';
import {
    ApplicationPrototypeDto,
    CreateApplicationPrototypeRequestDto as CreateDto,
    UpdateApplicationPrototypeRequestDto as UpdateDto,
} from '^types/applicationPrototype.type';
import {UseFormReturn} from 'react-hook-form';

interface LogoImageFormPanelProps {
    proto: ApplicationPrototypeDto | null;
    form: UseFormReturn<CreateDto> | UseFormReturn<UpdateDto>;
}

export const LogoImageFormPanel = memo((props: LogoImageFormPanelProps) => {
    const {proto, form} = props;
    const [faviconUrl, setFaviconUrl] = useState('');
    const [initial, setInitial] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const base = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=`;

    useEffect(() => {
        if (proto) {
            setInitial(proto.name);
            setLogoUrl(proto.image);
        }
        form.setValue('imageFile', undefined);
    }, [proto]);

    return (
        <ContentPanel title="로고 이미지">
            <ContentPanelList>
                <ContentPanelInput title="<도구> Favicon 추출기" text="웹사이트 주소를 넣으면 favicon 을 추출해줍니다.">
                    <input
                        type="text"
                        className="input input-sm input-bordered w-full"
                        onChange={(e) => {
                            const url = e.target.value;
                            setFaviconUrl(base + url);
                        }}
                    />
                    <div className="pt-3">
                        <p className="text-sm mb-2">Result:</p>
                        {faviconUrl && (
                            <div className="flex gap-4 items-end">
                                <img src={faviconUrl} className="w-24 border rounded" />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-accent text-white"
                                    onClick={() => {
                                        form.setValue('image', faviconUrl);
                                        setLogoUrl(faviconUrl);
                                    }}
                                >
                                    아래 입력란에 적용
                                </button>
                            </div>
                        )}
                    </div>
                </ContentPanelInput>

                <ContentPanelInput title="Logo image (URL)" text="로고가 URL 이라면 여기로 입력해주세요.">
                    <TextInput placeholder="ex. https://www.github.com/favicon.ico" {...form.register('image')} />
                </ContentPanelInput>

                <ContentPanelInput title="Logo image (File)" text="로고가 파일이라면 여기로 업로드 해주세요.">
                    <ProfileImageFileInput
                        imageUrl={logoUrl}
                        fallbackLetter={initial}
                        {...form.register('imageFile')}
                        onChange={(e) => {
                            const uploadedFiles = e.target.files as FileList;
                            form.setValue('imageFile', uploadedFiles[0]);
                        }}
                    />
                </ContentPanelInput>
            </ContentPanelList>
        </ContentPanel>
    );
});