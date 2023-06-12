<script setup>
import { onMounted, ref } from "vue";
import TripTravellerServices from "../services/TripTravellerServices";
import TravelPlanCardComponent from "../components/TravelPlanCardComponent.vue";
import { useRoute } from "vue-router";

const router = useRoute();

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

const travellersList = ref([]);

const userJoinedPlans = ref({});
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  isAdmin.value = user.value?.isAdmin;
  await getTripTravellers(router?.params?.id);
});

async function getTripTravellers(tripId) {
  await TripTravellerServices.getTripTravellersByTripId(tripId)
    .then((response) => {
      travellersList.value = response?.data[0];
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}
</script>
<template>
  <v-container>
    <v-row align="center">
      <v-col class="d-flex justify-space-between"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >{{ travellersList?.name }} Travellers List
        </v-card-title>
        <v-btn variant="flat" color="secondary" @click="$router.go(-1)"
          >Back</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <!-- <v-col cols="10"
                ><v-card-title class="headline">Travellers List</v-card-title>
              </v-col> -->
              <v-col cols="12">
                <v-table>
                  <thead>
                    <tr
                      v-bind:style="{
                        backgroundColor: '#bcbbf7',
                      }"
                    >
                      <th class="text-left">Travellers Group</th>
                      <th class="text-left">Emergency Contact</th>
                      <th class="text-left">First Name</th>
                      <th class="text-left">Last Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="travellersList?.tripTravellers?.length == 0">
                      <td
                        colspan="4"
                        v-bind:style="{
                          color: '#707070',
                          'font-size': '14px',
                          textAlign: 'center',
                        }"
                      >
                        No travellers found...
                      </td>
                    </tr>
                    <template
                      v-for="(
                        traveller, index
                      ) in travellersList?.tripTravellers"
                    >
                      <tr>
                        <td :rowspan="traveller?.travellers?.length + 1">
                          Group {{ index + 1 }}
                        </td>
                        <td :rowspan="traveller?.travellers?.length + 1">
                          {{ traveller?.emergencyContact }}
                        </td>
                        <td>{{ traveller?.user?.firstName }}</td>
                        <td>{{ traveller?.user?.lastName }}</td>
                      </tr>
                      <tr v-for="subTraveller in traveller?.travellers">
                        <td>{{ subTraveller?.firstName }}</td>
                        <td>{{ subTraveller?.lastName }}</td>
                      </tr>
                    </template>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
