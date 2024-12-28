<template>
    <!-- view-cart -->
    <div v-if="isAddedToCart" :class="{'slide-in': isOpenCart, 'slide-out': !isOpenCart}" class="view-cart" >
        <div class="view-cart-inner">
            <div class="title">
                <div class="title-inner">
                    JUST ADDED TO YOUR CART
                </div>
                <div class="cross">
                    <i @click="hideToCart" class="fa-solid fa-xmark"></i>
                </div>
            </div>
            <div class="middle">
                <div 
                class="little-img"
                :style="{ 'background-image':`url(/images/${currentProduct.photo[0]})`}"
                >
    
                </div>
                <div class="product-name">
                    {{ currentProduct.name }}
                </div>
                <div class="quantity">
                    Qty: {{ currentProduct.quantity }}
                </div>
            </div>
            <div class="view-cart-button">
                <RouterLink :to="{name:'cart'}">
                    <button class="cart-button ">
                            VIEW CART
                            <span>
                                ( {{ totalProductNumberOnCart }} )
                            </span>
                    </button>
                </RouterLink>
            </div>
            <RouterLink :to="{name:'shop'}">
            <div class="continue-shopping">
                Continue Shopping
            </div>
            </RouterLink>  
        </div>
    </div>
    <Navigation/>
    <div v-if="loading" class="loading">
        Yükleniyor...
    </div>
    <div v-else-if="!currentProduct" class="error">
        Ürün bulunamadı.
    </div>
    <div v-else class="main">
        <div class="main-inner">
            <div class="main-inner-left">
                <div>
                    <div 
                    class="big-img" 
                    :style="{ 'background-image':`url(/images/${currentProduct.photo[0]})`}"
                    >

                    </div>
                    <div class="other-images"> <!-- important slice(1, 4) -->
                        <div 
                        v-for="(photo, index) in currentProduct.photo.slice(1, 4)" 
                        :key="index"
                        class="other-images-product" 
                        :style="{ 'background-image':`url(/images/${photo})`}"
                        @mouseover="handleImage(photo)"
                        @mouseout="leaveImage(photo)"
                        >
                            
                        </div>
                    </div>
                </div>
            </div>
            <div class="main-inner-right">
                <div>
                    <div class="payout">
                        <!-- index starts from zero. route starts from one. because:[currentRoute-1] -->
                        <h1>
                            {{ currentProduct.name }}
                        </h1>
                        <div class="product-stars">
                            <i class="fa fa-light fa-star"></i>
                            <i class="fa fa-light fa-star"></i>
                            <i class="fa fa-light fa-star"></i>
                            <i class="fa fa-light fa-star"></i>
                            <i class="fa fa-light fa-star"></i>
                        </div>
                        <div class="product-price">
                            ${{ currentProduct.price }}
                        </div>
                        <div class="quantity">
                            <div class="q-header"> 
                                Quantity
                            </div>
                            <div class="q-input-div">
                                <input v-model="currentProduct.quantity" class="q-input" type="number" min="1" step="1">
                            </div>
                        </div>
                        <div class="purchase-buttons">
                            <button @click="addToCart" class="p-btn-1 add-to-card"> ADD TO CART</button>
                            <button class="p-btn-1 apple-pay"> BUY WITH <i class="fa-brands fa-apple-pay fa-2xl"></i> </button>
                            <button class="more-payment-options">More payment options</button>
                        </div>
                    </div>
                    <div class="description">
                        <p>{{ currentProduct.description }}</p>
                        <ul>
                            <li v-for="(feature, index) in currentProduct.features" :key="index">
                                {{ feature }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-inner-bottom">
            <RouterLink :to="{name:'shop'}">
                <button class="back-btn">
                    <i class="fa fa-light fa-arrow-left"></i>
                    TÜM ÜRÜNLERE GERİ DÖN
                </button>
            </RouterLink>
        </div>
        <Footer/>
    </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
/* components */
import Footer from "../components/Footer.vue";
import Navigation from '../components/Navigation.vue'
/* router */
import { useRoute } from "vue-router";
const route = useRoute()
/* pinia */
import { useProductStore } from '../stores/productStore';
const productStore = useProductStore()

const currentProduct = ref(null)
const loading = ref(true)

const loadProduct = async () => {
    try {
        loading.value = true
        console.log('Loading product...')
        
        // Ürünleri yükle
        await productStore.getProducts()
        console.log('Products loaded:', productStore.products)
        
        // Route'dan ID'yi al ve sayıya çevir
        const productId = Number(route.params.id)
        console.log('Looking for product ID:', productId, 'Type:', typeof productId)
        
        // Tüm ürünleri ve ID'lerini kontrol et
        console.log('Available product IDs:', productStore.products.map(p => ({ id: p.id, type: typeof p.id })))
        
        // Ürünü bul
        const foundProduct = productStore.products.find(item => Number(item.id) === productId)
        console.log('Found product:', foundProduct)
        
        if (foundProduct) {
            currentProduct.value = {
                ...foundProduct,
                quantity: 1
            }
            console.log('Current product set:', currentProduct.value)
        } else {
            console.log('Product not found!')
            currentProduct.value = null
        }
    } catch (error) {
        console.error('Error loading product:', error)
        currentProduct.value = null
    } finally {
        loading.value = false
    }
}

// Component yüklendiğinde ürünü yükle
onMounted(async () => {
    await loadProduct()
})

// Route değişikliklerini izle
watch(() => route.params.id, async (newId, oldId) => {
    if (newId !== oldId) {
        await loadProduct()
    }
})

/* image-hover */
const handleImage = (photo) => {
    if (currentProduct.value) {
        currentProduct.value.photo[4] = currentProduct.value.photo[0]
        currentProduct.value.photo[0] = photo
    }
}

const leaveImage = () => {
    if (currentProduct.value) {
        currentProduct.value.photo[0] = currentProduct.value.photo[4]
    }
}

/* add-to-cart */
const isAddedToCart = ref(false) /* view-cart opening control */
const isOpenCart = ref(false) /* Animation control */

const addToCart = () =>{
    isAddedToCart.value = true
    isOpenCart.value = true

    /* add product to cart | CANCELED AFTER LOCALSTORAGE UPDATE */
/*     productStore.addCartProduct({ this is cartProduct in productStore.js at addCartProduct's parameter
        id:currentProduct.value.id,
        name:currentProduct.value.name,
        price:currentProduct.value.price,
        photo:currentProduct.value.photo[0],
        quantity:currentProduct.value.quantity,
        totalPrice: Number(currentProduct.value.price * currentProduct.value.quantity).toFixed(2)
    }) */

    /* localStorage */

    const newCartProduct = {
        id:currentProduct.value.id,
        name:currentProduct.value.name,
        price:currentProduct.value.price,
        photo:currentProduct.value.photo[0],
        quantity:currentProduct.value.quantity,
        totalPrice: Number(currentProduct.value.price * currentProduct.value.quantity).toFixed(2)
    }
    const existingProduct = productStore.cartProductsLS.find( p => p.id === newCartProduct.id)
    if(existingProduct){
        existingProduct.quantity += newCartProduct.quantity
        existingProduct.totalPrice = Number(existingProduct.price * existingProduct.quantity).toFixed(2);
    }else{
        productStore.cartProductsLS.push(newCartProduct)
    }
    localStorage.setItem('cartProducts', JSON.stringify(productStore.cartProductsLS))

    /* localStorage */
}

/* hide-to-cart */
const hideToCart = () =>{
    setTimeout(() => {             
      isAddedToCart.value = false
    }, 499);                    /* code works half second after */
    isOpenCart.value = false
}

/* product number on cart */
const totalProductNumberOnCart = computed(() => {
      const sum = productStore.cartProductsLS.reduce((total, product) => total + product.quantity, 0);
      return sum;
    });



</script>

<style scoped>
    .view-cart{
        background-color: white;
        border: 1px solid #ebebeb;
        width: 350px;
        position: fixed;
        right: 0;
        box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, 0.1);
        z-index: 5;
    }
    .view-cart-inner{
        padding: 0 20px;
    }
    .view-cart .title{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        font-size: 14px;
        padding: 20px 0px 10px;
        border-bottom: 0.5px solid gray;
    }
    .view-cart .title .title-inner{
        grid-column: 1 / 5;
        
    }
    .view-cart .title .cross{
        text-align: right;
        font-size: 1.3rem;
        cursor: pointer;
    }
    .view-cart .middle{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        padding: 20px 0px;
    }
    .view-cart .middle .little-img{
        grid-column: 1 / 2;
        /* background-image:url(../assets/products/product_600x600.webp); */
        aspect-ratio: 1/1;
        background-size: contain;
        background-repeat: no-repeat;
    }
    .view-cart .middle .product-name{
        grid-column: 2 / 5;
        padding-left: 20px;
        letter-spacing: 1px;
        font-weight: 500;
    }
    .view-cart .middle .quantity{
        text-align: right;
    }
    .view-cart .view-cart-button{
        margin: 0 auto;
    }
    .view-cart .view-cart-button .cart-button{
        width: 100%;
        background-color: white;
        line-height: 1.4;
        border: solid #1B9C85 0.5px;
        border-radius: 2px;
        font-size: 1rem;
        color: #1B9c85;
        padding: 12px 0;
    }
    .view-cart .view-cart-button .cart-button:hover{
        border: solid #1B9C85 0.5px;
        border: solid #1B9C85 1px;
        color: #1B9c85;
        padding: 11.5px 0;
    }
    .view-cart .continue-shopping{
        text-align: center;
        letter-spacing: 0.7px;
        color: #1B9C85;
        text-decoration: underline;
        font-size: 0.9rem;
        padding: 20px;
    }
    @keyframes slide-in {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(0);
        }
    }
    @keyframes slide-out {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(-100%);
        }
    }
    .slide-in{
        animation: slide-in 0.5s ease;
    }
    .slide-out{
        animation: slide-out 0.5s ease;
    }
    .main{
        width: 100%;
        display: grid;
        margin-top: 50px;
    }
    .main .main-inner{
        width: 1200px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 30px;
        margin: 0 auto;
        padding: 20px;
    }
    .main .main-inner .main-inner-left{
        display: grid;
        grid-template-rows: 579px 208px;
        grid-gap: 10px;
    }
    .main .main-inner .main-inner-left .big-img{
        aspect-ratio: 1/1;
/*         background-image: url(../assets/products/product_600x600.webp); */
        background-size: contain;
        background-repeat: no-repeat;
    }
    .main .main-inner .main-inner-left .other-images{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
    .main .main-inner .main-inner-left .other-images .other-images-product{
        aspect-ratio: 1/1;
/*         background-image: url(../assets/products/product_600x600.webp); */
        background-size: contain;
        background-repeat: no-repeat;
        border: solid white 3px;
    }
    .main .main-inner .main-inner-right{
        display: grid;
        grid-template-rows: 450px 200px;
    }
    .main .main-inner .main-inner-right .payout h1{
        font-weight: 400;
        margin-bottom: 20px;
    }
    .main .main-inner .main-inner-right .payout .product-stars{
        color: rgb(255, 211, 33);
        font-size: 0.8rem;
        margin-bottom: 10px;
    }
    .main .main-inner .main-inner-right .payout .product-price{
        color: rgb(65, 61, 61);
        font-weight: 600;
        font-size: 1.3rem;
        margin-bottom: 30px;
    }
    .main .main-inner .main-inner-right .payout .quantity .q-header{
        color: rgb(65, 61, 61);
        font-weight: 400;
        font-size: 1.1rem;
        margin-bottom: 10px;
    }
    .main .main-inner .main-inner-right .payout .quantity .q-input-div .q-input{
        width: 100px;
        padding: 10px 0;
        font-size: 1rem;
        text-indent: 20px;
        border: solid rgb(188, 188, 188, 0.6) 1px;
    }
    .main .main-inner .main-inner-right .payout .purchase-buttons{
        margin-top: 10px;
        width: 400px;
    }
    .main .main-inner .main-inner-right .payout .purchase-buttons button{
        margin-bottom: 10px;
    }
    .main .main-inner .main-inner-right .payout .purchase-buttons .p-btn-1{
        display: block;
        width: 100%;
        line-height: 1.4;
        padding-left: 5px;
        padding-right: 5px;
        white-space: normal;
        margin-top: 0;
        min-height: 44px;
        padding: 10px 18px;
        border-radius: 4px;
    }
    .main .main-inner .main-inner-right .payout .purchase-buttons .add-to-card{
        background-color: white;
        border: solid #1B9C85 0.5px;
        color: #1B9c85;
        transition: 0.6s;
    }
    .main .main-inner .main-inner-right .payout .purchase-buttons .add-to-card:hover{
        background-color: #1B9C85;
        border: solid #1B9C85 0.5px;
        color: white;
        transition: 0.6s;
    }
    .main .main-inner .main-inner-right .payout .purchase-buttons .apple-pay{
        background-color: #5A31F4;
        border: solid #5A31F4 0.5px;
        color: whitesmoke;
    }
    .main .main-inner .main-inner-right .payout .purchase-buttons .more-payment-options{
        display: block;
        text-decoration: underline;
        font-size: 0.9rem;
        margin: 0 auto 20px;
        color: rgb(63, 63, 63);
        background-color: white;
    }
    .main .main-inner .main-inner-right .description{
        text-align: justify;
        letter-spacing: 1.5px;
        line-height: 22px;
        font-size: 0.9rem;
    }
    .main .main-inner .main-inner-right .description p{
        margin-bottom: 20px;
    }
    .main .main-inner .main-inner-right .description ul li{
        list-style-type: disc;
        width: 90%;
    }

    .main .main-inner-bottom .back-btn{
        display: block;
        margin: 20px auto 50px;
        padding: 20px 30px;
        background-color: white;
        border: solid #1B9C85 0.5px;
        color: #1B9c85;
        transition: 0.6s;
    }
    .main .main-inner-bottom .back-btn:hover{
        padding: 20px 50px;
        transition: 0.5s;
    }

    @media (min-width:700px) and (max-width:1205px){
        .main .main-inner{
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        .main .main-inner .main-inner-left{
            display: grid;
            grid-template-rows: 2.5fr;
            grid-gap: 10px;
        }

        .main .main-inner .main-inner-right{
            display: grid;
            grid-template-rows: auto;
        }
        .main .main-inner .main-inner-right .payout .purchase-buttons{
            margin-top: 10px;
            width: 90%;
        }
        .main .main-inner .main-inner-right .payout .purchase-buttons .more-payment-options{
        margin: 0 auto 20px;
    }
        .main .main-inner .main-inner-right .description{
            width: 90%;
            color: rgba(0,0,0, 0.7);
            line-height: 22px;
            font-size: 0.8rem;
    }
    }
    @media (max-width:700px){
        .main{
            display: grid;
        }
        .main .main-inner{
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            grid-column-gap: 0px ;
            margin: 0 auto;
            width: 95%;
            padding: 0px 0px 20px 0px;
        }
        .main .main-inner .main-inner-left{
            display: grid;
            grid-template-rows: auto auto;
        }
        .main .main-inner .main-inner-left .big-img{
            aspect-ratio: 1/1;
            /* background-image: url(../assets/products/product_600x600.webp); */
            background-size: contain;
            background-repeat: no-repeat;
        }
        .main .main-inner .main-inner-left .other-images .other-images-product{
            aspect-ratio: 1/1;
            /* background-image: url(../assets/products/product_600x600.webp); */
            background-size: contain;
            background-repeat: no-repeat;
            border: solid #1B9C85 0.5px;
            margin: 0;
        }
        .main .main-inner .main-inner-right{
            display: grid;
            grid-template-rows: 2.5fr;
            margin-top: 20px;
        }

        .main .main-inner .main-inner-right .payout{
            width: 100%;
            margin: 0 auto 50px;
            font-weight: 400;
        }
        .main .main-inner .main-inner-right .payout .purchase-buttons{
            margin-top: 10px;
            width: 100%;
        }
        .main .main-inner .main-inner-right .description{
            width: 90%;
            margin: 0 auto;
            text-align: justify;
            letter-spacing: 1.5px;
            line-height: 22px;
            font-size: 0.9rem;
        }
    }
    @media (max-width: 340px){
        .main .main-inner .main-inner-right .payout h1{
            font-size: 1.5rem;
            font-weight: 400;
            margin-bottom: 10px;
        }
        .main .main-inner .main-inner-right .payout .product-price{
            color: rgb(60, 60, 60);
            font-weight: 600;
            font-size: 1.2rem;
            margin-bottom: 15px;
        }
        .main .main-inner .main-inner-right .payout .quantity .q-header{
            display: inline-block;
            color: rgb(65, 61, 61);
            font-weight: 400;
            font-size: 1.1rem;
            margin-bottom: 10px;
        }
        .main .main-inner .main-inner-right .payout .quantity .q-input-div{
            display: inline-block;
            margin-left: 10px;
        }
        .main .main-inner .main-inner-right .payout .quantity .q-input-div .q-input{
            width: 100px;
            padding: 10px 0;
            font-size: 1rem;
            text-indent: 15px;
            border: solid rgb(188, 188, 188, 0.6) 1px;
        }
        .view-cart{
            background-color: white;
            border: 1px solid #ebebeb;
            width: 96%;
            position: fixed;
            right: 0;
            box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, 0.1);
            z-index: 5;
        }
        .view-cart .view-cart-button .cart-button{
            width: 100%;
            background-color: white;
            line-height: 1.4;
            border: solid #1B9C85 0.5px;
            border-radius: 2px;
            font-size: 0.9rem;
            color: #1B9c85;
            padding: 12px 0;
        }
    }
    .loading, .error {
        text-align: center;
        padding: 2rem;
        font-size: 1.2rem;
        margin-top: 2rem;
    }

    .error {
        color: #dc3545;
    }
</style>