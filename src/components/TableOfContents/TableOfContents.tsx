import { FC, useState } from 'react';
import { useTableOfContents } from './useTableOfContents';
import { ContentItem } from './types/ContentItem';

type TableOfContentsProps = ReturnType<typeof useTableOfContents>;

type TableOfContentsItemProps = Pick<TableOfContentsProps, 'children' | 'onClick'> & {
    item: ContentItem;
};

const TableOfContentsItem: FC<TableOfContentsItemProps> = ({ item, children, onClick }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div style={{ marginLeft: 20, marginTop: 5 }}>
            <button
                style={{ width: 22, visibility: item.id in children ? 'visible' : 'hidden', cursor: 'pointer' }}
                onClick={() => {
                    setExpanded((prev) => !prev);
                }}
            >
                {expanded ? 'v' : '>'}
            </button>
            <span style={{ marginLeft: 5, cursor: 'pointer' }} onClick={onClick(item)}>
                {item.name}
            </span>
            <div style={{ borderLeft: '1px dotted', marginLeft: 12 }}>
                {expanded &&
                    children[item.id]?.map((child: ContentItem, index: number) => (
                        <TableOfContentsItem key={index} item={child} children={children} onClick={onClick} />
                    ))}
            </div>
        </div>
    );
};

export const TableOfContents: FC<TableOfContentsProps> = ({ children, onClick }) => {
    return (
        <div style={{ fontFamily: 'consolas' }}>
            {children['root']?.map((child: ContentItem, index: number) => (
                <TableOfContentsItem key={index} item={child} children={children} onClick={onClick} />
            ))}
        </div>
    );
};
