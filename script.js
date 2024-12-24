const clientId = 'RdFkpfcR3PRm3NYX'; // Replace with your ScaleDrone channel ID
const drone = new ScaleDrone(clientId, {
    data: { name: "Anonymous" }
});

const roomName = 'observable-room';
const room = drone.subscribe(roomName);

room.on('open', error => {
    if (error) {
        console.error(error);
    } else {
        console.log('Connected to room');
    }
});

room.on('data', (message, member) => {
    const messagesDiv = document.getElementById('messages');
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${member.clientData.name}: ${message}`;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

document.getElementById('send-button').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    const message = transformSpeech(input.value);
    drone.publish({
        room: roomName,
        message: message
    });
    input.value = '';
});

function transformSpeech(text) {
    const rules = [
        { replace: 's', to: 'sh', percentage: 90 },
        { replace: 'ch', to: 'sh', pre: ['u', 's', 'o', 'a'], match: false, percentage: 70 },
        { replace: 'h', to: 'hh', pre: ['sch', 'h', 't'], match: false, percentage: 60 },
        { replace: 'th', to: 'thl', percentage: 40 },
        { replace: 'sch', to: 'shk', percentage: 60 },
        { replace: 'u', to: 'uuh', percentage: 20 },
        { replace: 'y', to: 'yy', percentage: 60 },
        { replace: 'e', to: 'ee', percentage: 40 },
        { replace: 'you', to: 'u', percentage: 40 },
        { replace: 'u', to: 'uo', pre: ['u'], match: false, percentage: 60 },
        { replace: 'that', to: 'taht', percentage: 20 },
        { replace: 'p', to: 'b', percentage: 30 },
        { replace: 'p', to: 'b', percentage: 70 },
        { replace: 'up', to: 'ubb', percentage: 80 },
        { replace: 'o', to: 'oh', percentage: 20 },
        { replace: 'ei', to: 'i', percentage: 30 },
        { replace: 'b', to: 'bb', percentage: 80 },
        { replace: '!!!', to: '!!!111!!!eleven!1!', pre: ['!'], match: false, percentage: 20 },
        { replace: '!', to: '!!', pre: ['!'], match: false, percentage: 90 },
        { replace: 'drunk', to: 'dhrkunn', pre: ['are'], match: false, percentage: 70 },
        { replace: 'walk', to: 'whhealhk', pre: ['you can', 'you can still', 'you can not'], match: false, percentage: 80 },
        { replace: 'wtf', to: 'wft', percentage: 20 },
        { replace: 'lol', to: 'loool', percentage: 80 },
        { replace: 'afk', to: 'aafkayyy', percentage: 30 },
        { replace: 'write', to: 'wreitt', pre: ['you can','you can still','you can not'], match: false, percentage: 80 },
        { replace: 'drink', to: 'booze', percentage: 80 },
        { replace: '?', to: '????', pre: ['?'], match: false, percentage: 80 },
        { replace: '-space', to: '', pre: ['h', 'g', 'w'], match: true, percentage: 10 },
        { replace: '-space', to: '', percentage: 30 },
        { replace: '-space', to: '', percentage: 10 },
        { replace: '-start', to: 'dho', percentage: 15 },
        { replace: '-start', to: 'hhn', percentage: 10 },
        { replace: '-random', to: 'lu', percentage: 10 },
        { replace: '-random', to: 'lug', percentage: 10 },
        { replace: '-random', to: 'blub', percentage: 20 },
        { replace: '-random', to: 'lerg', percentage: 40 },
        { replace: '-random', to: 'gul', percentage: 40 },
        { replace: '-random', to: ' ', percentage: 100 },
        { replace: '-random', to: ' ', percentage: 60 },
        { replace: '-random', to: ' ', percentage: 50 },
        { replace: '-end', to: '!', percentage: 40 },
        { replace: '-random', to: ' *hic* ', percentage: 80 },
        { replace: '-random', to: ' *hic* ', percentage: 15 },
        { replace: '-space', to: ' *hic* ', percentage: 5 },
        { replace: '-end', to: ' *hic*', percentage: 70 },
        { replace: '-all', to: '*burp*', percentage: 3 },
        { replace: '-all', to: '*burp*', percentage: 6 }
    ];

    let transformedText = text;
    rules.forEach(rule => {
        const regex = createRegex(rule);
        transformedText = transformedText.replace(regex, rule.to);
    });

    return transformedText;
}

function createRegex(rule) {
    if (rule.replace === '-space') {
        return /\s/g;
    } else if (rule.replace === '-start') {
        return new RegExp('^', 'g');
    } else if (rule.replace === '-end') {
        return new RegExp('$', 'g');
    } else if (rule.replace === '-random') {
        return new RegExp('(.)', 'g');
    } else if (rule.replace === '-all') {
        return /./g;
    } else {
        if (rule.pre && rule.match !== undefined) {
            return new RegExp(`(?<!${rule.pre.join('|')})${rule.replace}`, 'gi');
        } else if (rule.pre) {
            return new RegExp(`(${rule.pre.join('|')})${rule.replace}`, 'gi');
        } else {
            return new RegExp(`${rule.replace}`, 'gi');
        }
    }
}
