import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface FormatedData {
  transactionsData: Transaction[];
  balanceData: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  function FormatData(
    transactionsData: Transaction[],
    balanceData: Balance,
  ): FormatedData {
    const formattedTransactions = transactionsData.map(transaction => {
      const formattedTransaction = transaction;

      formattedTransaction.formattedValue =
        (formattedTransaction.type === 'outcome' ? '- ' : '') +
        formatValue(Number(formattedTransaction.value));

      const date = new Date(formattedTransaction.created_at).toLocaleDateString(
        'pt-br',
      );

      formattedTransaction.formattedDate = date;

      return formattedTransaction;
    });

    const formattedBalance = balanceData;
    formattedBalance.income = formatValue(Number(formattedBalance.income));
    formattedBalance.outcome = formatValue(Number(formattedBalance.outcome));
    formattedBalance.total = formatValue(Number(formattedBalance.total));

    return {
      transactionsData: formattedTransactions,
      balanceData: formattedBalance,
    };
  }

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      // eslint-disable-next-line no-console
      console.log(response.data);

      const { transactionsData, balanceData } = FormatData(
        response.data.transactions,
        response.data.balance,
      );

      setTransactions(transactionsData);
      setBalance(balanceData);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header size="large" />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
              {/* <tr>
                <td className="title">Computer</td>
                <td className="income">R$ 5.000,00</td>
                <td>Sell</td>
                <td>20/04/2020</td>
              </tr>
              <tr>
                <td className="title">Website Hosting</td>
                <td className="outcome">- R$ 1.000,00</td>
                <td>Hosting</td>
                <td>19/04/2020</td>
              </tr> */}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
