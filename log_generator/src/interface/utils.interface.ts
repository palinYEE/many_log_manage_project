import { USER_DATA_SET } from './../data/user.data';
import { PAGE } from './../data/page.data';
import { USER_ACTION } from '../data/user_action.data';

export interface IUserAction {
  page: (typeof PAGE)[number];
  name: (typeof USER_DATA_SET)[number];
  action: (typeof USER_ACTION)[number];
  time: string;
}
