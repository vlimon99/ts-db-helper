import { CompositeClause } from './composite-clause.model';
import { ClauseOperators } from '../constants/clause-operators.constant';
import { QueryPart } from './query-part.model';
import { Clause } from './clause.model';
import { IClause } from '../interfaces/i-clause.interface';

/**
 * @public
 * @class ClauseGroup
 *
 * @description
 * is a group of clause computed at the same
 * level. Clause group are used for where statement of Select, Update
 * and Delete statement.
 *
 * @example
 * ```typescript
 * // Create a group of clauses
 * const group = new ClauseGroup();
 *
 * // create clause to get Todo item where isDone === false
 * const doneClause = new Clause();
 * doneClause.key = 'isDone';
 * doneClause.value = false;
 * group.add(doneClause);
 *
 * // create clause to get Todo item where dueDate <= now
 * const dueDateClause = new Clause();
 * dueDateClause.key = 'dueDate';
 * dueDateClause.value = (new Date()).getTime();
 * dueDateClause.comparator = Clause.COMPARATORS.LTE;
 * group.add(dueDateClause);
 *
 * // start select clause
 * Select(Todo).where(group).exec().subscribe((QueryResult<Todo>) => {
 *      // do something with the result...
 * }, (err) => {
 *      // do something with the error...
 * });
 * ```
 *
 * @author  Olivier Margarit
 *
 * @since   0.1
 */
export class ClauseGroup {
    /**
     * @private
     * @property {Array<IClause>} clauses array of clause to append in the same group
     */
    private clauses = <IClause[]>[];

    /**
     * @public
     * @constructor could take same parameters as add
     *
     * @param {ClauseGroup|Clause|Clause[]|CompositeClause|{[index: string]: any}} clauses clauses to add to the group
     */
    public constructor(clauses?: ClauseGroup|Clause|Clause[]|CompositeClause|{[index: string]: any}) {
        if (clauses) {
            this.add(clauses);
        }
    }

    /**
     * @public
     * @method isEmpty check if clause group is empty
     *
     * @return {boolean} true if is empty
     */
    public isEmpty(): boolean {
        return !this.clauses;
    }

    /**
     * @public
     * @method add add one or many clause
     *
     * @example
     * // create group
     * const group = new ClauseGroup();
     *
     * // clause with dict notation
     * group.add({isDone: false, bar: 'foo'});
     *
     * // Adding a clause object
     * const clause = new Clause();
     * clause.key = 'isDone';
     * clause.value = false;
     * group.add(clause);
     *
     * @param {ClauseGroup|Clause|Clause[]|IClause[]|CompositeClause|{[index: string]: any}} clauses clauses to add to the clause group
     */
    public add(clauses: ClauseGroup|Clause|Clause[]|IClause[]|CompositeClause|{[index: string]: any}) {
        if (clauses instanceof ClauseGroup) {
            this.add(clauses.clauses);
        } else if (clauses instanceof Clause || clauses instanceof CompositeClause) {
            this.clauses.push(clauses);
        } else if (Array.isArray(clauses)) {
            this.clauses = this.clauses.concat(clauses);
        } else {
            for (const key in clauses) {
                if (clauses.hasOwnProperty(key)) {
                    const clause = new Clause();
                    clause.key = key;
                    clause.value = clauses[key];
                    this.clauses.push(clause);
                }
            }
        }
    }

    /**
     * @public
     * @method build is apart of private API, should move later...
     * it build the clause  group to the string part of the query
     *
     * @return {QueryPart} of the query with the string part and
     *          clauses params.
     */
    public build(): QueryPart {
        const queryPart = new QueryPart;
        for (const clause of this.clauses) {
            if (queryPart.content) {
                queryPart.appendContent((clause.operator === ClauseOperators.AND) ? ClauseOperators.AND : ClauseOperators.OR);
            }
            queryPart.append(clause.build());
        }
        return queryPart;
    }
}
