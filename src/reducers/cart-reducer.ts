import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

export type CartActions=
{type:"ADD_TO_CART",payload:{item:Guitar} }|
{type:"REMOVE_FROM_CART",payload:{id:Guitar['id']} }|
{type:"UPDATE_QUANTITY",payload:{id:Guitar['id'],operation:'increase'|'decrease'} } |
{type:"CLEAR_CART"} 

export type CartState={
    data:Guitar[],
    cart:CartItem[]
}

const initalCart=():CartItem[] =>{
    const localStorageCart=localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

export const initialState:CartState={
    data:db,
    cart:initalCart()
}
const MAX_ITEMS=5;
const MIN_ITEMS=1;

export const cartReducer=(state:CartState=initialState,action:CartActions)=>{
    
    // agrega un item al carrito si no existe, sino aumenta la cantidad
    if(action.type==="ADD_TO_CART"){
        // busca el item en el carrito
        const itemExists=state.cart.find((guitar)=> guitar.id===action.payload.item.id )
        let updateCart:CartItem[] =[];

        // si existe el item en el carrito, se actualiza su cantidad
        if(itemExists ){ 
            // se crea un nuevo arreglo de items con la cantidad actualizada o no cambiada en caso de que ya sea el máximo permitido
            updateCart=state.cart.map((item)=>{
                // si es el item buscado
                if(item.id===action.payload.item.id){
                    // si la cantidad es menor al máximo permitido
                    if(item.quantity< MAX_ITEMS){
                        // se devuelve un nuevo objeto con la cantidad actualizada
                        return {...item,quantity:item.quantity+1}
                    }
                    // si la cantidad es igual al máximo permitido
                    else{
                        // se devuelve la referencia del objeto sin cambios
                        return item
                    }
                }
                // si no es el item buscado
                else{
                    // se devuelve la referencia del objeto sin cambios
                    return item
                }
            })
            
        }
        // si no existe el item en el carrito se crea uno nuevo
        else{
            const newItem: CartItem= {...action.payload.item, quantity:1}
            updateCart= [...state.cart,newItem]

        }
        // se devuelve un nuevo objeto con el estado actual y el carrito actualizado
        return{
            ...state,
            cart:updateCart
        }
    }
    // elimina un item del carrito
    if(action.type==="REMOVE_FROM_CART"){
        const updateCart=state.cart.filter((item)=> item.id!==action.payload.id)
        return{
            ...state,
            cart:updateCart
        }
    }
    // actualiza la cantidad de un item en el carrito
    if(action.type==="UPDATE_QUANTITY"){
        const updateCart=state.cart.map((item)=>{
            // si es el item buscado
            if(item.id===action.payload.id){
                // si se aumenta la cantidad
                if(action.payload.operation==='increase'){
                    // y la cantidad actual es menor al máximo permitido
                    if(item.quantity<MAX_ITEMS){
                        // se devuelve un nuevo objeto con la cantidad actualizada
                        return {...item,quantity:item.quantity+1}
                    }
                }
                // si se reduce la cantidad
                if(action.payload.operation==='decrease'){
                    // y la cantidad actual es mayor a 1
                    if(item.quantity>MIN_ITEMS){
                        // se devuelve un nuevo objeto con la cantidad actualizada
                        return {...item,quantity:item.quantity-1}
                    }
                }
            }
            // si no es el item buscado
            return item
        })
        return{
            ...state,
            cart:updateCart
        }
    }
    if(action.type==="CLEAR_CART"){

        // se devuelve un nuevo objeto con el estado actual y el carrito vacío
        return{
            ...state,
            cart:[]
        }
    }

    return state;
}