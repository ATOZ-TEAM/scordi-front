import {memo} from 'react';
import {useId} from 'react-id-generator';
import {AiOutlinePlus} from '@react-icons/all-files/ai/AiOutlinePlus';
import {ReactNodeElement} from '^types/global.type';

interface QuestionItemProps {
    question: ReactNodeElement;
    answer: ReactNodeElement;
}

export const QuestionItem = memo(function QuestionItem(props: QuestionItemProps) {
    const {question, answer} = props;
    const id = useId();
    const inputId = `qna-${id}`;

    return (
        <li>
            <input id={inputId} type="checkbox" hidden defaultChecked={true} />
            <label htmlFor={inputId}>
                <p className="question">{question}</p>
                <div className="icon-wrapper">
                    <AiOutlinePlus size={30} />
                </div>
            </label>
            <div className="answer-wrapper">
                <pre>{answer}</pre>
            </div>
        </li>
    );
});
