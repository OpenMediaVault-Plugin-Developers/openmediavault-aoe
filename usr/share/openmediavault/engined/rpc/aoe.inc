<?php
/**
 * Copyright (C) 2009-2018 Volker Theile <volker.theile@openmediavault.org>
 * Copyright (C) 2013-2018 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

class OMVRpcServiceAoe extends \OMV\Rpc\ServiceAbstract
{
    public function getName()
    {
        return 'AOE';
    }

    public function initialize()
    {
        $this->registerMethod('getTargetList');
        $this->registerMethod('getTarget');
        $this->registerMethod('setTarget');
        $this->registerMethod('deleteTarget');
        $this->registerMethod('doDiscover');
    }

    public function getTargetList($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.common.getlist');
        // Get the configuration object.
        $db = \OMV\Config\Database::getInstance();
        $objects = $db->getAssoc('conf.service.aoe.target');
        // Filter the result.
        return $this->applyFilter($objects, $params['start'], $params['limit'],
            $params['sortfield'], $params['sortdir']);
    }

    public function getTarget($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.common.objectuuid');
        // Get the configuration object.
        $db = \OMV\Config\Database::getInstance();
        return $db->getAssoc('conf.service.aoe.target', $params['uuid']);
    }

    public function setTarget($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.aoe.settarget');
        // Verify that shelf and slot are unique
        $db = \OMV\Config\Database::getInstance();
        $objects = $db->get('conf.service.aoe.target');
        foreach ($objects as $objectk => $objectv) {
            if (($objectv->get('shelf') == $params['shelf']) &&
                ($objectv->get('slot') == $params['slot']))
                throw new \OMV\Exception(
                    "Shelf %d: Slot %d already in use.",
                    $params['shelf'], $params['slot']
                );
        }
        // Verify that file exists
        if (!file_exists($params['filename'])) {
            throw new \OMV\Exception(
                "File does not exist '%s': %s",
                $params['filename'], $error['message']
            );
        }
        // Prepare the configuration object.
        $object = new \OMV\Config\ConfigObject('conf.service.aoe.target');
        $object->setAssoc($params);
        // Set the configuration object.
        $db->set($object);
        // Return the configuration object.
        return $object->getAssoc();
    }

    public function deleteTarget($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.common.objectuuid');
        // Delete the configuration object.
        $db = \OMV\Config\Database::getInstance();
        $object = $db->get('conf.service.aoe.target', $params['uuid']);
        $db->delete($object);
        // Return the deleted configuration object.
        return $object->getAssoc();
    }

    public function doDiscover($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        exec('aoe-discover', $output);
    }
}
