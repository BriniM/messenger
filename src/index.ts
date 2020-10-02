import Messenger from "./Messenger";
import { question, questionEMail } from "readline-sync";
import chalk from "chalk";
import dotenv from "dotenv";
import Input from "./Input";
dotenv.config();


const input = new Input();
const messengerClient = new Messenger();

(async function () {
  console.log("Messenger CLI - 1.0.0");
  if (messengerClient.cookiesExist()) {
    await loginWithFile();
  }
  if (!messengerClient.isApiInitialized()) {
    do {
      await loginWithCredentials();
    } while (!messengerClient.isApiInitialized());
  }
  messengerClient.listen((err: any, event: any) => {
    if (err) {
      console.log("An error has occured while listening to events!");
      if (process.env.DEBUG) {
        console.log(`err: ${JSON.stringify(err)}`);
      }
    } else {
      switch (event.type) {
        case "message":
          messengerClient._api.getUserInfo(
            event.senderID,
            (err: any, data: any) => {
              console.log(
                `${chalk.blue(data[event.senderID].name)}: ${event.body}`
              );
            }
          );
          break;
      }
    }
  });

  // Starts asking for user input and provides the messengerClient object
  // for further interaction.
  input.prompt(messengerClient);
})();

async function loginWithFile() {
  console.log("Attempting to login");
  await messengerClient.login();
}

async function loginWithCredentials() {
  console.log("Attempting to login with email/pass.");
  let email = questionEMail("Your email: ");
  let pass = question("Your password: ", { hideEchoBack: true });
  await messengerClient.login(email, pass);
} 