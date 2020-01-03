import { IsDefined } from 'class-validator';

export class PasswordChangeDto {
  @IsDefined()
  username: string;
  @IsDefined()
  password: string;
  @IsDefined()
  newPassword: string;
  constructor(username: string, password: string, newPassword: string) {
    this.username = username;
    this.password = password;
    this.newPassword = newPassword;
  }
}
