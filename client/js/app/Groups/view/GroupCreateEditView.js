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

            Backbone.Validation.bind(this);
        },

        render: function () {
            var teacherView,
                expertView,
                model;

            this.teachers = this.model.get('teachers');
            this.experts = this.model.get('experts');

            teacherView = new This.TeacherView(this.teachers);
            expertView = new This.ExpertView(this.experts);

            model = _.extend({
                directions: i.directions,
                locations: i.locations
            }, this.model.toJSON());

            this.$el.html(this.template(model));
            this.$el.find('#teachers').html(teacherView.render().$el);
            this.$el.find('#experts').html(expertView.render().$el);

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

        setBudgetOwner: function (event) {
            this.$el.find('.budget-option').removeClass('active');
            $(event.target).addClass('active');
        },

        save: function () {
            var formData = {teachers: this.teachers, experts: this.experts},
                errors = {},
                message;

            this.$el.find('#name, #startDate, #finishDate').each(function (index, field) {
                formData[field.name] = field.value;
            });
            this.$el.find('#location option:selected, #direction option:selected').each(function (index, field) {
                formData[$(field).data('name')] = field.value;
            });
            this.$el.find('.budget-option').each(function (index, button) {
                if ($(button).hasClass('active')) {
                    formData['budgetOwner'] = $(button).data('value');
                }
            });

            errors = this.model.preValidate(formData);

            if (!_.isEmpty(errors)) {
                app.mediator.publish('Message', {
                    type: 'hints',
                    $el: this.$el,
                    hints: [errors]
                })
            } else {
                this.model.save(formData);

                if (this.model.isNew()) {
                    message = 'group ' + this.model.get('name') + ' created';
                } else {
                    message = 'group ' + this.model.get('name') + ' edited';
                }

                _.each(_.pick(formData, 'teachers', 'experts'), function (value, key) {
                    if (!value.length) {
                        app.mediator.publish('Message', {
                            type: 'warning',
                            msg: key + ' are not specified'
                        });
                    }
                });

                app.mediator.publish('Groups: group-saved', this.model);
                app.mediator.publish('Message', {
                    type: 'info',
                    msg: message
                });
                this.remove();

            }
        },

        close: function () {
            $(document).off('keydown');
            this.remove();
            app.mediator.publish('Groups: dialog-closed');
        }

    });
})(CS.Groups);