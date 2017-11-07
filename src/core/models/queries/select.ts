import { DbHelperModel } from '../db-helper-model.model';
import { QuerySelect } from './query-select.model';
/**
 * @public
 *
 * @function Select
 *
 * @description
 * This function is an helper to select models inherited from {@link DbHelperModel}
 * from the database
 *
 * @param T @extends DbHelperModel a model declared with table and column annotations
 *
 * @example
 * ```typescript
 * // select todos
 * Select(Todo).where({isDone: false}}).exec().subscribe((qr: QueryResult<Todo>) => {
 *      // do something with the result...
 * }, (err) => {
 *      // do something with the error...
 * });
 * ```
 *
 * @return {QuerySelect<T>} the new query select instance.
 *
 * @author  Olivier Margarit
 * @since   0.1
 */
export function Select<T extends DbHelperModel>(model: { new(): T }): QuerySelect<T> {
    return new QuerySelect(model);
}
