import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormState } from 'react-final-form';
import { getNavFromURL, setNavToURL } from './urlSync';
import TabsMenu from './TabsMenu';

const renderPageHeading = (bundleTitle, sectionTitle) => (
  <React.Fragment>
    <Title headingLevel="h3" size="xl" className="pf-v5-u-pb-xs">
      {`${sectionTitle} | ${bundleTitle}`}
    </Title>
    <Text className="pf-v5-u-mb-md">
      Configure your {sectionTitle} notifications.
    </Text>
  </React.Fragment>
);

const FormTabs = ({ fields, titleRef, bundles }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const formOptions = useFormApi();
  const searchRef = useRef(null);
  const navConfig = useRef({});

  const [search, setSearch] = useState('');
  const [filteredFields, setFilteredFields] = useState(fields);
  const { pristine, submitSucceeded, dirtyFieldsSinceLastSubmit } =
    useFormState();

  const handleResize = () => {
    const container = document.getElementById('notifications-container');
    const gridElement = document.getElementById('notifications-grid');
    const menu = document.getElementById('notifications-menu-content');
    if (menu?.style && gridElement?.style) {
      const buttonsHeight =
        document
          .getElementById('user-pref__form-buttons')
          ?.getBoundingClientRect()?.height || 0;
      gridElement.style.height = `${
        container.getBoundingClientRect().height - buttonsHeight
      }px`;
      let menuMaxHeight;
      menuMaxHeight =
        container.getBoundingClientRect().height -
        titleRef.current.getBoundingClientRect().height -
        searchRef.current.getBoundingClientRect().height -
        (menuMaxHeight < menu.scrollHeight ? buttonsHeight : 0) -
        1;
      menu.style.maxHeight = `${menuMaxHeight}px`;
      menu.style.height = `${menuMaxHeight - buttonsHeight}px`;
    }
  };

  useEffect(() => {
    if (window.screen.width > 768) {
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    navConfig.current = getNavFromURL(location, navigate, fields, {
      bundle: fields?.[0]?.name,
      app: fields?.[0]?.fields?.[0]?.name,
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const filtered = fields.reduce(
      (acc, bundle) => [
        ...acc,
        {
          ...bundle,
          fields: bundle.fields.filter((item) => {
            const searchValue = search.toLowerCase();
            return (
              item.name?.toLowerCase().includes(searchValue) ||
              item.title?.toLowerCase().includes(searchValue)
            );
          }, []),
        },
      ],
      []
    );
    setFilteredFields(filtered);
  }, [search]);

  useEffect(() => {
    handleResize();
  }, [pristine, submitSucceeded, dirtyFieldsSinceLastSubmit]);

  return (
    <React.Fragment>
      <div className="pref-notifications--nav">
        <TabsMenu
          searchRef={searchRef}
          search={search}
          setSearch={setSearch}
          fields={filteredFields}
          onClick={(e, bundleName, sectionName) => {
            e.preventDefault();
            navConfig.current = {
              bundle: bundleName,
              app: sectionName,
            };
            setNavToURL(location, navigate, navConfig.current);
          }}
        />
      </div>
      <div className="pref-notifications--inputs">
        <React.Fragment>
          {renderPageHeading(
            bundles[navConfig.current.bundle]?.label,
            fields
              .reduce((acc, curr) => [...acc, ...curr.fields], [])
              .filter(
                (item) =>
                  item.name === navConfig.current.app &&
                  item.bundle === navConfig.current.bundle
              )?.[0]?.label
          )}
          <div>
            {formOptions.renderForm(
              fields.reduce(
                (acc, curr) => [
                  ...acc,
                  ...curr.fields.map((item) => ({
                    ...item,
                    key: `form-${item.bundle}-${item.name}`,
                    fields: [
                      item.fields.map((input) => ({
                        ...input,
                        hideField: !(
                          item.name === navConfig.current.app &&
                          item.bundle === navConfig.current.bundle
                        ),
                      })),
                    ],
                  })),
                ],
                []
              ),
              formOptions
            )}
          </div>
        </React.Fragment>
      </div>
    </React.Fragment>
  );
};

FormTabs.propTypes = {
  fields: PropTypes.array.isRequired,
  titleRef: PropTypes.any,
  bundles: PropTypes.shape({ label: PropTypes.string }),
};

export default React.memo(FormTabs);
