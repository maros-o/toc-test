import { useEffect, useState, useRef } from 'react';
import { ContentItem } from './types/ContentItem';

type TableOfContentsArg = {
    items: ContentItem[];
};

export const useTableOfContents = ({ items }: TableOfContentsArg) => {
    const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
    const childrenIdsRef = useRef<{ [id: string]: string[] }>({});

    useEffect(() => {
        const newChildrenIds: typeof childrenIdsRef.current = {};

        items.forEach(({ id, parentId }) => {
            newChildrenIds[id] = [];

            if (parentId) {
                newChildrenIds[parentId].push(id);
            }
        });

        childrenIdsRef.current = newChildrenIds;
    }, [items]);

    const setExpandedById = (id: string, value: boolean) => {
        if (value) {
            setExpanded((prevExpanded) => ({
                ...prevExpanded,
                [id]: value,
            }));
            return;
        }

        setExpanded((prevExpanded) => {
            const newExpanded = { ...prevExpanded };
            collapse(id, newExpanded);
            return newExpanded;
        });
    };

    const collapse = (id: string, newExpanded: typeof expanded) => {
        newExpanded[id] = false;

        const childrenIds = childrenIdsRef.current[id];
        if (!childrenIds) {
            return;
        }
        childrenIds.forEach((childId: string) => {
            if (newExpanded[childId]) {
                collapse(childId, newExpanded);
            }
        });
    };

    const onClick = (item: ContentItem) => () => console.log(item);

    const handleToggle = (id: string) => () => setExpandedById(id, !expanded[id]);

    return { items, expanded, onClick, handleToggle };
};
