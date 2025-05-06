import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layouts */
import Layout1 from '../layouts/Layout1'
import Default from '../layouts/BlankLayout'
import AuthLayout1 from '../layouts/AuthLayouts/AuthLayout1'
/* Dashboards View */
import Dashboard2 from '../views/Dashboards/Dashboard2.vue'
import Dashboard1 from '../views/Dashboards/Dashboard1.vue'
import Dashboard3 from '../views/Dashboards/Dashboard3'
import Dashboard4 from '../views/Dashboards/Dashboard4'
import Dashboard5 from '../views/Dashboards/Dashboard5'
/* UIElements View */
import UiAlerts from '../views/core/UiAlerts.vue'
import UiButtons from '../views/core/UiButtons.vue'
import UiBadges from '../views/core/UiBadges.vue'
import UiBreadcrumb from '../views/core/UiBreadcrumb.vue'
import UiColors from '../views/core/UiColors.vue'
import UiTypography from '../views/core/UiTypography.vue'
import UiCards from '../views/core/UiCards.vue'
import UiCarousel from '../views/core/UiCarousel.vue'
import UiEmbedVideo from '../views/core/UiEmbedVideo.vue'
import UiGrid from '../views/core/UiGrid.vue'
import UiModal from '../views/core/UiModal.vue'
import UiListGroup from '../views/core/UiListGroup.vue'
import UiImages from '../views/core/UiImages.vue'
import UiMediaObject from '../views/core/UiMediaObject.vue'
import UiTooltips from '../views/core/UiTooltips.vue'
import UiPopovers from '../views/core/UiPopovers.vue'
import UiNotifications from '../views/core/UiNotifications.vue'
import UiTabs from '../views/core/UiTabs.vue'
import UiPagination from '../views/core/UiPagination.vue'
import UiProgressBars from '../views/core/UiProgressBars.vue'
/* Authentic View */
import SignIn1 from '../views/AuthPages/Default/SignIn1'
import SignUp1 from '../views/AuthPages/Default/SignUp1'
import RecoverPassword1 from '../views/AuthPages/Default/RecoverPassword1'
import LockScreen1 from '../views/AuthPages/Default/LockScreen1'
import ConfirmMail1 from '../views/AuthPages/Default/ConfirmMail1'
/* Extra Pages */
import ErrorPage from '../views/Pages/ErrorPage'
import ComingSoon from '../views/Pages/ComingSoon'
import Maintenance from '../views/Pages/Maintenance'
import TimeLine from '../views/Pages/TimeLines'
import Pricing from '../views/Pages/Pricing'
import Pricing1 from '../views/Pages/Pricing1'
import BlankPage from '../views/Pages/BlankPage'
import FAQ from '../views/Pages/FAQ'
import Invoice from '../views/Pages/Invoice'
/* Apps Views */
import EmailListing from '../views/Apps/Email/EmailListing'
import EmailCompose from '../views/Apps/Email/EmailCompose'
import Calendar from '../views/Apps/Calendar/Calendar'
import ChatIndex from '../views/Apps/Chat/Index'
/* Icon Views */
import IconDripicons from '../views/Icons/IconDripicons'
import IconFontawesome5 from '../views/Icons/IconFontawesome5'
import IconLineAwesome from '../views/Icons/IconLineAwesome'
import IconRemixicon from '../views/Icons/IconRemixicon'
import IconUnicons from '../views/Icons/IconUnicons'
/* Tables Views */
import TablesBasic from '../views/Tables/TablesBasic'
import DataTable from '../views/Tables/DataTable'
import EditableTable from '../views/Tables/EditableTable'
import ApexCharts from '../views/Charts/ApexCharts'
import AmCharts from '../views/Charts/AmCharts'
import MorrisCharts from '../views/Charts/MorrisCharts'
import HighCharts from '../views/Charts/HighCharts'
import GoogleMaps from '../views/Maps/GoogleMaps'
import VectorMaps from '../views/Maps/VectorMaps'
/* Form View */
import FormLayout from '../views/Forms/FormLayout'
import FormValidates from '../views/Forms/FormValidates'
import FormSwitches from '../views/Forms/FormSwitches'
import FormRadios from '../views/Forms/FormRadios'
import FormCheckboxes from '../views/Forms/FormCheckboxes'
/* User View */
import Profile from '../views/User/Profile'
import ProfileEdit from '../views/User/ProfileEdit'
import AddUser from '../views/User/AddUser'
import UserList from '../views/User/UserList'
/* Todo */
import Callback from '../views/AuthPages/Default/Callback'
/* Plugins Views */
import DatepickerDemo from '../views/Plugins/DatepickerDemo'
import SelectDemo from '../views/Plugins/SelectDemo'
import DragDropDemo from '../views/Plugins/DragDropDemo'
import AppTreeView from '../views/Plugins/AppTreeView'

/* PATIENT PROFILE */
import PatientProfile from '../views/Patient/PatientProfile'
import PatientDiagram from '../views/Patient/PatientDiagram'
import PatientEdit from '../views/Patient/PatientEdit'
import AddPatient from '../views/Patient/AddPatient'
import PatientList from '../views/Patient/PatientList'
import PatientView from '../views/Patient/PatientView'

/* ACTIVITY LOGS */
import ActivityLogs from '../views/ActivityLog/ActivityLogs'
import ViewActivity from '../views/ActivityLog/ViewActivity'

/* EXPENSES */
import Expenses from '../views/Expense/Expenses'

/* SERVICE LIST */
import ServiceList from '../views/Params/Services/ServiceList'

/* SYSTEM USER LIST */
import SystemUserList from '../views/Params/SystemUsers/SystemUserList'

/* PAYEMENT TYPE LIST */
import paymentTypeList from '../views/Params/paymentTypes/paymentTypeList'

/* EXPENSE TYPE LIST */
import expenseTypeList from '../views/Params/expenseTypes/expenseTypeList'

/* PAYEMENT TYPE LIST */
import discountList from '../views/Params/Discounts/discountList'

/* SERVICE LIST */
import ClinicList from '../views/Params/Clinic/ClinicList'

/* BRANCH LIST */
import BranchList from '../views/Params/Branch/BranchList'

/* DOCTOR PROFILE */
import DoctorProfile from '../views/Params/Doctor/DoctorProfile'
// import DoctorEdit from '../views/Params/Doctor/DoctorEdit'
import AddDoctor from '../views/Params/Doctor/AddDoctor'
import EditDoctor from '../views/Params/Doctor/EditDoctor'
import DoctorList from '../views/Params/Doctor/DoctorList'

/* GENERAL SEARCH */
import ViewResults from '../views/GeneralSearch/ViewResults'

/* REPORTS */
import DailyActivityReport from '../views/Reports/DailyActivityReport'
import CommissionReport from '../views/Reports/CommissionReport'
import PatientBalanceReport from '../views/Reports/PatientBalanceReport'
import OverheadExpenseReport from '../views/Reports/OverheadExpenseReport'

Vue.use(VueRouter)

const childRoutes = (prop, mode) => [
  {
    path: 'home-1',
    name: prop + '.home-1',
    meta: { dark: mode, auth: true, name: 'Home 1' },
    component: Dashboard1
  },
  {
    path: 'home-2',
    name: prop + '.home-2',
    meta: { dark: mode, auth: true, name: 'Home 2' },
    component: Dashboard2
  },
  {
    path: 'home-3',
    name: prop + '.home-3',
    meta: { dark: mode, auth: true, name: 'Home 3' },
    component: Dashboard3
  },
  {
    path: 'home-5',
    name: prop + '.home-5',
    meta: { dark: mode, auth: true, name: 'Home 5' },
    component: Dashboard5
  },
  {
    path: '/',
    name: prop + '.home-4',
    meta: { dark: mode, auth: true, name: 'Home 4' },
    component: Dashboard4
  }
]

const coreChildRoute = (prop, mode) => [
  {
    path: 'ui-colors',
    name: prop + '.color',
    meta: { dark: mode, auth: true, name: 'Colors' },
    component: UiColors
  },
  {
    path: 'ui-typography',
    name: prop + '.typography',
    meta: { dark: mode, auth: true, name: 'Typography' },
    component: UiTypography
  },
  {
    path: 'ui-alerts',
    name: prop + '.alert',
    meta: { dark: mode, auth: true, name: 'Alert' },
    component: UiAlerts
  },
  {
    path: 'ui-buttons',
    name: prop + '.button',
    meta: { dark: mode, auth: true, name: 'Button' },
    component: UiButtons
  },
  {
    path: 'ui-breadcrumb',
    name: prop + '.breadcrumb',
    meta: { dark: mode, auth: true, name: 'Breadcrumb' },
    component: UiBreadcrumb
  },
  {
    path: 'ui-badges',
    name: prop + '.badges',
    meta: { dark: mode, auth: true, name: 'Badges' },
    component: UiBadges
  },
  {
    path: 'ui-cards',
    name: prop + '.cards',
    meta: { dark: mode, auth: true, name: 'Card' },
    component: UiCards
  },
  {
    path: 'ui-carousel',
    name: prop + '.carousel',
    meta: { dark: mode, auth: true, name: 'Carousel' },
    component: UiCarousel
  },
  {
    path: 'ui-grid',
    name: prop + '.grid',
    meta: { dark: mode, auth: true, name: 'Grid' },
    component: UiGrid
  },
  {
    path: 'ui-embed-video',
    name: prop + '.embed-video',
    meta: { dark: mode, auth: true, name: 'Embed Video' },
    component: UiEmbedVideo
  },
  {
    path: 'ui-modal',
    name: prop + '.modal',
    meta: { dark: mode, auth: true, name: 'Model' },
    component: UiModal
  },
  {
    path: 'ui-listgroup',
    name: prop + '.listgroup',
    meta: { dark: mode, auth: true, name: 'List Group' },
    component: UiListGroup
  },
  {
    path: 'ui-images',
    name: prop + '.images',
    meta: { dark: mode, auth: true, name: 'Image' },
    component: UiImages
  },
  {
    path: 'ui-media-object',
    name: prop + '.media-object',
    meta: { dark: mode, auth: true, name: 'Media Object' },
    component: UiMediaObject
  },
  {
    path: 'ui-pagination',
    name: prop + '.pagination',
    meta: { dark: mode, auth: true, name: 'Paginations' },
    component: UiPagination
  },
  {
    path: 'ui-progressbars',
    name: prop + '.progressbars',
    meta: { dark: mode, auth: true, name: 'Progressbar' },
    component: UiProgressBars
  },
  {
    path: 'ui-tooltips',
    name: prop + '.tooltips',
    meta: { dark: mode, auth: true, name: 'Tooltip' },
    component: UiTooltips
  },
  {
    path: 'ui-popovers',
    name: prop + '.popovers',
    meta: { dark: mode, auth: true, name: 'Popover' },
    component: UiPopovers
  },
  {
    path: 'ui-notifications',
    name: prop + '.notifications',
    meta: { dark: mode, auth: true, name: 'Notification' },
    component: UiNotifications
  },
  {
    path: 'ui-tabs',
    name: prop + '.tabs',
    meta: { dark: mode, auth: true, name: 'Tabs' },
    component: UiTabs
  }
]
const formChildRoute = (prop, mode = false) => [
  {
    path: 'form-layout',
    name: prop + '.layout',
    meta: { dark: mode, auth: true, name: 'Layout' },
    component: FormLayout
  },
  {
    path: 'form-validate',
    name: prop + '.validate',
    meta: { dark: mode, auth: true, name: 'Validate' },
    component: FormValidates
  },
  {
    path: 'form-switches',
    name: prop + '.switch',
    meta: { dark: mode, auth: true, name: 'Switch' },
    component: FormSwitches
  },
  {
    path: 'form-radios',
    name: prop + '.radio',
    meta: { dark: mode, auth: true, name: 'Radio' },
    component: FormRadios
  },
  {
    path: 'form-checkboxes',
    name: prop + '.checkbox',
    meta: { dark: mode, auth: true, name: 'Checkbox' },
    component: FormCheckboxes
  }
]

const tableChildRoute = (prop, mode = false) => [
  {
    path: 'tables-basic',
    name: prop + '.basic',
    meta: { dark: mode, auth: true, name: 'Basic' },
    component: TablesBasic
  },
  {
    path: 'data-table',
    name: prop + '.dataTable',
    meta: { dark: mode, auth: true, name: 'Datatable' },
    component: DataTable
  },
  {
    path: 'editable',
    name: prop + '.editable',
    meta: { dark: mode, auth: true, name: 'Editable' },
    component: EditableTable
  }
]

const iconChildRoute = (prop, mode = false) => [
  {
    path: 'dripicons',
    name: prop + '.dripicons',
    meta: { dark: mode, auth: true, name: 'Dripicons' },
    component: IconDripicons
  },
  {
    path: 'fontawesome-5',
    name: prop + '.fontawesome-5',
    meta: { dark: mode, auth: true, name: 'Font Awsome' },
    component: IconFontawesome5
  },
  {
    path: 'lineawesome',
    name: prop + '.lineawesome',
    meta: { dark: mode, auth: true, name: 'Line Awsome' },
    component: IconLineAwesome
  },
  {
    path: 'remixicon',
    name: prop + '.remixicon',
    meta: { dark: mode, auth: true, name: 'Remixicon' },
    component: IconRemixicon
  },
  {
    path: 'unicons',
    name: prop + '.unicons',
    meta: { dark: mode, auth: true, name: 'Unicon' },
    component: IconUnicons
  }
]

const chartChildRoutes = (prop, mode = false) => [
  {
    path: 'apex-charts',
    name: prop + '.apex',
    meta: { dark: mode, auth: true, name: 'Apex Chat' },
    component: ApexCharts
  },
  {
    path: 'am-charts',
    name: prop + '.am',
    meta: { dark: mode, auth: true, name: 'Am Chart' },
    component: AmCharts
  },
  {
    path: 'high-charts',
    name: prop + '.high',
    meta: { dark: mode, auth: true, name: 'High Chart' },
    component: HighCharts
  },
  {
    path: 'morris-charts',
    name: prop + '.morris',
    meta: { dark: mode, auth: true, name: 'Mirris Chart' },
    component: MorrisCharts
  }
]

const appChildRoute = (prop, mode = false) => [
  {
    path: 'calendar',
    name: prop + '.calendar',
    meta: { dark: mode, auth: true, name: 'Calendar' },
    component: Calendar
  },
  {
    path: 'chat',
    name: prop + '.chat',
    meta: { dark: mode, auth: true, name: 'Chat' },
    component: ChatIndex
  },
  {
    path: 'email',
    name: prop + '.email',
    meta: { dark: mode, auth: true, name: 'Email' },
    component: EmailListing
  },
  {
    path: 'email-compose',
    name: prop + '.email.compose',
    meta: { dark: mode, auth: true, name: 'New Email' },
    component: EmailCompose
  }
]

const authChildRoutes = (prop, mode = false) => [
  {
    path: 'login',
    name: prop + '.sign-in1',
    meta: { dark: mode, auth: false },
    component: SignIn1
  },
  {
    path: 'sign-up1',
    name: prop + '.sign-up1',
    meta: { dark: mode, auth: true },
    component: SignUp1
  },
  {
    path: 'password-reset1',
    name: prop + '.password-reset1',
    meta: { dark: mode, auth: true },
    component: RecoverPassword1
  },
  {
    path: 'lock-screen1',
    name: prop + '.lock-screen1',
    meta: { dark: mode, auth: true },
    component: LockScreen1
  },
  {
    path: 'confirm-mail1',
    name: prop + '.confirm-mail1',
    meta: { dark: mode, auth: true },
    component: ConfirmMail1
  }
]

const mapChildRoute = (prop, mode = false) => [
  {
    path: 'google-maps',
    name: prop + '.google',
    meta: { dark: mode, auth: true, name: 'Google map' },
    component: GoogleMaps
  },
  {
    path: 'vector-maps',
    name: prop + '.vector',
    meta: { dark: mode, auth: true, name: 'Vector Detail' },
    component: VectorMaps
  }
]

const defaultlayout = (prop, mode = false) => [
  {
    path: 'timeline',
    name: prop + '.timeline',
    meta: { dark: mode, auth: true, name: 'Timeline' },
    component: TimeLine
  },
  {
    path: 'invoice',
    name: prop + '.invoice',
    meta: { dark: mode, auth: true, name: 'Invoice' },
    component: Invoice
  },
  {
    path: 'blank-page',
    name: prop + '.blank-page',
    meta: { dark: mode, auth: true, name: 'Blank Page' },
    component: BlankPage
  },
  {
    path: 'pricing',
    name: prop + '.pricing',
    meta: { dark: mode, auth: true, name: 'Pricing' },
    component: Pricing
  },
  {
    path: 'pricing-1',
    name: prop + '.pricing1',
    meta: { dark: mode, auth: true, name: 'Pricing 1' },
    component: Pricing1
  },
  {
    path: 'faq',
    name: prop + '.faq',
    meta: { dark: mode, auth: true, name: 'Faq' },
    component: FAQ
  }
]

const pagesChildRoutes = (prop, mode = false) => [
  {
    path: 'error/:code',
    name: prop + '.error',
    meta: { dark: mode, auth: true },
    component: ErrorPage
  },
  {
    path: 'coming-soon',
    name: prop + '.coming-soon',
    meta: { dark: mode, auth: true },
    component: ComingSoon
  },
  {
    path: 'maintenance',
    name: prop + '.maintenance',
    meta: { dark: mode, auth: true },
    component: Maintenance
  }
]
const userChildRoute = (prop, mode = false) => [
  {
    path: 'profile',
    name: prop + '.profile',
    meta: { dark: mode, auth: true, name: 'Profile' },
    component: Profile
  },
  {
    path: 'profile-edit',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Edit Profile' },
    component: ProfileEdit
  },
  {
    path: 'add-user',
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Add Profile' },
    component: AddUser
  },
  {
    path: 'user-list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'User List' },
    component: UserList
  }
]

const patientChildRoute = (prop, mode = false) => [
  {
    path: 'patient',
    name: prop + '.profile',
    meta: { dark: mode, auth: true, name: 'Patient Profile' },
    component: PatientProfile
  },
  {
    path: 'diagram/:id/:action',
    name: prop + '.diagram',
    meta: { dark: mode, auth: true, name: 'Patient Diagram' },
    component: PatientDiagram
  },
  {
    path: 'patient-edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Edit Patient' },
    component: PatientEdit
  },
  {
    path: 'add-patient',
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Add Patient' },
    component: AddPatient
  },
  {
    path: 'patient-list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Patient List' },
    component: PatientList
  },
  {
    path: 'view/:id',
    name: prop + '.profile',
    meta: { dark: mode, auth: true, name: 'Patient Profile' },
    component: PatientView
  }
]

const doctorChildRoute = (prop, mode = false) => [
  {
    path: 'doctor',
    name: prop + '.profile',
    meta: { dark: mode, auth: true, name: 'Doctor Profile' },
    component: DoctorProfile
  },
  {
    path: 'doctor-edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Edit Doctor' },
    component: EditDoctor
  },
  {
    path: 'add-doctor',
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Add Doctor' },
    component: AddDoctor
  },
  {
    path: 'doctor-list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Doctors List' },
    component: DoctorList
  }
]
const searchChildRoute = (prop, mode = false) => [
  {
    path: 'view-results',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'ViewResults' },
    component: ViewResults
  }
]
const activityLogsChildRoute = (prop, mode = false) => [
  {
    path: 'activity-logs',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'ActivityLogs' },
    component: ActivityLogs
  },
  {
    path: 'view/:id',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'ViewActivity' },
    component: ViewActivity
  }
]

const expensesChildRoute = (prop, mode = false) => [
  {
    path: 'list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'ActivityLogs' },
    component: Expenses
  }
]

const reportsChildRoute = (prop, mode = false) => [
  {
    path: 'daily-activity-report',
    name: prop + '.daily-activity-report',
    meta: { dark: mode, auth: true, name: 'DailyActivityReport' },
    component: DailyActivityReport
  },
  {
    path: 'commission-report',
    name: prop + '.commission-report',
    meta: { dark: mode, auth: true, name: 'CommissionReport' },
    component: CommissionReport
  },
  {
    path: 'patient-balance-report',
    name: prop + '.patient-balance-report',
    meta: { dark: mode, auth: true, name: 'PatientBalanceReport' },
    component: PatientBalanceReport
  },
  {
    path: 'overhead-expense-report',
    name: prop + '.overhead-expense-report',
    meta: { dark: mode, auth: true, name: 'OverheadExpenseReport' },
    component: OverheadExpenseReport
  }
]

const paymentTypesChildRoute = (prop, mode = false) => [
  {
    path: 'list-of-payment-types',
    name: prop + '.list-of-payment-types',
    meta: { dark: mode, auth: true, name: 'paymentTypes' },
    component: paymentTypeList
  }
]

const discountsChildRoute = (prop, mode = false) => [
  {
    path: 'list-of-discounts',
    name: prop + '.list-of-discounts',
    meta: { dark: mode, auth: true, name: 'discounts' },
    component: discountList
  }
]

const expenseTypesChildRoute = (prop, mode = false) => [
  {
    path: 'list-of-expense-types',
    name: prop + '.list-of-expense-types',
    meta: { dark: mode, auth: true, name: 'expenseTypes' },
    component: expenseTypeList
  }
]

const usersChildRoute = (prop, mode = false) => [
  {
    path: 'list-of-users',
    name: prop + '.list-of-users',
    meta: { dark: mode, auth: true, name: 'SystemUserList' },
    component: SystemUserList
  }
]

const servicesChildRoute = (prop, mode = false) => [
  {
    path: 'service-list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Services' },
    component: ServiceList
  }
]

const clinicsChildRoute = (prop, mode = false) => [
  {
    path: 'clinic-list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Clinics' },
    component: ClinicList
  },
  {
    path: 'branches/:id',
    name: prop + '.branches',
    meta: { dark: mode, auth: true, name: 'Branches' },
    component: BranchList
  }
]

const pluginsChildRoute = (prop, mode = false) => [
  {
    path: 'datepicker',
    name: prop + '.datepicker',
    meta: { dark: mode, auth: true, name: 'Datepicker' },
    component: DatepickerDemo
  },
  {
    path: 'select',
    name: prop + '.select',
    meta: { dark: mode, auth: true, name: 'Select' },
    component: SelectDemo
  },
  {
    path: 'draggable',
    name: prop + '.draggable',
    meta: { dark: mode, auth: true, name: 'Draggable' },
    component: DragDropDemo
  },
  {
    path: 'treeview',
    name: prop + '.treeview',
    meta: { dark: mode, auth: true, name: 'Tree View' },
    component: AppTreeView
  }
]

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Layout1,
    meta: { auth: true },
    children: childRoutes('dashboard')
  },
  {
    path: '/core',
    name: 'core',
    component: Layout1,
    meta: { auth: true },
    children: coreChildRoute('core')
  },
  {
    path: '/table',
    name: 'table',
    component: Layout1,
    meta: { auth: true },
    children: tableChildRoute('table')
  },
  {
    path: '/chart',
    name: 'chart',
    component: Layout1,
    meta: { auth: true },
    children: chartChildRoutes('chart')
  },
  {
    path: '/icon',
    name: 'icon',
    component: Layout1,
    meta: { auth: true },
    children: iconChildRoute('icon')
  },
  {
    path: '/auth',
    name: 'auth1',
    component: AuthLayout1,
    meta: { auth: true },
    children: authChildRoutes('auth1')
  },
  {
    path: '/pages',
    name: 'pages',
    component: Default,
    meta: { auth: true },
    children: pagesChildRoutes('default')
  },
  {
    path: '/extra-pages',
    name: 'extra-pages',
    component: Layout1,
    meta: { auth: true },
    children: defaultlayout('extra-pages')
  },
  {
    path: '/app',
    name: 'app',
    component: Layout1,
    meta: { auth: true },
    children: appChildRoute('app')
  },
  {
    path: '/user',
    name: 'user',
    component: Layout1,
    meta: { auth: true },
    children: userChildRoute('user')
  },
  {
    path: '/patient',
    name: 'patient',
    component: Layout1,
    meta: { auth: true },
    children: patientChildRoute('patient')
  },
  {
    path: '/doctor',
    name: 'doctor',
    component: Layout1,
    meta: { auth: true },
    children: doctorChildRoute('doctor')
  },
  {
    path: '/activityLogs',
    name: 'activityLogs',
    component: Layout1,
    meta: { auth: true },
    children: activityLogsChildRoute('activityLogs')
  },
   {
    path: '/general-search',
    name: 'general-search',
    component: Layout1,
    meta: { auth: true },
    children: searchChildRoute('general-search')
  },
  {
    path: '/expenses',
    name: 'expenses',
    component: Layout1,
    meta: { auth: true },
    children: expensesChildRoute('expenses')
  },
  {
    path: '/services',
    name: 'services',
    component: Layout1,
    meta: { auth: true },
    children: servicesChildRoute('services')
  },
  {
    path: '/clinics',
    name: 'clinics',
    component: Layout1,
    meta: { auth: true },
    children: clinicsChildRoute('clinics')
  },
  {
    path: '/reports',
    name: 'reports',
    component: Layout1,
    meta: { auth: true },
    children: reportsChildRoute('reports')
  },
  {
    path: '/discounts',
    name: 'discounts',
    component: Layout1,
    meta: { auth: true },
    children: discountsChildRoute('discounts')
  },
  {
    path: '/expenseTypes',
    name: 'expenseTypes',
    component: Layout1,
    meta: { auth: true },
    children: expenseTypesChildRoute('expenseTypes')
  },
  {
    path: '/paymentTypes',
    name: 'paymentTypes',
    component: Layout1,
    meta: { auth: true },
    children: paymentTypesChildRoute('paymentTypes')
  },
  {
    path: '/users',
    name: 'users',
    component: Layout1,
    meta: { auth: true },
    children: usersChildRoute('users')
  },
  {
    path: '/map',
    name: 'map',
    component: Layout1,
    meta: { auth: true },
    children: mapChildRoute('map')
  },
  {
    path: '/form',
    name: 'form',
    component: Layout1,
    meta: { auth: true },
    children: formChildRoute('form')
  },
  {
    path: '/plugins',
    name: 'plugins',
    component: Layout1,
    meta: { auth: true },
    children: pluginsChildRoute('plugins')
  },
  {
    path: '/callback',
    name: 'callback',
    meta: { auth: false },
    component: Callback
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // instead of having to check every route record with
  // to.matched.some(record => record.meta.requiresAuth)
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  if (to.path === '/auth/login') {
    if (isLoggedIn && (isLoggedIn > 0)) {
      next({ name: 'dashboard.home-1' })
    }
  }
  if (to.meta.auth && !(isLoggedIn > 0)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    next('/auth/login')
  }
  next()
})

export default router
