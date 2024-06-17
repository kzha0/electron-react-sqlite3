/// <reference types="vite/client" />

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<
        React.ComponentProps<'svg'> & { title?: string }
    >;
    /**
     * TODO: Identify effect of having a default export for this file and determine whether it is necessary to keep the default export, otherwise find a way to supress linting that prevents the duplicate identifier for the export `ReactComponent`
     */
    //  export default ReactComponent;
}
