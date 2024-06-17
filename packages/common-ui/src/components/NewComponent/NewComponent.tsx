import classNames from "classnames";
import styles from "./NewComponent.module.scss";
import { useEffect, useState } from "react";

import { Text } from "@blueprintjs/core";

export interface NewComponentProps {
    className?: string;
}

export const NewComponent = ({ className }: NewComponentProps) => {

    const [dataContext, setDataContext] = useState("");

    useEffect(() => {
        setDataContext("SQLite")
    }, [])


    return (
        <div className={classNames(styles.root, className)}>
            <Text>Data Provider: {dataContext}</Text>
        </div>
    );
};
