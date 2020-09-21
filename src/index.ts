import Messenger from "./messenger";
import { question, questionEMail } from "readline-sync";
import readline from "readline";
import chalk from 'chalk';

const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '});
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
    switch (event.type) {
      case "message":
        messengerClient.api.getUserInfo(event.senderID, (err: any, data: any) => {
          console.log(`${chalk.blue(data[event.senderID].name)}: ${event.body}`);
      });
        break;
    }
  });
  rl.prompt();
  rl.on('line', input => {
    input = input.trim();
    let command;
    if (input.indexOf(' ') > 0) {
      command = input.substring(0, input.indexOf(' '));
    }  else {
      command = input;
    }

    switch (command) {
      case "/m":
      case "/message":
        messengerClient.message(input.substring(input.indexOf(' ') + 1));
        break;

      case "/s":
      case "/select":
        if(input.indexOf(' ') > 0) {
          messengerClient.select(input.substring(input.indexOf(' ') + 1));
        } else {
          console.log('Syntax: /s <name> | /select <name>')
        }
        break;
      case "/help":
        console.log("/help - shows this help page.");
        console.log(`/select | /s - Select someone to message using their name. 
                    For example: /s John Doe`);
        console.log("/message | /m - Sends the text to the selected friend.");
        console.log("/exit - exits the program.");
        break;
      case "/exit":
        console.log("Farewell!");
        process.exit(0);
        break;
      default:
        console.log("Unknown command, see /help");
        break;
    }

    rl.prompt();
  });
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
