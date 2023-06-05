<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import addIcon from "../images/add-icon.png";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import TravelPlanServices from "../services/TravelPlanServices.js";

const route = useRoute();

const props = defineProps({
  viewType: String,
  planEditId: null,
  getUpdatedTrips: Function,
  closePopupEvent: Function,
  showSnackbar: Function,
});

const travelPlan = ref({
  planId: null,
  fromDate: null,
  toDate: null,
  tripName: "",
  countryName: "",
  capacity: 3,
  travelDescription: "",
  isPublished: false,
});
const dateRange = ref(null);
const tripIterations = ref([]);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  if (props.planEditId != null && props.viewType == "edit") {
    await getRecipe();
  }
});

async function getRecipe() {
  await TravelPlanServices.getTravelPlanByPlanId(props.planEditId)
    .then((response) => {
      let tempPlan = {
        planId: null,
        fromDate: new Date(response.data[0].fromDate),
        toDate: new Date(response.data[0].toDate),
        tripName: response.data[0].name,
        countryName: response.data[0].countryName,
        capacity: response.data[0].capacity,
        travelDescription: response.data[0].description,
        isPublished: response.data[0].isPublished,
      };
      dateRange.value = [
        new Date(response.data[0].fromDate),
        new Date(response.data[0].toDate),
      ];
      travelPlan.value = tempPlan;
      if (response.data[0].tripItenary?.length > 0) {
        response.data[0].tripItenary?.map((item) => {
          item.visitPlaces = item?.visitPlaces
            ? item?.visitPlaces?.split(",")
            : [];
        });
      }
      tripIterations.value = response.data[0].tripItenary;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateRecipe() {
  let payload = {
    userId: JSON.parse(localStorage.getItem("user")).id,
    ...travelPlan.value,
    tripIterations: [...tripIterations.value],
  };
  if (props.viewType == "edit") {
    await TravelPlanServices.updateTravelPlan(props.planEditId, payload)
      .then((response) => {
        props.showSnackbar("green", response.data.msg);
        if (response.data.status == "success") {
          props.getUpdatedTrips();
          // route.push({ name: "travelplans" });
        }
      })
      .catch((error) => {
        console.log(error);
        props.showSnackbar("error", error.message);
      });
  } else {
    await TravelPlanServices.addTravelPlan(payload)
      .then((response) => {
        props.showSnackbar("green", response.data.msg);
        if (response.data.status == "success") {
          props.getUpdatedTrips();
        }
      })
      .catch((error) => {
        console.log(error);
        props.showSnackbar("error", error.message);
      });
  }
}

const onDateRangeSelect = (modelData) => {
  dateRange.value = modelData;
  // do something else with the data
  let Difference_In_Time = modelData[1].getTime() - modelData[0].getTime();
  let daysCount = Difference_In_Time / (1000 * 3600 * 24) + 1;

  let tempTrips = [];
  for (let i = 0; i < daysCount; i++) {
    tempTrips.push({
      id: null,
      day: i + 1,
      location: "",
      hotelName: "",
      meals: "",
      events: [],
      visitPlaces: [],
      tempPlaceName: "",
      tempEventName: "",
    });
  }
  tripIterations.value = tempTrips;
  travelPlan.value.fromDate = modelData[0];
  travelPlan.value.toDate = modelData[1];
};

const addPlaceNameClick = (trip) => {
  if (trip.tempPlaceName?.length > 0) {
    trip.visitPlaces?.push(trip.tempPlaceName);
    trip.tempPlaceName = "";
  }
};

const removeTripPlace = (trip, removeItem) => {
  let tempPlaces = [...trip.visitPlaces];
  trip.visitPlaces = tempPlaces.filter((e) => e != removeItem);
};

const addEventNameClick = (trip) => {
  if (trip.tempEventName?.length > 0) {
    let tempEvent = {
      id: null,
      event: trip.tempEventName,
      createdAt: null,
      updatedAt: null,
      tripItenaryId: null,
    };
    trip.events?.push(tempEvent);
    trip.tempEventName = "";
  }
};

const removeEvent = (trip, removeItem) => {
  let tempEvents = [...trip.events];
  trip.events = tempEvents.filter((e) => e?.event != removeItem);
};

const closeParentPopup = () => {
  props.closePopupEvent();
};

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >{{ props.viewType == "add" ? "Add" : "Edit" }} Travel Plan
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5 d-flex align-center">
          <v-card-text>
            <v-row align="center">
              <v-col>
                <VueDatePicker
                  class="mb-5"
                  v-model="dateRange"
                  placeholder="Select date range..."
                  range
                  @update:model-value="onDateRangeSelect"
                  :partial-range="false"
                  :enable-time-picker="false"
                ></VueDatePicker>
                <v-text-field
                  class="w-100"
                  v-model="travelPlan.tripName"
                  label="Trip Name"
                  required
                ></v-text-field>
                <v-text-field
                  class="w-100"
                  v-model="travelPlan.countryName"
                  label="Country Name"
                  required
                ></v-text-field>
                <v-text-field
                  class="w-100"
                  v-model.number="travelPlan.capacity"
                  label="Max allowed travellers"
                  type="number"
                  required
                ></v-text-field>
                <v-textarea
                  class="w-100"
                  v-model="travelPlan.travelDescription"
                  rows="6"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Trip Iterations</v-card-title>
              </v-col>
              <v-col cols="12">
                <v-expansion-panels>
                  <template v-if="tripIterations.length == 0"
                    ><span
                      v-bind:style="{
                        color: '#707070',
                        'font-size': '14px',
                      }"
                      >Please select trip dates to show trip iterations...</span
                    ></template
                  >
                  <template v-for="(trip, index) in tripIterations">
                    <v-expansion-panel>
                      <v-expansion-panel-title v-slot="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4" class="d-flex justify-start">
                            Day {{ trip.day }}
                          </v-col>
                          <v-col cols="8" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
                                Enter trip details
                              </span>
                              <span v-else key="1">
                                {{ trip.location }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-title>

                      <v-expansion-panel-text class="pl-15 pr-15">
                        <v-text-field
                          v-model="trip.location"
                          label="Location"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="trip.hotelName"
                          label="Hotel Name"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="trip.meals"
                          label="Food Special"
                          required
                        ></v-text-field>
                        <p class="font-italic text-left">
                          Events for the day:
                          <template v-if="trip.events.length == 0"
                            ><span
                              v-bind:style="{
                                color: '#707070',
                                'font-size': '14px',
                              }"
                              >Please enter event name below and click on add to
                              list them..</span
                            ></template
                          >
                          <template
                            v-for="(event, eIndex) in trip.events"
                            :key="{ eIndex }"
                          >
                            <v-chip
                              class="ma-2"
                              closable
                              @click:close="removeEvent(trip, event?.event)"
                            >
                              {{ event?.event }}
                            </v-chip>
                          </template>
                        </p>
                        <v-row no-gutters>
                          <v-col cols="4" class="d-flex justify-start">
                            <v-responsive max-width="350">
                              <v-text-field
                                v-model="trip.tempEventName"
                                v-on:keyup.enter="addEventNameClick(trip)"
                                label="Event name.."
                                clearable
                              ></v-text-field>
                            </v-responsive>
                          </v-col>
                          <v-col cols="1" class="d-flex mt-3"
                            ><div @click="addEventNameClick(trip)">
                              <v-img
                                class="mx-2"
                                :src="addIcon"
                                height="30"
                                width="30"
                                v-bind:style="{ cursor: 'pointer' }"
                                contain
                              ></v-img></div></v-col
                        ></v-row>
                        <p class="font-italic text-left">
                          Places Covered:
                          <template v-if="trip.visitPlaces.length == 0"
                            ><span
                              v-bind:style="{
                                color: '#707070',
                                'font-size': '14px',
                              }"
                              >Please enter place name below and click on add to
                              list them..</span
                            ></template
                          >
                          <template
                            v-for="(place, pIndex) in trip.visitPlaces"
                            :key="{ pIndex }"
                          >
                            <v-chip
                              class="ma-2"
                              closable
                              @click:close="removeTripPlace(trip, place)"
                            >
                              {{ place }}
                            </v-chip>
                          </template>
                        </p>
                        <v-row no-gutters>
                          <v-col cols="4" class="d-flex justify-start">
                            <v-responsive max-width="350">
                              <v-text-field
                                v-model="trip.tempPlaceName"
                                v-on:keyup.enter="addPlaceNameClick(trip)"
                                label="Enter place name.."
                                clearable
                              ></v-text-field>
                            </v-responsive>
                          </v-col>
                          <v-col cols="1" class="d-flex mt-3"
                            ><div @click="addPlaceNameClick(trip)">
                              <v-img
                                class="mx-2"
                                :src="addIcon"
                                height="30"
                                width="30"
                                v-bind:style="{ cursor: 'pointer' }"
                                contain
                              ></v-img></div></v-col
                        ></v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </template>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-space-between">
        <v-switch
          v-model="travelPlan.isPublished"
          hide-details
          inset
          :label="`Publish? ${travelPlan.isPublished ? 'Yes' : 'No'}`"
        ></v-switch>
        <div>
          <v-btn
            class="mr-3"
            variant="flat"
            color="secondary"
            @click="closeParentPopup()"
            >Cancel</v-btn
          >
          <v-btn
            v-if="props.viewType == 'add'"
            variant="flat"
            color="primary"
            @click="updateRecipe()"
            >Add Plan</v-btn
          >
          <v-btn v-else variant="flat" color="primary" @click="updateRecipe()"
            >Update Plan</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
