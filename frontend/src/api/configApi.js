const fetchObject = {
  mode: "cors",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
  },
  credentials: "include",
  method: "GET",
};
const fetchDeleteObject = {
  mode: "cors",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
  },
  credentials: "include",
  method: "DELETE",
};
function getDeleteFetchObject(obj){
  return {
    mode: "cors",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
  },
  credentials: "include",
  method: "DELETE",
  body: JSON.stringify(obj),
  }
}

function getApiLink(str) {
  let url = `http://localhost:9000/${str}`;
  return url;
}
function getFetchPostObject(obj) {
  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    method: "POST",
    body: JSON.stringify(obj),
  };
}
function getFetchPutObject(obj) {
  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    method: "PUT",
    body: JSON.stringify(obj),
  };
}

export {
  fetchObject,
  getFetchPostObject,
  getApiLink,
  getFetchPutObject,
  fetchDeleteObject,
  getDeleteFetchObject
};
