import { IMessage } from './message.model';

/**
 * модель всплывающих сообщений
 */
export interface IPopoverMessage extends IMessage {

  /**
   * заголовок сообщения
   */
  title?: string;

  /**
   * признак сообщение-предупреждение
   */
  isDanger?: boolean;

}
