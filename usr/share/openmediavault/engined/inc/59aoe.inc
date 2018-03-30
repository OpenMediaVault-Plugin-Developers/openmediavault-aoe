<?php
$mngr = \OMV\System\Storage\Backend\Manager::getInstance();
$mngr->registerBackend(new \OMV\System\Storage\Backend\AOE());
