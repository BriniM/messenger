import Messenger from "./messenger";
import readlineSync from "readline-sync";

const messengerClient = new Messenger();

(async function () {
  console.log(`Messenger CLI - 1.0.0`);
  if (messengerClient.cookiesExist()) {
    await loginWithFile();
  } else if (!messengerClient.isApiInitialized()) {
    do {
      await loginWithCreds();
    } while (!messengerClient.isApiInitialized());
  }
  readlineSync.setDefaultOptions({ prompt: "> " });
  readlineSync.promptLoop((input: string): boolean => {
    switch (input) {
      case "hello":
        console.log("World!");
        break;
      case "/exit":
        console.log("Farewell!");
        return true;
      default:
        console.log("Unknown command, see /help");
        break;
    }
    return false;
  });
})();

async function loginWithFile() {
  console.log(`Attempting to login\n`);
  await messengerClient.login();
}

async function loginWithCreds() {
  console.log(`Attempting to login with email/pass.`);
  let email = readlineSync.questionEMail("Your email: ");
  let pass = readlineSync.question("Your password: ", { hideEchoBack: true });
  await messengerClient.login(email, pass);
}
