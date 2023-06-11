import { FC, memo } from 'react';
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

const TableOfContentsItem: FC<TableOfContentsItemProps> = memo(
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

export const TableOfContents: FC<TableOfContentsProps> = ({ items, expanded, onClick, handleToggle }) => (
    <div style={{ fontFamily: 'consolas', textDecoration: 'underline #dedede' }}>
        {items.map((item: ContentItem, index: number) => {
            if (item.parentId && !expanded[item.parentId]) {
                return null;
            }
            return (
                <TableOfContentsItem
                    key={index}
                    item={item}
                    isExpanded={expanded[item.id]}
                    hasChildren={items[index + 1]?.level > item.level}
                    onClick={onClick}
                    handleToggle={handleToggle}
                />
            );
        })}
    </div>
);
