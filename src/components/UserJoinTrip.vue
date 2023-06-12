<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TripTravellerServices from "../services/TripTravellerServices";

const router = useRouter();
const user = ref({
  email: "",
  firstName: "",
  lastName: "",
  id: null,
  token: "",
  isAdmin: false,
});

const tripUserInputs = ref({
  userId: null,
  tripId: null,
  emergencyContact: null,
  totalTravellers: 1,
  travellersList: [],
});

const showJoinTrip = ref(true);

const props = defineProps({
  planDetails: Object,
  tripStatus: null,
  closeJoinTrip: Function,
  getTripTravellers: Function,
  showSnackbar: Function,
});

onMounted(async () => {
  // await getRecipeSteps();
  user.value = JSON.parse(localStorage.getItem("user"));
  tripUserInputs.value = {
    userId: user.value.id,
    tripId: props.planDetails.id,
    emergencyContact: props.tripStatus
      ? props.planDetails?.tripTraveller?.emergencyContact
      : null,
    totalTravellers: props.tripStatus
      ? props.planDetails?.tripTraveller?.totalTravellers
      : 1,
    travellersList:
      props.tripStatus && props.planDetails?.tripTraveller?.totalTravellers > 1
        ? [
            {
              travellerNum: 1,
              firstName: user.value.firstName,
              lastName: user.value.lastName,
            },
            ...props.planDetails?.tripTraveller?.travellers,
          ]
        : [
            {
              travellerNum: 1,
              firstName: user.value.firstName,
              lastName: user.value.lastName,
            },
          ],
  };
});

async function userJoinTrip() {
  let payload = {
    ...tripUserInputs.value,
    travellersList: tripUserInputs.value.travellersList.slice(1),
  };
  await TripTravellerServices.addTravellersByTripId(
    props.planDetails.id,
    payload
  )
    .then((response) => {
      props.showSnackbar("green", response.data.message);
      if (response.data.status == "success") {
        setTimeout(() => {
          router.push({ name: "joinedplans" });
        }, 1000);
      }
    })
    .catch((error) => {
      console.log(error);
      props.showSnackbar("error", error.message);
    });
}

async function userUpdateTripTravellers() {
  let payload = {
    ...tripUserInputs.value,
    travellersList: tripUserInputs.value.travellersList.slice(1),
  };
  await TripTravellerServices.updateTripTravellers(
    props.planDetails.id,
    props.planDetails?.tripTraveller?.id,
    payload
  )
    .then((response) => {
      props.showSnackbar("green", response.data.message);
      if (response.data.status == "success") {
        props.getTripTravellers();
        props.closeJoinTrip();
      }
    })
    .catch((error) => {
      console.log(error);
      props.showSnackbar("error", error.message);
    });
}

const joinTripClick = () => {
  userJoinTrip();
};

const generateTravellers = (currCount) => {
  if (currCount >= 1 && currCount <= props.planDetails.capacity) {
    let tempTravellers = [];
    for (let i = 0; i < currCount; i++) {
      tempTravellers.push({
        travellerNum: i + 1,
        firstName: i == 0 ? user.value.firstName : "",
        lastName: i == 0 ? user.value.lastName : "",
      });
    }
    tripUserInputs.value.travellersList = tempTravellers;
  }
};

const onTravellersCountChange = (e) => {
  console.log(e);
  if (e) {
    if (e > props.planDetails?.capacity) {
      tripUserInputs.value.totalTravellers = props.planDetails?.capacity;
      generateTravellers(props.planDetails?.capacity);
    } else if (e < 1) {
      tripUserInputs.value.totalTravellers = 1;
      generateTravellers(1);
    } else if (!(e >= 1 && e <= props.planDetails.capacity)) {
      tripUserInputs.value.totalTravellers = 1;
      generateTravellers(1);
    } else {
      generateTravellers(e);
    }
  }
};
</script>

<template>
  <v-dialog persistent v-model="showJoinTrip" width="1080">
    <v-card class="rounded-lg elevation-5">
      <v-card-title class="headline mb-2">{{
        props.tripStatus
          ? `Update ${props.planDetails?.name}`
          : `Join ${props.planDetails?.name}`
      }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="tripUserInputs.emergencyContact"
          label="Emergency Contact Number*"
          aria-required="true"
        ></v-text-field>
        <v-text-field
          v-model.number="tripUserInputs.totalTravellers"
          label="Number of Travellers*"
          type="number"
          @update:model-value="onTravellersCountChange"
          :min="1"
          :max="props.planDetails?.capacity"
          :hint="`Maximum allowed travellers for this trip is ${props.planDetails?.capacity}`"
        ></v-text-field>
        <v-expansion-panels class="mt-5">
          <template v-for="(item, index) in tripUserInputs.travellersList">
            <v-expansion-panel>
              <v-expansion-panel-title v-slot="{ open }">
                <v-row no-gutters>
                  <v-col cols="4" class="d-flex justify-start">
                    Traveller {{ item.travellerNum }}
                  </v-col>
                  <v-col cols="8" class="text--secondary">
                    <v-fade-transition leave-absolute>
                      <span v-if="open" key="0"> Enter traveller details </span>
                      <span v-else key="1">
                        {{ item.firstName + " " + item.lastName }}
                      </span>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="pl-15 pr-15">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="item.firstName"
                      label="First Name"
                      :disabled="item.travellerNum == 1"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="item.lastName"
                      label="Last Name"
                      :disabled="item.travellerNum == 1"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel> </template
        ></v-expansion-panels>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="secondary" @click="props.closeJoinTrip()"
          >Close</v-btn
        >
        <v-btn
          variant="flat"
          color="primary"
          @click="
            props.tripStatus ? userUpdateTripTravellers() : joinTripClick()
          "
          :disabled="
            !tripUserInputs?.emergencyContact ||
            !tripUserInputs?.totalTravellers
          "
          >{{ props.tripStatus ? "Update" : "Confirm & Join" }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
