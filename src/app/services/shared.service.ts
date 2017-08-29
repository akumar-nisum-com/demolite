import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/map'
import { Apiconstants } from './../models/apiconstants';
import { Router } from '@angular/router';
import { CartItem } from './../models/CartItem';
@Injectable()
export class SharedService {

  public token: string;
  constructor(private http: Http, private router: Router) {
    // set token if saved in local storage
  }

  checkout(cart: any): void {
    let cartItems: CartItem[] = [];
    cart.forEach(prodt => {
      var products = prodt.cart.products;
      products.forEach(element => {
        let product: CartItem = new CartItem();

        product.sku = element.sku;
        product.skuName = element.name;
        product.imageSource = element.src;
        product.sellingPrice = element.price;
        product.listPrice = element.price;
        product.quantity = element.quantity;
        cartItems.push(product);
      });

    })
    this.callQuickOut(cartItems).subscribe(
      (data: string) => {
        console.log(data);
        let idForCart = data;
        if (idForCart == null || idForCart.toString() === "nocart") {
          alert("Unable to process your cart request.")
        } else {
          console.log(Apiconstants.CART_ENDPOINT + idForCart)
          window.location.href = Apiconstants.CART_ENDPOINT + idForCart;
        }
      },
      error => {
        console.log('error')
      }
    );

  }

  callQuickOut(cartRequest: any): Observable<string> {

    let bodyString = JSON.stringify(cartRequest); // Stringify payload
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(Apiconstants.API_ENDPOINT, bodyString, options) //...using post request
      .map((res: Response) => {
        let response = res.json()
        return response.id;
      }) // ...and calling .json() on the response to return data
      .catch((error: any) => {
        console.log(error);
        return Observable.throw(error.json().error || 'Server error')
      }); //...errors if any
  }


  ngOnDestroy() {
    // this.quickOutSubscription.unsubscribe()
  }
}
