<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="ticket">
        <h2 class="jh-entity-heading" data-cy="ticketDetailsHeading">
          <span v-text="t$('bugTrackerJhipsterApp.ticket.detail.title')"></span> {{ ticket.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.ticket.title')"></span>
          </dt>
          <dd>
            <span>{{ ticket.title }}</span>
          </dd>
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.ticket.description')"></span>
          </dt>
          <dd>
            <span>{{ ticket.description }}</span>
          </dd>
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.ticket.dueDate')"></span>
          </dt>
          <dd>
            <span>{{ ticket.dueDate }}</span>
          </dd>
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.ticket.done')"></span>
          </dt>
          <dd>
            <span>{{ ticket.done }}</span>
          </dd>
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.ticket.newEntity')"></span>
          </dt>
          <dd>
            <span>{{ ticket.newEntity }}</span>
          </dd>
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.ticket.someInfo')"></span>
          </dt>
          <dd>
            <span>{{ ticket.someInfo }}</span>
          </dd>
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.ticket.project')"></span>
          </dt>
          <dd>
            <div v-if="ticket.project">
              <router-link :to="{ name: 'ProjectView', params: { projectId: ticket.project.id } }">{{ ticket.project.name }}</router-link>
            </div>
          </dd>
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.ticket.assignedTo')"></span>
          </dt>
          <dd>
            {{ ticket.assignedTo ? ticket.assignedTo.login : '' }}
          </dd>
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.ticket.label')"></span>
          </dt>
          <dd>
            <span v-for="(label, i) in ticket.labels" :key="label.id"
              >{{ i > 0 ? ', ' : '' }}
              <router-link :to="{ name: 'LabelView', params: { labelId: label.id } }">{{ label.label }}</router-link>
            </span>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.back')"></span>
        </button>
        <router-link v-if="ticket.id" :to="{ name: 'TicketEdit', params: { ticketId: ticket.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.edit')"></span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ticket-details.component.ts"></script>
