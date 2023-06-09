import { FC, useState } from 'react';
import { useTableOfContents } from './useTableOfContents';
import { ContentItem } from './types/ContentItem';

type TableOfContentsProps = ReturnType<typeof useTableOfContents>;

type ContentItemWithChildren = ContentItem & { children: ContentItemWithChildren[] };

const TableOfContentsItem: FC<{ item: ContentItemWithChildren; onClick: any }> = ({ item, onClick }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div style={{ marginLeft: 20, marginTop: 5 }}>
            <button
                style={{ visibility: item.children.length > 0 ? 'visible' : 'hidden' }}
                onClick={onClick(setExpanded)}
            >
                {expanded ? 'v' : '>'}
            </button>
            <span style={{ marginLeft: 5 }}>{item.name}</span>
            <div style={{ borderLeft: '1px dotted', marginLeft: 12 }}>
                {expanded &&
                    item.children.map((child) => (
                        <TableOfContentsItem key={child.name} item={child} onClick={onClick} />
                    ))}
            </div>
        </div>
    );
};

export const TableOfContents: FC<TableOfContentsProps> = ({ items, onClick }) => {
    const getRoot = (): ContentItemWithChildren => {
        const itemMap: { [id: string]: ContentItemWithChildren } = {};
        const root: ContentItemWithChildren = { id: 'root', name: 'root', level: 0, children: [] };
        itemMap[root.id] = root;

        items.forEach((item) => {
            itemMap[item.id] = { ...item, children: [] };

            if (item.parentId) {
                itemMap[item.parentId].children.push(itemMap[item.id]);
            } else {
                itemMap[root.id].children.push(itemMap[item.id]);
            }
        });

        return root;
    };

    return (
        <div style={{ fontFamily: 'consolas' }}>
            {getRoot().children.map((child: ContentItemWithChildren) => (
                <TableOfContentsItem key={child.name} item={child} onClick={onClick} />
            ))}
        </div>
    );
};
