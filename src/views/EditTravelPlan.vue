<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import addIcon from "../images/add-icon.png";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import IngredientServices from "../services/IngredientServices.js";
import RecipeIngredientServices from "../services/RecipeIngredientServices.js";
import RecipeStepServices from "../services/RecipeStepServices.js";
import RecipeServices from "../services/RecipeServices.js";

const route = useRoute();

const props = defineProps({
  viewType: String,
  planEditId: null,
  getUpdatedTrips: Function,
  closePopupEvent: Function,
  showSnackbar: Function,
});

const recipe = ref({});
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
const ingredients = ref([]);
const selectedIngredient = ref({});
const recipeIngredients = ref([]);
const recipeSteps = ref([]);
const isAddIngredient = ref(false);
const isEditIngredient = ref(false);
const isAddStep = ref(false);
const isEditStep = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newStep = ref({
  id: undefined,
  stepNumber: undefined,
  instruction: undefined,
  recipeId: undefined,
  recipeIngredient: [],
});
const newIngredient = ref({
  id: undefined,
  quantity: undefined,
  recipeId: undefined,
  recipeStepId: undefined,
  ingredientId: undefined,
});

onMounted(async () => {
  if (props.planEditId != null && props.viewType == "edit") {
    await getRecipe();
  }
  // await getRecipeIngredients();
  // await getIngredients();
  // await getRecipeSteps();
});

async function getRecipe() {
  await RecipeServices.getTravelPlanByPlanId(props.planEditId)
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
      if (response.data[0].recipeStep?.length > 0) {
        response.data[0].recipeStep?.map((item) => {
          item.visitPlaces = item?.visitPlaces
            ? item?.visitPlaces?.split(",")
            : [];
        });
      }
      tripIterations.value = response.data[0].recipeStep;
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
    await RecipeServices.updateTravelPlan(props.planEditId, payload)
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
    await RecipeServices.addTravelPlan(payload)
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

async function getIngredients() {
  await IngredientServices.getIngredients()
    .then((response) => {
      ingredients.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getRecipeIngredients() {
  await RecipeIngredientServices.getRecipeIngredientsForRecipe(props.planEditId)
    .then((response) => {
      recipeIngredients.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addIngredient() {
  isAddIngredient.value = false;
  newIngredient.value.recipeId = travelPlan.value.id;
  newIngredient.value.ingredientId = selectedIngredient.value.id;
  delete newIngredient.value.id;
  await RecipeIngredientServices.addRecipeIngredient(newIngredient.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Ingredient added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeIngredients();
}

async function updateIngredient() {
  isEditIngredient.value = false;
  newIngredient.value.recipeId = travelPlan.value.id;
  newIngredient.value.ingredientId = selectedIngredient.value.id;
  console.log(newIngredient);

  await RecipeIngredientServices.updateRecipeIngredient(newIngredient.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${selectedIngredient.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeIngredients();
}

async function deleteIngredient(ingredient) {
  await RecipeIngredientServices.deleteRecipeIngredient(ingredient)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${ingredient.ingredient.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeIngredients();
}

async function checkUpdateIngredient() {
  if (newStep.value.recipeIngredient.length > 0) {
    console.log(newStep.value.recipeIngredient);
    for (let i = 0; i < newStep.value.recipeIngredient.length; i++) {
      newIngredient.value.id = newStep.value.recipeIngredient[i].id;
      newIngredient.value.quantity = newStep.value.recipeIngredient[i].quantity;
      newIngredient.value.recipeStepId = newStep.value.id;
      selectedIngredient.value.id =
        newStep.value.recipeIngredient[i].ingredientId;
      await updateIngredient();
    }
  }
}

async function getRecipeSteps() {
  await RecipeStepServices.getRecipeStepsForRecipeWithIngredients(
    props.planEditId
  )
    .then((response) => {
      recipeSteps.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addStep() {
  isAddStep.value = false;
  newStep.value.recipeId = travelPlan.value.id;
  delete newStep.value.id;
  await RecipeStepServices.addRecipeStep(newStep.value)
    .then((data) => {
      newStep.value.id = data.data.id;
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdateIngredient();

  await getRecipeSteps();
}

async function updateStep() {
  isEditStep.value = false;
  await RecipeStepServices.updateRecipeStep(newStep.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdateIngredient();

  await getRecipeSteps();
}

async function deleteStep(step) {
  await RecipeStepServices.deleteRecipeStep(step)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getRecipeSteps();
}

function openAddIngredient() {
  newIngredient.value.id = undefined;
  newIngredient.value.quantity = undefined;
  newIngredient.value.recipeStepId = undefined;
  newIngredient.value.ingredientId = undefined;
  selectedIngredient.value = undefined;
  isAddIngredient.value = true;
}

function openEditIngredient(ingredient) {
  newIngredient.value.id = ingredient.id;
  newIngredient.value.quantity = ingredient.quantity;
  newIngredient.value.recipeStepId = ingredient.recipeStepId;
  newIngredient.value.ingredientId = ingredient.ingredientId;
  selectedIngredient.value = ingredient.ingredient;
  isEditIngredient.value = true;
}

function openAddStep() {
  newStep.value.id = undefined;
  newStep.value.stepNumber = undefined;
  newStep.value.instruction = undefined;
  newStep.value.recipeIngredient = [];
  isAddStep.value = true;
}

function openEditStep(step) {
  newStep.value.id = step.id;
  newStep.value.stepNumber = step.stepNumber;
  newStep.value.instruction = step.instruction;
  newStep.value.recipeIngredient = step.recipeIngredient;
  isEditStep.value = true;
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
      visitPlaces: [],
      tempPlaceName: "",
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

const closeParentPopup = () => {
  props.closePopupEvent();
};

function closeAddIngredient() {
  isAddIngredient.value = false;
}

function closeEditIngredient() {
  isEditIngredient.value = false;
}

function closeAddStep() {
  isAddStep.value = false;
}

function closeEditStep() {
  isEditStep.value = false;
}

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
                            Day {{ index + 1 }}
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
              <!-- <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddIngredient()">Add</v-btn>
              </v-col> -->
            </v-row>
          </v-card-title>
          <!-- <v-card-text>
            <v-list>
              <v-list-item
                v-for="recipeIngredient in recipeIngredients"
                :key="recipeIngredient.id"
              >
                <b
                  >{{ recipeIngredient.quantity }}
                  {{
                    `${recipeIngredient.ingredient.unit}${
                      recipeIngredient.quantity > 1 ? "s" : ""
                    }`
                  }}</b
                >
                of {{ recipeIngredient.ingredient.name }} (${{
                  recipeIngredient.ingredient.pricePerUnit
                }}/{{ recipeIngredient.ingredient.unit }})
                <template v-slot:append>
                  <v-row>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditIngredient(recipeIngredient)"
                    ></v-icon>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteIngredient(recipeIngredient)"
                    ></v-icon>
                  </v-row>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text> -->
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
        <!-- </v-col>
      <v-col class="d-flex justify-space-between"> -->
        <!-- <v-card-actions class="pt-0"> -->
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
        <!-- <v-spacer></v-spacer> -->
        <!-- </v-card-actions> -->
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Steps </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddStep()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-table>
              <tbody>
                <tr v-for="step in recipeSteps" :key="step.id">
                  <td>{{ step.stepNumber }}</td>
                  <td>{{ step.instruction }}</td>
                  <td>
                    <v-chip
                      size="small"
                      v-for="ingredient in step.recipeIngredient"
                      :key="ingredient.id"
                      pill
                      >{{ ingredient.ingredient.name }}</v-chip
                    >
                  </td>
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditStep(step)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteStep(step)"
                    >
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text> </v-card
      ></v-col>
    </v-row> -->

    <!-- <v-dialog
      persistent
      :model-value="isAddIngredient || isEditIngredient"
      width="800"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">{{
          isAddIngredient
            ? "Add Ingredient"
            : isEditIngredient
            ? "Edit Ingredient"
            : ""
        }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="newIngredient.quantity"
                label="Quantity"
                type="number"
                required
              >
              </v-text-field>
            </v-col>

            <v-col>
              <v-select
                v-model="selectedIngredient"
                :items="ingredients"
                item-title="name"
                item-value="unit"
                label="Ingredients"
                return-object
                required
              >
                <template v-slot:prepend>
                  {{
                    `${
                      selectedIngredient && selectedIngredient.unit
                        ? selectedIngredient.unit
                        : ""
                    }${newIngredient.quantity > 1 ? "s" : ""}`
                  }}
                  of
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddIngredient
                ? closeAddIngredient()
                : isEditIngredient
                ? closeEditIngredient()
                : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="
              isAddIngredient
                ? addIngredient()
                : isEditIngredient
                ? updateIngredient()
                : false
            "
            >{{
              isAddIngredient
                ? "Add Ingredient"
                : isEditIngredient
                ? "Update Ingredient"
                : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <!-- <v-dialog persistent :model-value="isAddStep || isEditStep" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          {{ isAddStep ? "Add Step" : isEditStep ? "Edit Step" : "" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newStep.stepNumber"
            label="Number"
            type="number"
            required
          ></v-text-field>

          <v-textarea
            v-model="newStep.instruction"
            label="Instruction"
            required
          ></v-textarea>

          <v-select
            v-model="newStep.recipeIngredient"
            :items="recipeIngredients"
            item-title="ingredient.name"
            item-value="id"
            label="Ingredients"
            return-object
            multiple
            chips
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddStep ? closeAddStep() : isEditStep ? closeEditStep() : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="isAddStep ? addStep() : isEditStep ? updateStep() : false"
            >{{
              isAddStep ? "Add Step" : isEditStep ? "Update Step" : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog> -->
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
