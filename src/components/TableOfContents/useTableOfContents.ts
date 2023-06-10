import { ContentItem } from './types/ContentItem';

type TableOfContentsArg = {
    items: ContentItem[];
};

type ChildrenByParentId = { [id: string]: ContentItem[] };

export const useTableOfContents = ({ items }: TableOfContentsArg) => {
    const getChildrenByParentId = (): ChildrenByParentId => {
        const children: ChildrenByParentId = {};
        children['root'] = [];

        items.forEach((item) => {
            if (item.parentId) {
                if (!children[item.parentId]) {
                    children[item.parentId] = [];
                }
                children[item.parentId].push(item);
            } else {
                children['root'].push(item);
            }
        });
        return children;
    };

    const children: ChildrenByParentId = getChildrenByParentId();

    const onClick = (item: ContentItem) => () => console.log(item);

    return { children, onClick };
};
