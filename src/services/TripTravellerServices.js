import apiClient from "./services";

export default {
  getTripTravellers() {
    return apiClient.get("tripPlan");
  },
  getUserJoinedTripsByUserId(userId) {
    return apiClient.get(`user/${userId}/tripswithtripTravellers`);
  },
  getTripTravellersByTripId(tripId) {
    return apiClient.get(`tripPlan/travellersByTripId/${tripId}`);
  },
  addTravellersByTripId(tripId, plan) {
    return apiClient.post(`trips/${tripId}/tripTravellers`, plan);
  },
  updateTripTravellers(tripId, travellerId, payload) {
    return apiClient.put(
      `trips/${tripId}/tripTravellers/${travellerId}`,
      payload
    );
  },
  deleteTripTravellers(tripId, travellerId) {
    return apiClient.delete(`trips/${tripId}/tripTravellers/${travellerId}`);
  },
};