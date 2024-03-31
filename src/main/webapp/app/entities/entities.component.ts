import { defineComponent, provide } from 'vue';

import ProjectService from './project/project.service';
import LabelService from './label/label.service';
import TeamService from './team/team.service';
import MemberService from './member/member.service';
import TicketService from './ticket/ticket.service';
import UserService from '@/entities/user/user.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Entities',
  setup() {
    provide('userService', () => new UserService());
    provide('projectService', () => new ProjectService());
    provide('labelService', () => new LabelService());
    provide('teamService', () => new TeamService());
    provide('memberService', () => new MemberService());
    provide('ticketService', () => new TicketService());
    // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
  },
});
