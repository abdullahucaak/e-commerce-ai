<template>
    <Navigation/>
    <div class="main">
        <div class="main-inner">
            <div class="header">
                <h1>Tamamlanan Siparişler</h1>
            </div>
            <div v-if="loading" class="loading">
                Siparişler yükleniyor...
            </div>
            <div v-else-if="!productStore.completedOrders.length" class="no-orders">
                Henüz tamamlanmış sipariş bulunmamaktadır.
            </div>
            <div v-else class="orders-container">
                <div v-for="order in productStore.completedOrders" :key="order.orderUniqueCode" class="order-card">
                    <div class="order-header">
                        <div class="order-id">
                            Sipariş No: {{ order.orderUniqueCode }}
                        </div>
                        <div class="order-date">
                            {{ new Date(order.cartInformation.expirationDate).toLocaleDateString() }}
                        </div>
                    </div>
                    <div class="order-details">
                        <div class="customer-info">
                            <p><strong>Müşteri:</strong> {{ order.shippingInfo.firstName }} {{ order.shippingInfo.lastName }}</p>
                            <p><strong>E-posta:</strong> {{ order.shippingInfo.email }}</p>
                            <p><strong>Telefon:</strong> {{ order.shippingInfo.phoneNumber }}</p>
                            <p><strong>Adres:</strong> {{ order.shippingInfo.shippingAddress }}</p>
                            <p><strong>Şehir/Ülke:</strong> {{ order.shippingInfo.city }}/{{ order.shippingInfo.country }}</p>
                        </div>
                        <div class="products">
                            <h3>Ürünler</h3>
                            <div v-for="product in order.cartProducts" :key="product.id" class="product-item">
                                <div class="product-image" :style="{ 'background-image': `url(/images/${product.photo})` }"></div>
                                <div class="product-info">
                                    <p class="product-name">{{ product.name }}</p>
                                    <p class="product-quantity">Adet: {{ product.quantity }}</p>
                                    <p class="product-price">${{ product.totalPrice }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="order-summary">
                            <div class="summary-item">
                                <span>Ara Toplam:</span>
                                <span>${{ (parseFloat(order.finalPrice) - parseFloat(order.shippingMethod.price)).toFixed(2) }}</span>
                            </div>
                            <div class="summary-item">
                                <span>Kargo:</span>
                                <span>${{ order.shippingMethod.price }}</span>
                            </div>
                            <div class="summary-item total">
                                <span>Toplam:</span>
                                <span>${{ order.finalPrice }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navigation from '../../components/Navigation.vue'
import Footer from '../../components/Footer.vue'
import { useProductStore } from '../../stores/productStore'

const productStore = useProductStore()
const loading = ref(true)

onMounted(async () => {
    try {
        await productStore.getCompletedOrders()
    } catch (error) {
        console.error('Siparişler yüklenirken hata oluştu:', error)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.main {
    min-height: 100vh;
    padding: 2rem 0;
}

.main-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.header {
    text-align: center;
    margin-bottom: 2rem;
}

.header h1 {
    font-size: 2rem;
    font-weight: 400;
    color: #333;
}

.loading, .no-orders {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #666;
}

.order-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-header {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: #f8f9fa;
    border-bottom: 1px solid #ddd;
    border-radius: 8px 8px 0 0;
}

.order-id {
    font-weight: 500;
    color: #1B9C85;
}

.order-date {
    color: #666;
}

.order-details {
    padding: 1rem;
}

.customer-info {
    margin-bottom: 1.5rem;
}

.customer-info p {
    margin: 0.5rem 0;
    color: #444;
}

.products {
    margin: 1.5rem 0;
}

.products h3 {
    margin-bottom: 1rem;
    font-weight: 500;
}

.product-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.product-image {
    width: 60px;
    height: 60px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 1rem;
}

.product-info {
    flex: 1;
}

.product-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.product-quantity, .product-price {
    color: #666;
    font-size: 0.9rem;
}

.order-summary {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #ddd;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.summary-item.total {
    font-weight: 600;
    color: #1B9C85;
    font-size: 1.1rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #ddd;
}

@media (max-width: 768px) {
    .order-header {
        flex-direction: column;
        gap: 0.5rem;
    }

    .product-item {
        flex-direction: column;
        text-align: center;
    }

    .product-image {
        margin: 0 auto 1rem;
    }

    .customer-info p {
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .header h1 {
        font-size: 1.5rem;
    }

    .order-card {
        margin-bottom: 1rem;
    }

    .order-details {
        padding: 0.75rem;
    }
}
</style> 