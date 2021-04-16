import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
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
import defaultImage from "../assets/menu-default.jpg";
import Layout from "../components/Layout";
import ListStopper from "../components/ListStopper";
import {
  cartItemDecrement,
  cartItemIncrement,
  useAppSelector,
} from "../tools/store";
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
    <IonItem key={item.code} className="menu-item">
      <IonAvatar slot="start" style={{ marginRight: "10px" }}>
        <IonImg src={defaultImage} alt="null" />
      </IonAvatar>

      <IonNote color="dark" className="menu-item-text">
        <h4>{item.name}</h4>
        <p>{item.description}</p>
      </IonNote>

      <IonLabel slot="end" style={{ paddingRight: 0, mparginRight: 0 }}>
        <h2 style={{ textAlign: "center" }}>{item.price.toFixed(2)} €</h2>
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
  const category = match.params.category;
  const categoryData = useAppSelector((state) => state.menu[Number(category)]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/menu" />
          </IonButtons>
          <IonTitle>{categoryData.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          {categoryData.dishes.map((item, index) => (
            <MenuItem item={item} key={index} />
          ))}
        </IonList>
        <ListStopper />
      </IonContent>
    </IonPage>
  );
};

export const MenuCategories: React.FC<RouteComponentProps> = () => {
  const menuData = useAppSelector((state) => state.menu);

  return (
    <Layout pageName="Menù">
      <IonList>
        {menuData.map(({ name }, index) => (
          <IonItem
            detail
            routerLink={`/menu/${index}`}
            className="menu-item"
            key={index}
          >
            <IonAvatar slot="start">
              <IonImg src={defaultImage} alt="null" />
            </IonAvatar>
            <IonLabel>
              <h2>{name}</h2>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
      <ListStopper />
    </Layout>
  );
};
