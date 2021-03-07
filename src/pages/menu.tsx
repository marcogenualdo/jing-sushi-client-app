import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { addOutline, removeOutline } from "ionicons/icons";
import React from "react";
import { RouteComponentProps } from "react-router";
import {
  cartItemDecrement,
  cartItemIncrement,
  useAppSelector,
} from "../components/store";
import { menuData } from "../tests/mocks/menu";
import { MenuItemData } from "../types";
import "./menu.css";

interface CategoryDetailProps
  extends RouteComponentProps<{
    category: string;
  }> {}

const MenuItem: React.FC<{ item: MenuItemData }> = ({ item }) => {
  const quantity = useAppSelector(
    (state) => state.cart[item.code]?.quantity ?? 0
  );

  return (
    <IonItem key={item.code}>
      <IonAvatar slot="start" style={{ marginRight: "10px" }}>
        <img
          src="https://i0.wp.com/www.candidafood.com/wp-content/uploads/2009/11/foods-to-eat-candida.jpg?resize=180%2C180"
          alt="none"
        />
      </IonAvatar>

      <IonNote color="dark" className="menu-item-text">
        <h4>{item.name}</h4>
        <p>{item.description}</p>
      </IonNote>

      <IonLabel slot="end" style={{ paddingRight: 0, mparginRight: 0 }}>
        <h2 style={{ textAlign: "center" }}>{item.price}€</h2>
        <IonButtons
          slot="secondary"
          style={{ justifyContent: "center", paddingTop: "1.5rem" }}
        >
          <IonButton onClick={() => cartItemDecrement({ quantity, ...item })}>
            <IonIcon slot="icon-only" icon={removeOutline} />
          </IonButton>
          <h2>{quantity}</h2>
          <IonButton onClick={() => cartItemIncrement({ quantity, ...item })}>
            <IonIcon slot="icon-only" icon={addOutline} />
          </IonButton>
        </IonButtons>
      </IonLabel>
    </IonItem>
  );
};

export const CategoryDetail: React.FC<CategoryDetailProps> = ({ match }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/menu" />
          </IonButtons>
          <IonTitle>{match.params.category}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          {menuData[match.params.category].map((item) => (
            <MenuItem item={item} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export const MenuCategories: React.FC<RouteComponentProps> = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menù</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Menù</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {Object.keys(menuData).map((name) => (
            <IonItem detail routerLink={`/menu/${name}`}>
              <IonAvatar slot="start">
                <img
                  src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
                  alt="none"
                />
              </IonAvatar>
              <IonLabel>
                <h2>{name}</h2>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
