import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatIconModule,
  MatSliderModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatMenuModule,
  MatToolbarModule,
} from "@angular/material";
import { MatExpansionModule } from "@angular/material/expansion";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { NgxImageCompressService } from "ngx-image-compress";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DpDatePickerModule } from "ng2-date-picker";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { GoogleChartsModule } from 'angular-google-charts';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ClickOutsideModule } from "ng-click-outside";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { AccordionModule } from "primeng/accordion";
import { MatBadgeModule } from "@angular/material";
import { EditorModule } from "primeng/editor";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputNumberModule } from "primeng/inputnumber";
import { SliderModule } from "primeng/slider";
import { NgxMaskModule, IConfig } from "ngx-mask";
import { BsDropdownModule, BsDropdownConfig } from "ngx-bootstrap/dropdown";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";

import { FilterComponent } from "../../components/common/filter/filter.component";
import { ScrollTopService } from "../../services/scroll-top.service";
import { HeaderComponent } from "../../layouts/header/header.component";
import { ProbingHeaderComponent } from "../../layouts/probing-header/probing-header.component";
import { ProductHeaderComponent } from "../../layouts/product-header/product-header.component";
import { SidebarComponent } from "../../layouts/sidebar/sidebar.component";
import { FooterComponent } from "../../layouts/footer/footer.component";
import { RemoveWhiteSpacePipe } from "../../common/pipes/remove-white-space.pipe";
import { ConfirmationComponent } from "../../components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "../../components/common/submit-loader/submit-loader.component";
import { SuccessComponent } from "../../components/common/success/success.component";
import { SuccessModalComponent } from "../../components/common/success-modal/success-modal.component";
import { ProductMakeComponent } from "../../components/common/product-make/product-make.component";
import { WorkstreamListComponent } from "../../components/common/workstream-list/workstream-list.component";
import { ApplicationComponent } from "../../components/common/application/application.component";
import { TagViewComponent } from "../../components/common/tag-view/tag-view.component";
import { ErrorCodeViewComponent } from "../../components/common/error-code-view/error-code-view.component";
import { AttachmentViewComponent } from "../../components/common/attachment-view/attachment-view.component";
import { SystemInfoViewComponent } from "../../components/common/system-info-view/system-info-view.component";
import { ModelsComponent } from "../../components/common/models/models.component";
import { YearsComponent } from "../../components/common/years/years.component";
import { SecWorkstreamsComponent } from "../../components/common/sec-workstreams/sec-workstreams.component";
import { TagsComponent } from "../../components/common/tags/tags.component";
import { ActionFormComponent } from "../../components/common/action-form/action-form.component";
import { ErrorCodeListsComponent } from "../../components/common/error-code-lists/error-code-lists.component";
import { ManageListComponent } from "../../components/common/manage-list/manage-list.component";
import { ManageGeoListComponent } from "../../components/common/manage-geo-list/manage-geo-list.component";
import { RelatedThreadListsComponent } from "../../components/common/related-thread-lists/related-thread-lists.component";
import { MakeComponent } from "../../components/common/make/make.component";
import { FileAttachmentComponent } from "../../components/common/file-attachment/file-attachment.component";
import { FileUploadModule } from "primeng/fileupload";
import { UploadAttachmentsComponent } from "../../components/common/upload-attachments/upload-attachments.component";
import { InputTextModule } from "primeng/inputtext";
import { LandingpageHeaderComponent } from "../../layouts/landingpage-header/landingpage-header.component";
import { LandingLeftSideMenuComponent } from "../../components/common/landing-left-side-menu/landing-left-side-menu.component";
import { DomainMembersComponent } from "../../components/common/domain-members/domain-members.component";
import { AnnouncementListComponent } from "../../components/common/announcement-list/announcement-list.component";
import { AnnouncementUserViewComponent } from "../../components/common/announcement-user-view/announcement-user-view.component";
import { AnnouncementWidgetsComponent } from "../../components/common/announcement-widgets/announcement-widgets.component";
import { EscalationWidgetsComponent } from "../../components/common/escalation-widgets/escalation-widgets.component";
import { RecentViewedWidgetsComponent } from "../../components/common/recent-viewed-widgets/recent-viewed-widgets.component";
import { RecentSearchesWidgetsComponent } from "../../components/common/recent-searches-widgets/recent-searches-widgets.component";
import { MyMetricsWidgetsComponent } from "../../components/common/my-metrics-widgets/my-metrics-widgets.component";
import { LandingReportWidgtsComponent } from "../../components/common/landing-report-widgts/landing-report-widgts.component";
import { AddLinkComponent } from "../../components/common/add-link/add-link.component";
import { MediaTypesComponent } from "../../components/common/media-types/media-types.component";
import { AppUserNotificationsComponent } from "../../components/common/app-user-notifications/app-user-notifications.component";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../../environments/environment";
import { HttpClientModule } from "@angular/common/http";
import { FcmMessagingService } from "../../services/fcm-messaging/fcm-messaging.service";
import { TotaluserPopupComponent } from "./totaluser-popup/totaluser-popup.component";
import { ManageUserComponent } from "../../components/common/manage-user/manage-user.component";
import { ThreadsPageComponent } from "../../components/common/threads-page/threads-page.component";
import { StatusComponent } from "../../components/common/status/status.component";
import { MediaInfoComponent } from "../../components/common/media-info/media-info.component";
import { PartsListComponent } from "../../components/common/parts-list/parts-list.component";
import { GridsterModule } from "angular-gridster2";
import { NgxMasonryModule } from "ngx-masonry";
import { NgxYoutubePlayerModule } from "ngx-youtube-player";
import { PhoneMaskDirective } from "../../phone-mask.directive";
// import { DragDropDirective } from 'src/app/common/directive/drag-drop.directive';
import {
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";
import { EmptyContainerComponent } from "../../components/common/empty-container/empty-container.component";
import { AuthFooterComponent } from "../../components/common/auth-footer/auth-footer.component";
import { AuthRightPanelComponent } from "../../components/common/auth-right-panel/auth-right-panel.component";
import { AuthSuccessComponent } from "../../components/common/auth-success/auth-success.component";
import { DomainUrlComponent } from "../../components/common/domain-url/domain-url.component";
import { ForgotpasswordComponent } from "../../components/common/forgotpassword/forgotpassword.component";
import { NonUserComponent } from "../../components/common/non-user/non-user.component";
import { ContentPopupComponent } from '../../components/common/content-popup/content-popup.component';
import { VerifyEmailComponent } from "../../components/common/verify-email/verify-email.component";
import { ProfileBusinessComponent } from "../../components/common/profile-business/profile-business.component";
import { ProfilePersonalComponent } from "../../components/common/profile-personal/profile-personal.component";
import { ProfileMetricsComponent } from "../../components/common/profile-metrics/profile-metrics.component";
import { ProfileCertificateComponent } from "../../components/common/profile-certificate/profile-certificate.component";
import { ChangePasswordComponent } from "../../components/common/change-password/change-password.component";
import { CreateFolderComponent } from "../../components/common/create-folder/create-folder.component";
import { MultiSelectComponent } from "../../components/common/multi-select/multi-select.component";
import { DynamicFieldsComponent } from "../../components/common/dynamic-fields/dynamic-fields.component";
import { DynamicValuesComponent } from "../../components/common/dynamic-values/dynamic-values.component";
import { DynamicPageViewComponent } from '../../components/common/dynamic-page-view/dynamic-page-view.component';
import { DynamicDetailHeaderComponent } from '../../layouts/dynamic-detail-header/dynamic-detail-header.component';
import { ImageCropperComponent } from "../../components/common/image-cropper/image-cropper.component";
import { ImageCropperModule } from "../../image-cropper/image-cropper.module";
import { CertificationComponent } from "../../components/common/certification/certification.component";
import { FollowersFollowingComponent } from "../../components/common/followers-following/followers-following.component";
import { CommonNotificationsComponent } from "../../components/common/common-notifications/common-notifications.component";
import { NewEditHeaderComponent } from '../../layouts/new-edit-header/new-edit-header.component';
import { ThreadDetailHeaderComponent } from "../../layouts/thread-detail-header/thread-detail-header.component";
import { ThreadDetailViewComponent } from "../../components/common/thread-detail-view/thread-detail-view.component";
import { DetailViewComponent } from "../../components/common/detail-view/detail-view.component";
import { DocumentsComponent } from "src/app/components/common/documents/documents.component";
import { FilesComponent } from "src/app/components/common/documents/files/files.component";
import { FoldersComponent } from "src/app/components/common/documents/folders/folders.component";
import { DocInfoComponent } from "src/app/components/common/doc-info/doc-info.component";
import { TableModule } from "primeng/table";
import { CountryPhonenumberComponent } from "../../components/common/country-phonenumber/country-phonenumber.component";
import { ExportPopupComponent } from "../../components/common/export-popup/export-popup.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { KnowledgeArticlesComponent } from "src/app/components/common/knowledge-articles/knowledge-articles.component";
import { WelcomeHomeComponent } from "../../components/common/welcome-home/welcome-home.component";
import { ManageProductCodesComponent } from "../../components/common/manage-product-codes/manage-product-codes.component";
import { VehicleModelsComponent } from "src/app/components/vehicle-models/vehicle-models.component";
import { EmissionsComponent } from '../../components/emissions/emissions.component';
import { ManageListComponentGTS } from "src/app/components/common/manage-list-gts/manage-list.component";
import { GtsListsComponent } from "src/app/components/common/gts-lists/gts-lists.component";
import { SibListComponent } from 'src/app/components/common/sib-list/sib-list.component';
import { SibApplicationComponent } from 'src/app/components/common/sib-application/sib-application.component';
import { SelectCountryComponent } from '../../components/common/select-country/select-country.component';
import { KnowledgeBaseListComponent } from '../../components/common/knowledge-base-list/knowledge-base-list.component';
import { CardModule } from "primeng/card";
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { CustomAccordionTabComponent } from "src/app/components/common/custom-accordion-tab/custom-accordion-tab.component";
import { SupportRequestWidgetComponent } from "src/app/components/common/support-request-widget/support-request-widget.component";
import { DialogPopupComponent } from 'src/app/components/common/dialog-popup/dialog-popup.component';
import { MediaUploadComponent } from 'src/app/components/media-upload/media-upload.component';
import { MediaAttachmentComponent } from 'src/app/components/common/media-attachment/media-attachment.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { SafePipePipe } from 'src/app/common/pipes/safe-pipe.pipe';
import { RemoveMediaComponent } from 'src/app/components/common/remove-media/remove-media.component';
import { ChipsModule } from 'primeng/chips';
import { DispatchPageComponent } from "../../components/common/dispatch-page/dispatch-page.component";
import { GMapModule } from 'primeng/gmap';
import { AudioDescAttachmentComponent } from 'src/app/components/common/audio-desc-attachment/audio-desc-attachment.component';
import { AudioAttachmentViewComponent } from 'src/app/components/common/audio-attachment-view/audio-attachment-view.component';
import { TagModule } from 'primeng/tag';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
};

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    HeaderComponent,
    ProbingHeaderComponent,
    ProductHeaderComponent,
    SidebarComponent,
    FilterComponent,
    FooterComponent,
    RemoveWhiteSpacePipe,
    ConfirmationComponent,
    SubmitLoaderComponent,
    SuccessComponent,
    SuccessModalComponent,
    WorkstreamListComponent,
    ProductMakeComponent,
    ApplicationComponent,
    VehicleModelsComponent,
    EmissionsComponent,
    TagViewComponent,
    ErrorCodeViewComponent,
    FileAttachmentComponent,
    AudioDescAttachmentComponent,
    AudioAttachmentViewComponent,
    UploadAttachmentsComponent,
    AttachmentViewComponent,
    SystemInfoViewComponent,
    ModelsComponent,
    YearsComponent,
    SecWorkstreamsComponent,
    GtsListsComponent,
    TagsComponent,
    ActionFormComponent,
    ErrorCodeListsComponent,
    ManageListComponent,
    ManageListComponentGTS,
    ManageGeoListComponent,
    RelatedThreadListsComponent,
    MakeComponent,
    LandingpageHeaderComponent,
    LandingLeftSideMenuComponent,
    DomainMembersComponent,
    AnnouncementListComponent,
    AnnouncementUserViewComponent,
    AnnouncementWidgetsComponent,
    EscalationWidgetsComponent,
    RecentViewedWidgetsComponent,
    RecentSearchesWidgetsComponent,
    MyMetricsWidgetsComponent,
    LandingReportWidgtsComponent,
    AddLinkComponent,
    AppUserNotificationsComponent,
    MediaTypesComponent,
    TotaluserPopupComponent,
    ManageUserComponent,
    ThreadsPageComponent,
    KnowledgeArticlesComponent,
    KnowledgeBaseListComponent,
    StatusComponent,
    MediaInfoComponent,
    PartsListComponent,
    EmptyContainerComponent,
    AuthFooterComponent,
    AuthRightPanelComponent,
    AuthSuccessComponent,
    DomainUrlComponent,
    ForgotpasswordComponent,
    NonUserComponent,
    ContentPopupComponent,
    VerifyEmailComponent,
    ProfileBusinessComponent,
    ProfilePersonalComponent,
    ProfileMetricsComponent,
    ProfileCertificateComponent,
    ChangePasswordComponent,
    CreateFolderComponent,
    PhoneMaskDirective,
    MultiSelectComponent,
    DynamicFieldsComponent,
    DynamicValuesComponent,
    DynamicPageViewComponent,
    DynamicDetailHeaderComponent,
    ImageCropperComponent,
    CertificationComponent,
    FollowersFollowingComponent,
    CommonNotificationsComponent,
    FilesComponent,
    FoldersComponent,
    NewEditHeaderComponent,
    ThreadDetailHeaderComponent,
    ThreadDetailViewComponent,
    DetailViewComponent,
    DocumentsComponent,
    DocInfoComponent,
    CountryPhonenumberComponent,
    ExportPopupComponent,
    WelcomeHomeComponent,
    SelectCountryComponent,
    ManageProductCodesComponent,
    SibListComponent,
    SibApplicationComponent,
    CustomAccordionTabComponent,
    SupportRequestWidgetComponent,
    DialogPopupComponent,
    MediaUploadComponent,
    MediaAttachmentComponent,
    SafePipePipe,
    RemoveMediaComponent,
    //DragDropDirective
    DispatchPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // GoogleChartsModule,
    ScrollingModule,
    DragDropModule,
    MatInputModule,
    CKEditorModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSliderModule,
    MatMomentDateModule,
    MatDatepickerModule,
    DpDatePickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    ClickOutsideModule,
    FileUploadModule,
    NgbModule,
    DialogModule,
    DropdownModule,
    MultiSelectModule,
    InputSwitchModule,
    InputNumberModule,
    SliderModule,
    AccordionModule,
    InputTextModule,
    MatBadgeModule,
    EditorModule,
    InputTextModule,
    CalendarModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
    GridsterModule,
    NgxMasonryModule,
    NgxYoutubePlayerModule,
    PerfectScrollbarModule,
    ImageCropperModule,
    TableModule,
    NgxIntlTelInputModule,
    NgxMaskModule.forRoot(),
    BsDropdownModule,
    CardModule,
    PanelModule,
    ChipModule,
    ProgressBarModule,
    MenuModule,
    AutoCompleteModule,
    InputTextareaModule,
    ListboxModule,
    ChipsModule,
    GMapModule,
    CheckboxModule,
    TagModule
  ],
  exports: [
    AccordionModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    CardModule,
    PanelModule,
    ReactiveFormsModule,
    DropdownModule,
    // GoogleChartsModule,
    ScrollingModule,
    MatInputModule,
    CKEditorModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSliderModule,
    MatMomentDateModule,
    MatDatepickerModule,
    DpDatePickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    ClickOutsideModule,
    NgbModule,
    DialogModule,
    HeaderComponent,
    ProbingHeaderComponent,
    ProductHeaderComponent,
    SidebarComponent,
    FilterComponent,
    VehicleModelsComponent,
    EmissionsComponent,
    FooterComponent,
    RemoveWhiteSpacePipe,
    WorkstreamListComponent,
    ApplicationComponent,
    TagViewComponent,
    ErrorCodeViewComponent,
    AttachmentViewComponent,
    KnowledgeArticlesComponent,
    KnowledgeBaseListComponent,
    FileAttachmentComponent,
    AudioDescAttachmentComponent,
    AudioAttachmentViewComponent,
    SystemInfoViewComponent,
    ModelsComponent,
    YearsComponent,
    SecWorkstreamsComponent,
    TagsComponent,
    GtsListsComponent,
    ActionFormComponent,
    ErrorCodeListsComponent,
    MakeComponent,
    FileUploadModule,
    SuccessModalComponent,
    InputTextModule,
    LandingpageHeaderComponent,
    LandingLeftSideMenuComponent,
    DomainMembersComponent,
    AnnouncementListComponent,
    AnnouncementUserViewComponent,
    AnnouncementWidgetsComponent,
    EscalationWidgetsComponent,
    RecentViewedWidgetsComponent,
    RecentSearchesWidgetsComponent,
    MyMetricsWidgetsComponent,
    LandingReportWidgtsComponent,
    MediaTypesComponent,
    MatBadgeModule,
    EditorModule,
    CalendarModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    HttpClientModule,
    TotaluserPopupComponent,
    ThreadsPageComponent,
    StatusComponent,
    MediaInfoComponent,
    PartsListComponent,
    GridsterModule,
    NgxMasonryModule,
    NgxYoutubePlayerModule,
    PerfectScrollbarModule,
    EmptyContainerComponent,
    AuthFooterComponent,
    AuthRightPanelComponent,
    ProfileBusinessComponent,
    ProfilePersonalComponent,
    ProfileMetricsComponent,
    ProfileCertificateComponent,
    PhoneMaskDirective,
    MultiSelectComponent,
    DynamicFieldsComponent,
    DynamicPageViewComponent,
    DynamicDetailHeaderComponent,
    CommonNotificationsComponent,
    DocumentsComponent,
    DynamicValuesComponent,
    FilesComponent,
    FoldersComponent,
    NewEditHeaderComponent,
    ThreadDetailHeaderComponent,
    ThreadDetailViewComponent,
    DetailViewComponent,
    DocInfoComponent,
    CountryPhonenumberComponent,
    NgxIntlTelInputModule,
    ExportPopupComponent,
    SibListComponent,
    SibApplicationComponent,
    CustomAccordionTabComponent,
    SupportRequestWidgetComponent,
    ChipModule,
    ProgressBarModule,
    MenuModule,
    MediaAttachmentComponent,
    AutoCompleteModule,
    InputTextareaModule,
    ListboxModule,
    InputNumberModule,
    SafePipePipe,    
    //AngularFireModule.initializeApp(environment.firebase),
    DispatchPageComponent,
    GMapModule,
    CheckboxModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    NgbActiveModal,
    MatMomentDateModule,
    MatDatepickerModule,
    DpDatePickerModule,
    ScrollTopService,
    NgxImageCompressService,
    FcmMessagingService,
    BsDropdownConfig,
  ],
  entryComponents: [
    ConfirmationComponent,
    SubmitLoaderComponent,
    SuccessComponent,
    ProductMakeComponent,
    ManageListComponent,
    ManageListComponentGTS,
    RelatedThreadListsComponent,
    UploadAttachmentsComponent,
    SuccessModalComponent,
    AddLinkComponent,
    AppUserNotificationsComponent,
    ManageGeoListComponent,
    ManageUserComponent,
    LandingLeftSideMenuComponent,
    AuthSuccessComponent,
    DomainUrlComponent,
    ForgotpasswordComponent,
    NonUserComponent,
    ContentPopupComponent,
    VerifyEmailComponent,
    ChangePasswordComponent,
    CreateFolderComponent,
    CertificationComponent,
    ImageCropperComponent,
    FollowersFollowingComponent,
    ExportPopupComponent,
    WelcomeHomeComponent,
    SelectCountryComponent,
    ManageProductCodesComponent,
    DialogPopupComponent,
    MediaUploadComponent,
    RemoveMediaComponent
  ],
})
export class SharedModule {}
