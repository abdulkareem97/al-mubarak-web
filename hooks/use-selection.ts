
// hooks/use-selection.ts
import { useState, useMemo } from "react";

export function useSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedItems = useMemo(() => {
    return  items.filter(item => selectedIds.includes(item.id));
  }, [items, selectedIds]);

  const isSelected = (id: string) => selectedIds.includes(id);
  
  const isAllSelected = useMemo(() => {
    return items.length > 0 && selectedIds.length === items.length;
  }, [items.length, selectedIds.length]);

  const isPartiallySelected = useMemo(() => {
    return selectedIds.length > 0 && selectedIds.length < items.length;
  }, [items.length, selectedIds.length]);

  const select = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(
      isAllSelected ? [] : items.map(item => item.id)
    );
  };

  const selectMultiple = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return {
    selectedIds,
    selectedItems,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    select,
    selectAll,
    selectMultiple,
    clearSelection,
    selectedCount: selectedIds.length,
  };
}
