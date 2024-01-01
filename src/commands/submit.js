import prompts from "prompts";
import { submitHours } from "../bob.js";
import conf from "conf";

const submit = async () => {
  // if username in config file, use it
  // if not, ask for it
  const config = new conf({ projectName: "byebob" });
  let username = config.get("username");
  let password = config.get("password");

  if (!username) {
    const questions = [
      {
        type: "text",
        name: "email",
        message: "What is your email?",
      },
      {
        type: "password",
        name: "password",
        message: "What is your password?",
      },
    ];
    const response = await prompts(questions);
    config.set("username", response.username);
    config.set("password", response.password);
    await submitHours(username, password);
  } else {
    const questions = [
      {
        type: "text",
        name: "verifyUser",
        message: "Submit hours for " + username + "? (Y/n)",
      },
    ];
    const response = await prompts(questions);
    if (
      response.verifyUser === "y" ||
      response.verifyUser === "Y" ||
      response.verifyUser === ""
    )
      await submitHours(username, password);
    else {
      return;
    }
  }
};

export { submit };
