import api from './apiService';

export async function createVolunteerProfile(profileData) {
  const response = await api.post('/volunteers/profile', profileData);
  return response.data;
}

export async function getVolunteerProfile(userId) {
  const response = await api.get(`/volunteers/profile/${userId}`);
  return response.data;
}

export async function updateVolunteerProfile(userId, profileData) {
  const response = await api.put(`/volunteers/profile/${userId}`, profileData);
  return response.data;
}

export async function createOrganizationProfile(profileData) {
  const response = await api.post('/organizations/profile', profileData);
  return response.data;
}

export async function getOrganizationProfile(orgId) {
  const response = await api.get(`/organizations/profile/${orgId}`);
  return response.data;
}

export async function updateOrganizationProfile(orgId, profileData) {
  const response = await api.put(`/organizations/profile/${orgId}`, profileData);
  return response.data;
}