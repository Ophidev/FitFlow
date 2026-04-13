import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import AppRouter from "./router/AppRouter";

import appStore from './redux/appStore';


function App() {

  return (
  <Provider store={appStore}>
    <BrowserRouter basename="/">
      <AppRouter />
    </BrowserRouter>
  </Provider>
  )
}

export default App;
