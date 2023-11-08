import { Injectable } from '@angular/core';
import { Cart } from '../shared/models/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/models/Food';
import { CartItem } from '../shared/models/Cartitem';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = this.getCartfromlocalstorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor() {}
  addTocart(food: Food): void {
    let cartitem = this.cart.items.find((item) => item.food.id === food.id);
    if (cartitem) {
      return;
    }
    this.cart.items.push(new CartItem(food));
    this.setCartTolocalstorage();
  }
  removefromcart(foodId: string): void {
    this.cart.items = this.cart.items.filter((item) => item.food.id != foodId);
    this.setCartTolocalstorage();
  }
  changeQuantity(foodId: string, quantity: number) {
    let cartitem = this.cart.items.find((item) => item.food.id === foodId);
    if (!cartitem) return;
    cartitem.quantity = quantity;
    cartitem.price = quantity * cartitem.food.price;
    this.setCartTolocalstorage();
  }
  clearcart() {
    this.cart = new Cart();
    this.setCartTolocalstorage();
  }
  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }
  private setCartTolocalstorage(): void {
    this.cart.totalPrice = this.cart.items.reduce(
      (prevsum, currentitem) => prevsum + currentitem.price,
      0
    );
    this.cart.totalCount = this.cart.items.reduce(
      (prevsum, currentitem) => prevsum + currentitem.quantity,
      0
    );
    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
  }
  private getCartfromlocalstorage(): Cart {
    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }
}
