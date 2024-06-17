import React from "react";
import ReactDOM from "react-dom/client";
import { Refine } from "@refinedev/core";

import { SampleWelcomePage } from "../common-ui/src/components/SampleWelcomePage/SampleWelcomePage";



const container = document.getElementById("root") as HTMLElement
const root = ReactDOM.createRoot(container);
root.render(
    <React.StrictMode>
        <Refine
            // data providers for Refine
            dataProvider={{
                default: window.API.SQLite(window.API.path.join(window.ENV.rootPath, "./data/testdata.db"))
            }}
        >
            <SampleWelcomePage/>
        </Refine>
    </React.StrictMode>
);
