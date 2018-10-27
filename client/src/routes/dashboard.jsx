// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import BubbleChart from "@material-ui/icons/BubbleChart";
// core components/views
import DashboardPage from "../views/Dashboard/Dashboard.jsx";
import CreateNewPoll from "../views/CreateNewPoll";
import Poll from "../views/Poll/PollWrapper";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/poll",
    sidebarName: "Poll",
    navbarName: "Poll",
    icon: "content_paste",
    component: Poll
  },
  {
    path: "/create",
    sidebarName: "Create",
    navbarName: "Create",
    icon: BubbleChart,
    component: CreateNewPoll
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
