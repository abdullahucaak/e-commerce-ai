import axios from 'axios';
import { defineStore } from 'pinia'

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    cartProducts:[],
    cartProductsLS:[], /* localStorage */
    orders:[],
    order:[], /* localStorage */
    completedOrders:[],
    loading:false,
    error: null,
    shippingMethodView: false,
    discountView: false,
    isSubmitGiftCardCode: false,
    giftCardCodeInput: "",
    priceBeforeDiscount: null,
    finalPrice: null,
    newId: null
  }),
  getters: { /* computed */
    /* shop-page | how many products are */
    totalProducts:(state) => {
    return state.products.length 
    },
    bestSellingProducts: (state) => {
      return state.products.filter((product) => product.bestSelling)
    },
    /* calculate subtotal */
    calculateSubtotal:(state) => {
      let subtotal = 0
      for( const p of state.cartProductsLS ){
        subtotal += Number(p.totalPrice)
      }
      return subtotal
    }
  },
  actions:{
    /* get Products with JSON */
    async getProducts() {
      console.log('getProducts called, current products:', this.products.length)
      
      // Eğer ürünler zaten yüklenmişse ve boş değilse, tekrar yükleme
      if (this.products && this.products.length > 0) {
        console.log('Products already loaded, returning existing products')
        return this.products;
      }

      this.loading = true;
      this.error = null;
      
      try {
        console.log('Fetching products from API...')
        const response = await axios.get('http://localhost:3000/products');
        
        if (response.data && Array.isArray(response.data)) {
          // ID'leri number tipine dönüştür
          this.products = response.data.map(product => ({
            ...product,
            id: Number(product.id)
          }));
          console.log('Products fetched and processed:', this.products)
          return this.products;
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = error.message;
        this.products = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },
    /* get cartProducts with JSON */
    async getCartProducts() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/cartProducts');
    
        if (response.status !== 200) {
          throw new Error('Failed to fetch cart products.');
        }
    
        this.cartProducts = response.data;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    /* get orders with JSON */
    async getOrders() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/orders');
    
        if (response.status !== 200) {
          throw new Error('Failed to fetch orders.');
        }
    
        this.orders = response.data;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    /* get orders with JSON */
    async getCompletedOrders() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/completedOrders');
    
        if (response.status !== 200) {
          throw new Error('Failed to fetch completedOrders.');
        }
    
        this.completedOrders = response.data;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    /* add product to cart | CANCELED AFTER LOCALSTORAGE UPDATE  */
/*     async addCartProduct(cartProduct){
      const existingProduct = this.cartProducts.find( p => p.id === cartProduct.id)
      if(existingProduct){
         existingProduct.quantity += cartProduct.quantity
         existingProduct.totalPrice = Number(existingProduct.price * existingProduct.quantity).toFixed(2);
         try {
          const patchRes = await axios.patch(
            `http://localhost:3000/cartProducts/${cartProduct.id}`,
            {
              quantity: existingProduct.quantity,
              totalPrice: existingProduct.totalPrice,
            }
          );
          if (!patchRes.ok) {
            throw new Error('Failed to update cart product.');
          }
        } catch (error) {
          console.log(error);
        }
      }else{
        // Add it as a new item
        this.cartProducts.push(cartProduct);        
        try {
          const res = await axios.post('http://localhost:3000/cartProducts', cartProduct);  
          if (!res.ok) {
            throw new Error('Failed to add product to cart.');
          }
        } catch (error) {
          console.log(error);
        }
      }
      console.log("existingProduct:" + existingProduct)
    } */

   /* delete product from cart */
    async deleteProduct(id){
      this.cartProductsLS = this.cartProductsLS.filter( p => {
        return p.id !== id
      })
      localStorage.setItem('cartProducts', JSON.stringify(this.cartProductsLS));

      
/*    const res = await axios.delete(`http://localhost:3000/cartProducts/${id}`);
      if (res.error) {
        console.log(res.error);
      } | CANCELED AFTER LOCALSTORAGE UPDATE */
    }
  }
})
