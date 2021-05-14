import React, { useReducer, useEffect, useContext } from "react";
import "./style.css";

const products = [
  {
    id: 1,
    name: "Jersey-1",
    price: 399,
    image: "https://i2.wp.com/jerseynmore.com/wp-content/uploads/2019/06/man-u-home-front-short.png?w=448&ssl=1",
    amount: 1
  },
  {
    id: 2,
    name: "Jersey-2",
    price: 499,
    image: "https://i2.wp.com/jerseynmore.com/wp-content/uploads/2019/06/man-u-home-front-short.png?w=448&ssl=1",
    amount: 1
  }
  ,
  {
    id: 3,
    name: "Jersey-3",
    price: 599.99,
    image: "https://i2.wp.com/jerseynmore.com/wp-content/uploads/2019/06/man-u-home-front-short.png?w=448&ssl=1",
    amount: 1
  }
  ,
  {
    id: 4,
    name: "Jersey-4",
    price: 699,
    image: "https://i2.wp.com/jerseynmore.com/wp-content/uploads/2019/06/man-u-home-front-short.png?w=448&ssl=1",
    amount: 1
  }

]

const DataContext = React.createContext();
const DataProvider = ({ children }) => {
  const reducer = (state, action) => {
    if (action.type === "CLEAR-CART") {
      return ({ ...state, cart: [], total: 0 })
    }
    if (action.type === "REMOVE") {
      return ({ ...state, cart: state.cart.filter(cartItem => cartItem.id !== action.payload) })
    }
    if (action.type === "INCREMENT") {
      const tempCart = state.cart.map(cartItem => {
        if (cartItem.id === action.payload) {
          return ({ ...cartItem, amount: cartItem.amount + 1 })
        }
        return cartItem;
      })
      return { ...state, cart: tempCart }
    }
    if (action.type === "DECREMENT") {
      const tempCart = state.cart.map(cartItem => {
        if (cartItem.id === action.payload) {
          return ({ ...cartItem, amount: cartItem.amount > 1 ? cartItem.amount - 1 : cartItem.amount })
        }
        return cartItem;
      })
      return { ...state, cart: tempCart }
    }
    if (action.type === "TOTALS") {
      let { total, amount } = state.cart.reduce((acc, curr) => {
        const { price, amount } = curr;
        const itemTotal = price * amount;
        acc.total += itemTotal;
        acc.amount += amount;

        return acc;
      }, { total: 0, amount: 0 })
      total = parseFloat(total.toFixed(2))
      return { ...state, total, amount }
    }
    return state
  }

  const initialState = {
    loading: false,
    amount: 0,
    cart: products,
    total: 0
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const clearCart = () => {
    dispatch({ type: "CLEAR-CART" })
  }
  const remove = (id) => {
    dispatch({ type: "REMOVE", payload: id })
  }
  const increment = (id) => {
    dispatch({ type: "INCREMENT", payload: id })
  }
  const decrement = (id) => {
    dispatch({ type: "DECREMENT", payload: id })
  }
  useEffect(() => {
    dispatch({ type: "TOTALS" })
  }, [state.cart])
  return (
    <DataContext.Provider value={{
      ...state,
      clearCart,
      remove,
      increment,
      decrement,
    }}>
      {children}
    </DataContext.Provider>
  )
}
const useGlobalContext = () => {
  return useContext(DataContext)
}


const App = () => {
 
  return (
    <DataProvider>
      <div className="app">
        <Navbar />
      <CartContainer />
      </div>
    </DataProvider>

  );
}

const CartContainer = () => {
  const { cart, total, clearCart } = useGlobalContext();

  if (cart.length === 0) {
    return (<div className="cards">
      <h1 className="margin">Your Cart</h1>
      <h3>Cart is currently empty</h3>
     <button className="empty">Return Home</button>
    </div>)
  }
  return (
    <div className="cards">
      <h1 className="margin">Your Cart</h1>
      {cart.map(item => <CartItems key={item.id} item={item} />)}
      <div className="flex">
        <h4 className="total">Total:</h4> <h4 className="total-amount">${total} {" "} </h4></div>
      <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
    </div>
  )
}

const CartItems = ({ item }) => {
  const { remove, increment, decrement } = useGlobalContext();
  return (
    <div className="card">
      <div className="left">

        <img style={{ width: "150px" }} src={item.image} alt={item.name} />
        <div className="column">
          <h2>{item.name}</h2><br /><br /><br />
          <h3>${item.price}</h3><br />
          <p style={{ cursor: "pointer" }} onClick={() => remove(item.id)}>Remove</p>
        </div>
      </div>
      <div className="right">
        <i onClick={() => { increment(item.id) }} className="fa fa-arrow-up"></i>
        <p className="right-amount">{item.amount}</p>
        <i onClick={() => { decrement(item.id) }} className="fa fa-arrow-down"></i>
      </div>
    </div>
  )
}

const Navbar = () => {
  const { amount } = useGlobalContext();
  return (
    <nav style={{ display: "flex", justifyContent: "space-around" }}>
      <h2 className="logo">CartApp</h2>
      <p className="cart-image"><i className="fa fa-shopping-cart fa-2x"><span className="amount">{amount}</span></i></p>
    </nav>
  )
}


export default App;

