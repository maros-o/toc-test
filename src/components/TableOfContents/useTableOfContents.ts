import { useMemo, useState, useCallback } from 'react';
import { ContentItem } from './types/ContentItem';

type TableOfContentsArg = {
    items: ContentItem[];
};

export const useTableOfContents = ({ items }: TableOfContentsArg) => {
    const [expanded, setExpanded] = useState<{ [itemId: string]: boolean }>({});

    const generateChildrenMapper = useCallback(() => {
        const childrenMapper: { [itemId: string]: ContentItem[] } = {};

        items.forEach(({ parentId, ...rest }) => {
            if (!parentId) {
                return;
            }
            if (!childrenMapper[parentId]) {
                childrenMapper[parentId] = [];
            }
            childrenMapper[parentId].push({ parentId, ...rest });
        });

        return childrenMapper;
    }, [items]);

    const childrenMapper: ReturnType<typeof generateChildrenMapper> = useMemo(generateChildrenMapper, [
        generateChildrenMapper,
    ]);

    const collapse = useCallback(
        (itemId: string, newExpanded: typeof expanded) => {
            newExpanded[itemId] = false;

            childrenMapper[itemId]?.forEach((child: ContentItem) => {
                if (newExpanded[child.id]) {
                    collapse(child.id, newExpanded);
                }
            });
        },
        [childrenMapper]
    );

    const setExpandedById = useCallback(
        (itemId: string, value: boolean) => {
            if (value === true) {
                setExpanded((prevExpanded) => ({
                    ...prevExpanded,
                    [itemId]: value,
                }));
                return;
            }
            setExpanded((prevExpanded) => {
                const newExpanded: typeof prevExpanded = { ...prevExpanded };
                collapse(itemId, newExpanded);
                return newExpanded;
            });
        },
        [collapse]
    );

    const onClick = useCallback((item: ContentItem) => () => console.log(item), []);

    const handleToggle = useCallback(
        (itemId: string, isExpanded: boolean) => () => setExpandedById(itemId, !isExpanded),
        [setExpandedById]
    );

    return { items, expanded, onClick, handleToggle };
};
