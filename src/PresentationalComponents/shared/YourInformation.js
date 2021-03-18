import {
  Card,
  CardBody,
  CardHeader,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import React, { Fragment } from 'react';
import { Skeleton } from '@redhat-cloud-services/frontend-components/Skeleton';
import useCurrentUser from './useCurrentUser';

const YourInformation = () => {
  const personalInfoUrl = `https://www.${
    insights.chrome.isProd ? '' : 'qa.'
  }redhat.com/wapps/ugc/protected/emailChange.html`;

  const { isLoaded, currentUser } = useCurrentUser();

  return (
    <Card className="pref-email__info" ouiaId="user-pref-info-card">
      <CardHeader>
        <TextContent>
          <Text component={TextVariants.h2}>Your information</Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <DataList>
          <DataListItem>
            <DataListItemRow>
              <DataListItemCells
                className="pref-u-condensed"
                dataListCells={[
                  <DataListCell
                    isFilled={false}
                    className="pref-c-title pref-u-bold pref-u-condensed"
                    key="email-title"
                  >
                    Email address
                  </DataListCell>,
                  <DataListCell
                    isFilled
                    key="email-value"
                    className="pref-email__info-user-email pref-u-condensed"
                  >
                    {isLoaded ? (
                      <Fragment>
                        <span>{currentUser.email}</span>
                        <a
                          rel="noopener noreferrer"
                          target="_blank"
                          href={personalInfoUrl}
                        >
                          Not correct?
                        </a>
                      </Fragment>
                    ) : (
                      <Skeleton size="lg" />
                    )}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        </DataList>
      </CardBody>
    </Card>
  );
};

export default YourInformation;
