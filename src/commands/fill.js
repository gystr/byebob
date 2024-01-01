import prompts from "prompts";
import { fillHours } from "../bob.js";
import conf from "conf";

const fill = async () => {
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
      {
        type: "text",
        name: "approve",
        message: "Are you sure you want to fill hours? (Y/n)",
      },
    ];

    const response = await prompts(questions);
    if (
      response.approve === "y" ||
      response.approve === "Y" ||
      response.approve === ""
    ) {
      await fillHours(response.email, response.password);
      config.set("username", response.email);
      config.set("password", response.password);
    }
  } else {
    const questions = [
      {
        type: "text",
        name: "verifyUser",
        message: "Fill hours for " + username + "? (Y/n)",
      },
    ];
    const response = await prompts(questions);
    if (
      response.verifyUser === "y" ||
      response.verifyUser === "Y" ||
      response.verifyUser === ""
    )
      await fillHours(username, password);
    else {
      return;
    }
  }
};

export { fill };
