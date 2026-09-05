import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { transactions } from '../../services/api';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { expenseCategoryOptions, incomeCategoryOptions } from '../../utils/categories';

const TransactionForm = ({ onSaved, transaction = null }) => {
  const navigate = useNavigate();
  const { transactionId: routeTransactionId } = useParams();
  const transactionId = transaction?.id || routeTransactionId;
  const isEdit = Boolean(transactionId);

  const initialValues = transaction ? {
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description || '',
    date: new Date(transaction.date).toISOString().split('T')[0]
  } : {
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  };

  const validationSchema = Yup.object({
    type: Yup.string().oneOf(['income', 'expense'], 'Invalid type').required('Type required'),
    amount: Yup.number().min(0.01, 'Amount must be greater than 0').required('Amount required'),
    category: Yup.string().required('Category required'),
    description: Yup.string().optional(),
    date: Yup.date().required('Date required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
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
      if (onSaved) onSaved();
      navigate('/transactions');
    } catch (error) {
      const response = error.response?.data;
      setErrors({ _error: response?.message || 'Transaction failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, values, setFieldValue }) => (
        <Form className="transaction-form">
          <h2>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>

          {errors._error && <div className="form-alert" role="alert">{errors._error}</div>}

          <div className="form-row">
            <Field as={Select}
                   label="Type"
                   name="type"
                   options={[
                     { value: 'income', label: 'Income' },
                     { value: 'expense', label: 'Expense' }
                   ]}
                   onChange={event => {
                     setFieldValue('type', event.target.value);
                     setFieldValue('category', '');
                   }} />
            <Field as={Input}
                   label="Amount"
                   name="amount"
                   type="number"
                   placeholder="Enter amount" />
          </div>

             <Field as={Select}
               label="Category"
               name="category"
                 options={values.type === 'income' ? incomeCategoryOptions : expenseCategoryOptions} />

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