import { BrowserRouter } from "react-router";
import AppRouter from "./router/AppRouter";

function App() {

  return (
    <BrowserRouter basename="/">
      <AppRouter />
    </BrowserRouter>
  )
}

export default App;
