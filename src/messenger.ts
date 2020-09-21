import { readFileSync, writeFileSync, existsSync } from 'fs';
import { promisify } from 'util';
// @ts-ignore
import login from 'facebook-chat-api';

const loginPromise = promisify(login);

// TODO: Viewing attachments
export default class Messenger {
  cookiesPath: string;
  api: any;
  selectedUser: number;
  private stopListening: any;
  constructor() {  
	this.cookiesPath = 'cookies.json';
    this.selectedUser = 0;
  }
	cookiesExist(): Boolean {
      return existsSync(this.cookiesPath);
	}

	getCookies(): Object {
      return JSON.parse(readFileSync(this.cookiesPath, 'utf8'));
	}

	saveCookies(): void {
      writeFileSync(this.cookiesPath, JSON.stringify(this.api.getAppState()));
	}

	isApiInitialized(): Boolean {
      return this.api !== undefined;
	}

  listen(cb: CallableFunction): void {
    this.stopListening = this.api.listenMqtt(cb);
  }

  stopListen(): void {
    this.stopListening();
  }
  // TODO: Select and show previous messages
  select(name: string) {
    this.api.getUserID(name, (err: any, data: any) => {
        if (err)
        {
          console.error(err);
        }
        else {
          this.selectedUser = data[0].userID;
          console.log(`Selected ${data[0].name} - ${data[0].userID}`);
        }
    });
}

  message(message: string): void {
    if(this.selectedUser) {    
      this.api.sendMessage(message, this.selectedUser);
    } else {
      console.log("You need to select a user first using /select, see /help.");
    }
  }
    
  async login(email?: string, pass?: string) {
        if (email == undefined && pass == undefined) {
        this.api = await loginPromise({appState: this.getCookies() }).catch((e: any) => { console.log(e) });
    } else {
      this.api = await loginPromise({
        email: email,
        password: pass
      }).catch((e: any) => { console.log(e) });

      if (this.api) {
        this.saveCookies();
      }
    }
	}
}
