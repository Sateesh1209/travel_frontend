<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import RecipeCard from "../components/RecipeCardComponent.vue";
import RecipeServices from "../services/RecipeServices.js";
import EditTravelPlan from "./EditTravelPlan.vue";

const travelPlans = ref([]);
const dateRange = ref(null);
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
  // user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value !== null && user.value.id !== null && isAdmin.value) {
    await RecipeServices.getRecipesByUserId(user.value.id)
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

async function addRecipe() {
  isAdd.value = false;
  newRecipe.value.userId = user.value.id;
  await RecipeServices.addRecipe(newRecipe.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newRecipe.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipes();
}

function openAdd() {
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
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
          @deletedList="getLists()"
        />
      </template>
      <template v-else>
        <p class="font-italic text-center">No travel plans found...</p>
      </template>

      <v-dialog persistent v-model="isAdd" width="1080">
        <v-card class="rounded-lg elevation-5">
          <EditTravelPlan
            :viewType="`add`"
            :closePopupEvent="closeAdd"
          ></EditTravelPlan>
          <!-- <v-card-title class="headline mb-2">Add Travel Plan</v-card-title>
          <v-card-text>
            <VueDatePicker
              class="mb-5"
              v-model="dateRange"
              placeholder="Select date range..."
              range
              :partial-range="false"
              :enable-time-picker="false"
            ></VueDatePicker>
            <v-text-field
              v-model="newRecipe.name"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model.number="newRecipe.servings"
              label="Number of Servings"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model.number="newRecipe.time"
              label="Time to Make (in minutes)"
              type="number"
            ></v-text-field>

            <v-textarea
              v-model="newRecipe.description"
              label="Description"
            ></v-textarea>
            <v-switch
              v-model="newRecipe.isPublished"
              hide-details
              inset
              :label="`Publish? ${newRecipe.isPublished ? 'Yes' : 'No'}`"
            ></v-switch>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAdd()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addRecipe()"
              >Add Recipe</v-btn
            >
          </v-card-actions> -->
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
