import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ApiService } from "../api/api.service";
import { BehaviorSubject, Observable } from "rxjs";
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import {
  pageInfo,
  Constant,
  PlatFormType,
  PlatFormNames,
} from "src/app/common/constant/constant";
import { map } from "rxjs/operators";
import { User } from "../../components/_models/user";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private http: HttpClient,
    private apiUrl: ApiService
  ) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("user"))
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  //register email id / user name and password
  //register profile details
  signup(signupData) {
    return this.http.post<any>(this.apiUrl.apiSignup(), signupData);
  }
  // validate username or email
  // validate password
  // login
  login(loginData) {
    localStorage.removeItem("loggedOut");
    return this.http.post<any>(this.apiUrl.apiLogin(), loginData);
  }

  //register / login success data
  UserSuccessData(user) {
    // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
    localStorage.setItem("user", JSON.stringify(user));
    //console.log(JSON.stringify(user));
    this.userSubject.next(user);
    return user;
  }

  ChatUCodeNew(theString) {
    var unicodeString = '';
    for (var i = 0; i < theString.length; i++) {
      var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
      while (theUnicode.length < 4) {
        theUnicode = '0' + theUnicode;
      }
      theUnicode = '\\u' + theUnicode;
      unicodeString += theUnicode;
    }
    return unicodeString;
  }

  ChatUCode(t) {
    var S = '';
    for (var a = 0; a < t.length; a++) {
      if (t.charCodeAt(a) > 255) {
        S += '\\u' + ('0000' + t.charCodeAt(a).toString(16)).substr(-4, 4).toUpperCase();
      } else {
        S += t.charAt(a);
      }
    }
    return S;
    //console.log(S);
  }

  ChatUCode1(t) {
    var S = "";
    for (var a = 0; a < t.length; a++) {
      if (t.charCodeAt(a) > 255) {
        S +=
          "\\u" +
          ("0000" + t.charCodeAt(a).toString(16)).substr(-4, 4).toUpperCase();
      } else {
        S += t.charAt(a);
      }
    }
    //console.log(S);
    return S;
  }

  convertunicode(val) {
    val = val.replace(/\\n/g, '')
      //.replace(/'/g, '"')
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f");

      // remove non-printable and other non-valid JSON chars      
      val = val.replace(/[\u0000-\u0019]+/g,"");   
      
    if (val == undefined || val == null) {
      return val;
    }
    //val = "hirisjh \uD83D\uDE06 dfg dfg dd df g";
    if (val.indexOf("\\uD") != -1 || val.indexOf("\\u") != -1) {

      JSON.stringify(val)
      //console.log(JSON.parse('"\\uD83D\\uDE05\\uD83D\\uDE04"'));

      //console.log(JSON.parse("'" +"\\uD83D\\uDE05\\uD83D\\uDE04"+"'"));
      //return (JSON.parse('"' + val.replace(/\"/g, '\\"' + '"') + '"'));
      return (JSON.parse('"' + val.toString().replace(/\\"/g, '"').replace(/"/g, '\\"') + '"'));
    }

    else {
      return val;
    }

  }

  convertunicode1(val) {
    val = val.replace(/\\n/g, '')

      .replace("\\u2013", "")
      .replace(/'/g, '"')
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f");

    if (val == undefined || val == null) {
      return val;
    }

    //val = "hirisjh \uD83D\uDE06 dfg dfg dd df g";
    if (val.indexOf("\\uD") != -1 || val.indexOf("\\u") != -1) {
      //  JSON.stringify(val)
      if (this.IsJsonString(val)) {
        return JSON.parse('"' + val.replace(/\"/g, '\\"' + '"') + '"');
      } else {
        return val;
      }
      //console.log(JSON.parse('"\\uD83D\\uDE05\\uD83D\\uDE04"'));

      //console.log(JSON.parse("'" +"\\uD83D\\uDE05\\uD83D\\uDE04"+"'"));
    } else {
      return val;
    }
  }

  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }


  URLReplacer(str) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;
    let match = str.match(/(?:href=")(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);

    let match2 = str.match(/(?:href=")(^|[^\/])(www\.[\S]+(\b|$))/ig);
    let final = str;
    if (match) {
      match.map(url => {
        console.log(url)
        final = final.replace(url, "<a href=\"" + url + "\" target=\"_BLANK\">" + url + "</a>")
      });
      replacePattern2 = /(?:href=")(^|[^\/])(www\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      //content.replace(/<[^>]*>/g, '');
      final = final.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

      // replacePattern3 = /(?:href=")([\S]+(\b|$))(^.com)/ig;
      //content.replace(/<[^>]*>/g, '');
      // final = final.replace(replacePattern3, '<a href="http://$1" target="_blank">$1</a>');


      // replacePattern1 = /(?:href=")(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      //final = final.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

      // replacePattern2 = /(?:href=")(^|[^\/])(www\.[\S]+(\b|$))/gim;
      //final = final.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    }
    else {
      replacePattern2 = /(?:href=")(^|[^\/])(www\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      //content.replace(/<[^>]*>/g, '');
      final = final.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    }

    return final;
  }


  checkPwdStrongLength(password, maxLength) {
    let toLowerCaseCount = 0;
    let toUpperCaseCount = 0;
    let toSpecialCaseCount = 0
    let validateMsg = '';

    if (password.match(/[a-z]+/)) {
      toLowerCaseCount = 1;
    }
    if (password.match(/[A-Z]+/)) {
      toUpperCaseCount = 1;
    }
    if (password.match(/[#$%&!'()*+,-./:;<=>?@[\]^_`{|}~]+/)) {
      toSpecialCaseCount = 1;
    }

    if (password.length < maxLength) {
      validateMsg = 'Password must have min. ' + maxLength + ' chars.';
    }
    else {
      if (toLowerCaseCount == 0 && toUpperCaseCount == 1 && toSpecialCaseCount == 1) {
        validateMsg = 'Password must have one lowercase';
      }
      if (toLowerCaseCount == 1 && toUpperCaseCount == 0 && toSpecialCaseCount == 1) {
        validateMsg = 'Password must have one uppercase';
      }
      if (toLowerCaseCount == 1 && toUpperCaseCount == 1 && toSpecialCaseCount == 0) {
        validateMsg = 'Password must have one special character';
      }
      if (toLowerCaseCount == 0 && toUpperCaseCount == 0 && toSpecialCaseCount == 0) {
        validateMsg = 'Password must have one uppercase, one lowercase & one special character';
      }
      if (toLowerCaseCount == 0 && toUpperCaseCount == 0 && toSpecialCaseCount == 1) {
        validateMsg = 'Password must have one lowercase  & one uppercase';
      }
      if (toLowerCaseCount == 0 && toUpperCaseCount == 1 && toSpecialCaseCount == 0) {
        validateMsg = 'Password must have one lowercase & one special character';
      }
      if (toLowerCaseCount == 1 && toUpperCaseCount == 0 && toSpecialCaseCount == 0) {
        validateMsg = 'Password must have one uppercase  & one special character';
      }
      if (toLowerCaseCount == 1 && toUpperCaseCount == 1 && toSpecialCaseCount == 1) {
        validateMsg = '';
      }
    }
    return validateMsg;
  }

  checkDomain() {
    let umUrl = 'under-maintenance';
    let maintanancePopup = localStorage.getItem("maintanancePopup");
    if (maintanancePopup == '0') {
      return true;
    }
    else {
      let domainName = localStorage.getItem("domainName");
      const subDomainData = new FormData();
      subDomainData.append('apiKey', Constant.ApiKey);
      subDomainData.append('domainName', domainName);
      this.validateSubDomain(subDomainData).subscribe((response) => {
        if (response.status == "Success") {
          if (response.maintanancePopup == '1') {
            console.log(response.maintanancePopup);
            localStorage.setItem("maintanancePopup", '1');
            setTimeout(() => {
              this.router.navigate([umUrl]);
            }, 500);
          }
          else {
            localStorage.setItem("maintanancePopup", '0');
            return true;
          }
        }
        else {
          localStorage.setItem("maintanancePopup", '0');
          return true;
        }
      });
    }

  }

  //logout user
  logout() {
    // remove user from local storage to log user out
    let lid = localStorage.getItem("languageId");
    let lname = localStorage.getItem("languageName");

    

    let teamSystem = localStorage.getItem("teamSystem");
    localStorage.removeItem("user");
    if (teamSystem) {
      this.authService.logoutRedirect();
      /*
      this.authService.logoutPopup({
        mainWindowRedirectUri: "/"
   });
   */
    }

    this.userSubject.next(null);

    localStorage.clear();

    // Collabtic setup
    let platformId = PlatFormType.Collabtic;
    let PlatFormName = PlatFormNames.Collabtic;

    // Mahle setup
    // let platformId = PlatFormType.MahleForum;
    // let PlatFormName = PlatFormNames.MahleForum;
    // let PlatFormName = PlatFormNames.Tvs;

    // CBA Forum
    // let platformId = PlatFormType.CbaForum;
    // let PlatFormName = PlatFormNames.CbaForum;

    localStorage.setItem("languageId", lid);
    localStorage.setItem("languageName", lname);

    localStorage.setItem("platformId", platformId);
    localStorage.setItem("platformName", PlatFormName);

    localStorage.setItem("loggedOut", "1");
    if (teamSystem) {
      this.router.navigate(["auth/integration"]);
    } else {
      localStorage.removeItem("teamSystem");
      let url = 'auth';
      if(window.location.host==Constant.knowledgeForumHostName)
      {
        url = 'auth/integration';
        //this.router.navigate(["auth/integration"]);
        window.location.href = url;
      }
      else
      {
        window.location.href = url;
      }
     
      //this.router.navigate(["auth"]);
    }
  }

  // validate sub domain
  validateSubDomain(domainData) {
    return this.http.post<any>(this.apiUrl.apivalidateSubDomain(), domainData);
  }

  //validate email
  resetPassword(rpData) {
    return this.http.post<any>(this.apiUrl.apiResetPassword(), rpData);
  }

  //reset password
  changePassword(cpData) {
    return this.http.post<any>(this.apiUrl.apiChangePassword(), cpData);
  }

  // Change password
  changeUserPassword(cpData) {
    return this.http.post<any>(this.apiUrl.apiChangeUserPassword(), cpData);
  }

  apiSaveDocumentFolder(cpData) {
    return this.http.post<any>(this.apiUrl.apiSaveDocumentFolder(), cpData);
  }

  // resent verification email
  resetVerificationEmail(mData) {
    return this.http.post<any>(this.apiUrl.apiResetVerificationEmail(), mData);
  }

  // user checked verification email
  verifiedEmail(mData) {
    return this.http.post<any>(this.apiUrl.apiVerifiedEmail(), mData);
  }

  // get language list
  getLanguageList(mData) {
    return this.http.post<any>(this.apiUrl.apiGetLangUageList(), mData);
  }

  // set language list
  saveUserLanguageOption(mData) {
    return this.http.post<any>(this.apiUrl.apiSaveUserLanguageOption(), mData);
  }
  // 
  tvsSSOLogin(mData) {
    return this.http.post<any>(this.apiUrl.apiTVSSSOLogin(), mData);
  }
  // 
  tvsSSODealerLogin(mData) {
    return this.http.post<any>(this.apiUrl.apiTVSSSODealerLogin(), mData);
  }  
  // Get employee Info
  getEmployeeInfoTVSSSO(mData) {
    return this.http.post<any>(this.apiUrl.apiTVSSSOGetEmployeeInfo(), mData);
  }
   // Get dealer Info
   getDealerInfoTVSSSO(mData) {
    return this.http.post<any>(this.apiUrl.apiTVSSSOGetDealerInfo(), mData);
  }

  // user checked verification email
  getPolicyContent(mData) {
    return this.http.post<any>(this.apiUrl.apiGetPolicyContent(), mData);
  }
  newBusinessSignup(newbsignupData) {
    return this.http.post<any>(this.apiUrl.apiNewBusinessSignup(), newbsignupData);
  }
  // 
  newBusinessSetup(mData) {
    return this.http.post<any>(this.apiUrl.apiNewBusinessSetup(), mData);
  }
  saveBusinessOptions(mData) {
    return this.http.post<any>(this.apiUrl.apiSaveBusinessOptions(), mData);
  }
  businessInviteNewMembers(mData) {
    return this.http.post<any>(this.apiUrl.apiBusinessInviteNewMembers(), mData);
  }
  decodeEmailaddress(mData) {
    return this.http.post<any>(this.apiUrl.apiDecodeEmailaddress(), mData);
  }
}
