import { BrowserRouter } from "react-router-dom";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { FiSettings } from 'react-icons/fi'
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div
            className="fixed right-4 bottom-4"
            style={{ zIndex: "1000" }}
          ></div>
          <TooltipComponent content={"Settings"} position="Top">
            <button>
              
              <FiSettings />
            </button>

          </TooltipComponent>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
