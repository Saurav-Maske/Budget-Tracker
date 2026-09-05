import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SignupForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .required('Username required'),
    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password required'),
    agreeToTerms: Yup.bool().oneOf([true], 'You must agree to the terms')
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { agreeToTerms, ...userData } = values;
      const response = await auth.register(userData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ _error: 'Sign up failed. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="signup-form">
          <h2>Create Account</h2>

          <Field as={Input} type="text" label="Username" name="username" placeholder="Choose a username" />
          <Field as={Input} type="email" label="Email" name="email" placeholder="Enter your email" />
          <Field as={Input} type="password" label="Password" name="password" placeholder="Create a password" />
          <Field as={Input} type="password" label="Confirm Password" name="confirmPassword" placeholder="Confirm your password" />

          <div className="checkbox-group">
            <Field type="checkbox" name="agreeToTerms" id="agreeToTerms" />
            <label htmlFor="agreeToTerms" className="checkbox-label">
              I agree to the <a href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="form-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;