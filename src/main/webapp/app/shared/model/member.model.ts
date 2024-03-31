export interface IMember {
  id?: number;
  nickName?: string | null;
}

export class Member implements IMember {
  constructor(
    public id?: number,
    public nickName?: string | null,
  ) {}
}
