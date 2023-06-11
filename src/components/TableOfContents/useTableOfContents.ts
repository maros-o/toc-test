import { useEffect, useMemo, useState, useCallback } from 'react';
import { ContentItem } from './types/ContentItem';

type TableOfContentsArg = {
    items: ContentItem[];
};

export const useTableOfContents = ({ items }: TableOfContentsArg) => {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setExpandedIds(new Set());
    }, [items]);

    const rootItem: ContentItem = useMemo(() => ({ id: 'root', level: -1, name: 'root' }), []);

    const generateParentToChildrenMap = useCallback(() => {
        const newChildrenMapper: { [itemId: string]: ContentItem[] } = {
            [rootItem.id]: [],
        };

        items.forEach((item) => {
            if (!item.parentId) {
                newChildrenMapper[rootItem.id].push(item);
                return;
            }
            if (!(item.parentId in newChildrenMapper)) {
                newChildrenMapper[item.parentId] = [];
            }
            newChildrenMapper[item.parentId].push(item);
        });

        return newChildrenMapper;
    }, [items, rootItem]);

    const childrenMapper: ReturnType<typeof generateParentToChildrenMap> = useMemo(generateParentToChildrenMap, [
        generateParentToChildrenMap,
    ]);

    const collapseRecursively = useCallback(
        (itemId: string, newExpandedIds: typeof expandedIds) => {
            newExpandedIds.delete(itemId);

            childrenMapper[itemId]?.forEach(({ id }) => {
                if (newExpandedIds.has(id)) {
                    collapseRecursively(id, newExpandedIds);
                }
            });
        },
        [childrenMapper]
    );

    const setExpandedById = useCallback(
        (itemId: string, expand: boolean) => {
            if (expand) {
                setExpandedIds((prevExpandedIds) => {
                    const newExpandedIds = new Set(prevExpandedIds);
                    newExpandedIds.add(itemId);
                    return newExpandedIds;
                });
                return;
            }

            setExpandedIds((prevExpandedIds) => {
                const newExpandedIds = new Set(prevExpandedIds);
                collapseRecursively(itemId, newExpandedIds);
                return newExpandedIds;
            });
        },
        [collapseRecursively]
    );

    const addActiveItemsRecursively = useCallback(
        (item: ContentItem, newActiveItems: ContentItem[]) => {
            childrenMapper[item.id].forEach((child) => {
                newActiveItems.push(child);

                if (expandedIds.has(child.id)) {
                    addActiveItemsRecursively(child, newActiveItems);
                }
            });
        },
        [childrenMapper, expandedIds]
    );

    const getActiveItems = useCallback(() => {
        const newActiveItems: ContentItem[] = [];

        addActiveItemsRecursively(rootItem, newActiveItems);

        return newActiveItems;
    }, [addActiveItemsRecursively, rootItem]);

    const activeItems: ContentItem[] = useMemo(getActiveItems, [getActiveItems]);

    const onClick = useCallback((item: ContentItem) => () => console.log(item), []);

    const handleToggle = useCallback(
        (itemId: string, isExpanded: boolean) => () => setExpandedById(itemId, !isExpanded),
        [setExpandedById]
    );

    return { activeItems, childrenMapper, expandedIds, onClick, handleToggle };
};
