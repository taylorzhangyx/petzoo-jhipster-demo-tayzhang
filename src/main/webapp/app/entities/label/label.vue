<template>
  <div>
    <h2 id="page-heading" data-cy="LabelHeading">
      <span v-text="t$('bugTrackerJhipsterApp.label.home.title')" id="label-heading"></span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="t$('bugTrackerJhipsterApp.label.home.refreshListLabel')"></span>
        </button>
        <router-link :to="{ name: 'LabelCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-label"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="t$('bugTrackerJhipsterApp.label.home.createLabel')"></span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && labels && labels.length === 0">
      <span v-text="t$('bugTrackerJhipsterApp.label.home.notFound')"></span>
    </div>
    <div class="table-responsive" v-if="labels && labels.length > 0">
      <table class="table table-striped" aria-describedby="labels">
        <thead>
          <tr>
            <th scope="row"><span v-text="t$('global.field.id')"></span></th>
            <th scope="row"><span v-text="t$('bugTrackerJhipsterApp.label.label')"></span></th>
            <th scope="row"><span v-text="t$('bugTrackerJhipsterApp.label.desc')"></span></th>
            <th scope="row"><span v-text="t$('bugTrackerJhipsterApp.label.fakeNumber')"></span></th>
            <th scope="row"><span v-text="t$('bugTrackerJhipsterApp.label.someFaker')"></span></th>
            <th scope="row"><span v-text="t$('bugTrackerJhipsterApp.label.ticket')"></span></th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="label in labels" :key="label.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'LabelView', params: { labelId: label.id } }">{{ label.id }}</router-link>
            </td>
            <td>{{ label.label }}</td>
            <td>{{ label.desc }}</td>
            <td>{{ label.fakeNumber }}</td>
            <td>{{ label.someFaker }}</td>
            <td>
              <span v-for="(ticket, i) in label.tickets" :key="ticket.id"
                >{{ i > 0 ? ', ' : '' }}
                <router-link class="form-control-static" :to="{ name: 'TicketView', params: { ticketId: ticket.id } }">{{
                  ticket.id
                }}</router-link>
              </span>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'LabelView', params: { labelId: label.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="t$('entity.action.view')"></span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'LabelEdit', params: { labelId: label.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="t$('entity.action.edit')"></span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(label)"
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
        <span id="bugTrackerJhipsterApp.label.delete.question" data-cy="labelDeleteDialogHeading" v-text="t$('entity.delete.title')"></span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-label-heading" v-text="t$('bugTrackerJhipsterApp.label.delete.question', { id: removeId })"></p>
      </div>
      <template #modal-footer>
        <div>
          <button type="button" class="btn btn-secondary" v-text="t$('entity.action.cancel')" v-on:click="closeDialog()"></button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-label"
            data-cy="entityConfirmDeleteButton"
            v-text="t$('entity.action.delete')"
            v-on:click="removeLabel()"
          ></button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./label.component.ts"></script>
