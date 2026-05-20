import { useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, XIcon } from '@shopify/polaris-icons';
import { setProductCategory } from '../lib/productDraft';
import {
  categoryHasChildren,
  findCategoryByPath,
  getChildCategories,
  searchCategories,
  SHOPIFY_TOP_LEVEL_CATEGORIES,
  type ShopifyProductCategory,
} from '../lib/shopifyProductCategories';
import { PolarisIcon } from './PolarisIcon';
import './ProductCategorySheet.css';

type ProductCategorySheetProps = {
  open: boolean;
  onClose: () => void;
  onSave: (categoryPath: string) => void;
};

export function ProductCategorySheet({ open, onClose, onSave }: ProductCategorySheetProps) {
  const [visible, setVisible] = useState(open);
  const [searchQuery, setSearchQuery] = useState('');
  const [browseParentPath, setBrowseParentPath] = useState('');

  useEffect(() => {
    if (open) {
      setVisible(true);
      setSearchQuery('');
      setBrowseParentPath('');
    }
  }, [open]);

  useEffect(() => {
    if (!open && visible) {
      const timer = window.setTimeout(() => setVisible(false), 280);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open, visible]);

  const isSearching = searchQuery.trim().length > 0;
  const browseParent = browseParentPath ? findCategoryByPath(browseParentPath) : undefined;
  const isAtRoot = !browseParentPath;

  const visibleCategories = useMemo(() => {
    if (isSearching) return searchCategories(searchQuery);
    if (browseParentPath) return getChildCategories(browseParentPath);
    return SHOPIFY_TOP_LEVEL_CATEGORIES;
  }, [browseParentPath, isSearching, searchQuery]);

  const sheetTitle = isSearching
    ? 'Search'
    : browseParent
      ? browseParent.label
      : 'All categories';

  if (!visible) return null;

  const handleSelect = (category: ShopifyProductCategory) => {
    setProductCategory(category.path);
    onSave(category.path);
    onClose();
  };

  const handleRowClick = (category: ShopifyProductCategory) => {
    if (!isSearching && categoryHasChildren(category)) {
      setSearchQuery('');
      setBrowseParentPath(category.path);
      return;
    }
    handleSelect(category);
  };

  const handleBack = () => {
    if (!browseParent) {
      setBrowseParentPath('');
      return;
    }
    setBrowseParentPath(browseParent.parentPath);
  };

  return (
    <div
      className={`category-sheet${open ? ' category-sheet--open' : ''}`}
      role="presentation"
    >
      <button
        type="button"
        className="category-sheet__backdrop"
        aria-label="Close categories"
        onClick={onClose}
      />
      <div
        className="category-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-sheet-title"
      >
        <header className="category-sheet__header">
          {isAtRoot && !isSearching ? (
            <button type="button" className="category-sheet__close" onClick={onClose} aria-label="Close">
              <PolarisIcon source={XIcon} className="category-sheet__close-icon" />
            </button>
          ) : (
            <button
              type="button"
              className="category-sheet__close"
              onClick={isSearching ? () => setSearchQuery('') : handleBack}
              aria-label={isSearching ? 'Clear search' : 'Back'}
            >
              <PolarisIcon source={ChevronLeftIcon} className="category-sheet__close-icon" />
            </button>
          )}
          <h2 id="category-sheet-title" className="category-sheet__title">
            {sheetTitle}
          </h2>
          <span className="category-sheet__header-spacer" aria-hidden />
        </header>

        <div className="category-sheet__toolbar">
          <label className="category-sheet__search">
            <PolarisIcon source={SearchIcon} tone="subdued" className="category-sheet__search-icon" />
            <input
              className="category-sheet__search-input"
              type="search"
              placeholder="Search categories"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </label>
          <p className="category-sheet__hint">Determines tax rates and adds category metafields</p>
        </div>

        <div className="category-sheet__list-wrap">
          {isSearching && visibleCategories.length === 0 ? (
            <p className="category-sheet__empty">No categories match your search.</p>
          ) : (
            <ul className="category-sheet__list" aria-label="Product categories">
              {visibleCategories.map((category) => {
                const showChevron = !isSearching && categoryHasChildren(category);
                const showBreadcrumb = isSearching && Boolean(category.parentPath);

                return (
                  <li key={category.id} className="category-sheet__item">
                    <button
                      type="button"
                      className="category-sheet__row"
                      onClick={() => handleRowClick(category)}
                    >
                      <span className="category-sheet__row-text">
                        <span className="category-sheet__row-label">{category.label}</span>
                        {showBreadcrumb ? (
                          <span className="category-sheet__row-meta">{category.parentPath}</span>
                        ) : null}
                      </span>
                      {showChevron ? (
                        <PolarisIcon
                          source={ChevronRightIcon}
                          tone="subdued"
                          className="category-sheet__row-chevron"
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
