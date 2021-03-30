import { updateMenu } from "./store";
import { MenuCategoryData } from "../types";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBR3dh8ok7mxd4gqBIh4dw9BBYlUME7xBw",
  authDomain: "jing-sushi-app2.firebaseapp.com",
  projectId: "jing-sushi-app2",
  storageBucket: "jing-sushi-app2.appspot.com",
  messagingSenderId: "1049840345964",
  appId: "1:1049840345964:web:450c9f3746912dc70d4949",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

// login persisted when app is closed, until explicit signout
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
auth.languageCode = "it";

export const fetchMenu = async () => {
  try {
    const firestore = firebase.firestore();
    const data = await firestore.collection("menu").get();

    const menuData = data.docs.map((doc) => doc.data()) as MenuCategoryData[];
    console.info("Fetched %s categories from firestore menu.", menuData.length);
    updateMenu(menuData);
  } catch (err) {
    console.error("Error fetching Menu data %s", err);
  }
};
