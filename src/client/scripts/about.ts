import '../styles/about.scss';

class Message {
    print() {
        console.log('About page');
    }
}

async function asyncMessage() {
    await console.log('About async page');
}

asyncMessage();
new Message().print();
