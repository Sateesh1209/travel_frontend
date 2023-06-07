<script setup>
import { onMounted, ref } from "vue";
import TripTravellerServices from "../services/TripTravellerServices";
import TravelPlanCardComponent from "../components/TravelPlanCardComponent.vue";

const user = ref({
  email: "",
  firstName: "",
  lastName: "",
  id: null,
  token: "",
  isAdmin: false,
});
const isAdmin = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const panel = ref([0]);

const userJoinedPlans = ref({});
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  isAdmin.value = user.value?.isAdmin;
  await getTripTravellers();
});

async function getTripTravellers() {
  await TripTravellerServices.getUserJoinedTripsByUserId(user.value.id)
    .then((response) => {
      userJoinedPlans.value = response.data;
      // travelPlans.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function closeSnackBar() {
  snackbar.value.value = false;
}

const showSnackbar = (color, msg) => {
  snackbar.value.value = true;
  snackbar.value.color = color;
  snackbar.value.text = msg;
};
</script>
<template>
  <v-container>
    <div id="body">
      <div>
        <v-expansion-panels v-model="panel">
          <v-expansion-panel>
            <v-expansion-panel-title mandatory>
              <template v-slot:default="{ expanded }">
                <v-row no-gutters>
                  <v-col class="d-flex justify-start"
                    ><b
                      v-bind:style="{
                        'font-size': '24px',
                      }"
                      >Ongoing Trips</b
                    ></v-col
                  >
                  <v-col cols="8" class="text--secondary"> </v-col>
                </v-row>
              </template>
            </v-expansion-panel-title>

            <v-expansion-panel-text
              class="pl-15 pr-15"
              v-bind:style="{
                'text-align': userJoinedPlans?.onGoing?.length == 0 && 'center',
              }"
            >
              <template v-if="userJoinedPlans?.onGoing?.length > 0">
                <span
                  v-bind:style="{
                    color: '#707070',
                    'font-size': '16px',
                  }"
                  ><b>Note: </b>Please note that you can't modify travellers or
                  dropout from the trip in this section since these trips are on
                  going...</span
                >
                <TravelPlanCardComponent
                  v-for="tPlan in userJoinedPlans?.onGoing"
                  :key="tPlan.id"
                  :tPlan="tPlan"
                  :isAdmin="isAdmin"
                  :getUpdatedTrips="getTripTravellers"
                  :showSnackbar="showSnackbar"
                  tripStatus="onGoing"
                />
              </template>
              <template v-else>
                <span
                  v-bind:style="{
                    color: '#707070',
                    'font-size': '16px',
                  }"
                  >You have no ongoing joined trips. Click
                  <router-link :to="{ name: 'travelplans' }">here</router-link>
                  to check available travel plans.</span
                >
              </template>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <template v-slot="{ expanded }">
                <v-row no-gutters>
                  <v-col class="d-flex justify-start"
                    ><b
                      v-bind:style="{
                        'font-size': '24px',
                      }"
                      >Upcoming Trips</b
                    ></v-col
                  >
                  <v-col cols="8" class="text--secondary"> </v-col>
                </v-row>
              </template>
            </v-expansion-panel-title>

            <v-expansion-panel-text
              class="pl-15 pr-15"
              v-bind:style="{
                'text-align':
                  userJoinedPlans?.upComing?.length == 0 && 'center',
              }"
            >
              <template v-if="userJoinedPlans?.upComing?.length > 0">
                <span
                  v-bind:style="{
                    color: '#707070',
                    'font-size': '16px',
                  }"
                  ><b>Note: </b>Please select the trip to modify the travellers
                  or dropout from the trip...</span
                >
                <TravelPlanCardComponent
                  v-for="tPlan in userJoinedPlans?.upComing"
                  :key="tPlan.id"
                  :tPlan="tPlan"
                  :isAdmin="isAdmin"
                  :getUpdatedTrips="getTripTravellers"
                  :showSnackbar="showSnackbar"
                  :getTripTravellers="getTripTravellers"
                  tripStatus="upComing"
                />
              </template>
              <template v-else>
                <span
                  v-bind:style="{
                    color: '#707070',
                    'font-size': '16px',
                  }"
                  >You have no upcoming trips. Click
                  <router-link :to="{ name: 'travelplans' }">here</router-link>
                  to check available travel plans.</span
                >
              </template>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <template v-slot="{ expanded }">
                <v-row no-gutters>
                  <v-col class="d-flex justify-start"
                    ><b
                      v-bind:style="{
                        'font-size': '24px',
                      }"
                      >Expired Trips</b
                    ></v-col
                  >
                  <v-col cols="8" class="text--secondary"> </v-col>
                </v-row>
              </template>
            </v-expansion-panel-title>

            <v-expansion-panel-text
              class="pl-15 pr-15"
              v-bind:style="{
                'text-align': userJoinedPlans?.expired?.length == 0 && 'center',
              }"
            >
              <template v-if="userJoinedPlans?.expired?.length > 0">
                <span
                  v-bind:style="{
                    color: '#707070',
                    'font-size': '16px',
                  }"
                  ><b>Note: </b>Please note that you can't do any modifications
                  to the expired trips...</span
                >
                <TravelPlanCardComponent
                  v-for="tPlan in userJoinedPlans?.expired"
                  :key="tPlan.id"
                  :tPlan="tPlan"
                  :isAdmin="isAdmin"
                  :getUpdatedTrips="getTripTravellers"
                  :showSnackbar="showSnackbar"
                  tripStatus="expired"
                />
              </template>
              <template v-else>
                <span
                  v-bind:style="{
                    color: '#707070',
                    'font-size': '16px',
                  }"
                  >You have no expired trips...</span
                >
              </template>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
  </v-container>
  <v-snackbar v-model="snackbar.value" rounded="pill">
    {{ snackbar.text }}

    <template v-slot:actions>
      <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
