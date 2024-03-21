import React, { useMemo } from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Menu } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuContent } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuGroup } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuSearch } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuItem } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { MenuList } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { MenuSearchInput } from '@patternfly/react-core/dist/dynamic/components/Menu';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import SearchIcon from '@patternfly/react-icons/dist/dynamic/icons/search-icon';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getNavFromURL } from './urlSync';

const renderEmptyState = (setSearch) => (
  <EmptyState variant={EmptyStateVariant.sm} className="pf-v5-u-mt-lg">
    <EmptyStateHeader
      titleText="No matching services found"
      icon={<EmptyStateIcon icon={SearchIcon} />}
      headingLevel="h4"
    />
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
        <MenuSearchInput ref={searchRef} className="pf-v5-u-mx-sm">
          <TextInput
            aria-label="Filter menu items"
            placeholder="Search services"
            type="search"
            onChange={(_event, value) => setSearch(value)}
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
                  className="pf-v5-u-px-sm"
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
