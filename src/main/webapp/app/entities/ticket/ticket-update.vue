<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="bugTrackerJhipsterApp.ticket.home.createOrEditLabel"
          data-cy="TicketCreateUpdateHeading"
          v-text="t$('bugTrackerJhipsterApp.ticket.home.createOrEditLabel')"
        ></h2>
        <div>
          <div class="form-group" v-if="ticket.id">
            <label for="id" v-text="t$('global.field.id')"></label>
            <input type="text" class="form-control" id="id" name="id" v-model="ticket.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.ticket.title')" for="ticket-title"></label>
            <input
              type="text"
              class="form-control"
              name="title"
              id="ticket-title"
              data-cy="title"
              :class="{ valid: !v$.title.$invalid, invalid: v$.title.$invalid }"
              v-model="v$.title.$model"
              required
            />
            <div v-if="v$.title.$anyDirty && v$.title.$invalid">
              <small class="form-text text-danger" v-for="error of v$.title.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.ticket.description')" for="ticket-description"></label>
            <input
              type="text"
              class="form-control"
              name="description"
              id="ticket-description"
              data-cy="description"
              :class="{ valid: !v$.description.$invalid, invalid: v$.description.$invalid }"
              v-model="v$.description.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.ticket.dueDate')" for="ticket-dueDate"></label>
            <b-input-group class="mb-3">
              <b-input-group-prepend>
                <b-form-datepicker
                  aria-controls="ticket-dueDate"
                  v-model="v$.dueDate.$model"
                  name="dueDate"
                  class="form-control"
                  :locale="currentLanguage"
                  button-only
                  today-button
                  reset-button
                  close-button
                >
                </b-form-datepicker>
              </b-input-group-prepend>
              <b-form-input
                id="ticket-dueDate"
                data-cy="dueDate"
                type="text"
                class="form-control"
                name="dueDate"
                :class="{ valid: !v$.dueDate.$invalid, invalid: v$.dueDate.$invalid }"
                v-model="v$.dueDate.$model"
              />
            </b-input-group>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.ticket.done')" for="ticket-done"></label>
            <input
              type="checkbox"
              class="form-check"
              name="done"
              id="ticket-done"
              data-cy="done"
              :class="{ valid: !v$.done.$invalid, invalid: v$.done.$invalid }"
              v-model="v$.done.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.ticket.newEntity')" for="ticket-newEntity"></label>
            <input
              type="text"
              class="form-control"
              name="newEntity"
              id="ticket-newEntity"
              data-cy="newEntity"
              :class="{ valid: !v$.newEntity.$invalid, invalid: v$.newEntity.$invalid }"
              v-model="v$.newEntity.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.ticket.someInfo')" for="ticket-someInfo"></label>
            <input
              type="text"
              class="form-control"
              name="someInfo"
              id="ticket-someInfo"
              data-cy="someInfo"
              :class="{ valid: !v$.someInfo.$invalid, invalid: v$.someInfo.$invalid }"
              v-model="v$.someInfo.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.ticket.project')" for="ticket-project"></label>
            <select class="form-control" id="ticket-project" data-cy="project" name="project" v-model="ticket.project">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="ticket.project && projectOption.id === ticket.project.id ? ticket.project : projectOption"
                v-for="projectOption in projects"
                :key="projectOption.id"
              >
                {{ projectOption.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.ticket.assignedTo')" for="ticket-assignedTo"></label>
            <select class="form-control" id="ticket-assignedTo" data-cy="assignedTo" name="assignedTo" v-model="ticket.assignedTo">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="ticket.assignedTo && userOption.id === ticket.assignedTo.id ? ticket.assignedTo : userOption"
                v-for="userOption in users"
                :key="userOption.id"
              >
                {{ userOption.login }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label v-text="t$('bugTrackerJhipsterApp.ticket.label')" for="ticket-label"></label>
            <select
              class="form-control"
              id="ticket-labels"
              data-cy="label"
              multiple
              name="label"
              v-if="ticket.labels !== undefined"
              v-model="ticket.labels"
            >
              <option v-bind:value="getSelected(ticket.labels, labelOption, 'id')" v-for="labelOption in labels" :key="labelOption.id">
                {{ labelOption.label }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <button type="button" id="cancel-save" data-cy="entityCreateCancelButton" class="btn btn-secondary" v-on:click="previousState()">
            <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.cancel')"></span>
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="v$.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.save')"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./ticket-update.component.ts"></script>
