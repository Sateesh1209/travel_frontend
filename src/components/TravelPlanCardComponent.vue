<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TravelPlanServices from "../services/TravelPlanServices";
import UserJoinTrip from "./UserJoinTrip.vue";
import TravellersJoinedCard from "./TravellersJoinedCard.vue";
import TripTravellerServices from "../services/TripTravellerServices";

const router = useRouter();

const showDeleteConf = ref(false);
const showDetails = ref(false);
const user = ref(null);
const isJoinTrip = ref(false);

const props = defineProps({
  tPlan: {
    required: true,
  },
  isAdmin: false,
  tripStatus: null,
  openEditPopup: Function,
  getUpdatedTrips: Function,
  showSnackbar: Function,
  openDeletePopup: Function,
  getTripTravellers: Function,
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function deleteTrip() {
  if (router.currentRoute.value.name == "joinedplans") {
    await TripTravellerServices.deleteTripTravellers(
      props.tPlan?.id,
      props.tPlan?.tripTraveller?.id
    )
      .then((response) => {
        props.showSnackbar("green", response.data.message);
        if (response.data.status == "success") {
          showDeleteConf.value = false;
          props.getTripTravellers();
        }
      })
      .catch((error) => {
        console.log(error);
        props.showSnackbar("error", error.message);
      });
  } else {
    await TravelPlanServices.deleteTravelPlan(props.tPlan.id)
      .then((response) => {
        props.showSnackbar("green", response.data.message);
        if (response.data.status == "success") {
          showDeleteConf.value = false;
          props.getUpdatedTrips();
        }
      })
      .catch((error) => {
        console.log(error);
        props.showSnackbar("error", error.message);
      });
  }
}

function navigateToEdit(e) {
  e?.stopPropagation();
  props.openEditPopup(props.tPlan.id);
}

function getFormattedDate(date) {
  date = new Date(date);
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return month + "/" + day + "/" + year;
}

const closeJoinTrip = () => {
  isJoinTrip.value = false;
};

const joinTripOpen = (e) => {
  e?.stopPropagation();
  isJoinTrip.value = true;
};

function openDeletePopup(e) {
  e?.stopPropagation();
  showDeleteConf.value = true;
}

function closeDeletePopup() {
  showDeleteConf.value = false;
}
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col>
          {{ tPlan.name }} <v-icon start icon="mdi-airplane-takeoff"></v-icon>
          {{ tPlan.countryName }}
          <v-chip class="ma-2" color="primary" label>
            <!-- <v-icon start icon="mdi-account-circle-outline"></v-icon> -->
            {{ getFormattedDate(tPlan.fromDate) }} - </v-chip
          >-
          <v-chip class="ma-2" color="accent" label>
            <!-- <v-icon start icon="mdi-clock-outline"></v-icon> -->
            {{ getFormattedDate(tPlan.toDate) }}
          </v-chip>
          <span v-if="props.isAdmin">
            <v-chip
              v-if="tPlan.isPublished"
              class="ma-2"
              color="green-darken-2"
              label
            >
              <v-icon start icon="mdi-checkbox-marked-circle"></v-icon>
              Published
            </v-chip>
            <v-chip v-else class="ma-2" color="orange-darken-2" label>
              <v-icon start icon="mdi-clock-outline"></v-icon>
              Pending
            </v-chip>
          </span>
          <v-chip class="ma-2" color="purple-darken-2" label>
            <v-icon start icon="mdi-account"></v-icon>
            Max allowed travellers : {{ tPlan.capacity }}
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <template v-if="user !== null && props.isAdmin && tPlan.isPublished">
            <router-link
              :to="{ name: 'travellerslist', params: { id: tPlan?.id } }"
            >
              <v-btn variant="flat" color="primary">Travellers List</v-btn>
            </router-link>
          </template>
          <template v-if="user !== null && props.isAdmin">
            <v-icon
              class="mr-3"
              size="small"
              icon="mdi-delete"
              @click="(e) => openDeletePopup(e)"
            ></v-icon>
          </template>
          <template v-if="user !== null && props.isAdmin">
            <v-icon
              size="small"
              icon="mdi-pencil"
              @click="(e) => navigateToEdit(e)"
            ></v-icon>
          </template>
          <template
            v-else-if="
              user !== null &&
              !props.isAdmin &&
              router.currentRoute.value.name != 'joinedplans' &&
              tPlan?.tripTravellers?.length == 0
            "
          >
            <v-btn
              variant="flat"
              color="primary"
              @click="(e) => joinTripOpen(e)"
              >Join Trip</v-btn
            >
          </template>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ tPlan.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Trip Iterations</h3>
        <v-table>
          <thead>
            <tr
              v-bind:style="{
                backgroundColor: '#bcbbf7',
              }"
            >
              <th class="text-left">Days</th>
              <th class="text-left">Location</th>
              <th class="text-left">Food Special</th>
              <th class="text-left">Events</th>
              <th class="text-left">Places Covered</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in tPlan.tripItenary" :key="day.id">
              <td>Day {{ day.day }}</td>
              <td>{{ day.location }}</td>
              <td>{{ day.meals }}</td>
              <td>
                <v-chip
                  v-if="day?.events?.length > 0"
                  size="small"
                  class="mr-1"
                  v-for="event in day?.events"
                  :key="event?.id"
                  pill
                  >{{ event?.event }}</v-chip
                >
                <span v-else> - </span>
              </td>
              <td>
                <v-chip
                  v-if="day?.visitPlaces"
                  size="small"
                  class="mr-1"
                  v-for="place in day?.visitPlaces?.split(',')"
                  pill
                  >{{ place }}</v-chip
                >
                <span v-else> - </span>
              </td>
            </tr>
          </tbody>
        </v-table>
        <TravellersJoinedCard
          v-if="
            user !== null &&
            !props.isAdmin &&
            router.currentRoute.value.name == 'joinedplans'
          "
          :tPlan="props.tPlan"
          :user="user"
          :tripStatus="props.tripStatus"
          :openDeletePopup="openDeletePopup"
          :joinTripOpen="joinTripOpen"
        ></TravellersJoinedCard>
      </v-card-text>
    </v-expand-transition>
  </v-card>
  <v-dialog persistent v-model="isJoinTrip" width="1080">
    <v-card class="rounded-lg elevation-5">
      <UserJoinTrip
        :planDetails="props.tPlan"
        :tripStatus="props.tripStatus"
        :closeJoinTrip="closeJoinTrip"
        :getTripTravellers="props.getTripTravellers"
        :showSnackbar="showSnackbar"
      ></UserJoinTrip>
    </v-card>
  </v-dialog>
  <v-dialog persistent v-model="showDeleteConf" width="600">
    <v-container>
      <v-card class="rounded-lg elevation-5">
        <div class="pb-2 pl-5 pt-5 pr-5">
          {{
            router.currentRoute.value.name == "joinedplans"
              ? "Are you sure want to drop out from the trip?"
              : "If you delete this plan users who ever joined in this trip will get auto dropped off. Are you sure want to delete this plan?"
          }}

          <v-row class="mt-3">
            <v-col class="d-flex justify-end">
              <v-btn
                class="mr-3"
                variant="flat"
                color="secondary"
                @click="closeDeletePopup()"
                >Cancel</v-btn
              >
              <v-btn variant="flat" color="primary" @click="deleteTrip()"
                >Confirm</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-container>
  </v-dialog>
</template>
