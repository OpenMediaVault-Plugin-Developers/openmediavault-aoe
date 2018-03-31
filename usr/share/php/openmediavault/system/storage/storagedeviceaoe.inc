<?php
/**
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @copyright Copyright (c) 2018 OpenMediaVault Plugin Developers
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2018 Volker Theile
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
namespace OMV\System\Storage;

class StorageDeviceAOE extends StorageDevice
{
    public function getModel()
    {
        return 'etherd';
    }

    public function getVendor()
    {
        return 'AoE';
    }

    public function getSerialNumber()
    {
        $serial = explode('/', $this->getPreferredDeviceFile());
        return $serial[3];
    }

    public function getDescription()
    {
        $model = $this->getModel();
        return sprintf('%s [%s, %s]',
            !empty($model) ? $model : gettext("n/a"),
            $this->getPreferredDeviceFile(),
            binary_format($this->getSize())
        );
    }

    public function isRotational()
    {
        return FALSE;
    }

    public function hasSmartSupport()
    {
        return FALSE;
    }
}
