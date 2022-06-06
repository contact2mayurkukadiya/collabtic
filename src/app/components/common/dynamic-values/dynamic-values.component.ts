import { Component, OnInit, Input } from '@angular/core';
import { industryTypes } from '../../../common/constant/constant';

@Component({
  selector: 'app-dynamic-values',
  templateUrl: './dynamic-values.component.html',
  styleUrls: ['./dynamic-values.component.scss']
})
export class DynamicValuesComponent implements OnInit {

  @Input() apiFields: any = [];
  @Input() banner: string = "";
  @Input() defaultBanner: boolean = false;
  @Input() public group: any = "";
  @Input() industryType: any = industryTypes[0];

  public optionTxt: string = "Options";
  public platform: any = localStorage.getItem('platformId');

  public dynamicValues: any = [
    {
      group: 1,
      items: [],
      optFlag: false,
      toggleTxt: "Show",
      optFields: []
    },
    {
      group: 2,
      items: [],
      optFlag: false,
      toggleTxt: "Show",
      optFields: []
    },
    {
      group: 3,
      items: [],
      optFlag: false,
      toggleTxt: "Show",
      optFields: []
    }  
  ];
  public emptyCont: string = "<i class='gray'>None</i>";
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.platform, this.banner, this.industryType, this.apiFields)    
    for(let f in this.apiFields) {
      //console.log(this.apiFields[f])
      let optFlag = this.apiFields[f].optField;
      let group = this.apiFields[f].group;
      let fieldName = this.apiFields[f].fieldName;
      let formatAttr = this.apiFields[f].formatAttr;
      let formatType = this.apiFields[f].formatType;
      let val = (formatAttr == 1) ? this.apiFields[f].formValueItems : this.apiFields[f].formValue;
      if(fieldName != 'threadType') {
        this.apiFields[f].selectedVal = val; 
      }
            
      this.apiFields[f].isArray = (formatType == 1 || fieldName == 'SelectProductType') ? false : true;
      if(this.apiFields[f].isArray && !Array.isArray(val)) {
        val = [val];
        this.apiFields[f].selectedVal = val;
      }
      //console.log(this.apiFields[f].fieldName, this.apiFields[f].selectedVal)
      //console.log(group);
      let di = this.dynamicValues.findIndex(option => option.group === group);
      //console.log(di);
      if(fieldName == 'miles') {
        let prevIndex = parseInt(f)-1;
        let preVal = this.apiFields[prevIndex].selectedVal;
        let optVal = this.apiFields[f].selectedVal;
        //console.log(1, preVal, optVal)
        if(preVal != '' && preVal != '""') {
          this.apiFields[prevIndex].selectedVal = `${preVal} <span class="joined-field">${optVal}</span>`;
        } else {
          this.apiFields[prevIndex].selectedVal = "";
        }       
      } else {
        if(optFlag) {
          this.dynamicValues[di].optFields.push(this.apiFields[f]);
        } else {
          this.dynamicValues[di].items.push(this.apiFields[f]);
        }
      }
    }
    
    //console.log(this.dynamicValues)
    if(this.industryType.id == 2)
      this.rearrangeField(this.dynamicValues[0].items, 'odometer')
  }

  onToggle(data) {
    let flag = data.optFlag;
    flag = (flag) ? false : true;
    data.optFlag = flag;
    data.toggleTxt = (flag) ? 'Hide' : 'Show';
  }

  rearrangeField(d, item) {
    let r = [];
    let index = -1;
    let yearIndex = -1;
    d.forEach((e, i) => {
      if (e['fieldName'] === item) {
        index = i;
        r.unshift(e);
      }
      
      if(e['fieldName'] === 'year') {
        yearIndex = i;
      }
    });

    if(index >= 0)
      d.splice(index, 1);

    d.splice(yearIndex+1, 0, r[0]);
  }

}