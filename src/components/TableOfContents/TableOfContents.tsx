import React from 'react';
import { useTableOfContents } from './useTableOfContents';
import { ContentItem } from './types/ContentItem';

type TableOfContentsProps = ReturnType<typeof useTableOfContents>;

type TableOfContentsItemProps = {
    item: ContentItem;
    isExpanded: boolean;
    hasChildren: boolean;
    onClick: (item: ContentItem) => () => void;
    handleToggle: (itemId: string, isExpanded: boolean) => () => void;
};

const TableOfContentsItem: React.FC<TableOfContentsItemProps> = React.memo(
    ({ item, isExpanded, hasChildren, onClick, handleToggle }) => (
        <div style={{ marginLeft: (item.level - 1) * 22, marginTop: 4 }}>
            <button
                onClick={handleToggle(item.id, isExpanded)}
                style={{ width: 22, marginRight: 4, visibility: hasChildren ? 'visible' : 'hidden' }}
            >
                {isExpanded ? 'v' : '>'}
            </button>
            <span onClick={onClick(item)}>{item.name}</span>
        </div>
    )
);

export const TableOfContents: React.FC<TableOfContentsProps> = (
    { activeItems, expandedIds, childrenMapper, onClick, handleToggle }) => (
    <div style={{ fontFamily: 'consolas', textDecoration: 'underline #dedede' }}>
        {activeItems.map((item: ContentItem) => (
            <TableOfContentsItem
                key={item.id}
                item={item}
                isExpanded={expandedIds.has(item.id)}
                hasChildren={item.id in childrenMapper}
                onClick={onClick}
                handleToggle={handleToggle}
            />
        ))}
    </div>
);
