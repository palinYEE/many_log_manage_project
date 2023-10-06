import { Faker, ko } from '@faker-js/faker';
import { IUser } from './interface/utils.interface';

const koFaker = new Faker({
  locale: [ko],
});

export function generateRandomLog() {
  const randomNumber = Math.floor(Math.random() * 1000);
  return `this is sample log ${randomNumber}`;
}

export function generateRandomUser(): IUser {
  const userName = koFaker.person.fullName();
  const userEmail = koFaker.internet.email();
  return {
    name: userName,
    email: userEmail,
  };
}
