import apiClient from "./services";

export default {
  getRecipes() {
    return apiClient.get("tripPlan");
  },
  getTravelPlansByUserId(userId) {
    return apiClient.get("tripPlan/user/" + userId);
  },
  getTravelPlanByPlanId(id) {
    return apiClient.get("tripPlan/" + id);
  },
  addTravelPlan(plan) {
    return apiClient.post("tripPlan", plan);
  },
  updateTravelPlan(planId, plan) {
    return apiClient.put("tripPlan/" + planId, plan);
  },
  deleteTravelPlan(planId) {
    return apiClient.delete("tripPlan/" + planId);
  },
};