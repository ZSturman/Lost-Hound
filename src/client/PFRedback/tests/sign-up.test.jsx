import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUp from '../app/(auth)/sign-up'; 
import { Alert } from 'react-native';

// Mocking the router to prevent navigation errors
jest.mock('expo-router', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
      router: {
        replace: jest.fn(),
      },
      // Mocking Link to render children properly using Text
      Link: ({ children }) => <Text>{children}</Text>,
    };
  });


// Mocking react-native-element-dropdown to select first option of Dropdown only
jest.mock('react-native-element-dropdown', () => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
  
    return {
      Dropdown: ({ data, value, onChange, accessibilityLabel }) => {
        const [selectedValue, setSelectedValue] = React.useState(value);
  
        // Simulate dropdown press to select first option
        const handlePress = () => {
          const firstOption = data[0];
          setSelectedValue(firstOption.value);
          if (onChange) onChange(firstOption);
        };
  
        return (
          <TouchableOpacity
            accessibilityLabel={accessibilityLabel}
            onPress={handlePress}
          >
            <Text>{selectedValue || 'Select item'}</Text>
          </TouchableOpacity>
        );
      },
    };
});

// Mocking fetch globally
global.fetch = jest.fn();

const mockEvent = {
    preventDefault: jest.fn(),
  };
  

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.HOST_URL = 'http://localhost';  // Only works if no HOST URL in .env
  });
  

  // Test 1
  it('renders correctly', () => {
    const { getByText, getByLabelText } = render(<SignUp />);

    // Check if form fields and buttons are rendered
    expect(getByLabelText('Name')).toBeTruthy();
    expect(getByLabelText('Email Address')).toBeTruthy();
    expect(getByLabelText('Password')).toBeTruthy();
    expect(getByLabelText('State')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
    expect(getByText('Already have an account?')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  // Test 2
  it('registers a user successfully', async () => {
    const mockResponse = {
      ok: true,
    };
    fetch.mockResolvedValueOnce(mockResponse);

    const { getByText, getByLabelText } = render(<SignUp />);

    // Simulate form input
    fireEvent.changeText(getByLabelText('Name'), 'Allie Chat');
    fireEvent.changeText(getByLabelText('Email Address'), 'achatsrirung@student.unimelb.edu.au');
    fireEvent.changeText(getByLabelText('Password'), 'password123');

    // Simulate button click
    fireEvent.press(getByText('Register'), mockEvent);

    // Wait for async actions
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/account/register'), expect.anything());
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          form: {
            name: 'Allie Chat',
            email: 'achatsrirung@student.unimelb.edu.au',
            password: 'password123',
            state: '',
          },
        }),
      }));

      // Verify the navigation to the OTP screen
      expect(require('expo-router').router.replace).toHaveBeenCalledWith({
        pathname: '/otp',
        params: { userEmail: 'achatsrirung@student.unimelb.edu.au' },
      });
    });
  });

  // Test 3
  it('shows error alert when fields are empty', async () => {
    const mockResponse = {
      ok: false,
      text: () => Promise.resolve('Empty field(s)'),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    jest.spyOn(Alert, 'alert');

    const { getByText } = render(<SignUp />);

    // Simulate button click without filling form
    fireEvent.press(getByText('Register'), mockEvent);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error: Empty Field(s)', 'Please ensure all fields are filled');
    });
  });

  // Test 4
  it('shows error alert for invalid email format', async () => {
    const mockResponse = {
      ok: false,
      text: () => Promise.resolve('Invalid email format'),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    jest.spyOn(Alert, 'alert');

    const { getByText, getByLabelText } = render(<SignUp />);

    // Fill the form with invalid email
    fireEvent.changeText(getByLabelText('Email Address'), 'invalid-email');

    // Simulate button click
    fireEvent.press(getByText('Register'), mockEvent);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error: Format', 'Invalid email format');
    });
  });

  // Test 5
  it('shows error alert for existing account', async () => {
    const mockResponse = {
      ok: false,
      text: () => Promise.resolve('Existing account'),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    jest.spyOn(Alert, 'alert');

    const { getByText, getByLabelText } = render(<SignUp />);

    // Simulate form input
    fireEvent.changeText(getByLabelText('Name'), 'Allie Chat');
    fireEvent.changeText(getByLabelText('Email Address'), 'achatsrirung@student.unimelb.edu.au');
    fireEvent.changeText(getByLabelText('Password'), 'password123');

    // Simulate button click
    fireEvent.press(getByText('Register'), mockEvent);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('User Already Exists', 'Please log in instead');
    });
  });


  // Test 6
  it('updates form state on state selection', () => {
    const { getByText, getByLabelText } = render(<SignUp />);

    // Selecting the first item of Dropdown
    const stateDropdown = getByLabelText('State');
    fireEvent.press(stateDropdown);
    expect(getByText('ACT')).toBeTruthy();
  });



});
