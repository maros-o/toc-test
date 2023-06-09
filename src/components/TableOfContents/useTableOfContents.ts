import { ContentItem } from './types/ContentItem';

type TableOfContentsArg = {
    items: ContentItem[];
};

export const useTableOfContents = ({ items }: TableOfContentsArg) => {
    const onClick = (setExpanded: any) => () => setExpanded((prev: any) => !prev);

    return { items, onClick };
};
