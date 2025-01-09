<template>
    <div class="dashboard">
        <nav class="dashboard-nav">
            <div class="logo">
                <img class="logo" src="../../assets/Alaya-Logo_300x300.jpg" alt="Logo">
            </div>
            <div class="nav-links">
                <RouterLink to="/cms/dashboard" class="nav-link" active-class="active">
                    <i class="fas fa-home"></i> Ana Sayfa
                </RouterLink>
                <RouterLink to="/cms/products" class="nav-link" active-class="active">
                    <i class="fas fa-box"></i> Ürünler
                </RouterLink>
                <RouterLink to="/cms/completed-orders" class="nav-link" active-class="active">
                    <i class="fas fa-shopping-cart"></i> Siparişler
                </RouterLink>
                <button @click="handleLogout" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Çıkış Yap
                </button>
            </div>
        </nav>

        <div class="dashboard-content">
            <header class="content-header">
                <div class="header-left">
                    <button class="back-btn" @click="router.back()">
                        <i class="fas fa-arrow-left"></i> Geri
                    </button>
                    <h1>Sipariş Detayı</h1>
                </div>
                <div class="order-status">
                    <span class="status-badge">Tamamlandı</span>
                </div>
            </header>

            <div class="order-details-container" v-if="order">
                <div class="order-info-card">
                    <h2>Sipariş Bilgileri</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Sipariş No</label>
                            <p>{{ order.orderUniqueCode }}</p>
                        </div>
                        <div class="info-item">
                            <label>Sipariş Tarihi</label>
                            <p>{{ new Date(order.cartInformation.expirationDate).toLocaleDateString() }}</p>
                        </div>
                        <div class="info-item">
                            <label>Toplam Tutar</label>
                            <p class="price">${{ order.finalPrice }}</p>
                        </div>
                    </div>
                </div>

                <div class="customer-info-card">
                    <h2>Müşteri Bilgileri</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Ad Soyad</label>
                            <p>{{ order.shippingInfo.firstName }} {{ order.shippingInfo.lastName }}</p>
                        </div>
                        <div class="info-item">
                            <label>Email</label>
                            <p>{{ order.shippingInfo.email }}</p>
                        </div>
                        <div class="info-item">
                            <label>Telefon</label>
                            <p>{{ order.shippingInfo.phoneNumber }}</p>
                        </div>
                    </div>
                </div>

                <div class="shipping-info-card">
                    <h2>Teslimat Bilgileri</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Adres</label>
                            <p>{{ order.shippingInfo.shippingAddress }}</p>
                        </div>
                        <div class="info-item">
                            <label>Şehir</label>
                            <p>{{ order.shippingInfo.city }}</p>
                        </div>
                        <div class="info-item">
                            <label>Posta Kodu</label>
                            <p>{{ order.shippingInfo.zipCode }}</p>
                        </div>
                    </div>
                </div>

                <div class="products-card">
                    <h2>Ürünler</h2>
                    <div class="products-list">
                        <div v-for="item in order.cartProducts" :key="item.id" class="product-item">
                            <div class="product-image" :style="{ 'background-image': `url(/images/${item.photo})` }"></div>
                            <div class="product-details">
                                <h3>{{ item.name }}</h3>
                                <div class="product-info">
                                    <div class="info-row">
                                        <span class="label">Birim Fiyat:</span>
                                        <span class="value price">${{ item.price }}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">Adet:</span>
                                        <span class="value">{{ item.quantity }}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">Toplam:</span>
                                        <span class="value price">${{ (item.price * item.quantity).toFixed(2) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="order-summary">
                        <div class="summary-row">
                            <span>Ara Toplam:</span>
                            <span class="price">${{ calculateSubtotal() }}</span>
                        </div>
                        <div class="summary-row">
                            <span>Kargo:</span>
                            <span class="price">${{ order.shippingMethod?.price || '0.00' }}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Toplam:</span>
                            <span class="price">${{ order.finalPrice }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="loading">
                Yükleniyor...
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductStore } from '../../stores/productStore'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const order = ref(null)

onMounted(async () => {
    if (!localStorage.getItem('isAdmin')) {
        router.push('/cms/login')
        return
    }
    
    await productStore.getCompletedOrders()
    order.value = productStore.completedOrders.find(o => o.orderUniqueCode === route.params.id)
    
    if (!order.value) {
        router.push('/cms/completed-orders')
    }
})

const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    router.push('/cms/login')
}

const calculateSubtotal = () => {
    if (!order.value?.cartProducts) return '0.00'
    return order.value.cartProducts
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)
        .toFixed(2)
}
</script>

<style scoped>
img.logo {
    border-radius: 50%;
    object-fit: cover;
}

.dashboard {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: 100vh;
}

.dashboard-nav {
    background-color: #1B9C85;
    color: white;
    padding: 2rem;
}

.logo {
    text-align: center;
    margin-bottom: 2rem;
}

.logo img {
    width: 120px;
    height: auto;
}

.nav-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.nav-link:hover, .nav-link.active {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-link i {
    margin-right: 0.5rem;
}

.logout-btn {
    margin-top: auto;
    background: none;
    border: none;
    color: white;
    padding: 0.75rem 1rem;
    cursor: pointer;
    text-align: left;
    font-size: 1rem;
}

.logout-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.dashboard-content {
    padding: 2rem;
    background-color: #f5f5f5;
}

.content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.back-btn {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.back-btn:hover {
    background-color: #e9ecef;
}

.content-header h1 {
    font-size: 1.2rem;
    opacity: 0.8;
    font-weight: 500;
    margin: 0;
}

.status-badge {
    background-color: #1B9C85;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
}

.order-details-container {
    display: grid;
    gap: 1.5rem;
}

.order-info-card,
.customer-info-card,
.shipping-info-card,
.products-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
    font-size: 1.2rem;
    font-weight: 500;
    margin: 0 0 1rem 0;
    color: #333;
    opacity: 0.8;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.info-item label {
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.25rem;
}

.info-item p {
    margin: 0;
    opacity: 0.8;
    font-size: 1rem;
    color: #333;
}

.price {
    color: #1B9C85;
    font-weight: 500;
}

.products-list {
    display: grid;
    gap: 1.5rem;
}

.product-item {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 8px;
    background-color: #fff;
}

.product-image {
    width: 120px;
    height: 120px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #eee;
}

.product-details {
    flex: 1;
}

.product-details h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    font-weight: 500;
    color: #333;
    opacity: 0.8;
}

.product-info {
    display: grid;
    gap: 0.5rem;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.info-row:last-child {
    border-bottom: none;
}

.label {
    color: #666;
    font-size: 0.9rem;
}

.value {
    font-weight: 500;
}

.price {
    color: #1B9C85;
    font-weight: 500;
}

.order-summary {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 2px solid #eee;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    font-size: 1rem;
    opacity: 0.8;
}

.summary-row.total {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 2px solid #eee;
    font-size: 1.2rem;
    font-weight: 500;
}

.loading {
    text-align: center;
    padding: 2rem;
    color: #666;
}

@media (max-width: 768px) {
    .dashboard {
        grid-template-columns: 1fr;
    }
    
    .dashboard-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        z-index: 100;
    }
    
    .logo {
        display: none;
    }
    
    .nav-links {
        flex-direction: row;
        justify-content: space-around;
    }
    
    .nav-link span {
        display: none;
    }
    
    .dashboard-content {
        padding: 1rem;
        padding-bottom: 5rem;
    }
    
    .product-item {
        flex-direction: column;
        padding: 1rem;
    }
    
    .product-image {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
    }
    
    .info-row {
        font-size: 0.9rem;
    }
}
</style> 