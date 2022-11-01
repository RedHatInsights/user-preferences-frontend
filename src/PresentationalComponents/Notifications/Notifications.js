import React, { useEffect, useReducer, useRef, useState } from 'react';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  Bullseye,
  Button,
  Divider,
  Dropdown,
  Grid,
  GridItem,
  KebabToggle,
  Menu,
  MenuContent,
  MenuGroup,
  MenuInput,
  MenuItem,
  MenuList,
  OverflowMenu,
  OverflowMenuContent,
  OverflowMenuControl,
  OverflowMenuGroup,
  OverflowMenuItem,
  Spinner,
  Split,
  SplitItem,
  StackItem,
  Text,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { menuItems } from './data';
import './notifications.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  emailPreferences,
  notificationPreferences,
  register,
} from '../../store';
import { getNotificationSchemas } from '../../actions';
import { getApplicationSchema } from '../../api';
import {
  calculateEmailConfig,
  notificationConfigForBundle,
} from '../../Utilities/functions';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import {
  FormTemplate,
  componentMapper,
} from '@data-driven-forms/pf4-component-mapper';
import FormButtons from '../shared/FormButtons';
import {
  DATA_LIST,
  DESCRIPTIVE_CHECKBOX,
  DataListLayout,
  DescriptiveCheckbox,
  LOADER,
  Loader,
} from '../../SmartComponents/FormComponents';
import { ButtonVariant } from '@patternfly/react-core/dist/js/components/Button/Button';
import useLoaded from '../shared/useLoaded';
import config from '../../config/config.json';

const reducer = (state, action) => {
  switch (action.type) {
    case 'changeTab':
      return {
        ...state,
        bundle: action.payload.bundle,
        section: action.payload.section,
      };
    default:
      throw new Error();
  }
};

const renderPageHeading = (bundleTitle, sectionTitle) => (
  <React.Fragment>
    <Title
      headingLevel="h3"
      size="xl"
      className="pf-u-pb-xs pf-u-mt-lg"
      style={{ paddingLeft: 0 }}
    >
      {`${sectionTitle} | ${bundleTitle}`}
    </Title>
    Configure your {sectionTitle} notifications.
  </React.Fragment>
);

const Notifications = () => {
  const dispatch = useDispatch();
  const mastheadHeight = useRef(0);
  const search = useRef(null);
  const title = useRef(null);

  const [emailConfig, setEmailConfig] = useState({});
  const isLoaded = useLoaded(async () => {
    await insights.chrome.auth.getUser();
    register(emailPreferences);
    setEmailConfig(await calculateEmailConfig(config, dispatch));
  });

  console.log(emailConfig, isLoaded);

  const resizeObserver = new ResizeObserver((entries) => {
    const content = document.getElementById('notifications-menu-content');
    content.style.maxHeight = `${Math.min(
      entries[0].target.getBoundingClientRect().height -
        search.current?.getBoundingClientRect().height -
        1,
      window.innerHeight -
        mastheadHeight.current -
        title.current?.getBoundingClientRect().height -
        search.current?.getBoundingClientRect().height -
        1
    )}px`;
  });

  const { bundles } = useSelector(({ notificationPreferences }) => ({
    bundles: {},
    ...notificationPreferences,
  }));

  const initialState = {
    bundle: Object.entries(bundles)?.filter(
      (entry) => entry[1]?.sections.length > 0
    )?.[0]?.[0],
    section: Object.entries(bundles)?.filter(
      (entry) => entry[1]?.sections.length > 0
    )?.[0]?.[1]?.sections[0].name,
  };

  const [state, change] = useReducer(reducer, initialState);

  useEffect(() => {
    register(notificationPreferences);
    mastheadHeight.current =
      window.innerHeight -
      document
        .getElementsByClassName('pf-c-page__main')[0]
        .getBoundingClientRect().height;
    const menuElement = document.getElementById('notifications-menu');

    resizeObserver.observe(menuElement);
    (async () => {
      await insights.chrome.auth.getUser();
      const promises = Object.keys(menuItems).map((bundleName) =>
        getApplicationSchema(
          notificationConfigForBundle(bundleName)?.application,
          undefined,
          notificationConfigForBundle(bundleName)?.resourceType
        ).then((data) => ({
          data,
          bundleName,
        }))
      );
      Promise.all(promises).then((values) => {
        const newValues = values.reduce(
          (acc, { data, bundleName }) => ({
            ...acc,
            [bundleName]: data?.fields[0],
          }),
          {}
        );
        dispatch(getNotificationSchemas(newValues));
        const initial = Object.entries(newValues).find(
          (entry) => entry[1]?.sections.length > 0
        );
        change({
          type: 'changeTab',
          payload: {
            bundle: initial?.[0],
            section: initial?.[1]?.sections[0].name,
          },
        });
      });
    })();

    return () => {
      resizeObserver.unobserve(menuElement);
    };
  }, []);

  console.log(menuItems, bundles);

  return (
    <React.Fragment>
      <Split>
        <SplitItem isFilled>
          <div ref={title}>
            <PageHeaderTitle
              className="pref-notifications--title sticky"
              title="My Notifications"
            />
            <Text className="pref-notifications--subtitle">
              This service allows you to opt-in and out of receiving
              notifications. Your Organization Administrator has configured
              which notifications you can or can not receive in their{' '}
              <a href={`/settings/notifications`}>Settings</a>.
            </Text>
          </div>
        </SplitItem>
      </Split>
      <Grid>
        <GridItem
          id="notifications-menu"
          className="pf-m-3-col-on-md pref-notifications--menu"
        >
          <Menu isPlain isScrollable>
            <MenuInput ref={search} className="pf-u-mx-sm">
              <TextInput
                placeholder="Search applications"
                // value={input}
                aria-label="Filter menu items"
                iconVariant="search"
                type="search"
                // onChange={(value) => handleTextInputChange(value)}
              />
            </MenuInput>
            <Divider />
            <MenuContent id="notifications-menu-content">
              {Object.entries(menuItems)
                ?.filter(([key]) => bundles[key]?.sections.length > 0)
                .map(([key, { title }]) => (
                  <MenuGroup key={key} label={title} className="pf-u-px-sm">
                    <MenuList>
                      {bundles[key]?.sections.map((section) => (
                        <MenuItem
                          onClick={() =>
                            change({
                              type: 'changeTab',
                              payload: { bundle: key, section: section.name },
                            })
                          }
                          itemId={section.name}
                          key={section.name}
                          className="pf-u-px-sm"
                        >
                          {section.label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </MenuGroup>
                ))}
            </MenuContent>
          </Menu>
        </GridItem>
        <GridItem className="pf-m-9-col-on-md pref-notifications--section">
          {Object.keys(bundles).length > 0 ? ( //replace with a loading flag
            <React.Fragment>
              <StackItem className="pf-u-mb-xl">
                {renderPageHeading(
                  menuItems[state.bundle]?.title,
                  bundles[state.bundle]?.sections.find(
                    (section) => section.name === state.section
                  )?.label
                )}
                {/** Do we want it to come together with the schema? */}
              </StackItem>

              <StackItem>
                <FormRenderer
                  componentMapper={{
                    ...componentMapper,
                    [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox,
                    [LOADER]: Loader,
                    [DATA_LIST]: DataListLayout,
                  }}
                  FormTemplate={(props) => (
                    <FormTemplate {...props} FormButtons={FormButtons} />
                  )}
                  schema={
                    bundles[state.bundle]?.sections.find(
                      (section) => section.name === state.section
                    )?.fields[0]
                  }
                  onSubmit={() => null}
                />
              </StackItem>
              <OverflowMenu breakpoint="lg">
                <OverflowMenuContent isPersistent>
                  <OverflowMenuGroup groupType="button">
                    <OverflowMenuItem>
                      <Button variant={ButtonVariant.primary}>Primary</Button>
                    </OverflowMenuItem>
                    <OverflowMenuItem>
                      <Button variant={ButtonVariant.secondary}>
                        Secondary
                      </Button>
                    </OverflowMenuItem>
                  </OverflowMenuGroup>
                </OverflowMenuContent>
                <OverflowMenuControl>
                  <Dropdown
                    onSelect={() => null}
                    toggle={<KebabToggle onToggle={() => null} />}
                    isOpen={true}
                    isPlain
                    dropdownItems={[]}
                    isFlipEnabled
                    menuAppendTo="parent"
                  />
                </OverflowMenuControl>
              </OverflowMenu>
            </React.Fragment>
          ) : (
            <Bullseye>
              <Spinner />
            </Bullseye>
          )}
        </GridItem>
      </Grid>
    </React.Fragment>
  );
};

export default Notifications;
