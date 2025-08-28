import React, { useMemo } from 'react';
import {
  Button,
  ButtonVariant,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuSearch,
  MenuSearchInput,
  SearchInput,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getNavFromURL } from './urlSync';

const renderEmptyState = (setSearch) => (
  <EmptyState
    headingLevel="h4"
    icon={SearchIcon}
    titleText="No matching services found"
    variant={EmptyStateVariant.sm}
    className="pf-v6-u-mt-lg"
  >
    <EmptyStateBody>Adjust your filters and try again.</EmptyStateBody>
    <EmptyStateFooter>
      <Button variant={ButtonVariant.link} onClick={() => setSearch('')}>
        Clear filters
      </Button>
    </EmptyStateFooter>
  </EmptyState>
);

const TabsMenu = ({ searchRef, search, setSearch, fields, onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bundle, app } = useMemo(
    () => getNavFromURL(location, navigate, fields, {}),
    [location.search]
  );

  return (
    <Menu isPlain isScrollable>
      <MenuSearch>
        <MenuSearchInput ref={searchRef} className="pf-v6-u-mx-sm">
          <SearchInput
            data-testid="search-input"
            aria-label="Filter menu items"
            placeholder="Search services"
            customIcon={<SearchIcon />}
            type="search"
            onChange={(_, value) => setSearch(value)}
            onClear={() => setSearch('')}
            value={search}
          />
        </MenuSearchInput>
      </MenuSearch>
      <Divider />
      <MenuContent id="notifications-menu-content">
        {fields.some((bundle) => bundle.fields.length > 0)
          ? fields.map(({ fields, title: bundleLabel, name: bundleName }) =>
              fields.length > 0 ? (
                <MenuGroup
                  label={bundleLabel}
                  className="pf-v6-u-px-sm pf-v6-u-font-size-xs"
                  key={`menu-group-${bundleName}`}
                >
                  <MenuList>
                    {fields.map(
                      ({ label: sectionLabel, name: sectionName }) => (
                        <MenuItem
                          onClick={(e) => onClick(e, bundleName, sectionName)}
                          key={`menu-item-${bundleName}-${sectionName}`}
                          isFocused={
                            bundle === bundleName && app === sectionName
                          }
                          className="pf-v6-u-font-size-md"
                        >
                          {sectionLabel}
                        </MenuItem>
                      )
                    )}
                  </MenuList>
                </MenuGroup>
              ) : null
            )
          : renderEmptyState(setSearch)}
      </MenuContent>
    </Menu>
  );
};

TabsMenu.propTypes = {
  fields: PropTypes.array.isRequired,
  search: PropTypes.string,
  setSearch: PropTypes.func,
  searchRef: PropTypes.object,
  onClick: PropTypes.func,
};

export default TabsMenu;
