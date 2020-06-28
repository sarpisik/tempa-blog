import PageController, { Router } from '@lib/page_controller';

const renderPage: PageController['_renderPage'] = async function renderPage(
    this: PageController,
    _req,
    res
) {
    const locals = this._generateLocals();

    res.render('pages/home', locals);
};

export default class HomePageController extends PageController {
    constructor(router: Router) {
        super(
            router,
            {
                path: '/',
                scripts: ['home.js', 'vendor.js'],
                stylesheets: ['home.css'],
                title: 'TYPESCRIPT-EXPRESS-MPA | Home',
            },
            renderPage
        );
    }
}
