import { Injectable, signal } from "@angular/core";
import { UserLoginInfo } from "../model/UserLoginDto";

@Injectable({providedIn: 'root'})
export class AuthService
{
    userLoginInfo: UserLoginInfo | undefined = undefined;

    public setUserLoginInfo(info: UserLoginInfo)
    {
        console.log("User login info: " + JSON.stringify(info));
        this.userLoginInfo = info;
    }

    public getUserLoginInfo()
    {
        return Object.freeze(this.userLoginInfo);
    }
}