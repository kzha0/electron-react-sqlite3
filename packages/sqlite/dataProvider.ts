import Database from "better-sqlite3";
import {
    DataProvider,
    BaseRecord,
    GetOneParams,
    GetOneResponse,
    GetListParams,
    GetListResponse,
    GetManyParams,
    GetManyResponse,
    CreateParams,
    CreateResponse,
    UpdateParams,
    UpdateResponse,
    DeleteOneParams,
    DeleteOneResponse,
} from "@refinedev/core";
import { generateSort, generateFilter } from "./utils";

export const dataProvider = (
    filename?: string | Buffer,
    options?: Database.Options
): DataProvider => {
    const connect = () => {
        /**
         * TO DO:
         * 
         * Study `new` operators and how constructor functions work. Use this knowledge to optimize the lines in this scope.
         */
        const connection = new Database(filename, options);
        connection.pragma("journal_mode = WAL")
        return connection;
    };

    return {
        getList: <TData extends BaseRecord>({
            resource,
            pagination,
            filters,
            sorters,
        }: GetListParams) => {
            return new Promise<GetListResponse<TData>>((resolve, reject) => {
                const SQLite = connect();

                const { current = 1, pageSize = 10 } = pagination ?? {};

                const queryFilters = generateFilter(filters);

                const query: {
                    _start?: number;
                    _end?: number;
                    _sortString?: string;
                } = {};

                query._start = (current - 1) * pageSize;
                query._end = current * pageSize;

                const generatedSort = generateSort(sorters);
                if (generatedSort) {
                    query._sortString = generatedSort;
                }

                let sql = `SELECT * FROM ${resource}`;

                if (queryFilters) sql += ` WHERE ${queryFilters}`;
                if (generatedSort) sql += ` ORDER BY ${query._sortString}`;
                if (pagination) sql += ` LIMIT ${query._start}, ${query._end}`;

                try {
                    const stmt = SQLite.prepare(sql);
                    const data = stmt.all() as Array<TData>;

                    resolve({
                        data,
                        total: data.length,
                    });
                } catch (error) {
                    console.error("Error in getList()", error);
                    reject({
                        data: [],
                        total: 0,
                    });
                } finally {
                    SQLite.close();
                }
            });
        },
        getMany: <TData extends BaseRecord>({ resource, ids }: GetManyParams) => {
            return new Promise<GetManyResponse<TData>>((resolve, reject) => {
                const SQLite = connect();
                const idString = ids.join(", ");

                try {
                    const stmt = SQLite.prepare(
                        `SELECT * FROM ${resource} WHERE id IN (${idString})`
                    );
                    const data = stmt.all() as Array<TData>;

                    resolve({
                        data,
                    });
                } catch (error) {
                    console.error("Error in getMany()", error);
                    reject({
                        data: [],
                    });
                } finally {
                    SQLite.close();
                }
            });
        },
        create: <TData extends BaseRecord, TVariables = unknown>({
            resource,
            variables,
        }: CreateParams<TVariables>) => {
            return new Promise<CreateResponse<TData>>((resolve, reject) => {
                const SQLite = connect();

                const columns = Object.keys(variables || {}).join(", ");
                const values = Object.values(variables || {})
                    .map((value) => `'${value}'`)
                    .join(", ");

                try {
                    const stmt = SQLite.prepare(
                        `INSERT INTO ${resource} (${columns}) VALUES (${values})`
                    );
                    const { lastInsertRowid } = stmt.run();

                    const stmt2 = SQLite.prepare(
                        `SELECT * FROM ${resource} WHERE id = ${lastInsertRowid}`
                    );
                    const data = stmt2.get() as TData;

                    resolve({
                        data,
                    });
                } catch (error) {
                    console.error("Error in create()", error);
                    reject({
                        data: {},
                    });
                } finally {
                    SQLite.close();
                }
            });
        },
        update: <TData extends BaseRecord, TVariables = unknown>({
            resource,
            id,
            variables,
        }: UpdateParams<TVariables>) => {
            return new Promise<UpdateResponse<TData>>((resolve, reject) => {
                const SQLite = connect();
                let updateQuery = "";

                const columns = Object.keys(variables || {});
                const values = Object.values(variables || {});

                columns.forEach((column, index) => {
                    updateQuery += `${column} = '${values[index]}', `;
                });

                // Slices the last comma
                updateQuery = updateQuery.slice(0, -2);

                try {
                    SQLite.prepare(`UPDATE ${resource} SET ${updateQuery} WHERE id = ?`).run(id);

                    const stmt = SQLite.prepare(`SELECT * FROM ${resource} WHERE id = ?`);
                    const data = stmt.get(id) as TData;

                    resolve({
                        data,
                    });
                } catch (error) {
                    console.error("Error in update()", error);
                    reject({
                        data: {},
                    });
                } finally {
                    SQLite.close();
                }
            });
        },
        getOne: <TData extends BaseRecord>({ resource, id }: GetOneParams) => {
            return new Promise<GetOneResponse<TData>>((resolve, reject) => {
                const SQLite = connect();
                try {
                    const stmt = SQLite.prepare(`SELECT * FROM ${resource} WHERE id = ?`);
                    const data = stmt.get(id) as TData;

                    resolve({
                        data,
                    });
                } catch (error) {
                    console.error("Error in getOne()", error);
                    reject({
                        data: {},
                    });
                } finally {
                    SQLite.close();
                }
            });
        },
        deleteOne: <TData extends BaseRecord, TVariables = unknown>({
            resource,
            id,
        }: DeleteOneParams<TVariables>) => {
            return new Promise<DeleteOneResponse<TData>>((resolve, reject) => {
                const SQLite = connect();

                try {
                    const stmt = SQLite.prepare(`DELETE FROM ${resource} WHERE id = ?`);
                    const { changes } = stmt.run(id);

                    if (changes !== 1) {
                        throw new Error(`Failed to delete ${resource} with id ${id}`);
                    }

                    resolve({
                        /**
                         * WARNING:
                         *
                         * The response for data has been changed from `null` 
                         * 
                         * `data: null`
                         * 
                         * to an empty object `{}` 
                         * 
                         * `data: {} as TData`
                         * 
                         * to satisfy the `TData` constraint
                         *
                         * 
                         * 
                         * TO DO:
                         * 
                         * Study the effects of this change to determine whether this change breaks any underlying application behavior or if it is same to retain this change.
                         * 
                         * Consequently, study the implications of setting the `data` property to a `null` type.
                         */

                        data: {} as TData
                    });
                } catch (error) {
                    console.log("Error in deleteOne()", error);
                    reject({
                        data: {}
                    });
                } finally {
                    SQLite.close();
                }
            });
        },
        getApiUrl: () => "",
    };
};
