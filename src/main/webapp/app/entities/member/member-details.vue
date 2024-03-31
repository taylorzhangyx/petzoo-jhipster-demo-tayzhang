<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="member">
        <h2 class="jh-entity-heading" data-cy="memberDetailsHeading">
          <span v-text="t$('bugTrackerJhipsterApp.member.detail.title')"></span> {{ member.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="t$('bugTrackerJhipsterApp.member.nickName')"></span>
          </dt>
          <dd>
            <span>{{ member.nickName }}</span>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.back')"></span>
        </button>
        <router-link v-if="member.id" :to="{ name: 'MemberEdit', params: { memberId: member.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.edit')"></span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./member-details.component.ts"></script>
