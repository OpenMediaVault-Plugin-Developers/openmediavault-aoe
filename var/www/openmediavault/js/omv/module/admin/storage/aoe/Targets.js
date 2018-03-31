/**
 * Copyright (C) 2014-2018 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")
// require("js/omv/module/admin/storage/aoe/Target.js")

Ext.define('OMV.module.admin.storage.aoe.Targets', {
    extend: 'OMV.workspace.grid.Panel',
    requires: [
        'OMV.data.Store',
        'OMV.data.Model',
        'OMV.data.proxy.Rpc',
        'OMV.module.admin.storage.aoe.Target'
    ],

    hideEditButton: true,
    hidePagingToolbar: false,
    reloadOnActivate: true,

    columns: [{
        xtype: "textcolumn",
        header: _('UUID'),
        hidden: true,
        dataIndex: 'uuid'
    },{
        xtype: "textcolumn",
        header: _('Shelf'),
        sortable: true,
        dataIndex: 'shelf'
    },{
        xtype: "textcolumn",
        header: _('Slot'),
        sortable: true,
        dataIndex: 'slot'
    },{
        xtype: "textcolumn",
        header: _('NIC'),
        sortable: true,
        dataIndex: 'netif'
    },{
        xtype: "textcolumn",
        header: _('Filename'),
        sortable: true,
        dataIndex: 'filename'
    }],

    store: Ext.create('OMV.data.Store', {
        autoLoad: true,
        model: OMV.data.Model.createImplicit({
            idProperty: 'uuid',
            fields: [{
                name: 'uuid',
                type: 'string'
            },{
                name: 'shelf',
                type: 'integer'
            },{
                name: 'slot',
                type: 'integer'
            },{
                name: 'netif',
                type: 'string'
            },{
                name: 'filename',
                type: 'string'
            }]
        }),
        proxy: {
            type: 'rpc',
            rpcData: {
                'service': 'AOE',
                'method': 'getTargetList'
            }
        }
    }),

    onAddButton: function() {
        Ext.create('OMV.module.admin.storage.aoe.Target', {
            title: _('Add target'),
            uuid: OMV.UUID_UNDEFINED,
            listeners: {
                scope: this,
                submit: function() {
                    this.doReload();
                }
            }
        }).show();
    },

    doDeletion: function(record) {
        OMV.Rpc.request({
            scope: this,
            callback: this.onDeletion,
            rpcData: {
                service: 'AOE',
                method: 'deleteTarget',
                params: {
                    uuid: record.get('uuid')
                }
            }
        });
    }
});

OMV.WorkspaceManager.registerPanel({
    id: 'targets',
    path: '/storage/aoe',
    text: _('Targets'),
    position: 10,
    className: 'OMV.module.admin.storage.aoe.Targets'
});
