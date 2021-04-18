import {
  IonAvatar,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonTitle,
} from "@ionic/react";
import { call, home, logoFacebook, mail } from "ionicons/icons";
import jingImg from "../assets/menu-default.jpg";
import Layout from "../components/Layout";
import ListStopper from "../components/ListStopper";
import { useAppSelector } from "../store/store";
import { OpeningTime, WeekOpeningTimes } from "../types";
import "./info.css";

const weekDaysNames: Record<keyof WeekOpeningTimes, string> = {
  0: "Domenica",
  1: "Lunedì",
  2: "Martedì",
  3: "Mercoledì",
  4: "Giovedì",
  5: "Venerdì",
  6: "Sabato",
};

const OpeningTimeItem: React.FC<{ name: string; data: OpeningTime }> = ({
  name,
  data,
}) => {
  const lunchFrom = data.lunch.from;
  const lunchTo = data.lunch.to;

  const dinnerFrom = data.dinner.from;
  const dinnerTo = data.dinner.to;

  return (
    <IonItem>
      <IonLabel className="opening-time-key">{name}</IonLabel>
      <IonLabel slot="end" className="opening-time-value">
        <span className="opening-time-label">Pranzo</span>
        <span className="opening-time-range">
          {lunchFrom.hour}:{lunchFrom.minute} - {lunchTo.hour}:{lunchTo.minute}
        </span>
        <span className="opening-time-label">Cena</span>
        <span className="opening-time-range">
          {dinnerFrom.hour}:{dinnerFrom.minute} - {dinnerTo.hour}:
          {dinnerTo.minute}
        </span>
      </IonLabel>
    </IonItem>
  );
};

const Info: React.FC = () => {
  const info = useAppSelector((state) => state.info);
  const openingTimes = info?.openingTimes;
  const contacts = info?.contacts;

  const zipCodes = useAppSelector((state) => state.zipCodes);

  return (
    <Layout pageName="Info">
      <IonList>
        <IonItem lines="none">
          <div slot="start" className="info-title">
            <strong>Jing Sushi</strong>
            <p>Sushi & Cucina orientale</p>
          </div>
          <IonAvatar slot="end" style={{ height: "7rem", width: "7rem" }}>
            <IonImg src={jingImg} />
          </IonAvatar>
        </IonItem>

        <IonItemDivider />

        <IonItem>
          <IonTitle>Contatti</IonTitle>
        </IonItem>
        <ContactsItem
          icon={call}
          label="Telefono"
          value={contacts?.phone ?? ""}
        />
        <ContactsItem
          icon={home}
          label="Indirizzo"
          value={contacts?.address ?? ""}
          href={contacts?.addressRef ?? ""}
        />
        <ContactsItem
          icon={call}
          label="Mobile"
          value={contacts?.mobile ?? ""}
        />
        <ContactsItem
          icon={logoFacebook}
          label="Facebook"
          value="Vai alla pagina"
          href={contacts?.facebookRef ?? ""}
        />
        <ContactsItem icon={mail} label="Email" value={contacts?.email ?? ""} />

        <IonItemDivider />

        {openingTimes && (
          <>
            <IonItem>
              <IonTitle>Orari</IonTitle>
            </IonItem>
            <OpeningTimeItem name={weekDaysNames[0]} data={openingTimes[0]} />
            <OpeningTimeItem name={weekDaysNames[1]} data={openingTimes[1]} />
            <OpeningTimeItem name={weekDaysNames[2]} data={openingTimes[2]} />
            <OpeningTimeItem name={weekDaysNames[3]} data={openingTimes[3]} />
            <OpeningTimeItem name={weekDaysNames[4]} data={openingTimes[4]} />
            <OpeningTimeItem name={weekDaysNames[5]} data={openingTimes[5]} />
            <OpeningTimeItem name={weekDaysNames[6]} data={openingTimes[6]} />
          </>
        )}

        {zipCodes && (
          <>
            <IonItemDivider />
            <IonItem>
              <IonTitle>Zone di consegna</IonTitle>
            </IonItem>
            <IonItem style={{ color: "#808080" }}>
              <IonLabel slot="start">CAP</IonLabel>
              <IonLabel style={{ textAlign: "right" }}>Ordine minimo</IonLabel>
            </IonItem>
            {Object.keys(zipCodes).map((key) => (
              <IonItem key={key}>
                <IonLabel slot="start">{key}</IonLabel>
                <IonLabel slot="end">{zipCodes[key].toFixed(2)} €</IonLabel>
              </IonItem>
            ))}
          </>
        )}
        <ListStopper />
      </IonList>
    </Layout>
  );
};

export default Info;

const ContactsItem: React.FC<{
  icon: string;
  label: string;
  value: string;
  href?: string;
}> = ({ icon, label, value, href }) => {
  return (
    <IonItem lines="none">
      <IonLabel slot="start">
        <span className="contacts-icon">
          <IonIcon icon={icon} />
        </span>
        {label}
      </IonLabel>
      <p className="contacts-value">
        {href === undefined ? value : <a href={href}>{value}</a>}
      </p>
    </IonItem>
  );
};
