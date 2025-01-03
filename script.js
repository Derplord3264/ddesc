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
        { replace: 'write', to: 'wreitt', pre: ['you can', 'you can still', 'you can not'], match: false, percentage: 80 },
        { replace: 'drink', to: 'booze', percentage: 80 },
        { replace: '?', to: '????', pre: ['?'], match: false, percentage: 80 },
        { replace: '-space', to: '', pre: ['h', 'g', 'w'], match: true, percentage: 10 },
        { replace: '-end', to: '!', percentage: 40 },
        { replace: '-random', to: ' *hic* ', percentage: 80 }
    ];

    let transformedText = '';
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let replaced = false;

        rules.forEach(rule => {
            if (replaced) return;

            const { replace, to, percentage, pre, match } = rule;
            const escapedReplace = replace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special chars
            const escapedPre = pre ? pre.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') : null;

            if (Math.random() * 100 < percentage) {
                if (replace === '-space') {
                    if (char === ' ' && (!pre || pre.some(p => text.substring(0, i).endsWith(p)) === match)) {
                        char = to;
                        replaced = true;
                    }
                } else if (replace === '-end' && i === text.length - 1) {
                    char = char + to;
                    replaced = true;
                } else if (replace === '-random') {
                    if (Math.random() * 100 < percentage) {
                        char += to;
                        replaced = true;
                    }
                } else if (escapedPre) {
                    const regex = match
                    ? new RegExp(`(?<=${escapedPre})${escapedReplace}`, 'i')
                    : new RegExp(`(?<!${escapedPre})${escapedReplace}`, 'i');
                    if (regex.test(text.substring(0, i + 1))) {
                        char = char.replace(new RegExp(escapedReplace, 'i'), to);
                        replaced = true;
                    }
                } else {
                    const regex = new RegExp(`${escapedReplace}`, 'i');
                    if (regex.test(char)) {
                        char = char.replace(regex, to);
                        replaced = true;
                    }
                }
            }
        });

        transformedText += char;
    }

    return transformedText;
}

