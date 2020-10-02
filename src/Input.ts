import readline from "readline";
import Messenger from "./Messenger";

export default class Input {
  rl: readline.ReadLine;

  constructor(promptText?: string) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: promptText ? promptText : "> "
    });
  }

  prompt(messengerClient: Messenger) {
    this.rl.prompt();
    this.rl.on("line", (text) => {
      text = text.trim();
      let command;
      if (text.indexOf(" ") > 0) {
        command = text.substring(0, text.indexOf(" "));
      } else {
        command = text;
      }
  
      switch (command) {
        case "/m":
        case "/message":
          messengerClient.message(text.substring(text.indexOf(" ") + 1));
          break;
  
        case "/s":
        case "/select":
          if (text.indexOf(" ") > 0) {
            messengerClient.select(text.substring(text.indexOf(" ") + 1));
          } else {
            console.log("Syntax: /s <name> | /select <name>");
          }
          break;
  
        case "/history":
          messengerClient.printThreadHistory();
          break;
        case "/h":  
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
  
      this.rl.prompt();
  
    });
  }
}
