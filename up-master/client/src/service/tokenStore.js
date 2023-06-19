const storeToken = (value) => {
  localStorage.setItem("token", JSON.stringify(value));
};

const getToken = () => {
  let token = localStorage.getItem("token");
  return JSON.parse(token);
};

const removeToken = (value) => {
  localStorage.removeItem("token");
};

module.exports = { storeToken, removeToken, getToken };

// a no jo apde to backend mathi j store karvi ye 6 e cookit t