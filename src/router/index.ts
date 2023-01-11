import { createRouter, createWebHistory } from 'vue-router';
import SideMenu from '../layouts/side-menu/Main.vue';
import SimpleMenu from '../layouts/simple-menu/Main.vue';
import TopMenu from '../layouts/top-menu/Main.vue';
import Login from '@/views/login/Login.vue';
import ErrorPage from '@/views/error-page/ErrorPage.vue';
import { MyStore } from '@/stores/my-store';
import SideMenuMailBox from '@/views/mail-box/SideMenuMailBox.vue';
import ConversationComponent from '@/views/mail-box/conversation/ConversationComponent.vue';
import MainContact from '@/views/contacts/Main.vue';
// BEGIN: TigerBui`
import MailSetting from "@/views/settings/Setting.vue";
import MailSettingMail from "@/views/settings/mail/Mail.vue";
import MailSettingAccounts from "@/views/settings/accounts/accounts.vue";
import MailSettingGeneral from "@/views/settings/general/General.vue";
import MailSettingSignatures from "@/views/settings/signatures/Signatures.vue";
import MailSettingOutOfOffice from "@/views/settings/out-of-office/OutOfOffice.vue";
import MailSettingFilters from "@/views/settings/filters/Main.vue";
import LayoutAdmin from '../layouts/admin/Main.vue';
import AdminDashboard from '@/views/admin/dashboard/Main.vue';
import AdminOrganization from '@/views/admin/organization/Main.vue';
import AdminSpamMain from '@/views/admin/spam-filter/AdminSpamMain.vue';
import AdminAccountManagerMain from '@/views/admin/account-manager/Main.vue';
import AdminEmailTrackerMain from '@/views/admin/email-tracker/Main.vue';
import AdminLogMain from '@/views/admin/log/Main.vue';
import AdminLogin from '@/views/admin/login/Main.vue';
import AdminForgotPassword from '@/views/admin/forgot-password/Main.vue';
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import AdminSpamFilter from "@/views/admin/spam-filter/components/AdminSpamFilter.vue";
import AdminSpamFilterDetail from "@/views/admin/spam-filter/components/AdminSpamFilterDetail.vue";
import MainQuarantine from "@/views/admin/managing-quarantine/Main.vue";
import DelegateAuth from "@/views/admin/delegate-auth/DelegateAuth.vue";
import {MyBrowseStore} from "@/stores/browse-store/browse-store";
import Print from "@/views/print/Print.vue";
import {FolderStore} from "@/stores/folder-store/folder-store";
import {MyAppointmentStore} from "@/stores/appointment-store/appointment-store";
import {MyFilterRuleStore} from "@/stores/filter-rule-store/filter-rule-store";
import {AdminMailGatewayStore} from "@/stores/admin-store/mail-gateway/mail-gateway-store";
import {MyContactStore} from "@/stores/contact-store/contact-store";
import {MyDistributionStore} from "@/stores/distribution-store/distribution-store";
import {MyTagStore} from "@/stores/tag-store/tag-store";
// END: TigerBui`

const routes = [
  {
    path: '/',
    component: SideMenu,
    meta: { requiresAuth: true },
    redirect: 'mail-box',
    children: [
      {
        path: 'mail-box',
        name: 'side-menu-mail-box',
        component: SideMenuMailBox,
        children: [
          {
            path: ':itemId',
            name: 'side-menu-conversation',
            component: ConversationComponent,
          },
          {
            path: 'tag/:tagName',
            name: 'side-menu-tag',
            component: ConversationComponent,
          },
          {
            path: 'setting',
            name: 'mail-setting',
            component: MailSetting,
            children: [
              {
                path: 'general',
                name: 'mailSettingGeneral',
                component: MailSettingGeneral
              },
              {
                path: 'account',
                name: 'mailSettingAccounts',
                component: MailSettingAccounts
              },
              {
                path: 'mail',
                name: 'mail-setting-mail',
                component: MailSettingMail
              },
              {
                path: 'signatures',
                name: "mail-setting-signatures",
                component: MailSettingSignatures
              },
              {
                path: 'out-of-office',
                name: 'mail-setting-out-of-office',
                component: MailSettingOutOfOffice
              },
              {
                path: 'filters',
                name: "mail-setting-filters",
                component: MailSettingFilters
              }
            ]
          }
        ],
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    component: LayoutAdmin,
    meta: { requiresAdminAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          lucideIcon: 'home'
        },
        component: AdminDashboard
      },
      {
        path: 'organization',
        name: 'brandConfig',
        component: AdminOrganization,
        meta: {
          lucideIcon: "building-2"
        }
      },
      /*
      {
        path: 'statistical-report',
        name: 'Thống kê báo cáo',
        meta: {
          lucideIcon: "line-chart"
        }
      },
      {
        path: 'imapsync',
        name: 'Imap Sync',
        meta: {
          lucideIcon: "arrow-left-right"
        }
      },*/
      {
        path: 'account-manager',
        name: 'accountManager',
        component: AdminAccountManagerMain,
        meta: {
          lucideIcon: 'users'
        },
        children: [
          {
            path: 'mail-group',
            name: 'groupMail',
            component: AdminAccountManagerMain,
            meta: {
              lucideIcon: 'mails'
            }
          },
          {
            path: 'trash',
            name: 'trash',
            component: AdminAccountManagerMain,
            meta: {
              lucideIcon: 'trash'
            }
          }
        ]
      },
      {
        path: 'spam-filter',
        name: 'spamFilter',
        component: AdminSpamMain,
        redirect: "/admin/spam-filter/dashboard",
        meta: {
          lucideIcon: 'filter'
        },
        children: [
          {
            path: 'dashboard',
            name: 'overview',
            component: AdminSpamFilter,
            meta: {
              lucideIcon: 'layout-dashboard'
            }
          },
          {
            path: 'input-deny',
            name: 'inputDeny',
            component: AdminSpamFilterDetail,
            meta: {
              lucideIcon: 'mail-x'
            }
          },
          {
            path: 'out-deny',
            name: 'outDeny',
            component: AdminSpamFilterDetail,
            meta: {
              lucideIcon: 'mail-x'
            }
          },
          {
            path: 'white-list',
            name: 'allowReceive',
            component: AdminSpamFilterDetail,
            meta: {
              lucideIcon: 'mail-check'
            }
          }
        ]
      },
      {
        path: 'email-tracker',
        name: 'tracesMail',
        component: AdminEmailTrackerMain,
        meta: {
          lucideIcon: "mail-check"
        }
      },
      {
        path: 'log',
        name: 'logHistory',
        component: AdminLogMain,
        meta: {
          lucideIcon: "file-clock"
        }
      },
      {
        path: 'managing-quarantine',
        name: 'ManagingQuarantine',
        component: MainQuarantine,
        redirect: '/admin/managing-quarantine/virus',
        meta: {
          lucideIcon: "shield-alert"
        },
        children: [
          {
            path: 'virus',
            component: MainQuarantine,
            name: "virus",
            meta: {
              lucideIcon: "bug"
            }
          },
          {
            path: 'spam',
            component: MainQuarantine,
            name: "Spam",
            meta: {
              lucideIcon: "mail-warning"
            }
          }
        ]
      }
    ]
  },
  {
    path: '/admin/delegate-auth',
    component: DelegateAuth,
  },
  {
    path: '/admin/login',
    component: AdminLogin
  },
  {
    path: '/admin/forgot-password',
    component: AdminForgotPassword
  },
  {
    path: '/simple-menu',
    component: SimpleMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'mail-box',
        name: 'simple-menu-mail-box',
        component: SideMenuMailBox,
      }
    ],
  },
  {
    path: '/top-menu',
    component: TopMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'mail-box',
        name: 'top-menu-mail-box',
        component: SideMenuMailBox,
      }
    ],
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: MainContact,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/print/:conversationId',
    name: 'print',
    component: Print,
  },
  {
    path: '/error-page',
    name: 'error-page',
    component: ErrorPage,
  },
  {
    path: '/:pathMatch(.*)*',
    component: ErrorPage,
  },
] as any;

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
  linkActiveClass: 'link-router-active'
});

router.beforeEach(async (to, _from, next) => {
  //Check nếu đang truy cập route admin
  const arrays = to.path.split('/');
  const pathAdmin = arrays.some(value => value === 'admin');
  if(pathAdmin){
    //init value
    const myAdminStore = MyAdminStore();
    const adminMailGatewayStore = AdminMailGatewayStore();
    //get jwt
    myAdminStore.getAdminCookie();
    //check 1 lan gui request ve server xem jwt hop le ko
    if(!myAdminStore.myAdminHasLogged && myAdminStore.myAdminJwt){
      try{
        await myAdminStore.tryAuthOnce(); //await require
        await myAdminStore.getAdminCompanyUser(); //await require
        adminMailGatewayStore.initGetAllWhoDetail();
      }catch (e) {
        myAdminStore.deleteAdminCookie();
      }
    }
    //Nếu login dạng delegate auth thì cho phép truy cập
    if(to.path.startsWith('/admin/delegate-auth') && to.query.jwt){
      next();
    }
    //nếu giá trị rỗng thì chuyển route về login
    else if (to.matched.some((record) => record.meta.requiresAdminAuth) && !myAdminStore.myAdminJwt) {
      next('/admin/login');
    }
    //nếu co jwt hop le check dang vao route login ko, neu dung thi redirect ve trang chu admin
        //--- hobv@inet.vn - update /admin -> /admin/dashboard
    else if(myAdminStore.myAdminJwt && (to.path === '/admin/login' || to.path === '/admin')){
      next('/admin/dashboard');
    }
    //Cho phép truy cập khac binh thuong
    else{
      next();
    }
  }
  else{
    // Đảm bảo body luôn overflow hidden, nếu muốn scroll window thì cần check theo url
    if(_from.path !== to.path) {
      const body = document.body;
      const dW = window.innerWidth;
      if(dW > 1024) {
        if(!body.classList.contains('body-overflow-hidden')) {
          body.classList.add('body-overflow-hidden');
        }
      }
      else {
        body.classList.remove('body-overflow-hidden');
      }
    }
    //init value
    const myUserStore = MyStore();
    const myBrowseStore = MyBrowseStore();
    const folderStore = FolderStore();
    const myTagStore = MyTagStore();
    const contactStore = MyContactStore();
    const appointmentStore = MyAppointmentStore();
    const myFilterRuleStore = MyFilterRuleStore();
    const myDistributionStore = MyDistributionStore();
    //get jwt
    myUserStore.getCookie();
    //check 1 lan gui request ve server xem jwt hop le ko
    if(!myUserStore.myUserHasLogged){
      try{
        //get company
        await myUserStore.getCompany(); //require await
        //require token
        if(myUserStore.token){
          //try connect zimbra
          await myUserStore.tryUserAuthOnce(); //require await
          //get user
          await myUserStore.getUser(); //require await
          //get folder
          await folderStore.initGetFolder(); //require await
          //get browser
          myBrowseStore.initGetBrowseList();
          //get tag
          myTagStore.initGetTagList();
          //get folder (if create - move)
          folderStore.initGetFolderHasRoot();
          //get contact
          contactStore.initGetContactList();
          //get appointment
          appointmentStore.getAppointment();
          //get filter rule
          myFilterRuleStore.initGetFilterRuleList(false);
          myFilterRuleStore.initGetFilterRuleList(true);
          //get distribution
          myDistributionStore.initGetAccountDistributionList();
        }
      }catch (e) {
        myUserStore.deleteCookie();
      }
    }
    //nếu giá trị rỗng thì chuyển route về login
    if (to.matched.some((record) => record.meta.requiresAuth) && !myUserStore.token) {
      next('/login');
    }
    //nếu co jwt hop le check dang vao route login ko, neu dung thi redirect ve trang chu admin
    else if(myUserStore.token && to.path === '/login'){
      next('/');
    }
    //Cho phép truy cập khac binh thuong
    else{
      //next route
      next();
    }
  }
});

export default router;
