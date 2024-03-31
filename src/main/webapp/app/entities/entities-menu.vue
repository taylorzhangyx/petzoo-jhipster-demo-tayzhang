<template>
  <div>
    <b-dropdown-item to="/project">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.project')"></span>
    </b-dropdown-item>
    <b-dropdown-item to="/label">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.label')"></span>
    </b-dropdown-item>
    <b-dropdown-item to="/team">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.team')"></span>
    </b-dropdown-item>
    <b-dropdown-item to="/member">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.member')"></span>
    </b-dropdown-item>
    <b-dropdown-item to="/ticket">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.ticket')"></span>
    </b-dropdown-item>
    <!-- jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here -->
  </div>
</template>

<script lang="ts" src="./entities-menu.component.ts"></script>
