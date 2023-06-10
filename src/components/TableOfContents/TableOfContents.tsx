import { FC } from 'react';
import { useTableOfContents } from './useTableOfContents';
import { ContentItem } from './types/ContentItem';

type TableOfContentsProps = ReturnType<typeof useTableOfContents>;

export const TableOfContents: FC<TableOfContentsProps> = ({ items, expanded, onClick, handleToggle }) => {
    return (
        <div style={{ fontFamily: 'consolas' }}>
            {items.map(({ id, level, parentId, name }: ContentItem, idx: number) => {
                const hasChildren = items[idx + 1]?.level > level;

                if (parentId && !expanded[parentId]) {
                    return null;
                }
                return (
                    <div key={id} style={{ marginLeft: 30 * level - 30, marginTop: 5 }}>
                        <button
                            onClick={handleToggle(id)}
                            style={{ width: 22, visibility: hasChildren ? 'visible' : 'hidden', marginRight: 5 }}
                        >
                            {expanded[id] ? 'v' : '>'}
                        </button>
                        <span onClick={onClick({ id, level, parentId, name })}>{name}</span>
                    </div>
                );
            })}
        </div>
    );
};
