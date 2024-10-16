import {memo} from 'react';
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

interface PaginatorProps {
    className?: string;
    currentPage: number;
    totalPage: number;
    onClick: (pageNum: number) => any;
}

export const Paginator = memo((props: PaginatorProps) => {
    const {className = '', currentPage, totalPage, onClick} = props;

    const twoDigitIndex = Math.ceil(currentPage / 10) * 10;
    const startPageNum = twoDigitIndex - 9;
    const endPageNum = totalPage > twoDigitIndex ? twoDigitIndex : totalPage;
    const pageList = Array.from({length: endPageNum - startPageNum + 1}, (v, i) => startPageNum + i);

    return (
        <div className={`btn-group ${className}`}>
            <button className="btn" onClick={() => currentPage !== 1 && onClick(1)}>
                <MdKeyboardDoubleArrowLeft />
            </button>
            <button className="btn" onClick={() => currentPage !== 1 && onClick(currentPage - 1)}>
                <MdKeyboardArrowLeft />
            </button>

            {pageList.map((pageNum, i) => (
                <button
                    key={i}
                    className={`btn ${pageNum === currentPage && 'btn-active'}`}
                    onClick={() => onClick(pageNum)}
                >
                    {pageNum}
                </button>
            ))}

            <button className="btn" onClick={() => currentPage !== totalPage && onClick(currentPage + 1)}>
                <MdKeyboardArrowRight />
            </button>
            <button className="btn" onClick={() => currentPage !== totalPage && onClick(totalPage)}>
                <MdKeyboardDoubleArrowRight />
            </button>
        </div>
    );
});
