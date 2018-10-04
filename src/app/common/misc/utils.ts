import { IPluralCase } from '../interfaces/plural-case.interface';

export namespace Utils {

  /**
   * строит строку варианта произношения числительного
   * @param val цифровое значение показателя
   * @param opts варианты произношения
   * @param simple признак необходимости вывода простой строки, без числительного
   */
  export const pluralCase = (val: number, opts: IPluralCase, simple: boolean = false): string => {
    const firstPart: string = simple ?
    '' :
    `${val} `;
    if (isNaN(val) || (!val && val !== 0)) {
      return firstPart;
    }

    const inString: string = val.toString();
    const lastNum: number = +inString.charAt(inString.length - 1);
    if ((val >= 5 && val < 21)) {
      return `${firstPart}${opts.fromFive}`;
    } else if (lastNum > 1 && lastNum < 5) {
      return `${firstPart}${opts.fromTwoToFour}`;
    } else if (lastNum >= 5 || lastNum === 0) {
      return `${firstPart}${opts.fromFive}`;
    } else {
      return `${firstPart}${opts.one}`;
    }
  };

  /**
   * генерирует случайную строку символов
   * @param ln размерность требуемой строки
   */
  export const randomString = (ln: number = 6): string => {
    return Math.round((Math.pow(36, ln + 1) - Math.random() * Math.pow(36, ln))).toString(36).slice(1);
  };

  /**
   * округление до сотых
   * @param val число
   */
  export const roundingToHundredths = (val: number): number => Math.round(val * 100) / 100;

  /**
   * замена пустых значений в объекте на null
   * @param data объект данных
   */
  export const emptyToNull = (data: any = {}): any => {
    const strData: string = JSON.stringify(data);
    return JSON.parse(strData.replace(/:\"\"/g, ':null'));
  };

}
