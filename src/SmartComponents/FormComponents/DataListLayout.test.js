import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import DataListLayout from './DataListLayout';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';

describe('DataListLayout checkbox tests', () => {

    it('should render correctly', () => {
        const wrapper = mount(
            <Form onSubmit={ () => undefined }>
                {(props) => (
                    <RendererContext.Provider value={ {
                        formOptions: {
                            renderForm: () => null
                        }} }>
                        <DataListLayout
                            label="test label"
                            sections={ [{ label: 'test', fields: [{ fields: []}]}] }
                            formOptions={ {
                                renderForm: () => 'test'
                            } }
                            clearedValue
                            { ...props }
                        />
                    </RendererContext.Provider>
                )}
            </Form>

        );
        expect(toJson(wrapper.find('DataListLayout'))).toMatchSnapshot();
    });
});
