import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./Redux/Store.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./Components/ThemeProvider.jsx";

// Create a root for the React application and render the component tree
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <PersistGate persistor={persistor}>
      <ThemeProvider>
        <App /> {/* Main application component */}
      </ThemeProvider>
  </PersistGate>
  </Provider>
);
