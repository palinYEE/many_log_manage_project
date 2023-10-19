import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// {"name":"강 기범","page":"하의 구매 페이지","action":"클릭","time":"2023-10-19T12:28:15.731Z"}
@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  page: string;

  @Column()
  action: string;

  @Column()
  time: Date;
}
