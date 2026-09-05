import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { transactions } from '../../services/api';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const TransactionForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { transactionId } = useParams();
  const isEdit = !!transactionId;

  const initialValues = {
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  };

  // If editing, we would fetch the transaction and set initialValues accordingly
  // For simplicity, we are not implementing the fetch here, but in a real app we would.

  const validationSchema = Yup.object({
    type: Yup.string().oneOf(['income', 'expense'], 'Invalid type').required('Type required'),
    amount: Yup.number().min(0.01, 'Amount must be greater than 0').required('Amount required'),
    category: Yup.string().required('Category required'),
    description: Yup.string().optional(),
    date: Yup.date().required('Date required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const transactionData = {
        ...values,
        amount: parseFloat(values.amount),
        date: new Date(values.date)
      };

      if (isEdit) {
        await transactions.update(transactionId, transactionData);
      } else {
        await transactions.create(transactionData);
      }

      // Reset form and redirect or show success message
      resetForm();
      navigate(isEdit ? '/transactions' : '/transactions'); // Adjust as needed
    } catch (error) {
      console.error(error);
      // Set error in formik
      if (error.response && error.response.data) {
        // Assuming the backend returns validation errors in a certain format
        // For now, we'll just set a general error
        throw new Error(error.response.data.message || 'Transaction failed');
      } else {
        throw new Error('Transaction failed. Please try again.');
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
        <Form className="transaction-form">
          <h2>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>

          <div className="form-row">
            <Field as={Select}
                   label="Type"
                   name="type"
                   options={[
                     { value: 'income', label: 'Income' },
                     { value: 'expense', label: 'Expense' }
                   ]} />
            <Field as={Input}
                   label="Amount"
                   name="amount"
                   type="number"
                   placeholder="Enter amount" />
          </div>

          <Field as={Input}
                 label="Category"
                 name="category"
                 placeholder="Enter category" />

          <Field as={Input}
                 label="Description"
                 name="description"
                 type="text"
                 placeholder="Enter description" />

          <Field as={Input}
                 label="Date"
                 name="date"
                 type="date" />

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default TransactionForm;