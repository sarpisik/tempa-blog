import PageController, { Router } from '@lib/page_controller';

const renderPage: PageController['_renderPage'] = async function renderPage(
    this: PageController,
    _req,
    res
) {
    const locals = this._generateLocals();

    res.render('pages/about', locals);
};

export default class AboutPageController extends PageController {
    constructor(router: Router) {
        super(
            router,
            {
                path: '/about',
                scripts: ['about.js'],
                stylesheets: ['about.css'],
                title: 'TYPESCRIPT-EXPRESS-MPA | About',
            },
            renderPage
        );
    }
}
