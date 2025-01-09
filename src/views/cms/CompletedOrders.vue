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
                <h1>Tamamlanan Siparişler</h1>
            </header>

            <div class="orders-container">
                <div v-for="order in completedOrders" :key="order.orderUniqueCode" class="order-card">
                    <div class="order-header">
                        <div class="order-number">Sipariş No: {{ order.orderUniqueCode }}</div>
                        <span class="order-date">{{ new Date(order.cartInformation.expirationDate).toLocaleDateString() }}</span>
                    </div>
                    <div class="customer-info">
                        <p>Müşteri: {{ order.shippingInfo.firstName }} {{ order.shippingInfo.lastName }}</p>
                        <p>Email: {{ order.shippingInfo.email }}</p>
                        <p>Telefon: {{ order.shippingInfo.phoneNumber }}</p>
                    </div>
                    <div class="shipping-info">
                        <p>Adres: {{ order.shippingInfo.shippingAddress }}</p>
                        <p>Şehir: {{ order.shippingInfo.city }}</p>
                        <p>Posta Kodu: {{ order.shippingInfo.zipCode }}</p>
                    </div>
                    <div class="order-items">
                        <div class="order-details">Sipariş Detayları</div>
                        <ul>
                            <li v-for="item in order.cartInformation.items" :key="item.id">
                                {{ item.name }} - {{ item.quantity }} adet - ${{ item.price }}
                            </li>
                        </ul>
                    </div>
                    <div class="order-total">
                        <p>Toplam Tutar: ${{ order.finalPrice }}</p>
                        <button class="view-details-btn" @click="router.push(`/cms/order/${order.orderUniqueCode}`)">
                            <i class="fas fa-eye"></i> Detayları Görüntüle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../../stores/productStore'

const router = useRouter()
const productStore = useProductStore()
const completedOrders = ref([])

onMounted(async () => {
    if (!localStorage.getItem('isAdmin')) {
        router.push('/cms/login')
        return
    }
    
    await productStore.getCompletedOrders()
    completedOrders.value = productStore.completedOrders
})

const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    router.push('/cms/login')
}
</script>

<style scoped>
img.logo {
    border-radius: 50%;
    object-fit: cover;
}

.order-details, .order-number{
}
.order-number{
    color: #1B9C85;
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
    margin-bottom: 2rem;
}

.content-header h1 {
    font-size: 1.5rem;
    font-weight: 500;
    opacity: 0.9;
}

.orders-container {
    display: grid;
    gap: 1.5rem;
}

.order-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}


.order-date {
    color: #666;
}

.customer-info, .shipping-info {
    margin-bottom: 1rem;
}

.customer-info p, .shipping-info p {
    margin: 0.5rem 0;
    opacity: 0.8;
}

.order-items {
    margin: 1rem 0;
}

.order-items h4 {
    margin-bottom: 0.5rem;
}

.order-items ul {
    list-style: none;
    padding: 0;
}

.order-items li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.order-total {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.view-details-btn {
    background-color: #1B9C85;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    transition: background-color 0.3s;
}

.view-details-btn:hover {
    background-color: #158c77;
}

.view-details-btn i {
    font-size: 1rem;
}

.order-total p {
    font-size: 1.1rem;
    color: #1B9C85;
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
}
</style> 