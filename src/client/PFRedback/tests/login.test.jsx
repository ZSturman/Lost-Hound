import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../app/(auth)/login';
import { Alert } from 'react-native';

// Mocking the router to prevent navigation errors
jest.mock('expo-router', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
      router: {
        replace: jest.fn(),
      },
      Link: ({ children }) => <Text>{children}</Text>,
    };
});

// Mocking fetch globally
global.fetch = jest.fn();

const mockEvent = {
    preventDefault: jest.fn(),
};

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.HOST_URL = 'http://localhost';      // Only works if no HOST URL in .env
    });

    
    // Test 1
    it('renders login form correctly', () => {
        const { getByText, getByLabelText } = render(<Login />);

        // Check if form fields and buttons are rendered
        expect(getByLabelText('Email Address')).toBeTruthy();
        expect(getByLabelText('Password')).toBeTruthy();
        expect(getByText('Sign In')).toBeTruthy();
        expect(getByText("Don't have an account?")).toBeTruthy();
        expect(getByText('Sign-Up')).toBeTruthy();
    });

    // Test 2
    it('logs in the user successfully', async () => {
        const mockResponse = { ok: true };
        fetch.mockResolvedValueOnce(mockResponse);

        const { getByText, getByLabelText } = render(<Login />);

        // Simulate form input
        fireEvent.changeText(getByLabelText('Email Address'), 'achatsrirung@student.unimelb.edu.au');
        fireEvent.changeText(getByLabelText('Password'), 'password123');

        // Simulate button press
        fireEvent.press(getByText('Sign In'), mockEvent);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/account/login'), expect.anything());
            expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    email: 'achatsrirung@student.unimelb.edu.au',
                    password: 'password123',
                }),
            }));

            // Verify the navigation to the home screen
            expect(require('expo-router').router.replace).toHaveBeenCalledWith('/home');
        });
    });

    // Test 3
    it('shows error alert when fields are empty', async () => {
        const mockResponse = {
            ok: false,
            text: () => Promise.resolve('Empty email or password field'),
        };
        fetch.mockResolvedValueOnce(mockResponse);

        jest.spyOn(Alert, 'alert');

        const { getByText } = render(<Login />);

        // Simulate button click without filling form
        fireEvent.press(getByText('Sign In'), mockEvent);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error: Empty Field(s)', 'Please ensure all fields are filled');
        });
    });

    // Test 4: Invalid email format
    it('shows error alert for invalid email format', async () => {
        const mockResponse = {
            ok: false,
            text: () => Promise.resolve('Invalid email format'),
        };
        fetch.mockResolvedValueOnce(mockResponse);

        jest.spyOn(Alert, 'alert');

        const { getByText, getByLabelText } = render(<Login />);

        // Fill the form with invalid email
        fireEvent.changeText(getByLabelText('Email Address'), 'invalid-email');

        // Simulate button click
        fireEvent.press(getByText('Sign In'), mockEvent);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error: Format', 'Invalid email format');
        });
    });

    // Test 5: User not verified
    it('navigates to OTP screen when user is not verified', async () => {
        const mockResponse = {
            ok: false,
            text: () => Promise.resolve('User not verified'),
        };
        fetch.mockResolvedValueOnce(mockResponse);

        const { getByText, getByLabelText } = render(<Login />);

        // Simulate form input
        fireEvent.changeText(getByLabelText('Email Address'), 'achatsrirung@student.unimelb.edu.au');
        fireEvent.changeText(getByLabelText('Password'), 'password123');

        // Simulate button click
        fireEvent.press(getByText('Sign In'), mockEvent);

        await waitFor(() => {
            expect(require('expo-router').router.replace).toHaveBeenCalledWith({
                pathname: '/otp',
                params: { userEmail: 'achatsrirung@student.unimelb.edu.au' },
            });
        });
    });

    // Test 6: User does not exist
    it('shows error alert when user does not exist', async () => {
        const mockResponse = {
            ok: false,
            text: () => Promise.resolve('No existing user'),
        };
        fetch.mockResolvedValueOnce(mockResponse);

        jest.spyOn(Alert, 'alert');

        const { getByText, getByLabelText } = render(<Login />);

        // Simulate form input
        fireEvent.changeText(getByLabelText('Email Address'), 'notexist@hotmail.com');
        fireEvent.changeText(getByLabelText('Password'), 'password123');

        // Simulate button click
        fireEvent.press(getByText('Sign In'), mockEvent);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('User Does Not Exist', 'Please sign-up instead');
        });
    });

    // Test 7: Incorrect email or password
    it('shows error alert for incorrect email or password', async () => {
        const mockResponse = {
            ok: false,
            text: () => Promise.resolve('Incorrect email or password'),
        };
        fetch.mockResolvedValueOnce(mockResponse);

        jest.spyOn(Alert, 'alert');

        const { getByText, getByLabelText } = render(<Login />);

        // Simulate form input
        fireEvent.changeText(getByLabelText('Email Address'), 'achatsrirung@student.unimelb.edu.au');
        fireEvent.changeText(getByLabelText('Password'), 'wrongpassword');

        // Simulate button click
        fireEvent.press(getByText('Sign In'), mockEvent);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('', 'Incorrect email or password');
        });
    });

    // Test 8: Handles unknown error
    it('shows error alert on unknown error', async () => {
        const mockError = new Error('Unknown error');
        fetch.mockRejectedValueOnce(mockError);

        jest.spyOn(Alert, 'alert');

        const { getByText } = render(<Login />);

        // Simulate button click
        fireEvent.press(getByText('Sign In'), mockEvent);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('', 'An error occurred. Please try again.');
        });
    });


});
