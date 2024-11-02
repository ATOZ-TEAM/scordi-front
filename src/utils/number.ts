/**
 * Number
 */

export const currencyFormat = (num: number, unit = '원', format = '%n%u'): string => {
    return `${format || '%n%u'}`.replace('%u', unit).replace('%n', Number(num).toLocaleString());
};

// 반올림
export const roundNumber = (num: number, pos = 0): number => {
    return Math.round(num * 10 ** pos) / 10 ** pos;
};

// 올림
export const ceilNumber = (num: number, pos = 0): number => {
    return Math.ceil(num * 10 ** pos) / 10 ** pos;
};

// 버림
export const floorNumber = (num: number, pos = 0): number => {
    return Math.floor(num * 10 ** pos) / 10 ** pos;
};

// Zero padding
export const zeroPad = (num: string): string => (num.length == 1 ? `0${num}` : num);

/**
 * To Percentage : 0.15679 -> 15.68 (pos = 2)
 * - !NOTE: toFixed(pos) 가 필요하면 밖에서 따로 할 것.
 * @param num
 * @param pos
 */
export const floatToPercent = (num: number, pos = 2): number => {
    return roundNumber(num * 100, pos);
};
