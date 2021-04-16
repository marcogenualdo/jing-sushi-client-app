import { IonItemDivider } from "@ionic/react";

/**
 * Prevents last element of IonList from partially ending up under the bottom tab-bar.
 */
const ListStopper = () => {
  return (
    <>
      <IonItemDivider style={{ opacity: 0 }} />
      <IonItemDivider style={{ opacity: 0 }} />
    </>
  );
};
export default ListStopper;
