import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { PagenotfoundComponent } from "./components/pagenotfound/pagenotfound.component";
import { ForbiddenComponent } from "./components/forbidden/forbidden.component";
import { AuthGuard } from "./components/_helpers/auth.guard";
import { VideoCallComponent } from './video-call/video-call.component';
import { DeepLinkComponent } from './components/deep-link/deep-link.component';
import { EscalationWidgetsComponent } from './components/common/escalation-widgets/escalation-widgets.component';
import { UnderMaintenanceComponent } from './components/under-maintenance/under-maintenance.component';

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./modules/authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./modules/authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: "home/:platformId/:domainId/:uid/:accessId",
    component: HomeComponent,
  },
  {
    path: "home/:platformId/:domainId/:uid/:accessId/:workstreamId",
    component: HomeComponent,
  },
  {
    path: "home/:platformId/:domainId/:uid/:accessId/:action/:actionId",
    component: HomeComponent,
  },
  {
    path: "home/:platformId/:domainId/:uid/:accessId",
    component: HomeComponent,
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "mis/dashboard",
    loadChildren: () =>
      import("./modules/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "workstreams",
    loadChildren: () =>
      import("./modules/workstreams/workstreams.module").then(
        (m) => m.WorkstreamsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "forbidden",
    component: ForbiddenComponent,
  },
  {
    path: "product-matrix",
    loadChildren: () =>
      import("./modules/product-matrix/product-matrix.module").then(
        (m) => m.ProductMatrixModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "parts",
    loadChildren: () =>
      import("./modules/parts/parts.module").then((m) => m.PartsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "user-dashboard",
    loadChildren: () =>
      import("./modules/user-dashboard/user-dashboard.module").then(
        (m) => m.UserDashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "export-option",
    loadChildren: () =>
      import("./modules/export-option/export-option.module").then(
        (m) => m.ExportOptionModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "landing-page",
    data: {
      reuse: true,
    },
    loadChildren: () =>
      import("./modules/landingpage/landingpage.module").then(
        (m) => m.LandingpageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "media-manager",
    loadChildren: () =>
      import("./modules/media-manager/media-manager.module").then(
        (m) => m.MediaManagerModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "escalations",
    loadChildren: () =>
      import("./modules/escalations/escalations.module").then(
        (m) => m.EscalationsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "ppfr",
    loadChildren: () =>
      import("./modules/escalations-ppfr/escalations-ppfr.module").then(
        (m) => m.EscalationsPpfrModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "chat-page",
    loadChildren: () =>
      import("./modules/chat/chat.module").then((m) => m.ChatModule),
    canActivate: [AuthGuard],
  },
  {
    path: "workstreams-page",
    data: {
      reuse: true,
    },
    loadChildren: () =>
      import("./modules/workstreams-landing/workstreams-landing.module").then(
        (m) => m.WorkstreamsLandingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "search-page",
    data: {
      reuse: true,
    },
    loadChildren: () =>
      import("./modules/search/search.module").then((m) => m.SearchModule),
    canActivate: [AuthGuard],
  },
  {
    path: "threads",
    loadChildren: () =>
      import("./modules/threads-landing/threads-landing.module").then(
        (m) => m.ThreadsLandingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "knowledgearticles",
    loadChildren: () =>
      import(
        "./modules/knowledge-article-landing/knowledge-article.module"
      ).then((m) => m.KnowledgeArticleModule),
    canActivate: [AuthGuard],
  },
  {
    path: "gts",
    loadChildren: () => import("./modules/gts/gts.module").then((m) => m.GtsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "profile/:puid",
    loadChildren: () =>
      import("./modules/profile/profile.module").then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: "documents",
    loadChildren: () =>
      import("./modules/techinfopro/techinfopro.module").then(
        (m) => m.TechinfoproModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "announcements",
    loadChildren: () =>
      import("./modules/announcement/announcement.module").then(
        (m) => m.AnnouncementModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'escalation-tvs',
    component: EscalationWidgetsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "sib",
    loadChildren: () =>
      import("./modules/sib/sib.module").then((m) => m.SibModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'video-call',
    component: VideoCallComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'video-call/:sessionId/:token',
    component: VideoCallComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "knowledge-base",
    loadChildren: () =>
      import("./modules/knowledge-base/knowledge-base.module").then((m) => m.KnowledgeBaseModule),
    canActivate: [AuthGuard],
  },
  {
    path: "escalation-management",
    loadChildren: () =>
      import("./modules/escalation-management/escalation-management.module").then((m) => m.EscalationManagementModule),
    canActivate: [AuthGuard],
  },
  {
    path: "under-maintenance",
    component: UnderMaintenanceComponent,
  },
  {
    path: "deep-link",
    component: DeepLinkComponent,
  },
  {
    path: "dtc",
    loadChildren: () =>
      import("./modules/dtc/dtc.module").then((m) => m.DtcModule),
    canActivate: [AuthGuard],
  },
  {
    path: "dispatch",
    loadChildren: () =>
      import("./modules/dispatch/dispatch.module").then(
        (m) => m.DispatchModule
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: "**",
    component: PagenotfoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: "legacy",
      scrollPositionRestoration: "disabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
