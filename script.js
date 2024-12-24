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
    msgDiv.textContent = `${member.clientData.name}: ${transformSpeech(message)}`;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

document.getElementById('send-button').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    const message = input.value;
    drone.publish({
        room: roomName,
        message: message
    });
    input.value = '';
});

function transformSpeech(text) {
    const rules = [
        { replace: 's', to: 'sh', percentage: 90, alcohol: 30 },
        { replace: 'ch', to: 'sh', pre: 'u,s,o,a', match: false, percentage: 70, alcohol: 10 },
        // Add all other rules here...
    ];

    let transformedText = text;
    rules.forEach(rule => {
        const regex = new RegExp(`\\b${rule.replace}\\b`, 'gi');
        transformedText = transformedText.replace(regex, rule.to);
    });

    return transformedText;
}
