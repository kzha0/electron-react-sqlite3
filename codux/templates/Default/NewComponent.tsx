import classNames from "classnames";
import styles from "./NewComponent.module.scss";

export interface NewComponentProps {
    className?: string;
}

export const NewComponent = ({ className }: NewComponentProps) => {
    return <div className={classNames(styles.root, className)}>NewComponent</div>;
};
