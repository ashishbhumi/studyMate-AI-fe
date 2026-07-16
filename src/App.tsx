import { BrowserRouter } from "react-router-dom";
import RouteIndex from "./routes/RouteIndex";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <RouteIndex />
    </BrowserRouter>
  );
}

export default App;
