import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/api';
import Input from '../ui/Input';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password required')
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await auth.login(values);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ _error: 'Login failed. Please try again.' });
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
      {({ isSubmitting, errors }) => (
        <Form className="login-form">
          <h2>Welcome Back</h2>

          {errors.message && <div className="form-alert" role="alert">{errors.message}</div>}
          {errors.errors && <div className="form-alert" role="alert">{errors.errors.join(', ')}</div>}

          <Field as={Input} type="email" label="Email" name="email" placeholder="Enter your email" />

          <Field as={Input} type="password" label="Password" name="password" placeholder="Enter your password" />

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;