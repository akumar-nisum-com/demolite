import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs/Subscription';
import { CartAction } from '../../store/actions/cart.actions';
import { Product } from '../../models/Product';

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {

  public tempcart = [];
  public cart = [];
  public totalPrice: number;
  public totalQuantity: number;
  public cartSubscription: Subscription;

  constructor(private productService:ProductService, private cartStore: CartAction) {}

  removeProduct(product) {
    this.cartStore.removeFromCart(product)
  }

  checkout() {
    this.cartStore.checkOutFromCart()
  //  alert('Sorry! Checkout will be coming soon!')
  }

  getTotalPrice() {
    let totalCost: Array<number> = []
    let quantity: Array<number> = []
    let intPrice: number
    let intQuantity: number
    this.cart.forEach((item, i) => {
      intPrice = parseInt(item.price)
      intQuantity = parseInt(item.quantity)
      totalCost.push(intPrice)
      quantity.push(intQuantity)
    })

    this.totalPrice = totalCost.reduce((acc, item) => {
      return acc += item
    }, 0)
    this.totalQuantity = quantity.reduce((acc, item) => {
      return acc += item
    }, 0)
  }

  ngOnInit() {
    this.cartSubscription = this.cartStore.getState().subscribe(res => {
      this.tempcart = res.products
      let idListMap : Map<number, any> = new Map<number, any>();
      
      this.tempcart.forEach((item, i) => {
       let prod = item;
       if(idListMap.get(prod.id) == null ){       
        idListMap.set(prod.id,prod);
       }else{
        prod = idListMap.get(item.id);
        let quantity = parseInt(prod.quantity);
        quantity = quantity + parseInt(prod.quantity);
        prod.quantity = quantity;
        idListMap.set(item.id,prod);
       }
      })
      console.log(idListMap);
      idListMap.forEach(item => {
      this.cart.push(item); 
      })
      this.getTotalPrice()
      res.products = this.cart;
    })
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe()
  }
  
}
