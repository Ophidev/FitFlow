import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import appStore from "./redux/appStore";
import AuthLoader from "./router/AuthLoader";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <AuthLoader />
      </BrowserRouter>
    </Provider>
  );
}

export default App;