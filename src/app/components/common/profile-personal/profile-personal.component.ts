import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile/profile.service';
import { countries } from 'country-data';

@Component({
  selector: 'app-profile-personal',
  templateUrl: './profile-personal.component.html',
  styleUrls: ['./profile-personal.component.scss']
})
export class ProfilePersonalComponent implements OnInit {

  @Input() personalPageData;

  public loadingrs:boolean=true;
  public optionsval;
  public roleId;
  public profileId;
  public firstName;
  public lastName;
  public emailAddress;
  public phonenumber;
  public city;
  public state;
  public zipCode;
  public profileEdit: boolean = false;
  public profileInfo: boolean = true;
  public platformId;
  public profileErrorMsg;
  public profileError;

  form: FormGroup;
  loading = false;
  submitted = false;

  public pwdFieldTextType: boolean = false;
  public phoneNumberData:any;
  public icountryName = '';
  public icountryCode = '';  
  public idialCode = '';
  public iphoneNumber = '';
  public phoneNumberValid:boolean = false;
  public invalidNumber:boolean = true;  

  constructor( 
    private formBuilder: FormBuilder,
    private profileService: ProfileService
    ) { }

  ngOnInit(): void {

    this.profileView();

  }

  // view profile info
  profileView(){   
    console.log(this.personalPageData);
    this.optionsval=(this.personalPageData);  
    this.roleId = this.optionsval.roleId;   
    this.firstName = this.optionsval.firstName;
    this.lastName = this.optionsval.lastName;
    this.emailAddress = this.optionsval.emailAddress;
    
    this.city = this.optionsval.city;
    this.state = this.optionsval.state;
    this.zipCode = this.optionsval.zipCode;  
    
    this.icountryName = this.optionsval.country;
    this.icountryCode = this.optionsval.countryCode;
    this.idialCode = this.optionsval.dialCode;
    this.phonenumber = this.optionsval.phone;

    this.iphoneNumber = this.phonenumber; 

    this.phoneNumberData = {  
      'countryCode': this.icountryCode, 
      'phoneNumber' : this.iphoneNumber,
      'country': this.icountryName, 
      'dialCode' : this.idialCode,
      'access': 'phone'
    }

    if(this.firstName=='' && this.lastName=='' && this.emailAddress=='' && this.phonenumber=='' && this.city=='' && this.state=='' && this.zipCode==''){
      this.profileErrorMsg = 'No Data';  
      this.profileError = true; 
    }      
    this.profileInfo = true;
    this.loadingrs = false;
    if(this.optionsval.platformId != '1'){
      this.profileEdit = ( parseInt(this.optionsval.loginUserId) == parseInt(this.optionsval.userId)) ? true : false;   
    }
    else{
      this.profileEdit = ( this.optionsval.roleId == '3' || (parseInt(this.optionsval.loginUserId) == parseInt(this.optionsval.userId))) ? true : false;   
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  editPersonalInfo(){
    
    this.profileInfo = false;   
    this.profileError = false;  

    this.form = this.formBuilder.group({
      firstName: [this.firstName, []],        
      lastName: [this.lastName, []],
      emailAddress: [this.emailAddress, [Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],      
       //emailAddress: [this.emailAddress, [Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],      
      city: [this.city, []],        
      state: [this.state, []],
      zipCode: [this.zipCode, [Validators.pattern(/^[0-9]\d*$/)]]
    });
     

  }

  onProfileSubmit(){
    
    this.submitted = true;

    if(this.iphoneNumber.length > 0){
      this.invalidNumber = this.phoneNumberValid ? false : true;
    }
    else{
      this.invalidNumber = true;
    }

    //alert(this.iphoneNumber);
    //alert(this.phoneNumberValid);
    //return false;

    // stop here if form is invalid
    if (this.form.invalid || (this.iphoneNumber.length > 0 && this.phoneNumberValid)) { 
      return;
    }

    if(this.profileEdit){
      this.profileErrorMsg = '';  
      this.profileError = false; 
      this.loadingrs = true;
      const apiFormData = new FormData();

      apiFormData.append('apiKey', this.optionsval.apiKey);
      apiFormData.append('domainId', this.optionsval.domainId);
      apiFormData.append('countryId', this.optionsval.countryId);
      apiFormData.append('loginId', this.optionsval.loginUserId);
      apiFormData.append('userId', this.optionsval.userId);
      apiFormData.append('firstname', this.firstName);
      apiFormData.append('lastname', this.lastName);
      apiFormData.append('email', this.emailAddress);     
      apiFormData.append('city', this.city);
      apiFormData.append('state', this.state);
      apiFormData.append('zipcode', this.zipCode);     
      apiFormData.append('profileUpdate', '1');   
      
      if(this.iphoneNumber!=''){
        this.iphoneNumber = this.iphoneNumber.replace(/^0+/, '');
        console.log(this.iphoneNumber); 
      }

      apiFormData.append('phone', this.iphoneNumber);
      apiFormData.append('country', this.icountryName);  
      apiFormData.append('countrycode', this.icountryCode);  
      apiFormData.append('dialCode', this.idialCode); 

      this.profileService.updateUserProfile(apiFormData).subscribe(res => {
        
        if(res.status=='Success'){                       
          let profileData = res.data;          
          if(profileData != ''){ 
            this.getUserProfileInfo();            
          }
          else{ 
            this.loadingrs = false;         
            this.profileErrorMsg = res.result;  
            this.profileError = true;
          }
        }
        else{
          this.loadingrs = false;
          this.profileErrorMsg = res.result;  
          this.profileError = true;   
        }
                  
      },
      (error => {
        this.loading = false;
        this.profileErrorMsg = error;
        this.profileError = '';       
      })
      );
    }
  }

  onCancelProfile(){
    this.profileInfo = true;
    this.profileView();
  }

  getUserProfileInfo(){
    this.profileErrorMsg = '';  
    this.profileError = false; 
    this.loadingrs = true;    
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.optionsval.apiKey);
    apiFormData.append('domainId', this.optionsval.domainId);
    apiFormData.append('countryId', this.optionsval.countryId);
    apiFormData.append('userId', this.optionsval.userId);
    apiFormData.append('loginId', this.optionsval.loginUserId);
    
    this.profileService.getUserProfile(apiFormData).subscribe(res => {
      
      if(res.status=='Success'){
         this.loadingrs = false;   
         this.profileInfo = true;   
         let profileData = res.data
        
         if(profileData != ''){ 

          this.personalPageData = {  
            'apiKey': this.optionsval.apiKey,
            'roleId': this.optionsval.roleId,
            'platformId': this.optionsval.platformId,
            'userId': this.optionsval.userId,
            'loginUserId': this.optionsval.loginUserId,
            'domainId': this.optionsval.domainId,   
            'countryId': this.optionsval.countryId,         
            'firstName': profileData.firstName,
            'lastName': profileData.lastName,
            'emailAddress': profileData.emailAddress,
            'country': profileData.country,
            'countryCode': profileData.countryCode,
            'dialCode': profileData.dialCode,
            'phone': profileData.phone,
            'city': profileData.city,
            'state': profileData.state,
            'zipCode': profileData.zipCode                              
          };
          this.profileView();
                    
         }
         else{          
          this.profileErrorMsg = res.result;  
          this.profileError = true;
         }
      }
      else{
        this.loadingrs = false;
        this.profileErrorMsg = res.result;  
        this.profileError = true;   
      }
                 
    },
    (error => {
      this.loading = false;
      this.profileErrorMsg = error;
      this.profileError = '';       
    })
    );
  }

  // country & phone number update
  getPhoneNumberData(newValue){
    console.log(newValue);
    
    if(newValue != null){
      if(newValue.phoneVal != null){ 
        if(newValue.access == 'phone'){     
          let placeHolderValueTrim = '';
          let placeHolderValueLen = 0 ;
          let placeHolderValue = newValue.placeholderVal;
          placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
          placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
          placeHolderValueLen = placeHolderValueTrim.length;  
          console.log(placeHolderValueLen); 
          
          let currPhValueTrim = '';
          let currPhValueLen = 0 ;      
          if(newValue.phoneVal['number'] != ''){
            currPhValueTrim = newValue.phoneVal['number'].replace(/[^\w]/g, "");
            currPhValueTrim = currPhValueTrim.replace(/^0+/, '');
            currPhValueLen = currPhValueTrim.length;   
            console.log(currPhValueLen);
          }     
          
          if(newValue.phoneVal['number'].length>0){
            this.invalidNumber = (newValue.errorVal) ? true : false; 
            
            this.phoneNumberValid = true;
            this.icountryName = '';
            this.icountryCode = '';          
            this.idialCode = '';
            this.iphoneNumber = '';
            this.iphoneNumber = newValue.phoneVal.number;

            if(currPhValueLen == placeHolderValueLen){ 
              this.phoneNumberValid = false;

              let getCode = newValue.phoneVal.countryCode;        
              this.icountryName = countries[getCode].name;
              this.icountryCode = newValue.phoneVal.countryCode;            
              this.idialCode = newValue.phoneVal.dialCode;
              this.iphoneNumber = newValue.phoneVal.number;

              console.log(this.iphoneNumber); 

            }
          }
          else{
            this.iphoneNumber = '';
          }       
        }
      }
      else{
        this.invalidNumber = (newValue.errorVal) ? true : false; 
        this.phoneNumberValid = true;
        this.icountryName = '';
        this.icountryCode = '';        
        this.idialCode = '';
        this.iphoneNumber = '';
      }      
    }
    else{
      this.invalidNumber = (newValue.errorVal) ? true : false; 
      this.phoneNumberValid = true;
      this.icountryName = '';
      this.icountryCode = '';      
      this.idialCode = '';
      this.iphoneNumber = '';
    }
  } 
  

}