import { TableOfContents } from './components/TableOfContents/TableOfContents';
import { useTableOfContents } from './components/TableOfContents/useTableOfContents';
// eslint-disable-next-line
import { tableOfContentsItems } from './components/TableOfContents/data/tableOfContentsItems';
// eslint-disable-next-line
 import { NOZ_TOC_ITEMS_MOCK } from './components/TableOfContents/data/NOZ_TOC_ITEMS_MOCK';

const App = () => {
    const items = NOZ_TOC_ITEMS_MOCK;
    const props = useTableOfContents({ items });

    return (
        <div>
            <TableOfContents {...props} />
        </div>
    );
};

export default App;
