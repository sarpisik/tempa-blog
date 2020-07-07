import generateApiControllers from './api';
import { pageControllers } from './pages';

export default function routes(
    db: Parameters<typeof generateApiControllers>[0]
) {
    const apiControllers = generateApiControllers(db);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return pageControllers.concat(apiControllers);
}
