import { DbHelperModel } from '../db-helper-model.model';
import { QueryInsert } from './query-insert.model';
/**
 * @public
 * @function Insert
 *
 * @description
 * This function provides an easy mean of data insertion.
 * Prefer use the save() method instead of Insert for a single entry, see
 * {@link DbHelperModel} for more informations.
 * Insert optimize multiple entry insertion with bulk mecanisme for example.
 *
 * @param T @extends DbHelperModel a model declared with table and
 *          column annotations
 *
 * @example
 * ```typescript
 * // Create new model instance
 * const todo = new Todo();
 * // manipulates todo instance and then insert it
 * Insert(todo).exec().subscribe((qr: QueryResult<any>) => {
 *      // do something after insertion
 * }, (err) => {
 *      // manage error
 * });
 *
 * // it is simplier to use the save methode for a single entry
 * todo.save()
 *
 * // Insertion should be used for multiple model insertion
 * const todos = <Todo[]>[];
 * // provide and edi.subscribe((qr: QueryResult<any>) => {
 *      // do something after insertion
 * }, (err) => {
 *      // manage error
 * });t new entries
 * Insert(todos).exec().subscribe((qr: QueryResult<any>) => {
 *      // do something after insertion
 * }, (err) => {
 *      // manage error
 * });
 * ```
 *
 * @return {QueryInsert<T>} QueryInsert instance
 *
 * @author  Olivier Margarit
 * @since   0.1
 */
export function Insert<T extends DbHelperModel>(model: T | T[]): QueryInsert<T> {
    return new QueryInsert(model);
}
