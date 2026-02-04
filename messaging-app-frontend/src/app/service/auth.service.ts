import { Injectable, signal } from "@angular/core";
import { UserAuthInfo } from "../model/UserLoginDtos";

@Injectable({providedIn: 'root'})
export class AuthService
{
    userAuthInfo: UserAuthInfo | undefined = undefined;

    public setUserAuthInfo(info: UserAuthInfo)
    {
        this.userAuthInfo = info;
    }

    public getUserAuthInfo()
    {
        return Object.freeze(this.userAuthInfo);
    }
}