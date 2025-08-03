'use client';
import { Popover, Tag, TagProps } from 'antd';
import React from 'react';

import styles from './TagList.module.scss';

const TagList = ({ items, color = 'blue' }: { items: Array<string>; color: TagProps['color'] }) => {
  const renderTag = (tag: string, idx: number) => (
    <Tag color={color} key={`tag-${idx}`}>
      {tag}
    </Tag>
  );

  return (
    <div className={styles.tagListContainer}>
      {items.slice(0, 2).map(renderTag)}
      {items.length > 2 && (
        <Popover content={items.slice(2).map((item, idx) => renderTag(item, idx + 2))}>
          <Tag color={color}>та ще {items.length - 2}...</Tag>
        </Popover>
      )}
    </div>
  );
};

export default TagList;
