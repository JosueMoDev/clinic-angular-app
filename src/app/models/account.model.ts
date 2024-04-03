
export class Account {
  constructor(
    public id: string,
    public duiNumber: string,
    public email: string,
    public name: string,
    public lastname: string,
    public gender: string,
    public phone: string,
    public isValidated: boolean,
    public role: string,
    public photoUrl?: string
  ) {}
}