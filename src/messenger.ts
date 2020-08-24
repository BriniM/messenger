import { readFileSync, writeFileSync, existsSync } from 'fs';
import { promisify } from 'util';
// @ts-ignore
import login from 'facebook-chat-api';

const loginPromise = promisify(login);

export default class Messenger {
  cookiesPath: string;
  api: any;
  constructor() {  
	  this.cookiesPath = 'cookies.json';
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
