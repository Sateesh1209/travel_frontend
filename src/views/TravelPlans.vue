<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import RecipeCard from "../components/RecipeCardComponent.vue";
import RecipeServices from "../services/RecipeServices.js";
import EditTravelPlan from "./EditTravelPlan.vue";

const travelPlans = ref([]);
const viewType = ref("add");
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
const newRecipe = ref({
  name: "",
  description: "",
  servings: 0,
  time: "30",
  isPublished: false,
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  isAdmin.value = user.value?.isAdmin;
  await getRecipes();
});

async function getRecipes() {
  isAdd.value = false;
  planEditId.value = null;
  // user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value !== null && user.value.id !== null && isAdmin.value) {
    await RecipeServices.getTravelPlansByUserId(user.value.id)
      .then((response) => {
        travelPlans.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } else {
    await RecipeServices.getRecipes()
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
      <template v-if="travelPlans?.length > 0">
        <RecipeCard
          v-for="tPlan in travelPlans"
          :key="tPlan.id"
          :tPlan="tPlan"
          :isAdmin="isAdmin"
          :openEditPopup="openEditPopup"
          :getUpdatedTrips="getRecipes"
          :showSnackbar="showSnackbar"
          @deletedList="getLists()"
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
