const urlBase = "http://localhost:3000";
var APIMapping = {
  getDetails: "/todo",
  deleteDetails: "/todo/{id}",
  updateDetails: "/todo/{id}",
  createDetails: "/todo",
};
function getAPIMap(name) {
  return urlBase + APIMapping[name];
}

export default getAPIMap;
