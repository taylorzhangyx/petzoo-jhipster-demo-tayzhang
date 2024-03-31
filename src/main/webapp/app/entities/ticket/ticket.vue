<template>
  <div>
    <h2 id="page-heading" data-cy="TicketHeading">
      <span v-text="t$('bugTrackerJhipsterApp.ticket.home.title')" id="ticket-heading"></span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="t$('bugTrackerJhipsterApp.ticket.home.refreshListLabel')"></span>
        </button>
        <router-link :to="{ name: 'TicketCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-ticket"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="t$('bugTrackerJhipsterApp.ticket.home.createLabel')"></span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && tickets && tickets.length === 0">
      <span v-text="t$('bugTrackerJhipsterApp.ticket.home.notFound')"></span>
    </div>
    <div class="table-responsive" v-if="tickets && tickets.length > 0">
      <table class="table table-striped" aria-describedby="tickets">
        <thead>
          <tr>
            <th scope="row" v-on:click="changeOrder('id')">
              <span v-text="t$('global.field.id')"></span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('title')">
              <span v-text="t$('bugTrackerJhipsterApp.ticket.title')"></span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'title'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('description')">
              <span v-text="t$('bugTrackerJhipsterApp.ticket.description')"></span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'description'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('dueDate')">
              <span v-text="t$('bugTrackerJhipsterApp.ticket.dueDate')"></span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'dueDate'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('done')">
              <span v-text="t$('bugTrackerJhipsterApp.ticket.done')"></span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'done'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('newEntity')">
              <span v-text="t$('bugTrackerJhipsterApp.ticket.newEntity')"></span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'newEntity'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('someInfo')">
              <span v-text="t$('bugTrackerJhipsterApp.ticket.someInfo')"></span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'someInfo'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('project.name')">
              <span v-text="t$('bugTrackerJhipsterApp.ticket.project')"></span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'project.name'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('assignedTo.login')">
              <span v-text="t$('bugTrackerJhipsterApp.ticket.assignedTo')"></span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'assignedTo.login'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'TicketView', params: { ticketId: ticket.id } }">{{ ticket.id }}</router-link>
            </td>
            <td>{{ ticket.title }}</td>
            <td>{{ ticket.description }}</td>
            <td>{{ ticket.dueDate }}</td>
            <td>{{ ticket.done }}</td>
            <td>{{ ticket.newEntity }}</td>
            <td>{{ ticket.someInfo }}</td>
            <td>
              <div v-if="ticket.project">
                <router-link :to="{ name: 'ProjectView', params: { projectId: ticket.project.id } }">{{ ticket.project.name }}</router-link>
              </div>
            </td>
            <td>
              {{ ticket.assignedTo ? ticket.assignedTo.login : '' }}
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'TicketView', params: { ticketId: ticket.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="t$('entity.action.view')"></span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'TicketEdit', params: { ticketId: ticket.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="t$('entity.action.edit')"></span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(ticket)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntity
                >
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="t$('entity.action.delete')"></span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <template #modal-title>
        <span
          id="bugTrackerJhipsterApp.ticket.delete.question"
          data-cy="ticketDeleteDialogHeading"
          v-text="t$('entity.delete.title')"
        ></span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-ticket-heading" v-text="t$('bugTrackerJhipsterApp.ticket.delete.question', { id: removeId })"></p>
      </div>
      <template #modal-footer>
        <div>
          <button type="button" class="btn btn-secondary" v-text="t$('entity.action.cancel')" v-on:click="closeDialog()"></button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-ticket"
            data-cy="entityConfirmDeleteButton"
            v-text="t$('entity.action.delete')"
            v-on:click="removeTicket()"
          ></button>
        </div>
      </template>
    </b-modal>
    <div v-show="tickets && tickets.length > 0">
      <div class="row justify-content-center">
        <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
      </div>
      <div class="row justify-content-center">
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ticket.component.ts"></script>
