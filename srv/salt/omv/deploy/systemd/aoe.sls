# @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
# @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
# @copyright Copyright (c) 2019 OpenMediaVault Plugin Developers
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

{% set config = salt['omv_conf.get']('conf.service.aoe') %}

remove_aoe_service_unit_files:
  module.run:
    - file.find:
      - path: "/etc/systemd/system"
      - iname: "aoe-*.service"
      - delete: "f"

{% for target in config.targets.target %}

configure_aoe_{{ target.shelf }}_{{ target.slot }}_service_unit_file:
  file.managed:
    - name: '/etc/systemd/system/aoe-{{ target.shelf }}-{{ target.slot }}.service'
    - contents: |
        {{ pillar['headers']['auto_generated'] }}
        {{ pillar['headers']['warning'] }}
[Unit]
Description=ata over ethernet target for {{ target.shelf }} {{ target.slot }}
After=network.target

[Service]
Type=oneshot
{{ 'Update' if files else 'Continue' }}
ExecStart=/usr/sbin/vbladed {{ '-d ' if target.direct }}{{ '-s ' if target.sync }}{{ target.shelf }} {{ target.slot }} {{ target.netif }} {{ target.filename }}
RemainAfterExit=true

[Install]
WantedBy=local-fs.target
    - user: root
    - group: root
    - mode: 644

{% endfor %}

aoe_service_units_systemctl_daemon_reload:
  module.run:
    - name: service.systemctl_reload

{% for target in config.targets.target %}

enable_aoe_{{ target.shelf }}_{{ target.slot }}_service_unit:
  service.enabled:
    - name: 'aoe-{{ target.shelf }}-{{ target.slot }}.service'
    - enable: True

restart_aoe_{{ target.shelf }}_{{ target.slot }}_service_unit:
  module.run:
    - service.restart:
      - name: 'aoe-{{ target.shelf }}-{{ target.slot }}.service'

{% endfor %}
