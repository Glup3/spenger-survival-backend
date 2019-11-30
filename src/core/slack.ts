import Slack from 'node-slack';

const slack = new Slack(process.env.SLACK_WEBHOOK_URL);

interface MessageType {
  header: string;
  botname: string;
  icon: string;
  channel: string;
}

const resolveMessageType = (messageType: string): MessageType => {
  switch (messageType) {
    case 'feature':
      return {
        botname: 'Feature Request BOT',
        channel: '#feature-requests',
        header: 'Feature Request',
        icon: 'fire',
      };
    case 'feedback':
      return {
        botname: 'Feedback BOT',
        channel: '#feedback',
        header: 'Feedback Report',
        icon: 'heart',
      };
    case 'bug':
      return {
        botname: 'Bug Report BOT',
        channel: '#bugs',
        header: 'Bug Report',
        icon: 'bug',
      };
    default:
      return {
        botname: 'Sonstiges BOT',
        channel: '#sonstiges',
        icon: 'grin',
        header: 'Sonstiges',
      };
  }
};

export const sendFeedback = (message: string, messageType: string) => {
  const boti = resolveMessageType(messageType);

  slack.send({
    text: `*${boti.header}*\n${message}\n-------`,
    username: boti.botname,
    icon_emoji: boti.icon,
    channel: boti.channel,
  });
};

export const reportTip = (title: string, id: string, message: string) => {
  slack.send({
    text: `*${title} - ID #${id}* \n${message}`,
    username: 'Reporting-BOT',
    icon_emoji: 'zap',
  });
};
