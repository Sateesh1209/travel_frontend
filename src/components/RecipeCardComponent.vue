<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeIngredientServices from "../services/RecipeIngredientServices.js";
import RecipeStepServices from "../services/RecipeStepServices";

const router = useRouter();

const showDetails = ref(false);
const recipeIngredients = ref([]);
const recipeSteps = ref([]);
const user = ref(null);

const props = defineProps({
  tPlan: {
    required: true,
  },
  isAdmin: false,
});

onMounted(async () => {
  // await getRecipeIngredients();
  // await getRecipeSteps();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getRecipeIngredients() {
  await RecipeIngredientServices.getRecipeIngredientsForRecipe(props.tPlan.id)
    .then((response) => {
      recipeIngredients.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getRecipeSteps() {
  await RecipeStepServices.getRecipeStepsForRecipeWithIngredients(
    props.tPlan.id
  )
    .then((response) => {
      recipeSteps.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function navigateToEdit() {
  router.push({ name: "editTravelPlan", params: { id: props.tPlan.id } });
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
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ tPlan.name }} to {{ tPlan.countryName }}
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
        </v-col>
        <v-col class="d-flex justify-end">
          <template v-if="user !== null && props.isAdmin">
            <v-icon
              size="small"
              icon="mdi-pencil"
              @click="navigateToEdit()"
            ></v-icon>
          </template>
          <template v-else-if="user !== null && !props.isAdmin">
            <v-btn variant="flat" color="primary">Join Trip</v-btn>
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
            <tr>
              <th class="text-left">Days</th>
              <th class="text-left">Location</th>
              <th class="text-left">Food Special</th>
              <th class="text-left">Places Covered</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in tPlan.recipeStep" :key="day.id">
              <td>Day {{ day.day }}</td>
              <td>{{ day.location }}</td>
              <td>{{ day.meals }}</td>
              <td>
                <v-chip size="small" pill>{{ day.visitPlaces }}</v-chip>
                <!-- <v-chip
                  size="small"
                  v-for="ingredient in step.recipeIngredient"
                  :key="ingredient.id"
                  pill
                  >{{ ingredient.ingredient.name }}</v-chip
                > -->
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
