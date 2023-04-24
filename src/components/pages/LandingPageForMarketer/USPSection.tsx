import {memo} from 'react';
import {LandingPageForMarketerCTAButton} from './CTAButton';

interface USPSectionProps {
    imgUrl: string;
    imgWidth?: string;
    title: string;
    desc1?: string;
    desc2?: string;
    direct: 'left' | 'right';
}

export const USPSection = memo((props: USPSectionProps) => {
    const {direct, imgUrl, imgWidth = '60%', title, desc1, desc2} = props;

    return (
        <div className="hero container" style={{minHeight: '80vh'}}>
            <div
                className={`hero-content text-center px-10 sm:text-left justify-between w-full flex-col ${
                    direct === 'left' ? 'sm:flex-row-reverse' : 'sm:flex-row'
                }`}
                data-aos="fade-up"
                data-aos-anchor-placement="center-bottom"
            >
                <img src={imgUrl} className={`sm:w-[${imgWidth}] rounded-lg relative`} />
                <div>
                    <h1 className="text-3xl sm:text-5xl font-bold mb-6" dangerouslySetInnerHTML={{__html: title}} />
                    {desc1 && (
                        <p
                            className="mb-3 sm:text-xl italic text-gray-500 font-light"
                            dangerouslySetInnerHTML={{__html: desc1}}
                        />
                    )}
                    {desc2 && (
                        <p
                            className="mb-10 font-semibold sm:font-normal sm:text-xl text-gray-600"
                            dangerouslySetInnerHTML={{__html: desc2}}
                        />
                    )}
                    <LandingPageForMarketerCTAButton />
                </div>
            </div>
        </div>
    );
});
