import path from "path";
import Database from "better-sqlite3";

const SQLiteProvider = {
    open: (dbPath?: string) => {
        const sqliteInstance = new Database(
            dbPath
                ? dbPath
                : process.env.NODE_ENV === "development"
                ? path.join(__dirname, "./data/sqlite.template.db")
                : path.join(__dirname, "./sqlite.template.db")
        );
        sqliteInstance.pragma("journal_mode = WAL");
        return sqliteInstance;
    },
};

export const SQLite = (dbPath?: string) => ({
    getTables: () => {
        const sqlite = SQLiteProvider.open(dbPath);
        try {
            const query = `SELECT name FROM sqlite_master WHERE type='table'`;
            const request = sqlite.prepare(query);
            const transaction = sqlite.transaction(() => {
                const result = request.all() as Array<{
                    id?: string | number;
                    [key: string]: unknown;
                }>;
                if (result) {
                    console.log(result)
                    return {
                        data: result,
                        total: result.length,
                    };
                } else if (result === undefined) {
                    console.log(
                        `request for query ${query} returned 0 results`
                    );
                    return {
                        data: [],
                        total: 0,
                    };
                }
            });
            return transaction();
        } catch (error) {
            console.error(error);
        } finally {
            sqlite.close;
        }
    },
});
