<script setup>
import { onMounted, ref } from "vue";
import TravelPlanServices from "../services/TravelPlanServices";

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
// onMounted(async () => {
//   user.value = JSON.parse(localStorage.getItem("user"));
//   isAdmin.value = user.value?.isAdmin;
//   await getRecipes();
// });

// async function getRecipes() {
//   isAdd.value = false;
//   planEditId.value = null;
//   // user.value = JSON.parse(localStorage.getItem("user"));
//   if (user.value !== null && user.value.id !== null && isAdmin.value) {
//     await TravelPlanServices.getTravelPlansByUserId(user.value.id)
//       .then((response) => {
//         travelPlans.value = response.data;
//       })
//       .catch((error) => {
//         console.log(error);
//         snackbar.value.value = true;
//         snackbar.value.color = "error";
//         snackbar.value.text = error.response.data.message;
//       });
//   } else {
//     await TravelPlanServices.getRecipes()
//       .then((response) => {
//         travelPlans.value = response.data;
//       })
//       .catch((error) => {
//         console.log(error);
//         snackbar.value.value = true;
//         snackbar.value.color = "error";
//         snackbar.value.text = error.response.data.message;
//       });
//   }
// }

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>
<template>
  <v-container>
    <div id="body">
      <div>
        <v-expansion-panels>
          <!-- <template v-if="tripIterations.length == 0"
        ><span
          v-bind:style="{
            color: '#707070',
            'font-size': '14px',
          }"
          >Please select trip dates to show trip iterations...</span
        ></template
      > -->
          <v-expansion-panel>
            <v-expansion-panel-title mandatory>
              <template v-slot:default="{ expanded }">
                <v-row no-gutters>
                  <v-col class="d-flex justify-start"
                    ><b>Active Trips</b></v-col
                  >
                  <v-col cols="8" class="text--secondary">
                    <!-- <v-fade-transition leave-absolute>
                      <span v-if="expanded" key="0"> Enter trip details </span>
                      <span v-else key="1"> title 1 </span>
                    </v-fade-transition> -->
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-title>

            <v-expansion-panel-text class="pl-15 pr-15">
              abc
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <template v-slot="{ expanded }">
                <v-row no-gutters>
                  <v-col class="d-flex justify-start"
                    ><b>Expired Trips</b></v-col
                  >
                  <v-col cols="8" class="text--secondary">
                    <!-- <v-fade-transition leave-absolute>
                      <span v-if="expanded" key="0"> Enter trip details </span>
                      <span v-else key="1"> title 2 </span>
                    </v-fade-transition> -->
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-title>

            <v-expansion-panel-text class="pl-15 pr-15">
              klo
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
