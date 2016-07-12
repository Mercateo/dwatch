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
  'home.images': 'Images',
  'home.images.supportingText': 'Sehen Sie eine Liste aller Images.',
  'home.images.all': '{count, number} images',
  'home.images.dangling': '{count, number} dangling',
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
  'containers.actions.gc': 'Gestoppte Container entfernen',
  'containers.actions.gc.warning': 'Es konnten nicht alle gestoppten Container entfernen.',

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

  // images
  'images.title': 'Images',
  'images.th.id': 'Id',
  'images.th.name': 'Name',
  'images.th.tags': 'Tags',
  'images.th.created': 'Angelegt',
  'images.th.size': 'Größe',
  'images.filter.showDangling': 'Dangling Images anzeigen',
  'images.actions.gc': 'Dangling Images etnfernen',
  'images.actions.gc.warning': 'Es konnten nicht alle dangling Images entfernt werden. Vielleicht werden Sie noch von gestoppten Containern verwendet.',

  // image details
  'image.title': 'Image {name}',
  'image.header': 'Image',
  'image.details': 'Details',
  'image.detail.author': 'Autor',
  'image.detail.os': 'Betriebssystem',
  'image.detail.arch': 'Architektur',
  'image.detail.cmd': 'Kommandos',
  'image.detail.cwd': 'Arbeitsverzeichnis',
  'image.detail.environment': 'Umgebung',
  'image.detail.entrypoint': 'Einsprungspunkt',
  'image.detail.exposed-ports': 'Bereitgestellte Ports',
  'image.detail.volumes': 'Volumes',
  'image.action.remove': 'Entfernen',
  'image.action.remove.warning': 'Das Image konnte nicht gelsöcht werden. Es wird vielleicht noch von einem gestoppten Container verwendet.',

  // image history
  'image.history.title': 'Historie',
  'image.history.created-by': 'Erstellt von',

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
