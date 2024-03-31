export interface ITeam {
  id?: number;
  name?: string | null;
  description?: string | null;
}

export class Team implements ITeam {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
  ) {}
}
