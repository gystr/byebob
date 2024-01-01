import prompts from "prompts";
import conf from "conf";

const configure = async () => {
  const config = new conf({ projectName: "byebob" });
  let username = config.get("username");
  let password = config.get("password");

  if (!username) {
    const questions = [
      {
        type: "text",
        name: "email",
        message: "Insert email:",
      },
      {
        type: "password",
        name: "password",
        message: "Insert password:",
      },
    ];
    const response = await prompts(questions);
    config.set("username", response.email);
    config.set("password", response.password);
    console.log("Configuration saved!");
  } else {
    const questions = [
      {
        type: "text",
        name: "verifyConfiguration",
        message:
          "A configuration already exists for " +
          username +
          ". Do you want to overwrite it? (Y/n)",
      },
    ];
    const response = await prompts(questions);
    if (
      response.verifyConfiguration === "y" ||
      response.verifyConfiguration === "Y" ||
      response.verifyConfiguration === ""
    ) {
      config.clear();
      configure();
    } else {
      console.log("Configurations not changed.");
      return;
    }
  }
};

export { configure };
