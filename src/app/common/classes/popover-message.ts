import { Message } from './message';
import { IPopoverMessage } from '../models/popover-message.model';

/**
 * класс для всплывающих сообщений
 */
export class PopoverMessage extends Message implements IPopoverMessage {

  title = '';
  isDanger = false;

  constructor(data?: IPopoverMessage) {
    super();

    if (!data) {
      return;
    }

    Object.assign(this, data);
  }

}
