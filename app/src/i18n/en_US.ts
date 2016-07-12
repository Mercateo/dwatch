import { I18NLanguage } from './index';

export const en_US: I18NLanguage = {
  // general
  'container': 'Container',
  'containers': 'Containers',
  'no-data-available': 'No data available',
  'yes': 'yes',
  'no': 'no',

  //// pages
  // home
  'home.title': 'Dashboard',
  'home.containers.supportingText': 'Get a list of your containers.',
  'home.containers.all': '{count, number} containers',
  'home.containers.running': '{count, number} online',
  'home.images': 'Images',
  'home.images.supportingText': 'A list of all images.',
  'home.images.all': '{count, number} images',
  'home.images.dangling': '{count, number} dangling',
  'home.system': 'System',
  'home.system.server-version': 'Server Version',
  'home.system.os': 'OS',
  'home.system.kernel-version': 'Kernel Version',
  'home.system.go-version': 'GO Version',
  'home.system.arch': 'Architecture',
  'home.system.api-version': 'API Version',
  'home.system.build-time': 'Build Date',

  // containers
  'containers.title': 'Container',
  'containers.th.id': 'Id',
  'containers.th.image': 'Image',
  'containers.th.command': 'Commands',
  'containers.th.created': 'Created',
  'containers.th.status': 'State',
  'containers.th.ports': 'Ports',
  'containers.th.name': 'Name',
  'containers.filter.showAll': 'Show all',
  'containers.state.CREATED': 'Created',
  'containers.state.EXITED': 'Exited',
  'containers.state.RUNNING': 'Up',
  'containers.actions.gc': 'Remove stopped containers',
  'containers.actions.gc.warning': 'Not all stopped containers could be removed.',

  // container details
  'container.title': 'Container {name}',
  'container.header': 'Container',
  'container.detail.header': 'Details',
  'container.network.header': 'Network',
  'container.stats.header': 'Metrics',
  'container.detail.commands': 'Commands',
  'container.detail.arguments': 'Arguments',
  'container.detail.environment': 'Environment',
  'container.detail.pwd': 'Working dir',
  'container.live.title': 'Live data',
  'container.live.top': 'Top',

  // container node details
  'container.node.header': 'Node',
  'container.node.name': 'Name',
  'container.node.cpuCount': 'CPU Share',
  'container.node.memoryLimit': 'RAM',
  'container.node.ip': 'IP',

  'container.action.start': 'Start',
  'container.action.pause': 'Pause',
  'container.action.unpause': 'Unpause',
  'container.action.stop': 'Stop',
  'container.action.remove': 'Remove',

  // images
  'images.title': 'Images',
  'images.th.id': 'Id',
  'images.th.name': 'Name',
  'images.th.tags': 'Tags',
  'images.th.created': 'Created',
  'images.th.size': 'Size',
  'images.filter.showDangling': 'Show dangling',
  'images.actions.gc': 'Remove dangling images',
  'images.actions.gc.warning': 'Not all dangling images could be removed. They may be used by stopped containers.',

  // image details
  'image.title': 'Image {name}',
  'image.header': 'Image',
  'image.details': 'Details',
  'image.detail.author': 'Author',
  'image.detail.os': 'OS',
  'image.detail.arch': 'Architecture',
  'image.detail.cmd': 'Commands',
  'image.detail.cwd': 'Working dir',
  'image.detail.environment': 'Environment',
  'image.detail.entrypoint': 'Entrypoint',
  'image.detail.exposed-ports': 'Exposed ports',
  'image.detail.volumes': 'Volumes',
  'image.action.remove': 'Remove',
  'image.action.remove.warning': 'Image could not be removed. Its may be used by a (stopped) container.',

  // image history
  'image.history.title': 'Creation history',
  'image.history.created-by': 'By',

  //settings
  'settings.title': 'Settings',
  'settings.config-type': 'Connection type',
  'settings.config-type.host': 'Host',
  'settings.config-type.socket': 'Socket',
  'settings.socket-path': 'Socket path',
  'settings.host': 'Host',
  'settings.port': 'Port',
  'settings.port.not-a-number': 'Port must be a number.',
  'settings.protocol': 'Protocoll',
  'settings.protocol.http': 'HTTP',
  'settings.protocol.https': 'HTTPS',
  'settings.ca-file': 'Path to CA certificate',
  'settings.cert-file': 'Path to VM certificate',
  'settings.key-file': 'Path to VM private key',
  'settings.action.submit': 'Save',
  'settings.valid-connection': 'Connection successfully tested.',
  'settings.update-notifications': 'Show update notifications',

  ////components
  //stats
  'stats.cpu': 'CPU',
  'stats.memory': 'RAM',
};
