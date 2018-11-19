import { ShadowValue } from '../models/shadow-value.model';
import { ModelManager } from '../managers/model-manager';
import { Clause } from '../models/queries/clause.model';
import { QueryResult } from '../interfaces/query-result.interface';
import { Select } from '../models/queries/select';
import { Observable } from 'rxjs/Observable';
import { RelationType } from '../models/constants/relation-type.constant';
import { DbRelationModel } from '../models/structure/db-relation.model';
import { DbTable } from '../models/structure/db-table.model';
import { DbColumn } from '../models/structure/db-column.model';
import { DbHelperModel } from '../models/db-helper-model.model';
import { ColumnConfig } from './configurator/column.configurator';

/**
 * @public
 * @function ForeignModel
 *
 * @description
 * Annotation factory to declare foreign model.
 *
 * @example
 * ```typescript
 *  @Table()
 *  export class Todo extends DbHelperModel {
 *
 *      @PrimaryKey({autoIncremented: true})
 *      public id: number
 *
 *      @Column()
 *      public name: string;
 *
 *      @Column({type: 'long'})
 *      public dueDate: number;
 *
 *      @ForeignModel(Category, {name: 'categoryFk'})
 *      public category: Category
 *  }
 * ```
 *
 *  @template T @extends DbHelperModel the target model
 *
 * @param {{new(): DbHelperModel}} model    the target model
 * @param {ColumnConfig?} config            optional configuration
 * @param {string?} relationKey             optional relation key
 *
 * @return {Function} the annotation
 *
 * @author  Olivier Margarit
 * @since   0.1
 */
export function ForeignModel<T extends DbHelperModel>(model: {new(): DbHelperModel}, config?: ColumnConfig, relationKey?: string): any {
    /**
     * @function
     *
     * @description
     * the annotation
     */
    return (target: T, key: string) => {

        const column = new DbColumn();
        column.field = key;

        if (config) {
            column.configure(config);
        }

        let table: DbTable = target.constructor.prototype.$$dbTable;
        if (!table) {
            table = new DbTable();
            target.constructor.prototype.$$dbTable = table;
        }

        let relation = table.getRelation(model as {new(): DbHelperModel}, relationKey);
        if (!relation) {
            relation = new DbRelationModel(target.constructor as {new(): DbHelperModel}, model);
            table.addRelation(model, relation, relationKey);
        }
        relation.add(column);

        let reverseTable: DbTable = model.prototype.$$dbTable;
        if (!reverseTable) {
            reverseTable =  new DbTable();
            model.prototype.$$dbTable = reverseTable;
        }

        let reverseRelation = table.getRelation(target.constructor as {new(): DbHelperModel}, relationKey);
        if (!reverseRelation) {
            reverseRelation = new DbRelationModel(target.constructor as {new(): DbHelperModel}, model, true);
            reverseTable.addRelation(target.constructor as {new(): DbHelperModel}, reverseRelation, relationKey);
        }
        reverseRelation.add(column);

        // relation compute column name is not set, so wait for it before invoking column.name
        table.columnList.push(column);
        table.columns[column.name] = column;
        table.fields[column.field] = column;

        const descriptor = Object.getOwnPropertyDescriptor(target, key);
        if (descriptor && descriptor.value !== undefined) {
            column.defaultValue = descriptor.value;
        }

        Object.defineProperty(target.constructor.prototype, key, {
            get: function () {
                return this.$$shadow[column.name].foreign;
            },
            set: function (foreign: DbHelperModel) {
                const oldVal = this.$$shadow[column.name].val;
                if (!foreign) {
                    this.$$shadow[column.name].val = null;
                    this.$$shadow[column.name].foreign = null;
                } else {
                    this.$$shadow[column.name].val = foreign.getFieldValue(column.foreignField!);
                    this.$$shadow[column.name].foreign = foreign;
                }
                if (this.$$shadow[column.name].val !== oldVal) {
                    this.$$isModified = true;
                    this.$$shadow[column.name].prevVal = oldVal;
                }
            },
            enumerable: true,
            configurable: false
        });
    };
}
