import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = (props) => {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  return (
    <AppContext.Provider
      value={{ fileState: [file, setFile], imageState: [image, setImage] }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
