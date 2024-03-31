import { type ITeam } from '@/shared/model/team.model';

export interface IProject {
  id?: number;
  name?: string | null;
  description?: string | null;
  owner?: ITeam | null;
}

export class Project implements IProject {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public owner?: ITeam | null,
  ) {}
}
