<?php
/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2018 Volker Theile
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * OpenMediaVault is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenMediaVault. If not, see <http://www.gnu.org/licenses/>.
 */
namespace OMV\System\Storage\Backend;

/**
 * Implements the storage device backend for ATA-over-Ethernet devices.
 * @ingroup api
 */
class AOE extends BackendAbstract {
	function getType() {
		return OMV_STORAGE_DEVICE_TYPE_DISK;
	}

	function enumerate() {
		// major minor  #blocks  name
                // 152       16   15728640 etherd/e1.5
                // 152        0   16777216 etherd/e1.1
                // 152       32   16777216 etherd/e1.4
                // 152       33    1048576 etherd/e1.4p1
                // 152       34   15727616 etherd/e1.4p2
		return $this->enumerateProcFs("etherd\/e[0-9]+\.[0-9]+");
	}

	function isTypeOf($deviceFile) {
		// Examples:
		// - /dev/etherd/e<shelf>.<slot>p<partition>
		// - /dev/etherd/e1.4
		// - /dev/etherd/e1.4p2
		$regex = "etherd\/e[0-9]+\.[0-9]+(p[0-9]+)*";
		return $this->isTypeOfByName($deviceFile, $regex);
	}

	function getImpl($args) {
		return new \OMV\System\Storage\StorageDeviceAOE($args);
	}

	function baseDeviceFile($deviceFile) {
		return preg_replace("/(p\d+)$/", "", $deviceFile);
	}

	function fsDeviceFile($deviceFile, $partition = 1) {
		// E.g. /dev/etherd/e1.4p2
		return sprintf("%sp%d", $deviceFile, $partition);
	}
}
