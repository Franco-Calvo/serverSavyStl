//@ts-nocheck
import cron from "node-cron";
import User from "../models/Users.js";
import Subscription from "../models/Subscription.js";

cron.schedule("0 0 * * *", async function () {
  try {
    const users = await User.find().populate("subscription");

    for (let user of users) {
      if (user.subscription && user.subscription.endDate < new Date()) {
        await Subscription.findByIdAndDelete(user.subscription._id);
        user.subscription = null;
        user.is_member = false;
        await users.save();
      }
    }
    console.log("Tarea de verificación en ejecución!");
  } catch (err) {
    console.log(
      "Se produjo un erorr al ejecutar la función de verificación de subscripciones",
      err
    );
  }
});

console.log("Tarea de ejecución Exitosa!");

// Ejecutar testing con mocha y super-test //
