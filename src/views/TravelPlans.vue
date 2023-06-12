<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import TravelPlanCardComponent from "../components/TravelPlanCardComponent.vue";
import TravelPlanServices from "../services/TravelPlanServices.js";
import EditTravelPlan from "../components/EditTravelPlan.vue";

const travelPlans = ref([]);
const constTravelPlans = ref([]);
const viewType = ref("add");
const filterPlans = ref("");
const planEditId = ref(null);
const isAdd = ref(false);
const isAdmin = ref(false);
const user = ref({
  email: "",
  firstName: "",
  lastName: "",
  id: null,
  token: "",
  isAdmin: false,
});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  isAdmin.value = user.value?.isAdmin;
  await getRecipes();
});

async function getRecipes() {
  isAdd.value = false;
  planEditId.value = null;
  if (user.value !== null && user.value.id !== null && isAdmin.value) {
    await TravelPlanServices.getAdminTravelPlans()
      .then((response) => {
        travelPlans.value = response.data;
        constTravelPlans.value = response.data;
        onFilterChange();
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } else if (user.value !== null && user.value.id !== null && !isAdmin.value) {
    await TravelPlanServices.getTravelPlansByUserId(user.value.id)
      .then((response) => {
        travelPlans.value = response.data;
        constTravelPlans.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } else {
    await TravelPlanServices.getTravelPlans()
      .then((response) => {
        travelPlans.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }
}

function openAdd() {
  viewType.value = "add";
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
  planEditId.value = null;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

const showSnackbar = (color, msg) => {
  snackbar.value.value = true;
  snackbar.value.color = color;
  snackbar.value.text = msg;
};

const openEditPopup = (id) => {
  viewType.value = "edit";
  planEditId.value = id;
  isAdd.value = true;
};

const onFilterChange = () => {
  if (filterPlans.value) {
    let tempFilteredPlans = [];
    tempFilteredPlans = constTravelPlans.value.filter(
      (item) =>
        item?.name?.toLowerCase()?.includes(filterPlans.value?.toLowerCase()) ||
        item?.countryName
          ?.toLowerCase()
          ?.includes(filterPlans.value?.toLowerCase())
    );
    travelPlans.value = tempFilteredPlans;
  } else {
    travelPlans.value = constTravelPlans.value;
  }
};
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Travel Plans
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <template v-if="isAdmin">
            <v-btn color="accent" @click="openAdd()">Add</v-btn>
          </template>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-if="constTravelPlans.length > 0"
            v-model="filterPlans"
            append-icon="mdi-magnify"
            v-bind:style="{
              marginBottom: '10px',
              backgroundColor: 'rgba(186, 186, 203, 0.82)',
            }"
            label="Search by plan name / country name..."
            @input="onFilterChange"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <template v-if="travelPlans?.length > 0">
        <TravelPlanCardComponent
          v-for="tPlan in travelPlans"
          :key="tPlan.id"
          :tPlan="tPlan"
          :isAdmin="isAdmin"
          :openEditPopup="openEditPopup"
          :getUpdatedTrips="getRecipes"
          :showSnackbar="showSnackbar"
        />
      </template>
      <template v-else>
        <p class="font-italic text-center">No travel plans found...</p>
      </template>

      <v-dialog persistent v-model="isAdd" width="1080">
        <v-card class="rounded-lg elevation-5">
          <EditTravelPlan
            :viewType="viewType"
            :planEditId="planEditId"
            :getUpdatedTrips="getRecipes"
            :closePopupEvent="closeAdd"
            :showSnackbar="showSnackbar"
          ></EditTravelPlan>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
