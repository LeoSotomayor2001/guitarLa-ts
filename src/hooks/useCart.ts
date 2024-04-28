import {db} from '../data/db';
import { useState,useEffect, useMemo } from 'react';
import type { CartItem,Guitar } from '../types';

export const useCart=()=>{

    const initalCart=():CartItem[] =>{
        const localStorageCart=localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
      
      const [data] = useState(db);
      const [cart, setCart] = useState(initalCart);
      const MAX_ITEMS=5;
    
      useEffect(()=>{
        localStorage.setItem('cart',JSON.stringify(cart));
      },[cart])
    
      function addToCart(item: Guitar){
        const itemExists=cart.findIndex((guitar)=> guitar.id===item.id )
        if(itemExists >=0){//existe en el carrito
    
          if(cart[itemExists].quantity >= MAX_ITEMS) return;
    
          const updateCart=[...cart];
          updateCart[itemExists].quantity++;
          setCart(updateCart);
        }
        else{
          const newItem: CartItem= {...item, quantity:1}

          setCart([...cart,newItem]);
    
        }
      
      }
    
      function removeFromCart(id:Guitar['id']){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !==id) )
      }
    
      function updateQuantity(id:Guitar['id'],  operation: 'increase' | 'decrease') {
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                let newQuantity = item.quantity;
    
                if (operation === 'increase' && item.quantity < MAX_ITEMS) {
                    newQuantity += 1;
    
                } else if (operation === 'decrease' && item.quantity > 1) {
                    newQuantity -= 1;
    
                }
                return {
                    ...item,
                    quantity: newQuantity
                };
            }
            return item;
        });
        setCart(updatedCart);
      }
    
      function clearCart(){
        setCart([]);
      }
    //State derivado
    const isEmpty=useMemo( () =>cart.length===0,[cart]);
    const cartTotal=useMemo( ()=> cart.reduce((total,item) => total + (item.quantity* item.price),0),[cart]);


    return{
        data,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}