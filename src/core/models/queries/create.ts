import { DbTable } from '../structure/db-table.model';
import { QueryCreate } from './query-create.model';
/**
 * @public
 * @function Create
 *
 * @description
 * this function is an helper to create table
 * This function is designed to help connectors to manage data model creation
 *
 * @example
 * ```typescript
 * Create(TodoDataModel).exec().subscribe((QueryResult<any>) = {
 *      // todo something on create succeed
 * }, (err) => {
 *      // do something with the error
 * });
 * ```
 *
 * @return {QueryCreate} instance
 *
 * @author  Olivier Margarit
 * @since   0.1
 */
export function Create(table: DbTable): QueryCreate {
    return new QueryCreate(table);
}
