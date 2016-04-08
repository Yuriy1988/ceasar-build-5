'use strict';

(function (This) {

    This.CreateEditView = Backbone.View.extend({
        tagName: 'section',

        className: 'backdrop',

        template: templates.groupEditCreate,

        events: {
            'click #save': 'save',
            'click #cancel': 'close',
            'change [name="startDate"]': 'setFinishDate',
            'change [name="direction"]': 'setFinishDate',
            'click .budget-option': 'setBudgetOwner'
        },

        initialize: function (model) {
            this.model = model || new This.Group();
            Backbone.Validation.bind(this, {
                valid: function (view, attr, selector) {
                    var $el = view.$('[name=' + attr + ']'),
                        $group = $el.closest('.form-group');

                    $group.removeClass('has-error');
                    $group.find('.help-block').html('').addClass('hidden');
                },
                invalid: function (view, attr, error, selector) {
                    var $el = view.$('[name=' + attr + ']'),
                        $group = $el.closest('.form-group');

                    $group.addClass('has-error');
                    $group.find('.help-block').html(error).removeClass('hidden');
                }
            });
        },

        render: function () {
            var locations = ['Dnipropetrovsk', 'Lviv', 'Kharkiv'],
                directions = ['MQC', 'UI'];

            this.$el.html(this.template(_.extend({
                directions: directions,
                locations: locations,
                teachers: [app.user.lastName]
            }, this.model)));

            $(document).on('keydown', keyEvent.bind(this));
            function keyEvent (event) {

                if (event.which === ENTER) {
                    this.save();
                } else if (event.which === ESC) {
                    this.close();
                }
            }

            return this;
        },

        setFinishDate: function () {
            var finishDate,
                courseDuration;

            if (this.$el.find('[name=direction]').val() === 'MQC') {
                courseDuration = 9 * 7;
            } else {
                courseDuration = 12 * 7;
            }

            finishDate = new Date(this.$el.find('[name=startDate]').val());

            finishDate.setDate(finishDate.getDate() + courseDuration);
            this.$el.find('[name=finishDate]').val(finishDate.toISOString().split('T')[0]);
        },

        setBudgetOwner: function () {
            this.$el.find('.budget-option').toggleClass('active');
        },

        save: function () {
            var formData = {teachers:[], experts:[]},
                errors = {};

            this.$el.find('input').each(function (index, field) {
                if (field.name === 'teachers' || field.name === 'experts') {
                    formData[field.name].push(field.value);
                } else {
                    formData[field.name] = field.value;
                }
            });

            this.$el.find('select option:selected').each(function (index, field) {
                formData[$(field).data('name')] = field.value;
            });

            this.$el.find('.budget-option').each(function (index, button) {
                if ($(button).hasClass('active')) {
                    formData['budgetOwner'] = $(button).data('value');
                }
            });

            this.model.set(formData);
            errors = this.model.isValid(true);

            if (errors) {
                console.log(errors);
            } else {
                this.model.save();
            }
        },

        close: function () {
            $(document).off('keydown');
            this.remove();
        }
    });
})(CS.Groups);