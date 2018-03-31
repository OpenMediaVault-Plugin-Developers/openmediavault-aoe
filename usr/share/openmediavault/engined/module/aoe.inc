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

class OMVModuleAoe extends \OMV\Engine\Module\ServiceAbstract
    implements \OMV\Engine\Notify\IListener
{
    public function getName()
    {
        return "aoe";
    }

    public function shouldStart() { return [ "systemd" ]; }

    public function stopService() {
        $this->execTasks("delete");
    }

    public function startService() {
        $db = \OMV\Config\Database::getInstance();
        $objects = $db->get("conf.service.aoe.target");
        foreach ($objects as $objectk => $objectv) {
            $serviceName = sprintf('aoe-%s-%s.service',
                $objectv->get('shelf'),
                $objectv->get('slot')
            );
            // Enable the service.
            $systemCtl = new \OMV\System\SystemCtl($serviceName);
            $systemCtl->enable(TRUE);
        }
    }

    final public function onDelete($type, $path, $object) {
        $this->addTask("delete", "deleteEntry", $object);
    }

    final public function deleteEntry($params) {
        $serviceName = sprintf('aoe-%s-%s.service',
            $params['shelf'],
            $params['slot']
        );
        // Disable the service
        $systemCtl = new \OMV\System\SystemCtl($serviceName);
        if ($systemCtl->isActive())
            $systemCtl->disable(TRUE);
        // Remove the service unit file.
        $unitPath = sprintf('/etc/systemd/system/%s', $serviceName);
        if (file_exists($unitPath))
            unlink($unitPath);
    }

    public function bindListeners(\OMV\Engine\Notify\Dispatcher $dispatcher)
    {
        $dispatcher->addListener(
            OMV_NOTIFY_CREATE | OMV_NOTIFY_DELETE,
            "org.openmediavault.conf.service.aoe.target",
            [ $this, "setDirty" ]
        );
        $dispatcher->addListener(
            OMV_NOTIFY_DELETE,
            "org.openmediavault.conf.service.aoe.target",
            [ $this, "onDelete" ]
        );
        $moduleMngr = \OMV\Engine\Module\Manager::getInstance();
        $dispatcher->addListener(
            OMV_NOTIFY_CREATE | OMV_NOTIFY_DELETE,
            "org.openmediavault.conf.service.aoe.target",
            [ $moduleMngr->getModule("systemd"), "setDirty" ]
        );
    }
}
