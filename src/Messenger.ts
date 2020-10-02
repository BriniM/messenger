import { readFileSync, writeFileSync, existsSync } from "fs";
import { promisify } from "util";
// @ts-ignore
import login from "facebook-chat-api";

const loginPromise = promisify(login);

// TODO: Select and show previous messages
// TODO: Viewing attachments
export default class Messenger {
  cookiesPath: string;
  _api: any;
  selectedUser: number | any;
  private stopListening: any;

  constructor() {
    this.cookiesPath = "cookies.json";
    this.selectedUser = 0;
  }
  cookiesExist(): Boolean {
    return existsSync(this.cookiesPath);
  }

  getCookies(): Object {
    return JSON.parse(readFileSync(this.cookiesPath, "utf8"));
  }

  saveCookies(): void {
    writeFileSync(this.cookiesPath, JSON.stringify(this._api.getAppState()));
  }

  isApiInitialized(): Boolean {
    return this._api !== undefined;
  }

  listen(cb: CallableFunction): void {
    this._api.setOptions({ selfListen: true });
    this.stopListening = this._api.listenMqtt(cb);
  }

  stopListen(): void {
    this.stopListening();
  }

  select(name: string) {
    this._api.getUserID(name, (err: any, data: any) => {
      if (err) {
        console.log("An error has occured when selecting a friend!");
      } else {
        this.selectedUser = data[0];
        console.log(`Selected ${data[0].name} - ${data[0].userID}`);
      }
    });
  }

  message(message: string): void {
    if (this.selectedUser) {
      this._api.sendMessage(message, this.selectedUser.userID);
    } else {
      console.log("You need to select a user first using /select, see /help.");
    }
  }

  printThreadHistory() {
    if (this.selectedUser) {
      this._api.getThreadHistory(this.selectedUser.userID, 50, undefined, (err: any, history: any) => {
        if (err) {
          console.log("An error has occured when fetching thread history.");
          if (process.env.DEBUG) {
            console.log("err: ${err}");
          }
        } else {
          console.log(history);
          history.map((message: any) => {
            if (message.type == 'message') {
              if (message.body != "") {
                console.log(message.body);
              }
              message.attachments.map((attachment: any) => {
                console.log(`${attachment.type}: ${attachment.url}`);
              });
            } else if (message.type == 'event') {
              console.log(`${message.snippet}`);
            }
            
          });
        }
      });
    } else {
      console.log("You need to select a user first using /select, see /help.");
    }   
  }

  async login(email?: string, pass?: string) {
    if (email == undefined && pass == undefined) {
      this._api = await loginPromise({ appState: this.getCookies() }).catch(
        (e: any) => {
          console.log(e);
        }
      );
    } else {
      this._api = await loginPromise({
        email: email,
        password: pass,
      }).catch((e: any) => {
        console.log(e);
      });

      if (this._api) {
        this.saveCookies();
      }
    }
  }
}
