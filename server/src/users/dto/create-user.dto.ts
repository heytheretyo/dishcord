export class CreateUserDto {
  readonly discordId: string;
  readonly username: string;
  readonly avatar: string;
  readonly email: string;
  readonly premium: boolean = false;
  readonly role: 'USER' | 'ADMIN' | 'OWNER' = 'USER';
}
