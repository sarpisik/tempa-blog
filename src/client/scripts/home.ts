import '../styles/home.scss';
import 'bootstrap/js/dist/carousel.js';
class Message {
    print() {
        console.log('Hello world!');
    }
}

async function asyncMessage() {
    await console.log('Hello async world!');
}

$().ready(function onLoad() {
    asyncMessage();
    new Message().print();
});
