export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/ts-db-helper.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'TsDbHelper',
    globals: {
        'rxjs/Observable': 'Rx',
        'rxjs/Observer': 'Rx',
        'rxjs/Subject': 'Rx',
        'rxjs/add/operator/combineLatest': 'Rx.Observable.prototype',
        'rxjs/add/operator/share': 'Rx.Observable.prototype',
        'rxjs/add/operator/map': 'Rx.Observable.prototype',
        'rxjs/add/Observable/concat': 'Rx.Observable.prototype'
    },
    external: [
        'rxjs/Observable',
        'rxjs/Observer',
        'rxjs/Subject',
        'rxjs/add/observable/combineLatest',
        'rxjs/add/operator/map',
        'rxjs/add/operator/share',
        'rxjs/add/Observable/concat'
    ]
};