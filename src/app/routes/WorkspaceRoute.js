'use strict';

module.exports = Ember.Route.extend({

    model: function(){
        return this.controllerFor('context').promiseProject();
    },

    actions: {

        error: function(error, transition){
            console.log(error);
            console.log('error, back to welcome');
            this.transitionTo('welcome');
        }

    }

});