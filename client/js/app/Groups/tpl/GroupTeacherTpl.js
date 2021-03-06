templates.groupTeachersTpl = _.template([
    '<ul class="list">',
    '</ul>',
    '<div class="add-teacher"></div>'
].join(''));


templates.groupSelectTeacherTpl = _.template([
    '<div class="input-group">',
    '    <select name="teachers" id="teachers" class="form-control">',
    '    <% _(allTeachers).each(function(teacher) { %>',
    '       <option value="<%= teacher %>"><%= teacher %></option>',
    '    <% }); %>',
    '    </select>',
    '    <span class="input-group-btn">',
    '       <button id="acceptSelect" class="btn btn-default" type="button">Ok</button>',
    '    </span>',
    '    <span class="input-group-btn">',
    '       <button id="cancelSelect" class="btn btn-default" type="button">Cancel</button>',
    '    </span>',
    '</div>'
].join(''));

templates.groupMoreTeacherTpl = _.template('<span class="add-teacher-btn">+ one more teacher</span>');

templates.groupTeacherTpl = _.template([
    '<% _(teachers).each(function(teacher) { %>',
    '<li>',
    '<%= teacher %>',
    '    <button class="remove-teacher" class="pull-right" data-teacher="<%= teacher %>">x</button>',
    '</li>',
    '<% }); %>'
].join(''));