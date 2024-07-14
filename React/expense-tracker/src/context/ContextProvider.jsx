/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const GlobalContext = createContext({
  formData: {},
  setFormData: () => {},
  totalExpense: 0,
  setTotalExpense: () => {},
  totalIncome: 0,
  setTotalIncome: () => {},
  allTransactions: [],
  setAllTransactions: () => {},
  value: "",
  setValue: () => {},
  handleFormSubmit: () => {},
});

export default function ContextProvider({ children }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: 0,
    description: "",
  });
  const [value, setValue] = useState("expense");
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);

  const handleFormSubmit = (currentFormData) => {
    console.log(currentFormData);
    if(!currentFormData.description || !currentFormData.amount) return
    setAllTransactions([...allTransactions, {...currentFormData, id: Date.now()}])
  };
  console.log(allTransactions);

  return (
    <GlobalContext.Provider
      value={{
        formData,
        setFormData,
        totalExpense,
        setTotalExpense,
        totalIncome,
        setTotalIncome,
        value,
        setValue,
        allTransactions,
        setAllTransactions,
        handleFormSubmit,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
