import { IonItem, IonLabel, IonList } from "@ionic/react";
import Layout from "../components/Layout";
import { useAppSelector } from "../tools/store";
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

  return (
    <Layout pageName="Info">
      {openingTimes && (
        <IonList>
          <OpeningTimeItem name={weekDaysNames[0]} data={openingTimes[0]} />
          <OpeningTimeItem name={weekDaysNames[1]} data={openingTimes[1]} />
          <OpeningTimeItem name={weekDaysNames[2]} data={openingTimes[2]} />
          <OpeningTimeItem name={weekDaysNames[3]} data={openingTimes[3]} />
          <OpeningTimeItem name={weekDaysNames[4]} data={openingTimes[4]} />
          <OpeningTimeItem name={weekDaysNames[5]} data={openingTimes[5]} />
          <OpeningTimeItem name={weekDaysNames[6]} data={openingTimes[6]} />
        </IonList>
      )}
    </Layout>
  );
};

export default Info;
