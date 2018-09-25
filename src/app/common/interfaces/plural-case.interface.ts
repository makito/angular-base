/**
 * интерфейс для описания вариантов произношения
 */
export interface IPluralCase {

  /**
   * для одного
   */
  one: string;

  /**
   * от двух до четырёх
   */
  fromTwoToFour: string;

  /**
   * от пяти
   */
  fromFive: string;

}
