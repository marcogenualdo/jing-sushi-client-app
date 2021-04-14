import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import { cart, informationCircle, map, personCircle } from "ionicons/icons";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect, Route } from "react-router-dom";
import { Cart } from "./pages/cart";
import Info from "./pages/info";
import { CategoryDetail, MenuCategories } from "./pages/menu";
import Profile from "./pages/profile";
/* Theme variables */
import "./theme/variables.css";
import { auth, fetchMenu, fetchZipCodes } from "./tools/firestore";
import { fetchAddress } from "./tools/store";

export const BottomNav: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Redirect exact from="/" to="/info" />
      <Route exact path="/:tab(info)" component={Info} />
      <Route exact path="/:tab(menu)" component={MenuCategories} />
      <Route exact path="/:tab(menu)/:category" component={CategoryDetail} />
      <Route exact path="/:tab(cart)" component={Cart} />
      <Route exact path="/:tab(profile)" component={Profile} />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="schedule" href="/info">
        <IonIcon icon={informationCircle} />
        <IonLabel>Info</IonLabel>
      </IonTabButton>
      <IonTabButton tab="menu" href="/menu">
        <IonIcon icon={map} />
        <IonLabel>Menu</IonLabel>
      </IonTabButton>
      <IonTabButton tab="about" href="/cart">
        <IonIcon icon={cart} />
        <IonLabel>Carrello</IonLabel>
      </IonTabButton>
      <IonTabButton tab="map" href="/profile">
        <IonIcon icon={personCircle} />
        <IonLabel>Profilo</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user != null) fetchAddress(user);
  }, [user]);
  try {
    fetchMenu();
    fetchZipCodes();
  } catch (err) {
    console.error(err);
  }

  return (
    <IonApp>
      <IonReactRouter>
        <BottomNav />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
