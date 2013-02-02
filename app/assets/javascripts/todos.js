// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.html)
// to persist Backbone models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Todo Model
  // ----------

  // Our basic **Todo** model has `content`, `order`, and `done` attributes.
  var Todo = Backbone.Model.extend({

    // Default attributes for the todo item.
    defaults: function() {
      return {
        content: "empty todo...",
        order: Todos.nextOrder(),
        done: false
      };
    },

    // Ensure that each todo created has `content`.
    initialize: function() {
      if (!this.get("content") || !/[^\s]+/.test(this.get("content"))) {
        this.set({"content": this.defaults().content});
      }
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    },

	  url : function() {
	    return this.id ? '/todos/' + this.id : '/todos';
	  },
	
	  clear: function() {
	    this.destroy();
	    this.view.remove();
	  }

  });

  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  var TodoList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Todo,

    // Save all of the todo items under the `"todos-backbone"` namespace.
    // localStorage: new Backbone.LocalStorage("todos-backbone-local"),
	url: '/todos',
	
    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      //return this.last().get('order') + 1;
      return 1+ this.max(function(todo){return todo.get("order");}).get("order");
    },

    // Todos are sorted by their original insertion order.
    comparator: function(todo) {
    	// reverse order
      return -todo.get('order');
    }

  });

  // Create our global collection of **Todos**.
  var Todos = new TodoList;

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  var TodoView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    //template: _.template($('#item-template').html()),
    template: Handlebars.compile($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the contents of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.$el.attr('id_order', this.model.get('id') + ':'+ this.model.get('order'));
      
      this.input = this.$('.edit');
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({content: value});
        this.model.fetch();
        this.$el.removeClass("editing");
      }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
    	//console.log(">>" + e.keyCode);
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    // Our template for the line of statistics at the bottom of the app.
    //statsTemplate: _.template($('#stats-template').html()),
    statsTemplate: Handlebars.compile($('#stats-template').html()),
	
    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete",
      "update-sort": 	"updateSort"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {

      this.input = this.$("#new-todo");
      this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Todos, 'add', this.addOne);
      this.listenTo(Todos, 'reset', this.addAll);
      this.listenTo(Todos, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');

      Todos.fetch();
	},

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      if (Todos.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      //this.$("#todo-list").append(view.render().el);
      // reverse order
      this.$("#todo-list").prepend(view.render().el);
    },
    appendOne: function(todo){
    	var view = new TodoView({model: todo});
       this.$("#todo-list").append(view.render().el);    	
    },
    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Todos.each(this.appendOne, this);
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Todos.create({content: this.input.val()});
      this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.invoke(Todos.done(), 'destroy');
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Todos.each(function (todo) { todo.save({'done': done}); });
    },
    
    updateSort: function(event, model, position){
    	var orders = [],ids = [];
    	this.$('#todo-list li').each( function(index, el){
    	    //console.log(el);
    	    var arr = $(el).attr('id_order').split(':');
    	    ids.push( arr[0]);
    	    orders.push(arr[1]);
    	});
		orders.sort(function(a, b){return b - a});
    	//console.log(orders);
    	//console.log(ids);
    	$(ids).each( function(index, id){
    	    Todos.get(id).set({'order': orders[index]}).save();
    	});
    	
    }
  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

	// jquery sortable
/*	$("#todo-list").sortable({
		helper: 'clone',
		cursor: 'move',
		tolerance: 'pointer',
        stop: function(event, ui) {
           var idOrder = ui.item.attr('id_order');
           ui.item.trigger('update-sort', ui.item.index());
        }
	});
	//$("#todo-list").disableSelection();
*/ 
    $('#todo-list').sortable({
        stop: function(event, ui) {
           var idOrder = ui.item.attr('id_order');
           //console.log(ui.item);
           //console.log(ui.item.index());
           //console.log(idOrder);
           //ui.item.trigger('drop', ui.item.index());
           ui.item.trigger('update-sort', ui.item.index());
        }
    });
  	$("#todo-list").disableSelection();
});
