/**
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
 * @copyright Copyright (c) 2014-2018 OpenMediaVault Plugin Developers
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
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/util/Format.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")

Ext.define('OMV.module.admin.storage.aoe.Initiators', {
    extend: 'OMV.workspace.grid.Panel',
    requires: [
        'OMV.Rpc',
        'OMV.data.Store',
        'OMV.data.Model',
        'OMV.data.proxy.Rpc',
        'OMV.util.Format'
    ],

    hidePagingToolbar: false,
    hideAddButton: true,
    hideEditButton: true,
    hideDeleteButton: true,
    autoReload: false,
    stateful: true,
    stateId: 'de17b996-3748-11e8-830a-e31b4b87e663',
    columns: [{
        xtype: 'textcolumn',
        text: _('Device Name'),
        sortable: true,
        dataIndex: 'devname',
        stateId: 'devname'
    },{
        xtype: 'textcolumn',
        text: _('Device Size'),
        sortable: true,
        dataIndex: 'devsize',
        stateId: 'devsize'
    },{
        xtype: 'textcolumn',
        text: _('Network Adapter'),
        sortable: true,
        dataIndex: 'nic',
        stateId: 'nic'
    },{
        xtype: 'textcolumn',
        text: _('Payload Size'),
        sortable: true,
        dataIndex: 'payload',
        stateId: 'payload'
    },{
        xtype: 'textcolumn',
        text: _('Status'),
        sortable: true,
        dataIndex: 'status',
        stateId: 'status'
    }],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            store: Ext.create('OMV.data.Store', {
                autoLoad: true,
                model: OMV.data.Model.createImplicit({
                    idProperty: 'devname',
                    fields: [
                        { name: 'devname', type: 'string' },
                        { name: 'devsize', type: 'string' },
                        { name: 'nic', type: 'string' },
                        { name: 'payload', type: 'string' },
                        { name: 'status', type: 'string' }
                    ]
                }),
                proxy: {
                    type: 'rpc',
                    rpcData: {
                        service: 'AOE',
                        method: 'getInitiatorList'
                    }
                }
            })
        });
        me.callParent(arguments);
    },

    getTopToolbarItems: function() {
        var me = this;
        var items = me.callParent(arguments);

        Ext.Array.insert(items, 0, [{
            id: me.getId() + '-discover',
            xtype: 'button',
            text: _('Discover'),
            icon: 'images/search.png',
            iconCls: Ext.baseCSSPrefix + 'btn-icon-16x16',
            handler: Ext.Function.bind(me.onCommandButton, me, [ 'aoe-discover' ]),
            scope: me
        },{
            id: me.getId() + '-flush',
            xtype: 'button',
            text: _('Flush'),
            icon: 'images/eject.png',
            iconCls: Ext.baseCSSPrefix + 'btn-icon-16x16',
            handler: Ext.Function.bind(me.onCommandButton, me, [ 'aoe-flush' ]),
            scope: me
        }]);
        return items;
    },

    onCommandButton: function(cmd) {
        var me = this;
        OMV.Rpc.request({
            scope: me,
            relayErrors: false,
            rpcData: {
                service: 'AOE',
                method: 'doCommand',
                params: {
                    'command' : cmd
                }
            },
            success: function(id, success, response) {
                me.doReload();
            }
        });
    }
});

OMV.WorkspaceManager.registerPanel({
    id: 'initiators',
    path: '/storage/aoe',
    text: _('Initiators'),
    position: 20,
    className: 'OMV.module.admin.storage.aoe.Initiators'
});
