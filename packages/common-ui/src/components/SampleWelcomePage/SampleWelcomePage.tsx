import classNames from "classnames";
import styles from "./SampleWelcomePage.module.scss";
import { Text } from "@blueprintjs/core";
import { useList } from "@refinedev/core";

export interface SampleWelcomePageProps {
    className?: string;
}
interface IPerson {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
}

export const SampleWelcomePage = ({ className }: SampleWelcomePageProps) => {
    const { data, isLoading, isError } = useList<IPerson>({
        resource: "persons"
    })

    const persons = data?.data ?? [];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong!</div>;
    }

    return (
        <div className={classNames(styles.root, className)}>
            <h1>💖 Hello World!</h1>
            <p>Welcome to your Electron application.</p>
            <Text>SQLite Data</Text>
            <h1>List of persons</h1>
            <ul>
            {persons.map((person) => (
                <li key={person.id}>
                <h4>
                    {`${person.firstName} ${person.lastName} - ${person.address}`}
                </h4>
                </li>
            ))}
            </ul>
        </div>
    );
};
