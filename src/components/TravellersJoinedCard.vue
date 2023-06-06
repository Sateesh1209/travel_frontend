<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  tPlan: {},
  user: null,
  tripStatus: null,
  openDeletePopup: Function,
  joinTripOpen: Function,
});
</script>

<template>
  <v-divider></v-divider>

  <v-row align="center" class="mt-3">
    <v-col><h3>Traveller Details</h3></v-col>
    <v-col class="d-flex justify-end">
      <template v-if="props.tripStatus == 'upComing'">
        <v-icon
          class="mr-3 mt-2"
          size="large"
          icon="mdi-delete"
          @click="(e) => props.openDeletePopup(e)"
        ></v-icon>
        <v-btn color="accent" @click="(e) => props.joinTripOpen(e)"
          >Edit</v-btn
        ></template
      ></v-col
    >
  </v-row>
  <v-row>
    <v-col
      ><b>Emergency Contact:</b>
      {{ props.tPlan.tripTraveller?.emergencyContact }}</v-col
    >
  </v-row>
  <v-table>
    <thead>
      <tr
        v-bind:style="{
          backgroundColor: '#bcbbf7',
        }"
      >
        <th class="text-left">Traveller Number</th>
        <th class="text-left">First Name</th>
        <th class="text-left">Last Name</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Traveller 1</td>
        <td>{{ props.user?.firstName }}</td>
        <td>{{ props.user?.lastName }}</td>
      </tr>
      <tr
        v-for="traveller in props.tPlan.tripTraveller?.travellers"
        :key="traveller.id"
      >
        <td>Traveller {{ traveller?.travellerNum }}</td>
        <td>{{ traveller?.firstName }}</td>
        <td>{{ traveller?.lastName }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
