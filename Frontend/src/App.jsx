import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import appStore from "./redux/appStore";
import AuthLoader from "./router/AuthLoader";
import ThemeManager from "./components/ThemeManager";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <ThemeManager />
        <AuthLoader />
      </BrowserRouter>
    </Provider>
  );
}

export default App;