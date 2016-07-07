
var BaseView = tungsten.View;
var BaseModel = tungsten.Model;
var BaseCollection = tungsten.Collection;

var template = {table: '<table class="table table-striped latest-data"> <tbody> {{#dbs}} <tr class="js-table-row"> {{#lastSample}} <td class="dbname"> {{dbname}}</td> <td class="query-count"><span class="{{ countClassName }}"> {{ queries.length }} </span></td> {{#topFiveQueries}} <td class="Query {{ className }}"> {{ formatElapsed }} <div class="popover left"> <div class="popover-content">{{ query }}</div> <div class="arrow"></div> </div> </td> {{/topFiveQueries}} {{/lastSample}} </tr> {{/dbs}} </tbody> </table>'};
var compiledTemplate = window.t = tungsten.templateHelper.compileTemplates(template).table;


var DatabaseModel = BaseModel.extend({
    defaults: {
        dbs: []
    },
    relations: {
        dbs: BaseCollection.extend({
            model: BaseModel.extend({
                idAttr: 'dbname'
            })
        })
    }
});
var DatabaseView = BaseView.extend({
    childViews: {
        'js-table-row': BaseView.extend({}, {debugName: 'RowView'})
    },
    setDBs: function(e) {
        this.model.get('dbs').reset(e);
    }
}, {
    debugName: 'tableView'
});
var databasesView = new DatabaseView({
    el: document.getElementById('app'),
    template: compiledTemplate,
    model: new DatabaseModel({}),
    dynamicInitialize: true
});
window.data = {dbs: ENV.generateData().toArray()};

var update = function () {
    databasesView.setDBs(ENV.generateData().toArray());
    Monitoring.renderRate.ping();
    setTimeout(update, ENV.timeout);
};

update();
