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
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/form/field/plugin/FieldInfo.js")

Ext.define('OMV.module.admin.storage.aoe.Target', {
    extend: 'OMV.workspace.window.Form',
    requires: [
        'OMV.form.field.plugin.FieldInfo',
        'OMV.workspace.window.plugin.ConfigObject'
    ],

    plugins: [{
        ptype: 'configobject'
    }],

    hideResetButton: true,

    rpcService: 'AOE',
    rpcGetMethod: 'getTarget',
    rpcSetMethod: 'setTarget',

    getFormItems: function() {
        return [{
            xtype: 'numberfield',
            name: 'shelf',
            fieldLabel: _('Shelf'),
            minValue: 1,
            allowDecimals: false,
            allowBlank: false,
            value: 1,
            plugins: [{
                ptype: 'fieldinfo',
                text: _('This should be the shelf address (major AoE address) of the AoE device to create.')
            }]
        },{
            xtype: 'numberfield',
            name: 'slot',
            fieldLabel: _('Slot'),
            minValue: 1,
            allowDecimals: false,
            allowBlank: false,
            value: 1,
            plugins: [{
                ptype: 'fieldinfo',
                text: _('This should be the slot address (minor AoE address) of the AoE device to create.')
            }]
        },{
            xtype: 'combo',
            name: 'netif',
            fieldLabel: _('NIC'),
            emptyText: _('Select a device ...'),
            queryMode: 'local',
            store: Ext.create('OMV.data.Store', {
                autoLoad: true,
                model: OMV.data.Model.createImplicit({
                    idProperty: 'devicename',
                    fields: [
                        { name: 'devicename', type: 'string' }
                    ]
                }),
                proxy: {
                    type: 'rpc',
                    rpcData: {
                        service: 'Network',
                        method: 'getEthernetCandidates'
                    }
                },
                sorters: [{
                    direction: 'ASC',
                    property: 'devicename'
                }]
            }),
            displayField: 'devicename',
            valueField: 'devicename',
            allowBlank: false,
            forceSelection: true,
            triggerAction: 'all',
            plugins: [{
                ptype: 'fieldinfo',
                text: _('The name of the ethernet network interface to use for AoE communications.')
            }]
        },{
            xtype: 'textfield',
            name: 'filename',
            fieldLabel: _('Filename'),
            value: '',
            allowBlank: false,
            plugins: [{
                ptype: 'fieldinfo',
                text: _('The name of the regular file or block device to export.')
            }]
        },{
            xtype: 'checkbox',
            name: 'direct',
            fieldLabel: _('Direct'),
            checked: false,
            boxLabel: _('Selects O_DIRECT mode for accessing the underlying block device.')
        },{
            xtype: 'checkbox',
            name: 'sync',
            fieldLabel: _('Sync'),
            checked: false,
            boxLabel: _('Selects O_SYNC mode for accessing the underlying block device, so all writes are committed to disk before returning to the client.')
        }];
    }
});
