import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";
import NavigationBar from "./components/NavigationBar";
import { AppProvider } from "./context/AppContext";
import UploadScreen from "./components/UploadScreen";
import ImageScreen from "./components/ImageScreen";

const App = () => {
  return (
    <>
      <NavigationBar />
      <AppProvider>
        <UploadScreen />
        <ImageScreen />
      </AppProvider>
    </>
  );
};

export default App;
