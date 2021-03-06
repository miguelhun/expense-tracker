import React, { useReducer } from 'react'
import axios from 'axios'
import TransactionContext from './transactionContext'
import TransactionReducer from './transactionReducer'

const TransactionState = (props) => {
	const initialState = {
		transactions: null,
		income: null,
		expenses: null,
		filteredTransactions: null,
		error: null,
	}

	const [state, dispatch] = useReducer(TransactionReducer, initialState)

	// Get transactions
	const getTransactions = async () => {
		try {
			const res = await axios.get('transactions')

			dispatch({ type: 'GET_TRANSACTIONS', payload: res.data })
		} catch (err) {
			dispatch({
				type: 'TRANSACTION_ERROR',
				payload: err,
			})
		}
	}

	// Get Expenses
	const getExpenses = () => {
		dispatch({ type: 'GET_EXPENSES' })
	}

	// Get Income
	const getIncome = () => {
		dispatch({ type: 'GET_INCOME' })
	}

	// Add transaction
	const addTransaction = async (transaction) => {
		const config = {
			headers: {
				'Content-Type': 'Application/json',
			},
		}

		try {
			const res = await axios.post('transactions', transaction, config)

			dispatch({ type: 'ADD_TRANSACTION', payload: res.data })
		} catch (err) {
			dispatch({ type: 'TRANSACTION_ERROR', payload: err.response.msg })
		}
	}

	// Delete transaction
	const deleteTransaction = async (id) => {
		try {
			await axios.delete(`transactions/${id}`)

			dispatch({ type: 'DELETE_TRANSACTION', payload: id })
		} catch (err) {
			dispatch({ type: 'TRANSACTION_ERROR' })
		}
	}

	// Clear Transactions
	const clearTransactions = () => {
		dispatch({ type: 'CLEAR_TRANSACTIONS' })
	}

	// Filter transactions
	const filterTransactions = (text) => {
		dispatch({ type: 'FILTER_TRANSACTIONS', payload: text })
	}

	// Clear filtered transactions
	const clearFilter = () => {
		dispatch({ type: 'CLEAR_FILTER' })
	}

	return (
		<TransactionContext.Provider
			value={{
				transactions: state.transactions,
				expenses: state.expenses,
				income: state.income,
				error: state.error,
				filteredTransactions: state.filteredTransactions,
				getTransactions,
				getExpenses,
				getIncome,
				filterTransactions,
				clearFilter,
				addTransaction,
				deleteTransaction,
				clearTransactions,
			}}
		>
			{props.children}
		</TransactionContext.Provider>
	)
}

export default TransactionState
