<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="bugTrackerJhipsterApp.label.home.createOrEditLabel"
          data-cy="LabelCreateUpdateHeading"
          v-text="t$('bugTrackerJhipsterApp.label.home.createOrEditLabel')"
        ></h2>
        <div>
          <div class="form-group" v-if="label.id">
            <label for="id" v-text="t$('global.field.id')"></label>
            <input type="text" class="form-control" id="id" name="id" v-model="label.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.label.label')" for="label-label"></label>
            <input
              type="text"
              class="form-control"
              name="label"
              id="label-label"
              data-cy="label"
              :class="{ valid: !v$.label.$invalid, invalid: v$.label.$invalid }"
              v-model="v$.label.$model"
            />
            <div v-if="v$.label.$anyDirty && v$.label.$invalid">
              <small class="form-text text-danger" v-for="error of v$.label.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.label.desc')" for="label-desc"></label>
            <input
              type="text"
              class="form-control"
              name="desc"
              id="label-desc"
              data-cy="desc"
              :class="{ valid: !v$.desc.$invalid, invalid: v$.desc.$invalid }"
              v-model="v$.desc.$model"
            />
            <div v-if="v$.desc.$anyDirty && v$.desc.$invalid">
              <small class="form-text text-danger" v-for="error of v$.desc.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.label.fakeNumber')" for="label-fakeNumber"></label>
            <input
              type="number"
              class="form-control"
              name="fakeNumber"
              id="label-fakeNumber"
              data-cy="fakeNumber"
              :class="{ valid: !v$.fakeNumber.$invalid, invalid: v$.fakeNumber.$invalid }"
              v-model.number="v$.fakeNumber.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('bugTrackerJhipsterApp.label.someFaker')" for="label-someFaker"></label>
            <input
              type="text"
              class="form-control"
              name="someFaker"
              id="label-someFaker"
              data-cy="someFaker"
              :class="{ valid: !v$.someFaker.$invalid, invalid: v$.someFaker.$invalid }"
              v-model="v$.someFaker.$model"
            />
          </div>
          <div class="form-group">
            <label v-text="t$('bugTrackerJhipsterApp.label.ticket')" for="label-ticket"></label>
            <select
              class="form-control"
              id="label-tickets"
              data-cy="ticket"
              multiple
              name="ticket"
              v-if="label.tickets !== undefined"
              v-model="label.tickets"
            >
              <option v-bind:value="getSelected(label.tickets, ticketOption, 'id')" v-for="ticketOption in tickets" :key="ticketOption.id">
                {{ ticketOption.id }}
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
<script lang="ts" src="./label-update.component.ts"></script>
