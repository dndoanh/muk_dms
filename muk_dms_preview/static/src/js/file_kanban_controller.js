/**********************************************************************************
*
*    Copyright (c) 2017-2019 MuK IT GmbH.
*
*    This file is part of MuK Preview Image 
*    (see https://mukit.at).
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Lesser General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Lesser General Public License for more details.
*
*    You should have received a copy of the GNU Lesser General Public License
*    along with this program. If not, see <http://www.gnu.org/licenses/>.
*
**********************************************************************************/

odoo.define('muk_dms_preview.FileKanbanController', function (require) {
    "use strict";
    var core = require('web.core');
    var session = require('web.session');
    var field_utils = require('web.field_utils');
    var PreviewDialog = require('muk_preview.PreviewDialog');
    var PreviewManager = require('muk_preview.PreviewManager');
    var FileKanbanController = require('muk_dms.FileKanbanController');
    var _t = core._t;
    var QWeb = core.qweb;
    FileKanbanController.include({
        custom_events: _.extend({}, FileKanbanController.prototype.custom_events, {kanban_preview: '_onKanbanPreview',}),
        _onKanbanPreview: function (event) {
            var state = this.model.get(this.handle);
            var data = _.map(state.data, function (record) {
                var last_update = record.data.__last_update;
                var unique = field_utils.format.datetime(last_update);
                var download_url = session.url('/web/content', {
                    unique: unique ? unique.replace(/[^0-9]/g, '') : null,
                    filename: record.data.name,
                    filename_field: 'name',
                    model: 'muk_dms.file',
                    id: record.data.id,
                    field: 'content',
                    download: true,
                });
                return {url: download_url, filename: record.data.name, mimetype: record.data.mimetype,};
            });
            var index = _.findIndex(state.data, function (record) {
                return event.data.res_id === record.data.id;
            });
            var preview = new PreviewDialog(this, data, index);
            preview.appendTo(this.$('.mk_file_kanban_view'));
            event.stopPropagation();
        },
    });
});
