import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile/profile.service';
import { countries } from 'country-data';

@Component({
  selector: 'app-profile-business',
  templateUrl: './profile-business.component.html',
  styleUrls: ['./profile-business.component.scss']
})
export class ProfileBusinessComponent implements OnInit {

  @Input() businessPageData;

  public loadingrs:boolean=true;
  public roleId;
  public businessId;
  public optionsval;
  public businessName;
  public businessTitle;
  public businessEmail;
  public businessAddress1;
  public businessAddress2;
  public businessCity;
  public businessState;
  public businessZipcode;
  public businessLandline;
  public businessPhone;
  public businessStoreNo;
  public business_landline_ext;
  public businessofficeCode;
  public platformId;

  public businessProfileEdit: boolean = false;
  public profileInfo: boolean = true;

  public profileErrorMsg;
  public profileError;

  form: FormGroup;
  loading = false;
  submitted = false;

  public businessNumberData:any;
  public icountryName = '';
  public icountryCode = '';  
  public idialCode = '';
  public iphoneNumber = '';

  public landlineNumberData:any;
  public lcountryName = '';
  public lcountryCode = '';  
  public ldialCode = '';
  public lphoneNumber = '';

  public phoneNumberValid:boolean = false;
  public invalidNumber:boolean = true; 
  
  public phoneNumberValid1:boolean = false;
  public invalidNumber1:boolean = true; 

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {

    this.businessProfileView(); 
  
  }

   // view profile info
   businessProfileView(){

    this.optionsval=(this.businessPageData); 
    //console.log(this.businessPageData);     
    this.businessName= (this.optionsval.businessName == '' || this.optionsval.businessName == null || this.optionsval.businessName == undefined )? '' : this.optionsval.businessName;
    this.businessTitle= (this.optionsval.businessTitle == '' || this.optionsval.businessTitle == null || this.optionsval.businessTitle == undefined )? '' : this.optionsval.businessTitle;
    this.businessEmail= (this.optionsval.businessEmail == '' || this.optionsval.businessEmail == null || this.optionsval.businessEmail == undefined )? '' : this.optionsval.businessEmail;
    this.businessAddress1= (this.optionsval.businessAddress1 == '' || this.optionsval.businessAddress1 == null || this.optionsval.businessAddress1 == undefined )? '' : this.optionsval.businessAddress1;
    this.businessAddress2= (this.optionsval.businessAddress2 == '' || this.optionsval.businessAddress2 == null || this.optionsval.businessAddress2 == undefined )? '' : this.optionsval.businessAddress2;
    this.businessCity= (this.optionsval.businessCity == '' || this.optionsval.businessCity == null || this.optionsval.businessCity == undefined )? '' : this.optionsval.businessCity;  
    this.businessState= (this.optionsval.businessState == '' || this.optionsval.businessState == null || this.optionsval.businessState == undefined )? '' : this.optionsval.businessState;
    this.businessZipcode= (this.optionsval.businessZipcode == '' || this.optionsval.businessZipcode == null || this.optionsval.businessZipcode == undefined )? '' : this.optionsval.businessZipcode;       
     
    this.businessStoreNo= (this.optionsval.businessStoreNo == '' || this.optionsval.businessStoreNo == null || this.optionsval.businessStoreNo == undefined )? '' : this.optionsval.businessStoreNo;         
    this.business_landline_ext= this.optionsval.business_landline_ext;  
    this.businessofficeCode = (this.optionsval.businessofficeCode == '' || this.optionsval.businessofficeCode == null || this.optionsval.businessofficeCode == undefined )? '' : this.optionsval.businessofficeCode;

    this.icountryName= (this.optionsval.businessCountry == '' || this.optionsval.businessCountry == null || this.optionsval.businessCountry == undefined )? '' : this.optionsval.businessCountry;            
    this.icountryCode= (this.optionsval.businessCountryCode == '' || this.optionsval.businessCountryCode == null || this.optionsval.businessCountryCode == undefined )? '' : this.optionsval.businessCountryCode;             
    this.idialCode= (this.optionsval.businessDialCode == '' || this.optionsval.businessDialCode == null || this.optionsval.businessDialCode == undefined )? '' : this.optionsval.businessDialCode;
    this.businessPhone= (this.optionsval.businessPhone == '' || this.optionsval.businessPhone == null || this.optionsval.businessPhone == undefined )? '' : this.optionsval.businessPhone;            
    this.iphoneNumber = this.businessPhone;

    this.businessNumberData = {  
      'countryCode': this.icountryCode, 
      'phoneNumber' : this.iphoneNumber,
      'country': this.icountryName, 
      'dialCode' : this.idialCode,
      'access': 'business'
    }

    this.lcountryName= (this.optionsval.landLinecountryName == '' || this.optionsval.landLinecountryName == null || this.optionsval.landLinecountryName == undefined )? '' : this.optionsval.landLinecountryName;            
    this.lcountryCode= (this.optionsval.landLinecountryCode == '' || this.optionsval.landLinecountryCode == null || this.optionsval.landLinecountryCode == undefined )? '' : this.optionsval.landLinecountryCode;             
    this.ldialCode= (this.optionsval.landLinedialCode == '' || this.optionsval.landLinedialCode == null || this.optionsval.landLinedialCode == undefined )? '' : this.optionsval.landLinedialCode;
    this.businessLandline= (this.optionsval.businessLandline == '' || this.optionsval.businessLandline == null || this.optionsval.businessLandline == undefined )? '' : this.optionsval.businessLandline;           
    this.lphoneNumber = this.businessLandline;  
    
    this.landlineNumberData = {  
      'countryCode': this.lcountryCode, 
      'phoneNumber' : this.lphoneNumber,
      'country': this.lcountryName, 
      'dialCode' : this.ldialCode,
      'access': 'landline'
    }
     
    if(this.businessEmail==''){        
      this.profileErrorMsg = "No Data";  
      this.profileError = true; 
    }
    
    this.loadingrs = false;
    this.profileInfo = true;    
     
    if(this.optionsval.platformId != '1'){
      this.businessProfileEdit = (parseInt(this.optionsval.loginUserId) == parseInt(this.optionsval.userId)) ? true : false;
    }
    else{
      this.businessProfileEdit = ( this.optionsval.roleId == '3' || (parseInt(this.optionsval.loginUserId) == parseInt(this.optionsval.userId))) ? true : false;
    }

  }  

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  editBusinessInfo(){
    
    this.profileInfo = false;   
    this.profileError = false;  

    this.form = this.formBuilder.group({
      businessName: [this.businessName, []],        
      businessTitle: [this.businessTitle, []],                                 
      businessEmail: [this.businessEmail, [Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],      
      business_landline_ext: [this.business_landline_ext, []], 
      //businessLandline: [this.businessLandline ],       
      businessStoreNo: [this.businessStoreNo, []],
      businessAddress1: [this.businessAddress1, []],
      businessAddress2: [this.businessAddress2, []],
      businessCity: [this.businessCity, []],        
      businessState: [this.businessState, []],
      businessZipcode: [this.businessZipcode, [Validators.pattern(/^[0-9]\d*$/)]],
      officeCode: [this.businessofficeCode, []],

    });
     

  }

  onBusinessProfileSubmit(){
    this.submitted = true;

    if(this.iphoneNumber.length > 0){
      this.invalidNumber = this.phoneNumberValid ? false : true;
    }
    else{
      this.invalidNumber = true;
    }

    if(this.lphoneNumber.length > 0){
      this.invalidNumber1 = this.phoneNumberValid1 ? false : true;
    }
    else{
      this.invalidNumber1 = true;
    }

    // stop here if form is invalid
    if (this.form.invalid || (this.iphoneNumber.length > 0 && this.phoneNumberValid) || (this.lphoneNumber.length > 0 && this.phoneNumberValid1)) {
      return;
    }

    if(this.businessProfileEdit){
      this.profileErrorMsg = '';  
      this.profileError = false; 
      this.loadingrs = true;
      const apiFormData = new FormData();
      apiFormData.append('apiKey', this.optionsval.apiKey);
      apiFormData.append('domainId', this.optionsval.domainId);
      apiFormData.append('countryId', this.optionsval.countryId);
      apiFormData.append('userId', this.optionsval.userId);
      apiFormData.append('loginId', this.optionsval.loginUserId);
      apiFormData.append('businessName', this.businessName);
      apiFormData.append('businessTitle', this.businessTitle);    
      apiFormData.append('bussinessEmail', this.businessEmail);

      apiFormData.append('landLineExt', this.business_landline_ext);
      apiFormData.append('businessAddress1', this.businessAddress1);
      apiFormData.append('businessAddress2', this.businessAddress2);
      apiFormData.append('businessCity', this.businessCity);
      apiFormData.append('businessState', this.businessState);
      apiFormData.append('businessZipcode', this.businessZipcode);
      apiFormData.append('businessStoreNo', this.businessStoreNo);
      apiFormData.append('officeCode', this.businessofficeCode);
      apiFormData.append('profileUpdate', '2'); 
      
      if(this.iphoneNumber!=''){
        this.iphoneNumber = this.iphoneNumber.replace(/^0+/, '');
        console.log(this.iphoneNumber); 
      }
      apiFormData.append('businessPhone', this.iphoneNumber);
      apiFormData.append('countryName', this.icountryName);  
      apiFormData.append('countryCode', this.icountryCode);  
      apiFormData.append('dialCode', this.idialCode); 

      if(this.lphoneNumber!=''){
        this.lphoneNumber = this.lphoneNumber.replace(/^0+/, '');
        console.log(this.lphoneNumber); 
      }
      apiFormData.append('businessLandline', this.lphoneNumber);
      apiFormData.append('landLinecountryName', this.lcountryName);  
      apiFormData.append('landLinecountryCode', this.lcountryCode);  
      apiFormData.append('landLinedialCode', this.ldialCode); 

           
      this.profileService.updateUserProfile(apiFormData).subscribe(res => {
        
        if(res.status=='Success'){                       
          let profileData = res.data;          
          if(profileData != ''){ 
            this.getBusinessProfileInfo();            
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

  onCancelBusinessProfile(){
    this.profileInfo = true;
    this.businessProfileView();
  }

  getBusinessProfileInfo(){
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
         let profileData = res.data
        
         if(profileData != ''){ 

          this.businessPageData = {
            'apiKey': this.optionsval.apiKey,
            'roleId': this.optionsval.roleId,
            'platformId': this.optionsval.platformId,
            'userId': this.optionsval.userId,
            'loginUserId': this.optionsval.loginUserId,
            'domainId': this.optionsval.domainId,   
            'countryId': this.optionsval.countryId,          
            'businessName': profileData.businessName,
            'businessTitle': profileData.businessTitle,
            'businessEmail': profileData.businessEmail,
            'businessAddress1': profileData.businessAddress1,
            'businessAddress2': profileData.businessAddress2,
            'businessCity': profileData.businessCity,   
            'businessState': profileData.businessState,
            'businessZipcode': profileData.businessZipcode,         
            'landLinecountryName': profileData.landLinecountryName,
            'landLinecountryCode': profileData.landLinecountryCode,
            'landLinedialCode': profileData.landLinedialCode,                
            'businessLandline': profileData.businessLandline,               
            'businessCountry': profileData.businessCountry,
            'businessCountryCode': profileData.businessCountryCode,
            'businessDialCode': profileData.businessDialCode,  
            'businessPhone': profileData.businessPhone,             
            'businessStoreNo': profileData.businessStoreNo,           
            'business_landline_ext': profileData.business_landline_ext,
            'businessofficeCode':profileData.businessofficeCode
          };
          this.businessProfileView();
          
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
    getBusinessNumberData(newValue){
      console.log(newValue);
      
      if(newValue != null){
        if(newValue.access == 'business'){
          if(newValue.phoneVal != null){      
            let placeHolderValueTrim = '';
            let placeHolderValueLen = 0 ;
            let placeHolderValue = newValue.placeholderVal;
            placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
            placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
            placeHolderValueLen = placeHolderValueTrim.length;   
            
            let currPhValueTrim = '';
            let currPhValueLen = 0 ;      
            if(newValue.phoneVal['number'] != ''){
              currPhValueTrim = newValue.phoneVal['number'].replace(/[^\w]/g, "");
              currPhValueTrim = currPhValueTrim.replace(/^0+/, '');
              currPhValueLen = currPhValueTrim.length;   
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
      else{
        this.invalidNumber = (newValue.errorVal) ? true : false; 
        this.phoneNumberValid = true;
        this.icountryName = '';
        this.icountryCode = '';      
        this.idialCode = '';
        this.iphoneNumber = '';
      }  
        
  
    } 
  
    
      // country & phone number update
  getLandlineNumberData(newValue){
    console.log(newValue);
    
    if(newValue != null){
      if(newValue.access == 'landline'){
        if(newValue.phoneVal != null){      
          let placeHolderValueTrim = '';
          let placeHolderValueLen = 0 ;
          let placeHolderValue = newValue.placeholderVal;
          placeHolderValueTrim = placeHolderValue.replace(/[^\w]/g, "");
          placeHolderValueTrim = placeHolderValueTrim.replace(/^0+/, '');
          placeHolderValueLen = placeHolderValueTrim.length;   
          
          let currPhValueTrim = '';
          let currPhValueLen = 0 ;      
          if(newValue.phoneVal['number'] != ''){
            currPhValueTrim = newValue.phoneVal['number'].replace(/[^\w]/g, "");
            currPhValueTrim = currPhValueTrim.replace(/^0+/, '');
            currPhValueLen = currPhValueTrim.length;   
          }     
          
          if(newValue.phoneVal['number'].length>0){
            this.invalidNumber1 = (newValue.errorVal) ? true : false; 
            
            this.phoneNumberValid1 = true;
            this.lcountryName = '';
            this.lcountryCode = '';          
            this.ldialCode = '';
            this.lphoneNumber = '';
            this.lphoneNumber = newValue.phoneVal.number;

            if(currPhValueLen == placeHolderValueLen){ 
              this.phoneNumberValid1 = false;

              let getCode = newValue.phoneVal.countryCode;        
              this.lcountryName = countries[getCode].name;
              this.lcountryCode = newValue.phoneVal.countryCode;            
              this.ldialCode = newValue.phoneVal.dialCode;
              this.lphoneNumber = newValue.phoneVal.number;

              console.log(this.lphoneNumber); 

            }
          }
          else{
            this.lphoneNumber = '';
          }       
        }
        else{
          this.invalidNumber1 = (newValue.errorVal) ? true : false; 
          this.phoneNumberValid1 = true;
          this.lcountryName = '';
          this.lcountryCode = '';        
          this.ldialCode = '';
          this.lphoneNumber = '';
        }
      }
    }
    else{
      this.invalidNumber1 = (newValue.errorVal) ? true : false; 
      this.phoneNumberValid1 = true;
      this.lcountryName = '';
      this.lcountryCode = '';      
      this.ldialCode = '';
      this.lphoneNumber = '';
    }  
      

  } 
  
  

}
