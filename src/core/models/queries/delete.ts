import { DbHelperModel } from '../db-helper-model.model';
import { QueryDelete } from './query-delete.model';

/**
 * @public API
 * @function Delete
 *
 * @description
 * this function allow to simply remove model instance or entries
 * matching with specific clauses.
 *
 * @param T @extends DbHelperModel a model declared with table
 *          and column annotations
 *
 * @example
 * ```typescript
 * // Delete a specific model using Delete
 * // assume that "todo" is declared before and is a model extending
 * // DbHelperModel and using Table + Column annotation
 * Delete(todo).exec().subscribe((qr: QueryResult<any>) => {
 *      // the model is deleted...
 * }, (err) => {
 *      // manage th error...
 * });
 * // You could use Delete statement to delete many entries
 * Delete(Todo).where({isDone: true}).exec().subscribe((qr: QueryResult<any>) => {
 *      // all done todos are deleted !
 * }, (err) => {
 *      // manage th error...
 * });
 * ```
 *
 * @return {QueryDelete<T>} QueryDelete instance
 *
 * @author  Olivier Margarit
 * @since   0.1
 */
export function Delete<T extends DbHelperModel>(model: T | {new(): T }): QueryDelete<T> {
    return new QueryDelete(model);
}
