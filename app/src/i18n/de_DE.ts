import { I18NLanguage } from './index';

export const de_DE : I18NLanguage = {
  // general
  'container': 'Container',
  'containers': 'Container',
  'no-data-available': 'Keine Daten vorhanden',
  'yes': 'Ja',
  'no': 'Nein',

  //// pages
  // home
  'home.title': 'Dashboard',
  'home.containers.supportingText': 'Sehen Sie laufende und gestoppte Container auf einen Blick.',
  'home.containers.all': '{count, number} Container',
  'home.containers.running': '{count, number} online',
  'home.system': 'System',
  'home.system.server-version': 'Server Version',
  'home.system.os': 'Betriebssystem',
  'home.system.kernel-version': 'Kernel Version',
  'home.system.go-version': 'GO Version',
  'home.system.arch': 'Architektur',
  'home.system.api-version': 'API Version',
  'home.system.build-time': 'Datum',

  // containers
  'containers.title': 'Container',
  'containers.th.id': 'Id',
  'containers.th.image': 'Image',
  'containers.th.command': 'Kommando',
  'containers.th.created': 'Angelegt',
  'containers.th.status': 'Status',
  'containers.th.ports': 'Portzuweisungen',
  'containers.th.name': 'Name',
  'containers.filter.showAll': 'Alle anzeigen',
  'containers.state.CREATED': 'Created',
  'containers.state.EXITED': 'Exited',
  'containers.state.RUNNING': 'Up',

  // container details
  'container.title': 'Container {name}',
  'container.header': 'Container',
  'container.detail.header': 'Details',
  'container.network.header': 'Netzwerk',
  'container.stats.header': 'Metriken',
  'container.detail.commands': 'Kommandos',
  'container.detail.arguments': 'Argumente',
  'container.detail.environment': 'Umgebung',
  'container.detail.pwd': 'Arbeitsverzeichnis',
  'container.live.title': 'Live-Daten',
  'container.live.top': 'Top',

  // container node details
  'container.node.header': 'Knoten',
  'container.node.name': 'Name',
  'container.node.cpuCount': 'CPU Share',
  'container.node.memoryLimit': 'RAM',
  'container.node.ip': 'IP',

  'container.action.start': 'Starten',
  'container.action.pause': 'Pausieren',
  'container.action.unpause': 'Erneut starten',
  'container.action.stop': 'Stoppen',
  'container.action.remove': 'Löschen',

  //settings
  'settings.title': 'Einstellungen',
  'settings.config-type': 'Verbindungstyp',
  'settings.config-type.host': 'Host',
  'settings.config-type.socket': 'Socket',
  'settings.socket-path': 'Pfad zum Socket',
  'settings.host': 'Host',
  'settings.port': 'Port',
  'settings.port.not-a-number': 'Der Port muss eine Zahl sein.',
  'settings.protocol': 'Protokoll',
  'settings.protocol.http': 'HTTP',
  'settings.protocol.https': 'HTTPS',
  'settings.ca-file': 'Pfad zum Zertifikat der CA',
  'settings.cert-file': 'Pfad zum Zertifikat der VM',
  'settings.key-file': 'Pfad zum privaten Schlüssel der VM',
  'settings.action.submit': 'Speichern',
  'settings.valid-connection': 'Verbindung konnte erfolgreich getestet werden.',

  ////components
  //stats
  'stats.cpu': 'CPU',
  'stats.memory': 'RAM',


};
