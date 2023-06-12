import apiClient from "./services";

export default {
  getTravelPlans() {
    return apiClient.get("tripPlan");
  },
  getTravelPlansByUserId(userId) {
    return apiClient.get("tripPlan/user/" + userId);
  },
  getAdminTravelPlans() {
    return apiClient.get("tripPlan/admin");
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