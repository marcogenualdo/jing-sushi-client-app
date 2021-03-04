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
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { menuData } from "../tests/mocks/menu";
import "./menu.css";

interface CategoryDetailProps
  extends RouteComponentProps<{
    category: string;
  }> {}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({ match }) => {
  let startQuantities: Record<string, number> = {};
  for (let item of menuData[match.params.category]) {
    startQuantities[item.code] = 0;
    console.log(startQuantities);
  }
  const [quantities, setQuantities] = useState<Record<string, number>>(
    startQuantities
  );

  const addToItemQuantity = (code: string, n: number) => {
    let value = 0;
    if (quantities[code] + n > 0) {
      value = quantities[code] + n;
      console.log(quantities);
    }
    return setQuantities({
      ...quantities,
      [code]: value,
    });
  };

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
            <IonItem>
              <IonAvatar slot="start" style={{ marginRight: "10px" }}>
                <img
                  src="https://i0.wp.com/www.candidafood.com/wp-content/uploads/2009/11/foods-to-eat-candida.jpg?resize=180%2C180"
                  alt="none"
                />
              </IonAvatar>
              <IonNote className="menu-item-text">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
              </IonNote>
              <IonLabel slot="end" style={{ paddingRight: 0, mparginRight: 0 }}>
                <h2 style={{ textAlign: "center", paddingBottom: "15%" }}>
                  {item.price}€
                </h2>
                <IonButtons
                  slot="secondary"
                  style={{ justifyContent: "center" }}
                >
                  <IonButton onClick={() => addToItemQuantity(item.code, -1)}>
                    <IonIcon slot="icon-only" icon={removeOutline} />
                  </IonButton>
                  <h2>{quantities[item.code]}</h2>
                  <IonButton onClick={() => addToItemQuantity(item.code, 1)}>
                    <IonIcon slot="icon-only" icon={addOutline} />
                  </IonButton>
                </IonButtons>
              </IonLabel>
            </IonItem>
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
