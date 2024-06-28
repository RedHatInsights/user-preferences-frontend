import React, { useMemo } from 'react';
import {
  Button,
  ButtonVariant,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Menu,
  MenuContent,
  MenuGroup,
  MenuList,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { MenuItem, MenuSearch, MenuSearchInput } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { SearchIcon } from '@patternfly/react-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes, { string } from 'prop-types';
import { getNavFromURL } from './urlSync';

const renderEmptyState = (setSearch: (searchString: string) => any) => (
  <EmptyState variant={EmptyStateVariant.sm} className="pf-u-mt-lg">
    <EmptyStateIcon icon={SearchIcon} />
    <Title headingLevel="h4" size="lg">
      No matching services found
    </Title>
    <EmptyStateBody>Adjust your filters and try again.</EmptyStateBody>
    <Button variant={ButtonVariant.link} onClick={() => setSearch('')}>
      Clear filters
    </Button>
  </EmptyState>
);

export type TabsMenuProps = {
  fields: any[],
  search: string,
  setSearch: (searchValue: any) => void,
  searchRef: any,
  onClick: (e: void, bundleName: string, sectionName: string) => void,
}

const TabsMenu = ({ searchRef, search, setSearch, fields, onClick }: TabsMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bundle, app } = useMemo(
    () => getNavFromURL(location, navigate, fields, {}),
    [location.search]
  );

  return (
    <Menu isPlain isScrollable>
      <MenuSearch>
        <MenuSearchInput ref={searchRef} className="pf-u-mx-sm">
          <TextInput
            aria-label="Filter menu items"
            placeholder="Search services"
            customIcon="search"
            type="search"
            onChange={(value) => setSearch(value)}
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
                  className="pf-u-px-sm"
                  key={`menu-group-${bundleName}`}
                >
                  <MenuList>
                    {fields.map(
                      ({ label: sectionLabel, name: sectionName }: {label: string, name: string}) => (
                        <MenuItem
                          onClick={(e) => onClick(e, bundleName, sectionName)}
                          key={`menu-item-${bundleName}-${sectionName}`}
                          isFocused={
                            bundle === bundleName && app === sectionName
                          }
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

export default TabsMenu;
