<template>
  <div>
    <h2 id="page-heading" data-cy="MemberHeading">
      <span v-text="t$('bugTrackerJhipsterApp.member.home.title')" id="member-heading"></span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="t$('bugTrackerJhipsterApp.member.home.refreshListLabel')"></span>
        </button>
        <router-link :to="{ name: 'MemberCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-member"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="t$('bugTrackerJhipsterApp.member.home.createLabel')"></span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && members && members.length === 0">
      <span v-text="t$('bugTrackerJhipsterApp.member.home.notFound')"></span>
    </div>
    <div class="table-responsive" v-if="members && members.length > 0">
      <table class="table table-striped" aria-describedby="members">
        <thead>
          <tr>
            <th scope="row"><span v-text="t$('global.field.id')"></span></th>
            <th scope="row"><span v-text="t$('bugTrackerJhipsterApp.member.nickName')"></span></th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'MemberView', params: { memberId: member.id } }">{{ member.id }}</router-link>
            </td>
            <td>{{ member.nickName }}</td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'MemberView', params: { memberId: member.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="t$('entity.action.view')"></span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'MemberEdit', params: { memberId: member.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="t$('entity.action.edit')"></span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(member)"
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
          id="bugTrackerJhipsterApp.member.delete.question"
          data-cy="memberDeleteDialogHeading"
          v-text="t$('entity.delete.title')"
        ></span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-member-heading" v-text="t$('bugTrackerJhipsterApp.member.delete.question', { id: removeId })"></p>
      </div>
      <template #modal-footer>
        <div>
          <button type="button" class="btn btn-secondary" v-text="t$('entity.action.cancel')" v-on:click="closeDialog()"></button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-member"
            data-cy="entityConfirmDeleteButton"
            v-text="t$('entity.action.delete')"
            v-on:click="removeMember()"
          ></button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./member.component.ts"></script>
