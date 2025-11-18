import request from './axios';

export function fetchPersonAdvancedMap() {
  return request.get('/person/advanced');
}

export function fetchPersonAdvancedById(personId) {
  return request.get(`/person/${personId}/advanced`);
}

export function fetchPersonList() {
  return request.get('/person/list');
}

export function fetchPersonDetail(personId) {
  return request.get(`/person/${personId}`);
}


