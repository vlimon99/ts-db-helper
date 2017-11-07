import { DbHelperModel } from '../db-helper-model.model';
import { QueryUpdate } from './query-update.model';

/**
 * @public
 * @function Update
 *
 * @description
 * This function is an helper to update models.
 * For a single model prefer use {@link DbHelperModel.save}
 *
 * @param T @extends DbHelperModel a model declared with table and column annotations
 *
 * @example
 * ```typescript
 * // update todo object
 * Update(todo).exec().subscribe((qr: QueryResult<any>) => {
 *      // do something with the result...
 * }, (err) => {
 *      // do something with the error...
 * });
 * ```
 *
 * @return {QueryUpdate} query update instance
 *
 * @author  Olivier Margarit
 * @since   0.1
 */
export function Update<T extends DbHelperModel>(model: T | {new(): T}): QueryUpdate<T> {
    return new QueryUpdate(model);
}
