import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/TravelPlans",
      name: "travelplans",
      component: () => import("./views/TravelPlans.vue"),
    },
    {
      path: "/JoinedPlans",
      name: "joinedplans",
      component: () => import("./views/JoinedPlans.vue"),
    },
    {
      path: "/TravellersList/:id",
      name: "travellerslist",
      component: () => import("./views/UsersListByTrip.vue"),
    },
  ],
});

export default router;