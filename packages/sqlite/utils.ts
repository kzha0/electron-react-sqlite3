import {CrudOperators, CrudSorting, CrudFilters} from "@refinedev/core";

export const mapOperator = (operator: CrudOperators): string => {
    switch (operator) {
        case "ne":
            return "IS NOT";
        case "gte":
            return ">=";
        case "lte":
            return "<=";
        case "contains":
            return "LIKE"
        case "eq":
            return "IS"
        default:
            return "";
    }
};

export const generateSort = (sorters?: CrudSorting) => {
    if (sorters && sorters.length > 0) {
        const _sort: string[] = [];
        const _order: string[] = [];
        let _sortString = "";

        sorters.map((item) => {
            _sort.push(item.field);
            _order.push(item.order);
        });

        _sort.forEach((item, index) => {
            _sortString += `${item} ${_order[index]}, `
            if (index === _sort.length - 1) {
                _sortString = _sortString.slice(0, -2);
            }
        })

        return _sortString;
    }
    //     const _sort: string[] = [];
    //     const _order: string[] = [];
    //
    //     sorters.map((item) => {
    //         _sort.push(item.field);
    //         _order.push(item.order);
    //     });
    //
    //     return {
    //         _sort,
    //         _order,
    //     };
    // }

    return;
};

export const generateFilter = (filters?: CrudFilters) => {
    let queryFilterString = "";

    if (filters) {
        filters.map((filter) => {
            if (filter.operator === "or" || filter.operator === "and") {
                throw new Error(
                    `[refine-sqlite]: \`operator: ${filter.operator}\` is not supported. You can create custom data provider. https://refine.dev/docs/api-reference/core/providers/data-provider/#creating-a-data-provider`,
                );
            }

            // Check if the filter is of LogicalFilter type
            if ("field" in filter) {
                const { field, operator, value } = filter;

                queryFilterString += `${field} ${mapOperator(operator)} '${value}' AND `;
            }
        });
    }

    // Returns the query string without the last 5 characters (AND + space)
    return queryFilterString.slice(0, -5)
};
