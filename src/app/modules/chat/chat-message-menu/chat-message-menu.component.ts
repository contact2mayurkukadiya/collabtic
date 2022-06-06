import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatType, Constant, forumPageAccess, LocalStorageItem, MessageUserType } from 'src/app/common/constant/constant';
import { InputChat, LandingLeftSideMenuComponent } from 'src/app/components/common/landing-left-side-menu/landing-left-side-menu.component';
import { MemberToGroup } from 'src/app/models/chatmodel';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat-message-menu',
  templateUrl: './chat-message-menu.component.html',
  styleUrls: ['./chat-message-menu.component.scss']
})
export class ChatMessageMenuComponent implements OnInit {
  chatuserTypeSelf = MessageUserType.self;
  chatuserTypeOther = MessageUserType.other;
  chatTypeDMChat = ChatType.DirectMessage;
  @Output() ReloadChatSection = new EventEmitter<any>();
  @Input() leftmenucomponent : LandingLeftSideMenuComponent;
  @Input() chatType: string;
  public user: any;
  domainId: string;
  countryId: string;
  userId:string;
  constructor(
    private chatService: ChatService,
    private authenticationService: AuthenticationService, 
  ) { }
  @Input() chatmessage : any;
  @Input() messageUserType : string;
  @Output() deleteMessage =  new EventEmitter<any>();
  @Output() replyMessage =  new EventEmitter<any>();
  ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
  }
  OpenUserProfile(userid)
  {
    var aurl=forumPageAccess.profilePage+userid;
    window.open(aurl, '_blank');
  }

  DeleteChatMessage(id)
  {
    this.deleteMessage.emit(id);
  }
  ReplyChatMessage(message)
  {
    this.replyMessage.emit(message);
  }
  GroupName:string ;
  startNewChat(user){
    console.log('startNewChat');
    console.log(user);
    this.GroupName = "" ;
    this.SaveMembersToGroup(user);
  }
  SaveMembersToGroup(user){
    this.GroupName = "";    
    let alldomainusers :MemberToGroup=  this.prepareMemberData(user);
    console.log(alldomainusers);
    this.chatService.AddMemeberToGroup(alldomainusers).subscribe(resp=>{ 
     
      console.log('added to ');
      console.log(resp);
     
      let chatGroupId = resp.chatGroupId;  
      this.leftmenucomponent.ReloadGrouAndDMChatMenu(chatGroupId,ChatType.DirectMessage);
      let displayname  =  user.userName;
      let profileImage  =  user.profileImg;
      let pushitem : InputChat = { id :chatGroupId,name:displayname,chatType:ChatType.DirectMessage,profileImg:profileImage,contentType:{}};
      this.ClearChatSessionforRedirect();
      this.ReloadChatSection.emit(pushitem);
  }); 
  }
  prepareMemberData(user):MemberToGroup {
    let memberUserId:any[]=[];
    let removememberId:any[]=[];
    let memberToGroup : MemberToGroup = new MemberToGroup();
    memberToGroup.apiKey =  Constant.ApiKey;
    memberToGroup.chatGroupId ="0" ;     
    memberToGroup.domainId = this.domainId; 
    memberToGroup.countryId = this.countryId;       
    memberToGroup.chatType = ChatType.DirectMessage;    
    memberToGroup.userId = this.userId;
    memberUserId.push(user.userId);
    memberUserId.push(this.userId) ;    
    memberToGroup.newMembers =(memberUserId.length > 0)? JSON.stringify(memberUserId):"";    
    memberToGroup.removeMembers =(removememberId.length > 0)? JSON.stringify(removememberId):"";  
    memberToGroup.groupName = this.GroupName;
    
    
    return memberToGroup;
  }
  ClearChatSessionforRedirect(){
    localStorage.removeItem(LocalStorageItem.reloadChatGroupId);
    localStorage.removeItem(LocalStorageItem.reloadChatType);
  }
  isReplyMessageExist(chat):boolean{
    // some code where value of x changes and than you want to check whether it is null or some object with values
    if (chat != null && chat!=undefined && chat.originalMessage !=null && chat.originalMessage !=undefined)
    {
      let om = chat.originalMessage;
      if(Object.keys(om).length){
        return true; 
        }
    }      
    return false;
  }
}
