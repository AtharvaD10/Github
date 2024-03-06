const userController = require("../controllers/user.controller");

module.exports = (app) => {
  app.get("/users/sorted", userController.getAllUsersSorted);
  app.get("/users/:username", userController.getUser);
  app.get("/search", userController.searchUsers);
  app.delete("/users/:username", userController.softDeleteUser);
  app.patch("/users/:username", userController.updateUserFields);
};
