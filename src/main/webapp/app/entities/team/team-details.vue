<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="team">
        <h2 class="jh-entity-heading" data-cy="teamDetailsHeading">
          <span v-text="t$('bugTrackerJhipsterApp.team.detail.title')"></span> {{ team.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.team.name')"></span>
          </dt>
          <dd>
            <span>{{ team.name }}</span>
          </dd>
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.team.description')"></span>
          </dt>
          <dd>
            <span>{{ team.description }}</span>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.back')"></span>
        </button>
        <router-link v-if="team.id" :to="{ name: 'TeamEdit', params: { teamId: team.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.edit')"></span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./team-details.component.ts"></script>
