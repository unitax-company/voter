// @material-ui/icons
import Person from "@material-ui/icons/Person";
// import ContentPaste from "@material-ui/icons/ContentPaste";
// core components/views
import SignInPage from "../views/SignIn";
import SignUpPage from "../views/SignUp";
import EmailVerificaiton from "../views/EmailVerification";

const loginRoutes = [
  {
    path: "/signIn",
    sidebarName: "Sign In",
    navbarName: "Sign In",
    icon: Person,
    component: SignInPage
  },
  {
    path: "/signUp",
    sidebarName: "Sign Up",
    navbarName: "Sign Up",
    icon: Person,
    component: SignUpPage
  },
  {
    path: "/verifyEmail",
    sidebarName: "Email verification",
    navbarName: "Email verification",
    icon: Person,
    component: EmailVerificaiton
  },
  { redirect: true, path: "/", to: "/signIn", navbarName: "Redirect" }
];

export default loginRoutes;
